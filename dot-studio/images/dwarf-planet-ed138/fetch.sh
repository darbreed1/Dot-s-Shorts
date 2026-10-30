#!/bin/sh
# fetch.sh - download the Higgsfield results listed in jobs.json (voice -> public/, pictures -> raw/)
cd "$(dirname "$0")"
python3 - <<'PY'
import json, subprocess
j = json.load(open("jobs.json")); base = j.pop("base")
for dest, name in j.items():
    out = "../../public/dwarf-planet-ed138/vo/take1.wav" if dest.startswith("vo/") else dest
    subprocess.run(["curl", "-sS", "--fail", "-o", out, base + name], check=True)
    print("ok", dest)
PY
