# chapters_srt.py - write out/computer-short{1-6}.srt for the chapter Shorts (ComputerShort n = voice section n, whose
# voice starts LEAD seconds into the Short; see chapterWindow in src/longform/computer/Computer.tsx).
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LEAD = 0.55
tmp = os.path.join(HERE, "tmp")
os.makedirs(tmp, exist_ok=True)
for short in range(1, 7):
    n = f"{short:02d}"
    srt = os.path.join(ROOT, "out", f"computer-short{short}.srt")
    subprocess.run([sys.executable, os.path.join(ROOT, "images", "lib", "captions.py"), os.path.join(HERE, "script", f"s{n}.txt"),
                    os.path.join(HERE, "words", f"s{n}.json"), str(LEAD), os.path.join(tmp, f"short{short}.ts"), srt],
                   check=True, capture_output=True)
    print(srt)
