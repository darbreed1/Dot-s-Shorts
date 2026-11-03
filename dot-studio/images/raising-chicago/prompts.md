# raising-chicago — picture prompts

Dot poses: all reused (dot_lookup, dot_surprised, dot_aha, dot_watch, dot_shrug). Props / characters:
`gpt_image_2_5`, 4k, quality high, background transparent, reference = dot-hero job a67b7f06-… (style only, role
`image_references`). Results are listed in `jobs.json` (`python images/lib/fetch.py images/raising-chicago/jobs.json`).
Made through the Higgsfield connector tools (generate_image_batch / generate_audio_batch), not the CLI.

| file | aspect | prompt (before the style block) |
|------|--------|---------------------------------|
| building_a.png | 2:3 | A four-storey red-brick commercial building from the 1860s seen straight from the front, a flat facade: warm red brick with a lighter stone cornice along the flat roof top, three rows of four tall arched upper windows with plain flat light-blue glass (every window empty, nothing inside), a ground-floor shop with one wide plain light-blue shop window on the left and a dark green wooden door on the right with two small stone steps in front of it, a striped green-and-cream canvas awning above the shop window, a blank cream signboard above the awning with no writing. The bottom edge of the building is one straight horizontal line. No people, no text, no letters, no numbers, no logo. Only the building, nothing else. |
| building_b.png | 2:3 | A narrow three-storey shop building from the 1860s seen straight from the front, a flat facade: pale tan stone blocks with white window trim, a flat roof with a simple dark wooden cornice, two rows of two tall rectangular upper windows with plain flat light-blue glass (every window empty), a ground-floor shop with a big plain light-blue shop window on the left and a dark red wooden door on the right with one small step, a blank wooden signboard above the shop window with no writing. (same closing lines as building_a) |
| worker_jack.png | 1:1 | A friendly 1860s construction worker, full body, side view facing to the LEFT, leaning forward and pushing with both hands on a long horizontal iron lever bar that sticks out of a short squat iron screw jack standing in front of him on a small wooden block (the screw jack: a thick dark-grey iron screw column with spiral threads rising from a wide round iron base, a flat top plate); he wears a flat brown cap, a white shirt with rolled-up sleeves, brown suspenders and dark grey trousers, determined small smile. Whole figure and the screw jack in frame with a margin. |
| townsman.png | 4:5 | Waist-up, facing the viewer, centred: a friendly 1860s gentleman wearing a tall black top hat, a neat dark grey suit jacket over a white shirt collar with a small black bow tie, a small curled black moustache, the hand on the RIGHT side of the image raised beside his head waving, cheerful open smile. Whole upper body and top hat in frame with a margin. |
| townswoman.png | 4:5 | Waist-up, facing the viewer, centred: a friendly 1860s lady wearing a small blue bonnet tied under her chin with a ribbon, a high-collared blue dress with a row of small buttons, brown hair parted in the middle, the hand on the LEFT side of the image raised beside her head waving, happy surprised smile. Whole upper body and bonnet in frame with a margin. |

Style block for the buildings: STYLE_OBJ verbatim. For the people: "A simple cartoon character with a big round head,
a small soft body, noodle arms with simple four-finger hands (and short legs with rounded feet), small solid black oval
eyes, simple curved black eyebrows, no nose." + STYLE_OBJ without "no characters" + "no wizard hat, no watch".
Generic, fictional people (no real person).

prep.py measures: window glass boxes (light-blue components), the shop window, building_a's door, the jack's top
plate on worker_jack (pinned to the building's underside), the townsfolk head discs.

Skyline, street, fill, plank walk, jackscrews under the buildings (kit/effects/ScrewJack.tsx), the swamp
cross-section, frog, sewer pipe and its face, day/night sky, LAKE STREET sign, OPEN sign: all code.

Sound effects (seed_audio, no voice), trimmed by images/lib/sfx.py into public/sfx/: creak, ratchet, frog_croak,
mud_squelch, street_tone, pipe_gurgle, dirt_pour, shop_bell. (The shop bell job hit a rate limit once and was resent.)
