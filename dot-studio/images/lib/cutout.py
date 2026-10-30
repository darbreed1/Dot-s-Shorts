# Shared cut-out helpers for every Short's prep.py: trim, measure, align, pre-blur.
import os
import cv2
import numpy as np
from PIL import Image

PAD = 12
MAX_SIDE = 1800  # trimmed sprites are drawn <= ~900 comp px, i.e. <= 1800 px at the 2x 4K render


def trim(src, dest, max_side=MAX_SIDE):
    """Trim to the alpha box + PAD, downscale so the long side <= max_side, save. Returns (image, (x0, y0, scale))."""
    im = Image.open(src).convert("RGBA")
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 8)
    x0, y0 = max(xs.min() - PAD, 0), max(ys.min() - PAD, 0)
    x1, y1 = min(xs.max() + PAD + 1, im.width), min(ys.max() + PAD + 1, im.height)
    im = im.crop((x0, y0, x1, y1))
    s = min(1.0, max_side / max(im.size))
    if s < 1:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    im.save(dest, optimize=True)
    return im, (int(x0), int(y0), s)


def solid_mask(alpha):
    """Opaque silhouette with interior holes filled."""
    h, w = alpha.shape
    ff = (alpha > 128).astype(np.uint8)
    cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 2)
    return np.where(ff == 2, 0, 1).astype(np.uint8)


def inscribed_disc(alpha, region=None):
    """Largest inscribed disc [x, y, r] of the hole-filled silhouette (optionally inside a region mask)."""
    solid = solid_mask(alpha)
    if region is not None:
        solid = solid & region.astype(np.uint8)
    dt = cv2.distanceTransform(solid, cv2.DIST_L2, 5)
    y, x = np.unravel_index(dt.argmax(), dt.shape)
    return [int(x), int(y), float(dt[y, x])]


def feet(alpha):
    """Middle of the opaque pixels in the bottom 3.5 % rows."""
    h = alpha.shape[0]
    ys, xs = np.where(alpha[int(h * 0.965):] > 128)
    return [float(xs.mean()), float(h - PAD)]


def colour_blob(px, cond):
    """Centre + equivalent radius of the pixels matching cond (boolean mask), or None."""
    ys, xs = np.where(cond & (px[:, :, 3] > 200))
    if len(xs) == 0:
        return None
    return [float(xs.mean()), float(ys.mean()), float(np.sqrt(len(xs) / np.pi))]


def red_ball(px):
    """Dot's antenna ball: the only red on Dot (the watch is navy)."""
    p = px.astype(int)
    return colour_blob(p, (p[:, :, 0] > 180) & (p[:, :, 1] < 90) & (p[:, :, 2] < 90))


def largest_component(mask):
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8))
    if n < 2:
        return None
    i = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    return lab == i


def steel(px):
    """Knife blade: light, low-saturation, opaque pixels; the largest such component (skips the watch face)."""
    hsv = cv2.cvtColor(px[:, :, :3], cv2.COLOR_RGB2HSV)
    m = (hsv[:, :, 1] < 30) & (hsv[:, :, 2] > 150) & (hsv[:, :, 2] < 252) & (px[:, :, 3] > 200)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return largest_component(m)


def extreme(mask, how):
    """Extreme point of a mask: how in {'top','bottom','left','right','tr','br','tl','bl'}."""
    ys, xs = np.where(mask)
    score = {"top": -ys, "bottom": ys, "left": -xs, "right": xs,
             "tr": xs - ys, "br": xs + ys, "tl": -xs - ys, "bl": ys - xs}[how]
    i = int(np.argmax(score))
    return [int(xs[i]), int(ys[i])]


def ecc_to(A_rgba, B_rgba, mask):
    """Affine that draws B inside A's frame (B px -> A px), fitted on `mask` (in A's frame). Returns (matrix6, cc)."""
    A = cv2.cvtColor(A_rgba, cv2.COLOR_RGBA2GRAY).astype(np.float32)
    B = np.zeros_like(A)
    h, w = min(B_rgba.shape[0], A.shape[0]), min(B_rgba.shape[1], A.shape[1])
    B[:h, :w] = cv2.cvtColor(B_rgba, cv2.COLOR_RGBA2GRAY)[:h, :w]
    warp = np.eye(2, 3, dtype=np.float32)
    cc, warp = cv2.findTransformECC(A, B, warp, cv2.MOTION_AFFINE,
                                    (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 500, 1e-6), mask, 5)
    inv = cv2.invertAffineTransform(warp)  # warp maps A -> B; inverse draws B in A's frame
    return [float(inv[0, 0]), float(inv[1, 0]), float(inv[0, 1]), float(inv[1, 1]), float(inv[0, 2]), float(inv[1, 2])], float(cc)


def blur_copy(im, dest, sigma):
    """Pre-blurred copy (premultiplied alpha) for depth of field - a live CSS blur is far too slow to render."""
    px = np.array(im).astype(np.float32) / 255
    a = px[:, :, 3:4]
    pre = cv2.GaussianBlur(np.concatenate([px[:, :, :3] * a, a], 2), (0, 0), sigma)
    rgb = np.where(pre[:, :, 3:4] > 1e-4, pre[:, :, :3] / np.maximum(pre[:, :, 3:4], 1e-4), 0)
    out = np.concatenate([np.clip(rgb, 0, 1), pre[:, :, 3:4]], 2)
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(dest, optimize=True)
