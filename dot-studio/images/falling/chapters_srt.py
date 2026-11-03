# chapters_srt.py - write out/falling-short{1-4}.srt for the chapter Shorts (FallingShort n = voice section n+1,
# whose voice starts LEAD seconds into the Short; see chapterWindow in src/longform/falling/Falling.tsx).
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LEAD = 0.55
tmp = os.path.join(HERE, "tmp")
os.makedirs(tmp, exist_ok=True)
for short in range(1, 5):
    n = f"{short + 1:02d}"
    srt = os.path.join(ROOT, "out", f"falling-short{short}.srt")
    subprocess.run([sys.executable, os.path.join(ROOT, "images", "lib", "captions.py"), os.path.join(HERE, "script", f"s{n}.txt"),
                    os.path.join(HERE, "words", f"s{n}.json"), str(LEAD), os.path.join(tmp, f"short{short}.ts"), srt],
                   check=True, capture_output=True)
    print(srt)
