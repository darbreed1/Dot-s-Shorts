# tighten.py IN.wav OUT.wav [MAX_PAUSE=0.7] - shorten every silent pause (below -42 dB for >= 0.18 s, as in
# words.py) that is longer than MAX_PAUSE by cutting out its middle, with 10 ms crossfades. Only silence is removed.
import sys, wave
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
cap = float(sys.argv[3]) if len(sys.argv) > 3 else 0.7
with wave.open(src) as f:
    sr, ch, sw, n = f.getframerate(), f.getnchannels(), f.getsampwidth(), f.getnframes()
    x = np.frombuffer(f.readframes(n), dtype={2: np.int16, 4: np.int32}[sw]).astype(np.float64).reshape(-1, ch)
mono = x.mean(1) / (2 ** (8 * sw - 1))
hop = int(sr * 0.02)
db = 20 * np.log10(np.array([np.sqrt(np.mean(mono[i:i + hop] ** 2) + 1e-12) for i in range(0, len(mono) - hop, hop)]))
quiet = db < -42
cuts, i = [], 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j < len(quiet) and quiet[j]:
            j += 1
        a, b = i * hop, j * hop
        # leading / trailing silence of the take is kept as it is
        if (b - a) / sr > cap and a > 0 and j < len(quiet):
            keep = int(cap * sr / 2)
            cuts.append((a + keep, b - keep))
        i = j
    else:
        i += 1
fade = int(sr * 0.01)
out, pos = [], 0
for a, b in cuts:
    out.append(x[pos:a])
    pos = b
out.append(x[pos:])
y = out[0]
for seg in out[1:]:
    r = np.linspace(1, 0, fade)[:, None]
    y = np.concatenate([y[:-fade], y[-fade:] * r + seg[:fade] * (1 - r), seg[fade:]])
with wave.open(dst, "wb") as f:
    f.setnchannels(ch); f.setsampwidth(sw); f.setframerate(sr)
    f.writeframes(np.clip(y, -(2 ** (8 * sw - 1)), 2 ** (8 * sw - 1) - 1).astype({2: np.int16, 4: np.int32}[sw]).tobytes())
print(f"{len(cuts)} pauses shortened: {[(round(a / sr, 2), round((b - a) / sr, 2)) for a, b in cuts]}; {n / sr:.2f}s -> {len(y) / sr:.2f}s")
