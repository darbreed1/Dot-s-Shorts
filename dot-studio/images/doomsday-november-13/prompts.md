# doomsday-november-13 — picture prompts

Dot poses: one new (dot_scared, in images/dot/prompts.md; its head radius is overridden in prep.py because the hands
gripping the hat merge into the head disc); reused dot_watch, dot_lookup, dot_surprised, dot_aha, dot_shrug.
`gpt_image_2_5`, 4k, quality high, background transparent, reference = dot-hero job a67b7f06-… (role
`image_references`). Results in `jobs.json` (`python images/lib/fetch.py images/doomsday-november-13/jobs.json`).

| file | aspect | prompt (before the style block) |
|------|--------|---------------------------------|
| black_cat.png | 1:1 | A cartoon black cat walking calmly to the right, side view, whole body: sleek black fur with one soft dark-grey shade, the tail held up high in a curl, half-closed smug eyes with yellow irises looking toward the viewer, a tiny pink nose, small pointed ears, four short legs mid-step. Whole cat in frame with a margin. Only the cat, nothing else. (STYLE_OBJ with "use a dark grey inner line for details on the black fur" and "no people" instead of "no characters".) |

The three researchers are real people (von Foerster, Mora, Amiot), so they are faceless code pictograms
(kit/effects/Pictogram.tsx), not generated characters. Calendar, room, window and lightning, the 1960 paper, the
chart, the family, the warning sign, the crystal ball and the red X: all code.

Sound effects (seed_audio, no voice), trimmed by images/lib/sfx.py into public/sfx/: doom_sting, cat_meow,
paper_rustle, pencil_scribble, slide_whistle_up.
