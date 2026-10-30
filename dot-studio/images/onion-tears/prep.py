# prep.py - trim, measure and align onion-tears sprites; writes public/ PNGs + src/shorts/onion-tears/sprites.ts
import json, os, shutil, sys
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "images", "lib"))
from cutout import blur_copy, extreme, feet, inscribed_disc, red_ball, steel, trim  # noqa: E402

RAW = os.path.join(HERE, "raw")
NEW_DOT = ["dot_cry_knife", "dot_chop", "dot_squeeze", "dot_knife_show", "dot_slow_cut"]
KNIFE_TIP = {"dot_cry_knife": "top", "dot_chop": "br", "dot_knife_show": "top", "dot_slow_cut": "br"}
OWN = ["onion_whole", "onion_halves", "counter", "knife", "mouse", "mouse_cry"]

out = {}
for n in NEW_DOT:
    im, _ = trim(os.path.join(RAW, n + ".png"), os.path.join(ROOT, "public", "dot", n + ".png"))
    px = np.array(im)
    a = px[:, :, 3]
    e = {"src": f"dot/{n}.png", "w": im.width, "h": im.height, "head": inscribed_disc(a), "feet": feet(a), "ball": red_ball(px)}
    # drawn tear streams (light blue): the lowest point of each stream is where code drips fall from
    hsv = cv2.cvtColor(px[:, :, :3], cv2.COLOR_RGB2HSV)
    blue = ((hsv[:, :, 0] > 95) & (hsv[:, :, 0] < 118) & (hsv[:, :, 1] > 60) & (hsv[:, :, 2] > 150) & (a > 200)).astype(np.uint8)
    nb, lab, stats, _ = cv2.connectedComponentsWithStats(blue)
    tears = [extreme(lab == i, "bottom") for i in range(1, nb) if stats[i, cv2.CC_STAT_AREA] > 400]
    if tears:
        e["tears"] = sorted(tears)
    if n in KNIFE_TIP:
        blade = steel(px)
        ys, xs = np.where(blade)
        e["blade"] = {"tip": extreme(blade, KNIFE_TIP[n]), "mid": [float(xs.mean()), float(ys.mean())]}
    out[n] = e
    shutil.copy(os.path.join(RAW, n + ".png"), os.path.join(ROOT, "images", "dot", n + ".png"))
# the waist-up close-up: its head disc must not land on the hands - search only the top 60 %
sq = np.array(trim(os.path.join(RAW, "dot_squeeze.png"), os.path.join(ROOT, "public", "dot", "dot_squeeze.png"))[0])
region = np.zeros(sq.shape[:2], np.uint8)
region[: int(sq.shape[0] * 0.6)] = 1
out["dot_squeeze"]["head"] = inscribed_disc(sq[:, :, 3], region)

ims, trims = {}, {}
for n in OWN:
    im, trims[n] = trim(os.path.join(RAW, n + ".png"), os.path.join(ROOT, "public", "onion-tears", n + ".png"))
    ims[n] = np.array(im)
    out[n] = {"src": f"onion-tears/{n}.png", "w": im.width, "h": im.height}

# onion: the bulb is the largest inscribed disc (tip and roots are thin)
ow = ims["onion_whole"]
out["onion_whole"]["bulb"] = inscribed_disc(ow[:, :, 3])
ys, xs = np.where(ow[:, :, 3] > 128)
out["onion_whole"]["bottom"] = [float(xs[ys > ys.max() - 6].mean()), float(ys.max())]

# halves: split at the widest empty column gap, one bulb disc per half
oh = ims["onion_halves"]
cols = (oh[:, :, 3] > 128).sum(0)
mid = oh.shape[1] // 2
gap = [x for x in range(int(mid * 0.6), int(mid * 1.4)) if cols[x] == 0]
split = int(np.mean(gap)) if gap else mid
left = np.zeros(oh.shape[:2], np.uint8); left[:, :split] = 1
out["onion_halves"]["halves"] = [inscribed_disc(oh[:, :, 3], left), inscribed_disc(oh[:, :, 3], 1 - left)]
ys, xs = np.where(oh[:, :, 3] > 128)
out["onion_halves"]["bottom"] = float(ys.max())

# counter: the wooden top band (light wood) and the cutting board (darker wood) as boxes
c = ims["counter"].astype(int)
hsv = cv2.cvtColor(ims["counter"][:, :, :3], cv2.COLOR_RGB2HSV).astype(int)
opaque = c[:, :, 3] > 200
blue = opaque & (hsv[:, :, 0] > 90) & (hsv[:, :, 0] < 120) & (hsv[:, :, 1] > 40)
wood = opaque & (hsv[:, :, 0] > 8) & (hsv[:, :, 0] < 25) & (hsv[:, :, 1] > 60)
rows_blue = np.where(blue.sum(1) > c.shape[1] * 0.3)[0]
out["counter"]["frontEdgeY"] = float(rows_blue.min()) if len(rows_blue) else None
ys, xs = np.where(opaque)
out["counter"]["topY"] = float(ys.min())
# cutting board box, read off qa/sheet1.png (colour detection also caught the countertop's darker front lip)
out["counter"]["board"] = [502.0, 12.0, 1294.0, 145.0]

# knife prop: handle on the left, tip on the right
k = ims["knife"]
km = k[:, :, 3] > 128
out["knife"]["tip"] = extreme(km, "right")
out["knife"]["handle"] = extreme(km, "left")

# mouse: nose (leftmost), paws (bottom), body disc; crying mouse aligned on the back half of the body
m = ims["mouse"]
mm = m[:, :, 3] > 128
out["mouse"]["nose"] = extreme(mm, "left")
out["mouse"]["feet"] = feet(m[:, :, 3])
out["mouse"]["body"] = inscribed_disc(m[:, :, 3])
# the crying mouse is an edit "in the same place and size", so the raw canvases already line up (checked in
# qa/mouse-overlay.png; ECC failed because the head and ears change too much): map through the trim offsets.
# raw = px / s + offset  ->  mouse_px = (cry_px / s_c + off_c - off_m) * s_m
(xm, ym, sm), (xc, yc, sc) = trims["mouse"], trims["mouse_cry"]
out["mouse_cry"]["toMouse"] = [sm / sc, 0.0, 0.0, sm / sc, (xc - xm) * sm, (yc - ym) * sm]

# depth of field copies (Dot's close-ups) for the onion + counter behind him
for n, sigma in [("onion_whole", 3.0), ("onion_halves", 3.0), ("counter", 2.0)]:
    blur_copy(trim(os.path.join(RAW, n + ".png"), os.path.join(ROOT, "public", "onion-tears", n + ".png"))[0],
              os.path.join(ROOT, "public", "onion-tears", n + "_blur.png"), sigma)
    out[n]["blur"] = f"onion-tears/{n}_blur.png"

ts = "// generated by images/onion-tears/prep.py - do not edit\n"
ts += "export const S = " + json.dumps(out, indent=1) + " as const;\n"
open(os.path.join(ROOT, "src", "shorts", "onion-tears", "sprites.ts"), "w").write(ts)
print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk not in ("src",)} for k, v in out.items()}))
