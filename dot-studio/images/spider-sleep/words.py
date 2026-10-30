# words.py VO.wav OUT.json - whisper word times + loudness pauses
import json, sys, wave
import numpy as np
from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
with wave.open(src) as f:
    sr, n, ch, sw = f.getframerate(), f.getnframes(), f.getnchannels(), f.getsampwidth()
    raw = f.readframes(n)
x = np.frombuffer(raw, dtype={2: np.int16, 4: np.int32}[sw]).astype(np.float64)
x = x.reshape(-1, ch).mean(1) / (2 ** (8 * sw - 1))

# decode ourselves (the installed PyAV is incompatible with faster-whisper's decoder); whisper wants 16 kHz mono
x16 = np.interp(np.arange(0, len(x) / sr, 1 / 16000), np.arange(len(x)) / sr, x).astype(np.float32)
model = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = model.transcribe(x16, word_timestamps=True, language="en")
words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
hop = int(sr * 0.02)
rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
db = 20 * np.log10(rms)
quiet = db < -42
pauses, i = [], 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j < len(quiet) and quiet[j]:
            j += 1
        if (j - i) * 0.02 >= 0.18:
            pauses.append([round(i * 0.02, 2), round(j * 0.02, 2)])
        i = j
    else:
        i += 1
json.dump({"duration": round(len(x) / sr, 3), "words": words, "pauses": pauses}, open(out, "w"), indent=1)
print("duration", round(len(x) / sr, 3))
print(" ".join(f"{w['w']}@{w['s']:.2f}" for w in words))
print("pauses", pauses)
