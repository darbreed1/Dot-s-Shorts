# orcas long-form — picture prompts and production notes

16:9 long-form (1920x1080, 60 fps), composition OrcaLongform (src/longform/orcas/). Script: scripts/orcas-longform.md.
Dot poses: one new (dot_scuba, in images/dot/prompts.md); reused dot_lookup, dot_aha, dot_shrug, dot_scratch,
dot_magnify, dot_droop, dot_two, dot_three. Props: `gpt_image_2_5`, 4k, quality high, background transparent,
prompt + STYLE_OBJ ("... no sky, no water, no ground, no shadow"), reference = dot-hero job a67b7f06-… (style only).
Results are listed in `jobs.json` (`python3 images/lib/fetch.py images/orcas/jobs.json`).

| file | aspect | prompt (before STYLE_OBJ) |
|------|--------|---------------------------|
| orca.png | 3:2 | A cartoon orca (killer whale) swimming, side view facing to the RIGHT, the whole body in frame: glossy black back and sides, a white chin and white belly, a white oval eye patch just behind and above the eye, a pale grey saddle patch behind the dorsal fin, a tall dorsal fin, paddle-shaped flippers, a horizontal tail fluke, mouth closed with a slight friendly smile, a small black eye. |
| blue_whale.png | 3:2 | A cartoon blue whale swimming, side view facing to the LEFT ... blue-grey skin with a few lighter mottled spots, pale grooves on the throat, a small dorsal fin far back, long slim flippers, a wide tail fluke, a small calm eye, mouth closed. |
| shark.png | 3:2 | A cartoon great white shark swimming, side view facing to the RIGHT ... grey back, white belly with a sharp wavy line between them, pointed snout, a tall triangular dorsal fin, five gill slits, mouth closed, a small black eye, a slightly nervous expression. |
| seal.png | 1:1 | A cute cartoon harbor seal swimming, side view facing to the LEFT ... a plump grey body with darker spots, a round head, big shiny black eyes, whiskers, small flippers, mouth closed. |
| salmon.png | 3:2 | A cartoon Chinook salmon fish swimming, side view facing to the LEFT ... silvery body with a blue-green back covered in small black spots, a faint pink tint along the side, forked tail. |
| dolphin.png | 3:2 | A cartoon bottlenose dolphin swimming, side view facing to the RIGHT ... smooth grey body with a lighter belly, a curved dorsal fin, a short beak with a friendly smile. |
| elephant.png | 1:1 | A cartoon African elephant standing, side view facing to the RIGHT ... big ears, trunk hanging down, two small white tusks. |
| sailboat.png | 1:1 | A small white sailing yacht seen from the side, facing to the LEFT, the whole boat including the part below the waterline: white hull with one blue stripe, a keel fin, a rudder clearly visible under the back, one tall mast with a mainsail and a smaller front sail, no name, no number, no flag, no people. |

Everything else is code: the underwater / surface / dock sets, fins, spouts, bubbles, kelp, surfboard, kayak, the
see-saw, the birthday cake, warm sea + Antarctic ice panels, the liver x-ray, the podium, menu cards, dialect
squiggles, echolocation arcs, brains, tanks, the 75 fins.

Voice: ten section takes in Dot's locked voice (images/orcas/vo-raw/), long pauses capped at 0.7 s
(images/lib/tighten.py) into public/orcas/vo/. Section 9's take had a garbled repeat ("Don't a thing they don't
understand") after "...things they don't understand." - cut out (15.62-18.11 s of the tightened take, inside two
silent pauses). Section 3 says "very, very good hunters" (kept; captions follow the audio). Sections are laid end to
end by images/orcas/timeline.py (0.4 s lead, 1.1 s between sections), which also writes the captions + .srt.
Sound effects (seed_audio, no voice): underwater.wav, waves.wav, orca_call.wav, echo_clicks.wav (sliced), splash.wav.
