# prep.py - trim, downscale, measure and align every sprite; writes public/ PNGs + src/shorts/spider-sleep/sprites.ts
import json, os, shutil
import cv2
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW = os.path.join(ROOT, "images", "spider-sleep", "raw")
MAX_SIDE = 1800  # trimmed sprites are drawn <= ~900 comp px, i.e. <= 1800 px at the 2x 4K render
PAD = 12

DOT = ["dot_lookup", "dot_two", "dot_watch", "dot_surprised", "dot_aha", "dot_bell", "dot_droop", "dot_shrug"]
OWN = ["spider_droop", "spider_rem", "web", "camera"]


def trim(name, dest):
    im = Image.open(os.path.join(RAW, name + ".png")).convert("RGBA")
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 8)
    x0, y0 = max(xs.min() - PAD, 0), max(ys.min() - PAD, 0)
    x1, y1 = min(xs.max() + PAD + 1, im.width), min(ys.max() + PAD + 1, im.height)
    im = im.crop((x0, y0, x1, y1))
    s = min(1.0, MAX_SIDE / max(im.size))
    if s < 1:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    im.save(dest, optimize=True)
    return im, (x0, y0, s)


def head_disc(alpha):
    h, w = alpha.shape
    ff = (alpha > 128).astype(np.uint8)
    cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 2)
    solid = np.where(ff == 2, 0, 1).astype(np.uint8)
    dt = cv2.distanceTransform(solid, cv2.DIST_L2, 5)
    hy, hx = np.unravel_index(dt.argmax(), dt.shape)
    return [int(hx), int(hy), float(dt[hy, hx])]


def feet(alpha):
    h = alpha.shape[0]
    rows = alpha[int(h * 0.965):] > 128
    ys, xs = np.where(rows)
    return [float(xs.mean()), float(h - PAD)]


out = {}
for n in DOT:
    im, _ = trim(n, os.path.join(ROOT, "public", "dot", n + ".png"))
    a = np.array(im)[:, :, 3]
    out[n] = {"src": f"dot/{n}.png", "w": im.width, "h": im.height, "head": head_disc(a), "feet": feet(a)}
    # antenna ball = the only red on Dot (watch is navy): centre + radius, for the "aha" glow
    px = np.array(im).astype(int)
    red = (px[:, :, 0] > 180) & (px[:, :, 1] < 90) & (px[:, :, 2] < 90) & (px[:, :, 3] > 200)
    ys, xs = np.where(red)
    out[n]["ball"] = [float(xs.mean()), float(ys.mean()), float(np.sqrt(red.sum() / np.pi))]
    shutil.copy(os.path.join(RAW, n + ".png"), os.path.join(ROOT, "images", "dot", n + ".png"))

trims = {}
for n in OWN:
    im, t = trim(n, os.path.join(ROOT, "public", "spider-sleep", n + ".png"))
    trims[n] = (im, t)
    out[n] = {"src": f"spider-sleep/{n}.png", "w": im.width, "h": im.height}

# spider: body disc + the big black eyes (thick dark blobs; thin outlines vanish under erosion)
sp = np.array(trims["spider_droop"][0])
out["spider_droop"]["body"] = head_disc(sp[:, :, 3])
dark = ((sp[:, :, :3].max(2) < 50) & (sp[:, :, 3] > 200)).astype(np.uint8)
thick = cv2.erode(dark, np.ones((9, 9), np.uint8))
n_c, lab, stats, cent = cv2.connectedComponentsWithStats(thick)
eyes = []
for i in range(1, n_c):
    if stats[i, cv2.CC_STAT_AREA] < 60:
        continue
    blob = (lab == i).astype(np.uint8)
    dt = cv2.distanceTransform(cv2.dilate(blob, np.ones((9, 9), np.uint8)), cv2.DIST_L2, 5)
    ey, ex = np.unravel_index(dt.argmax(), dt.shape)
    eyes.append([int(ex), int(ey), float(dt[ey, ex])])
eyes.sort(key=lambda e: -e[2])
out["spider_droop"]["eyes"] = sorted(eyes[:4], key=lambda e: e[0])
# top line the legs grip (first opaque row) and the leg-tip span
ys, xs = np.where(sp[:, :, 3] > 128)
out["spider_droop"]["grip"] = [float(xs[ys < ys.min() + 30].mean()), float(ys.min())]

