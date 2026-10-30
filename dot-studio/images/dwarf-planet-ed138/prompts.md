# dwarf-planet-ed138 — picture prompts

Dot poses: see `images/dot/prompts.md` (two new: dot_magnify, dot_scratch; reused: dot_lookup, dot_shrug,
dot_watch). Props / set pieces: `gpt_image_2_5`, 4k, quality high, background transparent, prompt + STYLE_OBJ,
reference = dot-hero job a67b7f06-… (style only). Job result files are listed in `jobs.json` (`fetch.sh` downloads them).

| file | aspect | prompt (before STYLE_OBJ) |
|------|--------|---------------------------|
| pluto.png | 1:1 | The dwarf planet Pluto as a round cartoon ball seen from the front: a pale beige-grey surface with soft light-brown and tan patches, one big pale cream heart-shaped patch on the lower right part of the ball, a few small round craters, perfectly round outline, no face. Only the round planet, nothing else. |
| ed138.png | 1:1 | A small icy dwarf planet as a round cartoon ball seen from the front: a dusty pale grey-lavender surface with a few soft darker reddish-brown smudges and four small round craters, perfectly round outline, no face, no rings. Only the round ball, nothing else. (Its real colour is unknown: a neutral look on purpose.) |
| observatory.png | 3:2 | A wide rocky mountain summit seen from the front: a broad flat-topped peak of grey-brown stone with a few boulders and gentle slopes that run off both sides of the picture, and on the flat top a white boxy observatory building with a large rounded white telescope dome whose dark slit is open, sitting a little right of centre. The mountain spreads across the whole width of the picture. Only the mountain and the building, nothing else, no logo. (Came out as a mesa, not edge to edge - ridges in code fill the sides.) |

Faces on Pluto / the object / the Sun, the Sun, Earth, ruler, Milky Way, Southern Cross, search ring, detection
brackets, flash, ground and ridges: all code. Sound effects (seed_audio, no voice): shutter.wav ("a single crisp camera
shutter click"), inflate.wav ("a cartoon balloon inflating ... ends with a soft pop"), space_hum.wav ("a soft calm airy
outer-space ambience") - trimmed by spider-sleep/sfx.py into public/sfx/.
