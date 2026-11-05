# align.py SCRIPT.txt WORDS.json [OUT.json] - give every script word a time from Whisper's words, even where they
# don't match one to one (Whisper writes "256", "2,300", "U .S.", "color" where the script says "two hundred and
# fifty-six", "two thousand three hundred", "US", "colour"). Numbers are expanded with num2words, tokens are matched
# with difflib, and unmatched script words share the time of the Whisper span they stand in for. Writes a words.json
# whose "words" list has exactly one entry per script word, ready for captions.py. OUT defaults to WORDS.json.
import difflib, json, re, sys

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def num2words(n, to=None):
    """English words for a whole number, British style ("two hundred and fifty-six"); to="year" reads 1971 as
    "nineteen seventy-one" and 2023 as "twenty twenty-three"."""
    if to == "year" and 1100 <= n <= 2099 and n % 100 != 0 and not 2000 <= n < 2010:
        return num2words(n // 100) + " " + num2words(n % 100)
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")
    if n < 1000:
        return ONES[n // 100] + " hundred" + (" and " + num2words(n % 100) if n % 100 else "")
    for div, name in ((10 ** 9, "billion"), (10 ** 6, "million"), (1000, "thousand")):
        if n >= div:
            rest = n % div
            return num2words(n // div) + " " + name + ((" and " if rest < 100 else " ") + num2words(rest) if rest else "")
    return str(n)

script_path, words_path = sys.argv[1], sys.argv[2]
out_path = sys.argv[3] if len(sys.argv) > 3 else words_path
script = open(script_path, encoding="utf-8-sig").read().split()
W = json.load(open(words_path))

# 1. glue Whisper fragments back together (",300", ".S.", "-rich")
toks = []
for w in W["words"]:
    if toks and re.match(r"^[,.\-]", w["w"]) and not re.match(r"^[,.]$", w["w"]):
        toks[-1] = {"w": toks[-1]["w"] + w["w"], "s": toks[-1]["s"], "e": w["e"]}
    else:
        toks.append(dict(w))

norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("colour", "color").replace("metre", "meter"))

# 2. expand numbers into words, sharing the token's time
hyp = []
for w in toks:
    raw = re.sub(r"[^\d.]", "", w["w"].replace(",", ""))
    if re.fullmatch(r"\d+", raw) and not re.search(r"[a-zA-Z]", w["w"]):
        n = int(raw)
        text = num2words(n, to="year") if 1900 <= n <= 2099 and len(raw) == 4 else num2words(n)
        parts = text.replace(",", "").split()
        # keep the digits too, for scripts that write the number as digits
        if any(c.isdigit() for c in "".join(script)) and raw in [re.sub(r"[^\d]", "", s) for s in script]:
            parts = [raw]
    else:
        parts = [w["w"]]
    d = (w["e"] - w["s"]) / len(parts)
    for k, p in enumerate(parts):
        hyp.append({"k": norm(p), "s": w["s"] + k * d, "e": w["s"] + (k + 1) * d})

ref = [norm(s) for s in script]
# hyphenated script words ("fifty-six") are one script token but one num2words token too ("fifty-six"); fine.
sm = difflib.SequenceMatcher(None, ref, [h["k"] for h in hyp], autojunk=False)
out = [None] * len(script)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == "equal":
        for k in range(i2 - i1):
            out[i1 + k] = {"s": hyp[j1 + k]["s"], "e": hyp[j1 + k]["e"]}
    elif i2 > i1:
        if j2 > j1:
            s0, s1 = hyp[j1]["s"], hyp[j2 - 1]["e"]
        else:  # script words Whisper skipped: squeeze them in at the boundary
            s0 = hyp[j1 - 1]["e"] if j1 > 0 else hyp[0]["s"]
            s1 = hyp[j1]["s"] if j1 < len(hyp) else s0 + 0.3 * (i2 - i1)
            if s1 <= s0:
                s1 = s0 + 0.12 * (i2 - i1)
        lens = [max(1, len(ref[i])) for i in range(i1, i2)]
        tot, acc = sum(lens), 0
        for k, i in enumerate(range(i1, i2)):
            a = s0 + (s1 - s0) * acc / tot
            acc += lens[k]
            out[i] = {"s": round(a, 3), "e": round(s0 + (s1 - s0) * acc / tot, 3)}
words = [{"w": script[i], "s": round(o["s"], 3), "e": round(o["e"], 3)} for i, o in enumerate(out)]
for i in range(1, len(words)):  # keep it monotonic
    words[i]["s"] = max(words[i]["s"], words[i - 1]["s"] + 0.02)
    words[i]["e"] = max(words[i]["e"], words[i]["s"] + 0.05)
W["words"] = words
json.dump(W, open(out_path, "w"), indent=1)
miss = sum(1 for op, i1, i2, *_ in sm.get_opcodes() if op != "equal" for _ in range(i1, i2))
print(f"{len(words)} script words aligned ({miss} not matched exactly)")
