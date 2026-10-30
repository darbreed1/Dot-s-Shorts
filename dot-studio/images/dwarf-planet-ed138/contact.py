# contact.py OUT.png DIR - every still in DIR (0.5x frames) in one grid with its time, for checking beats
import os, sys
from PIL import Image, ImageDraw
out, d = sys.argv[1], sys.argv[2]
files = sorted(f for f in os.listdir(d) if f.endswith(".png"))
cols, w = 6, 270
h = w * 16 // 9
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 10), rows * (h + 26)), (110, 190, 130))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(os.path.join(d, f)).convert("RGB").resize((w, h))
    x, y = (i % cols) * (w + 10), (i // cols) * (h + 26)
    sheet.paste(im, (x, y))
    dr.text((x + 4, y + h + 6), f, fill=(0, 0, 0))
sheet.save(out)
