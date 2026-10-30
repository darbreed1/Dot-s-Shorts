# verify.py VIDEO [W H FPS SECONDS] - size, fps, frame count, audio present + as long as picture, peak level,
# and that the picture still moves at the very end. Uses the ffmpeg/ffprobe that Remotion ships.
import json, os, subprocess, sys, wave
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BIN = os.path.join(ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc")
FFPROBE, FFMPEG = os.path.join(BIN, "ffprobe.exe"), os.path.join(BIN, "ffmpeg.exe")
video = sys.argv[1]
W, H, FPS, SEC = (int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (2160, 3840, 60, 29.2)

info = json.loads(subprocess.run([FFPROBE, "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", video],
                                 capture_output=True, text=True).stdout)
v = next(s for s in info["streams"] if s["codec_type"] == "video")
a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
num, den = map(int, v["r_frame_rate"].split("/"))
frames = int(v.get("nb_read_frames", 0))
vdur = float(v.get("duration", info["format"]["duration"]))
checks = {
    "size": (f"{v['width']}x{v['height']}", v["width"] == W and v["height"] == H),
    "fps": (num / den, abs(num / den - FPS) < 0.01),
    "frames": (frames, frames == round(SEC * FPS)),
    "audio": (a["codec_name"] if a else None, a is not None),
}
if a:
    adur = float(a.get("duration", 0))
    checks["audio length"] = (f"{adur:.3f}s vs video {vdur:.3f}s", abs(adur - vdur) < 0.05)
    # Remotion's slim ffmpeg has no raw-float muxer: decode to a temp wav and read it
    tmp = os.path.join(ROOT, "out", "_verify.wav")
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", video, "-vn", "-ac", "1", "-c:a", "pcm_s16le", tmp], check=True)
    with wave.open(tmp) as f:
        x = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float64) / 32768
    os.remove(tmp)
    peak = 20 * np.log10(np.abs(x).max() + 1e-9)
    clipped = int((np.abs(x) > 0.999).sum())
    checks["audio peak"] = (f"{peak:.1f} dBFS, {clipped} clipped samples", peak < -0.5 and clipped == 0)

# last two frames differ (the picture still moves at the very end)
def frame_at(sec):
    import cv2
    cap = cv2.VideoCapture(video)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(sec * FPS))
    ok, f = cap.read()
    return cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (270, 480)).astype(np.float32)
f1, f2 = frame_at(vdur - 0.25), frame_at(vdur - 0.02)
checks["moves at end"] = (f"mean diff {np.abs(f1 - f2).mean():.2f}", np.abs(f1 - f2).mean() > 0.05)

ok = True
for k, (val, good) in checks.items():
    ok &= bool(good)
    print(f"{'OK ' if good else 'BAD'} {k:13s} {val}")
print("ALL OK" if ok else "SOME CHECKS FAILED")
