# spider-sleep — picture prompts

Dot poses: see `images/dot/prompts.md` (all eight were new for this Short).
Props / set pieces: `gpt_image_2_5`, 4k, quality high, background transparent, prompt + STYLE_OBJ, reference =
dot-hero (style only).

| file | aspect | prompt (before STYLE_OBJ) |
|------|--------|---------------------------|
| spider_droop.png | 1:1 | A cute round fuzzy cartoon jumping spider, fast asleep, hanging upside down from a flat ceiling line: seen from the front, its eight short fuzzy legs reach straight up and their tips all end at the same straight horizontal line at the very top (as if gripping a ceiling, the ceiling itself is not drawn), its round body hangs loosely below, relaxed and droopy. Warm brown body (#8A5A3C) with a darker brown shade, a few small cream tufts along the legs and a cream stripe fringe on the head. Its face is at the bottom of the body and faces the viewer: two very big round glossy black front eyes side by side and two much smaller black eyes beside them, each eye with one small white glint; a tiny relaxed sleepy mouth with two small fuzzy mouthparts. Only the spider, nothing else. |
| spider_rem.png | 1:1 | EDIT of spider_droop (reference = spider_droop job 98e71815-…): The same picture of the same spider, with only the legs changed: the four middle legs (two on each side) are now bent and curled in tightly against the sides of the body like a twitch in its sleep, while the two outer legs on each side still reach straight up to the same straight top line. The body, face, eyes, colours, size and position are exactly identical. |
| web.png | 3:2 | A thin knobbly brown twig running horizontally across the whole picture from edge to edge, with two small green leaves, and a small loose sheet of white silk spider web hanging just below the middle of the twig like a shallow hammock, a few thin silk threads joining it to the twig; the underside of the web sheet is a gently curved line. Only the twig and the web, nothing else. |
| camera.png | 1:1 | A small old-fashioned boxy film camera on a wooden three-legged tripod, the lens pointing up and to the right, a small round red recording light on top of the camera, side view. No logo, no text. Only the camera and tripod, nothing else. |

Alignment: spider_rem -> spider_droop by ECC affine on the body + face (correlation 0.964); matrix in sprites.ts.
