# sheet.py OUT.png a.png b.png ... - cut-outs on a coloured background with names, to check edges and transparency
import sys
from PIL import Image, ImageDraw

out, files = sys.argv[1], sys.argv[2:]
cell, cols = 520, 4
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGBA", (cell * cols, (cell + 30) * rows), (110, 190, 130, 255))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGBA")
    im.thumbnail((cell - 20, cell - 20))
    x, y = (i % cols) * cell, (i // cols) * (cell + 30)
    sheet.alpha_composite(im, (x + (cell - im.width) // 2, y + 10))
    d.text((x + 10, y + cell + 6), f.replace("\\", "/").split("/")[-1], fill=(0, 0, 0, 255))
sheet.save(out)
