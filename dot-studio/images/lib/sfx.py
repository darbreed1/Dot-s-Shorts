# sfx.py IN_DIR OUT_DIR - per file: trim lead silence to the onset, trim the tail, peak-normalise to -1 dBFS,
# print length, peak time after onset, and a coarse 50 ms envelope so each sound can be judged by its waveform.
import os, sys, wave
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)


def read(p):
    with wave.open(p) as f:
        sr, n, ch, sw = f.getframerate(), f.getnframes(), f.getnchannels(), f.getsampwidth()
        raw = f.readframes(n)
    x = np.frombuffer(raw, dtype={2: np.int16, 4: np.int32}[sw]).astype(np.float64) / (2 ** (8 * sw - 1))
    return sr, x.reshape(-1, ch).mean(1)


for name in sorted(os.listdir(src)):
    if not name.endswith(".wav"):
        continue
    sr, x = read(os.path.join(src, name))
    hop = int(sr * 0.005)
    env = np.array([np.abs(x[i:i + hop]).max() for i in range(0, len(x) - hop, hop)])
    db = 20 * np.log10(env + 1e-9)
    peak_db = db.max()
    on = int(np.argmax(db > peak_db - 30))  # onset = first block within 30 dB of the peak
    loud = np.where(db > peak_db - 45)[0]
    end = loud.max() + 1
    a, b = max(on * hop - int(sr * 0.008), 0), min((end + 4) * hop, len(x))
    y = x[a:b]
    fade = min(int(sr * 0.03), len(y) // 4)
    y[-fade:] *= np.linspace(1, 0, fade)
    y = y / (np.abs(y).max() + 1e-9) * 10 ** (-1 / 20)
    pk = (np.argmax(np.abs(y)) / sr)
    with wave.open(os.path.join(dst, name), "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes((y * 32767).astype(np.int16).tobytes())
    e50 = [np.abs(y[i:i + int(sr * .05)]).max() for i in range(0, len(y), int(sr * .05))]
    bar = "".join(" .:-=+*#%@"[min(9, int(v * 10))] for v in e50)
    print(f"{name:14s} len {len(y) / sr:5.2f}s  peak@{pk:4.2f}s  |{bar[:80]}|")
