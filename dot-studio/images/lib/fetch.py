# fetch.py JOBS.json - download Higgsfield results: {"base": url-prefix, "<path relative to dot-studio>": "<file name>"}
import json, os, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
j = json.load(open(sys.argv[1]))
base = j.pop("base")
for dest, name in j.items():
    out = os.path.join(ROOT, dest)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if not os.path.exists(out):
        subprocess.run(["curl", "-sS", "--fail", "-o", out, base + name], check=True)
    print("ok", dest)