# spider_rem -> spider_droop: ECC affine on the body disc (legs differ)
A = cv2.cvtColor(sp, cv2.COLOR_RGBA2GRAY).astype(np.float32)
rem = np.array(trims["spider_rem"][0])
B = np.zeros_like(A)
hB, wB = min(rem.shape[0], A.shape[0]), min(rem.shape[1], A.shape[1])
B[:hB, :wB] = cv2.cvtColor(rem, cv2.COLOR_RGBA2GRAY)[:hB, :wB]
bx, by, br = out["spider_droop"]["body"]
mask = np.zeros(A.shape, np.uint8)
cv2.circle(mask, (bx, by), int(br * 1.15), 255, -1)
cv2.rectangle(mask, (0, by + int(br * 0.2)), (A.shape[1], A.shape[0]), 255, -1)  # face too
warp = np.eye(2, 3, dtype=np.float32)
cc, warp = cv2.findTransformECC(A, B, warp, cv2.MOTION_AFFINE,
                                (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 500, 1e-6), mask, 5)
# warp maps droop coords -> rem coords; invert so rem pixels can be drawn in droop's frame
inv = cv2.invertAffineTransform(warp)
out["spider_rem"]["toDroop"] = [float(inv[0, 0]), float(inv[1, 0]), float(inv[0, 1]), float(inv[1, 1]),
                                float(inv[0, 2]), float(inv[1, 2])]
out["spider_rem"]["ecc"] = float(cc)

# web: the lowest point of the white silk sheet (where the spider's leg tips hang from)
wb = np.array(trims["web"][0])
white = (wb[:, :, :3].min(2) > 200) & (wb[:, :, 3] > 200)
ys, xs = np.where(white)
low = ys.max()
out["web"]["hang"] = [float(xs[ys > low - 6].mean()), float(low)]
out["web"]["sheetTopY"] = float(ys.min())

# camera: red light centre + lens tip
cm = np.array(trims["camera"][0]).astype(int)
red = (cm[:, :, 0] > 180) & (cm[:, :, 1] < 90) & (cm[:, :, 2] < 90) & (cm[:, :, 3] > 200)
ys, xs = np.where(red)
out["camera"]["light"] = [float(xs.mean()), float(ys.mean()), float(np.sqrt(red.sum() / np.pi))]
a = cm[:, :, 3] > 128
ys, xs = np.where(a)
out["camera"]["feet"] = [float(xs[ys > ys.max() - 20].mean()), float(ys.max())]

# pre-blurred copies for depth of field (a live CSS blur costs seconds per frame in the software renderer).
# sigma in sprite px = 3 screen px / (layer scale ~1 in Dot's close-ups * sprite->world scale)
for n, sigma in [("spider_droop", 3 / 0.416), ("spider_rem", 3 / 0.416), ("web", 3 / 1.333)]:
    px = np.array(trims[n][0]).astype(np.float32) / 255
    a = px[:, :, 3:4]
    pre = np.concatenate([px[:, :, :3] * a, a], 2)
    pre = cv2.GaussianBlur(pre, (0, 0), sigma)
    rgb = np.where(pre[:, :, 3:4] > 1e-4, pre[:, :, :3] / np.maximum(pre[:, :, 3:4], 1e-4), 0)
    outp = np.concatenate([np.clip(rgb, 0, 1), pre[:, :, 3:4]], 2)
    Image.fromarray((outp * 255 + 0.5).astype(np.uint8), "RGBA").save(
        os.path.join(ROOT, "public", "spider-sleep", n + "_blur.png"), optimize=True)
    out[n]["blur"] = f"spider-sleep/{n}_blur.png"
    out[n]["blurSigma"] = sigma

ts = "// generated by images/spider-sleep/prep.py - do not edit\n"
ts += "export const S = " + json.dumps(out, indent=1) + " as const;\n"
dst = os.path.join(ROOT, "src", "shorts", "spider-sleep", "sprites.ts")
open(dst, "w").write(ts)
print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk != "src"} for k, v in out.items()}, indent=0))
