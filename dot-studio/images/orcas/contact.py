# contact.py OUT.png DIR [cols] - every still in DIR in one grid with its file name (keeps the frames' aspect)
import os, sys
from PIL import Image, ImageDraw
out, d = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
files = sorted(f for f in os.listdir(d) if f.endswith(".png"))
first = Image.open(os.path.join(d, files[0]))
w = 380
h = round(w * first.height / first.width)
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 8), rows * (h + 22)), (110, 190, 130))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(os.path.join(d, f)).convert("RGB").resize((w, h))
    x, y = (i % cols) * (w + 8), (i // cols) * (h + 22)
    sheet.paste(im, (x, y))
    dr.text((x + 4, y + h + 4), f, fill=(0, 0, 0))
sheet.save(out)
