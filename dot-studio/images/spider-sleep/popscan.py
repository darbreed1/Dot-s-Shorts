# popscan.py VIDEO - mean frame-to-frame difference (blurred, 270x480); flag frames above 2.2x the local median.
# Every flag must be an intended swap or cut.
import sys
import cv2
import numpy as np

cap = cv2.VideoCapture(sys.argv[1])
fps = cap.get(cv2.CAP_PROP_FPS)
prev, diffs = None, []
while True:
    ok, f = cap.read()
    if not ok:
        break
    g = cv2.GaussianBlur(cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (270, 480)), (5, 5), 0).astype(np.float32)
    diffs.append(0.0 if prev is None else float(np.abs(g - prev).mean()))
    prev = g
d = np.array(diffs)
flags = []
for i in range(1, len(d)):
    lo, hi = max(1, i - 30), min(len(d), i + 31)
    med = np.median(d[lo:hi])
    if d[i] > 2.2 * max(med, 0.15) and d[i] > 0.6:
        flags.append((i, d[i], med))
print(f"frames {len(d)} fps {fps:.0f}  mean diff {d[1:].mean():.2f}")
for i, v, m in flags:
    print(f"  frame {i:5d}  t={i / fps:6.2f}s  diff {v:6.2f}  (local median {m:.2f})")
