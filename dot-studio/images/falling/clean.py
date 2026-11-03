# clean.py - per section: merge Whisper's split tokens ("10" ",160", "twenty" "-eight", "90" "%"), fix misheard words
# and spellings to the approved script, then write words/sNN.json (clean, used for captions) and script/sNN.txt
# (the caption text, one token per Whisper word so captions.py maps them one-to-one). Raw Whisper output is kept in
# words/sNN.raw.json.
import json, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
FIX = {
    "vulevic.": "Vulović.", "vulovic.": "Vulović.", "vulović.": "Vulović.",
    "garcia": "García", "gutierrez": "Gutiérrez", "shoot": "chute",
    "meets": "metres",
}


def spell(w):
    low = w.lower()
    if low in FIX:
        return FIX[low]
    if low.startswith("sebasti"):
        return "Sebastián"
    w = re.sub(r"kilometer", "kilometre", w)
    w = re.sub(r"\bmeters", "metres", w)
    return w


os.makedirs(os.path.join(HERE, "script"), exist_ok=True)
for i in range(1, 7):
    p = os.path.join(HERE, "words", f"s{i:02d}.json")
    raw = os.path.join(HERE, "words", f"s{i:02d}.raw.json")
    if not os.path.exists(raw):
        shutil.copy(p, raw)
    W = json.load(open(raw, encoding="utf-8"))
    out = []
    for w in W["words"]:
        t = w["w"]
        if out and (t.startswith(",") or t.startswith("-") or t == "%" or t.startswith("%")):
            out[-1] = {"w": out[-1]["w"] + t, "s": out[-1]["s"], "e": w["e"]}
        else:
            out.append(dict(w))
    for w in out:
        w["w"] = spell(w["w"])
    # first word of a section is a sentence start
    out[0]["w"] = out[0]["w"][0].upper() + out[0]["w"][1:]
    W["words"] = out
    json.dump(W, open(p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(os.path.join(HERE, "script", f"s{i:02d}.txt"), "w", encoding="utf-8").write(" ".join(w["w"] for w in out))
    print(f"s{i:02d}", len(out), "words", round(W["duration"], 2), "s")
