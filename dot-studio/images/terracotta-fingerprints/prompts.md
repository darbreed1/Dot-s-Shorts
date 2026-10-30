# terracotta-fingerprints — picture prompts

Dot poses: all reused (dot_lookup, dot_aha, dot_watch, dot_shrug; dot_magnify measured as in dwarf-planet-ed138).
Props / characters: `gpt_image_2_5`, 4k, quality high, background transparent, reference = dot-hero job a67b7f06-…
(style only). Results are listed in `jobs.json` (`python3 images/lib/fetch.py images/terracotta-fingerprints/jobs.json`).

| file | aspect | prompt (before the style block) |
|------|--------|---------------------------------|
| warrior.png | 2:3 | A single terracotta warrior statue from ancient China, standing upright facing the viewer, full body: earthy orange-brown baked clay with a few lighter worn patches, armour of small rectangular plates over a knee-length robe, hair tied in a topknot, a calm stern clay face with closed lips, both hands at his sides in loose fists, standing on a small square clay base. Whole statue in frame with a margin. Only the statue, nothing else. |
| worker_man.png | 2:3 | A friendly ancient Chinese clay worker, an adult man, full body, three-quarter view facing to the right, proud smile, holding a lump of orange clay in both hands ... short black hair tied in a small topknot, a simple knee-length earth-brown wrap tunic with a darker sash. |
| worker_woman.png | 2:3 | ... an adult woman ... warm smile, pressing her thumb into a lump of orange clay held in her other hand ... black hair in a neat bun, a pale green wrap tunic with a darker green sash. |
| worker_child.png | 2:3 | ... a child about ten years old ... cheeky happy grin, holding a small orange clay brick up in both hands ... smaller and shorter than an adult ... short black hair in two small buns, a light blue wrap tunic with a darker blue sash. |

Style block for the workers: "A simple cartoon character with a big round head, a small soft body, noodle arms with simple
four-finger hands and short legs with rounded feet, small solid black oval eyes, simple curved black eyebrows, no nose,"
+ STYLE_OBJ without "no characters" + "no hat, no watch". Generic, fictional people (no real person).

Pit, earth walls, hangar roof, workshop, fingerprints (kit/effects/Fingerprint.tsx), print tokens, the iris time
warp: all code. Voice: the take had an 8 s silent gap after "fifteen" (cut by images/lib/tighten.py; original in
vo_raw.wav). Sound effects (seed_audio, no voice): time_warp.wav, clay_squish.wav (sliced).
