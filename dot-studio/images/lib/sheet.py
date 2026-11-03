# sheet.py DIR OUT.png [COLS] [W] - contact sheet of DIR/t*.png stills, labelled with their time, sorted by time.
import glob, os, sys
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
w = int(sys.argv[4]) if len(sys.argv) > 4 else 480
fs = sorted(glob.glob(os.path.join(d, "t*.png")), key=lambda p: float(os.path.basename(p)[1:-4]))
ims = [Image.open(f).convert("RGB") for f in fs]
h = round(w * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * (h + 22)), "white")
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * w, (i // cols) * (h + 22)
    sheet.paste(im.resize((w, h)), (x, y + 22))
    dr.text((x + 6, y + 4), os.path.basename(f)[1:-4] + "s", fill="black")
sheet.save(out)
print(len(fs), sheet.size)
