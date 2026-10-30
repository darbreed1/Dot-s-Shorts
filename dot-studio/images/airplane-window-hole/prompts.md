# airplane-window-hole — picture prompts

Dot poses: one new (dot_three, in images/dot/prompts.md); reused dot_magnify, dot_aha, dot_lookup. Props:
`gpt_image_2_5`, 4k, quality high, background transparent, prompt + STYLE_OBJ, reference = dot-hero job a67b7f06-…
(style only). Results are listed in `jobs.json` (`python3 images/lib/fetch.py images/airplane-window-hole/jobs.json`).

| file | aspect | prompt (before STYLE_OBJ) |
|------|--------|---------------------------|
| airliner.png | 3:2 | A cartoon passenger airliner flying, side view facing to the right: a plain white body with one light-blue stripe along the side, a long row of small round windows, swept wings, two engines under the wings, a tall tail fin, no logo, no text, no letters, no numbers. Only the plane, nothing else. |
| seat.png | 1:1 | A single airplane passenger seat seen from the side, facing to the LEFT: dark blue fabric cushion and backrest, a grey plastic frame and armrest, a white headrest cover on top, short grey metal legs. Only the seat, nothing else, no logo. (Drawn mirrored in the scene.) |

Cabin wall, window, clouds, fog, the exploded panes, the cross-section (air particles, arrows, pane faces): all code.
Voice: long pauses capped at 0.7 s by images/lib/tighten.py (original in vo_raw.wav). Sound effects (seed_audio, no
voice): cabin_hum.wav, air_hiss.wav, cabin_chime.wav, glass_squeak.wav (sliced).
