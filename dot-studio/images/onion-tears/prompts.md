# onion-tears — picture prompts

Dot poses: see `images/dot/prompts.md` (five new: dot_cry_knife, dot_chop, dot_squeeze, dot_knife_show,
dot_slow_cut). Props / set pieces: `gpt_image_2_5`, 4k, quality high, background transparent, prompt + STYLE_OBJ,
reference = dot-hero (style only) unless noted.

| file | aspect | prompt (before STYLE_OBJ) |
|------|--------|---------------------------|
| onion_whole.png | 1:1 | A big round golden-brown onion with dry papery skin and a few thin darker lines curving from top to bottom, a short dry pointed tip on top and a small tuft of pale wiry roots at the bottom, front view, standing upright, no face. Only the onion, nothing else. |
| onion_halves.png | 3:2 | (reference = onion_whole job facb10de-…) The same onion as the reference picture, now cut cleanly in half from top to bottom, the two halves standing side by side with a small gap between them, both cut faces turned toward the viewer, each cut face showing white and pale purple-tinged concentric rings inside a thin golden-brown papery skin edge, no face. Only the two halves, nothing else. |
| counter.png | 3:2 | A wide kitchen counter seen from the front and slightly from above: a light wooden countertop running across the whole picture from edge to edge, with simple pale-blue cabinet doors with round knobs below it, and a big rectangular wooden cutting board lying flat on the countertop in the middle. Only the counter and the board, nothing else. (Came out as an island, not edge to edge - staged beside Dot.) |
| knife.png | 1:1 | A large kitchen chef's knife with a shiny pale steel blade and a black handle with three silver rivets, lying horizontally with the handle on the left, the blade pointing to the right and the sharp edge facing down. Only the knife, nothing else. |
| mouse.png | 1:1 | A small cute grey cartoon mouse with big round pink-lined ears, a pink nose, small black oval eyes and a long thin tail, standing on all fours in side view facing to the LEFT, sniffing curiously with its nose stretched forward. Only the mouse, nothing else. (STYLE_OBJ without "no characters".) |
| mouse_cry.png | 1:1 | EDIT of mouse (reference = mouse job 4ff9ba5e-…): The same picture of the same mouse in the same place and size, but now recoiling backward with its head pulled back, eyes squeezed shut into two '> <' chevrons, two small streams of light-blue tears, mouth open in a grimace showing a pink tongue, ears flattened back. Same colours, same outline, same side view facing left. |

Alignment: mouse_cry -> mouse through the raw canvases (same place and size; qa/mouse-overlay.png), not ECC (the
head changes too much). Cell diagram, onion face, gas puffs, mist, tears, glints, kitchen, stool: all code.
