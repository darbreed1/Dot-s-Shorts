# Computer long-form: picture prompts

All GPT Image 2.5, 4k, quality high, transparent background, reference image dot-hero
(`a67b7f06-2d0a-40e1-acd0-4647472a5822`). Props end with the shared style line: "Only the X, nothing else. Flat 2D
cartoon in exactly the same drawing style as the reference images: thick smooth black outlines of even weight, flat
colours with one simple soft shade, clean vector-like linework, no texture, no text, no border, no characters.
Isolated on a fully transparent background: no table, no ground, no shadow." Job results are in `jobs.json`.

| file | ratio | prompt |
|------|-------|--------|
| chip.png | 1:1 | A single computer processor chip seen from above at a slight angle: a square dark green circuit board package with a shiny silver metal lid in the middle and rows of small gold contact pins along all four edges, a few tiny gold circuit lines, no logo, no text, no letters, no numbers. (prep.py repaints the lid flat: the model left a smudge.) |
| laptop.png | 3:2 | An open silver laptop computer seen from the front at a slight three-quarter angle: a grey keyboard, a trackpad, the screen showing a plain light-blue glowing display with nothing on it, no logo, no text, no letters. |
| cooler.png | 1:1 | A computer cooler seen from the front: a tall block of thin shiny silver metal fins with three copper heat pipes curving out of the bottom, and a black round cooling fan with seven curved blades mounted on the front of the fins, no logo, no text. (Fan disc set by hand in prep.py; spinning blades are drawn in code.) |
| ram_stick.png | 3:2 | A computer memory stick (RAM module) seen from the front, lying horizontally: a long thin green circuit board with a row of eight black rectangular memory chips and a row of gold contacts along the bottom edge, no logo, no text, no stickers. |
| speaker.png | 2:3 | A small loudspeaker box standing upright, seen from the front: a rounded wooden cabinet with a big round black speaker cone below and a small round tweeter above, no logo, no text. (Cone disc set by hand in prep.py.) |
| dot_snip.png, dot_warm.png | 2:3 | New Dot poses: see `images/dot/prompts.md`. |

Everything else (switches, bulbs, bits, the wire and coil, data packets, pixel tiles, heat, symbols) is drawn in code
in `src/longform/computer/parts.tsx` and `sections.tsx`. Grace Hopper appears only as a name card and her wire, never
drawn.

Sound effects (seed_audio, "Sound effect only, no music, no voice: ..."): switch_click, scissors_snip, fan_whir,
computer_hum, pour (in `public/sfx/`).
