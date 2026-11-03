# falling long-form — production notes and picture prompts

16:9 long-form (1920x1080, 60 fps), composition FallingLongform (src/longform/falling/). Script:
scripts/falling-longform.md. Six voice sections laid end to end by timeline.py; scenes in sections.tsx keyed to the
spoken words with cue(n, phrase).

Built for cutting: every shot is drawn on the kit Stage (src/kit/Stage.tsx, a 1080x1080 safe square; backgrounds bleed
far past it), so chapters 1-4 (voice sections 2-5) also render as vertical Shorts FallingShort1-4 (1080x1920) with
their own captions and audio window (kit Mixer offset/end). Render one with:
`node images/lib/render.mjs FallingShort1 out/falling-short1-4K.mp4 2`.

Pipeline for re-cuts: images/falling/clean.py (merge split tokens, fix misheard words) -> timeline.py (timeline.ts +
out/falling-longform.srt). The outro took three voice takes (one dropped sentences, one garbled); the kept take is
takes/s06a.wav.

Dot poses: three new (dot_freefall, dot_headdown, dot_canopy; prompts in images/dot/prompts.md); reused dot_lookup,
dot_aha, dot_shrug, dot_surprised, dot_scratch. Props: `gpt_image_2_5`, 4k, quality high, background transparent,
reference = dot-hero job a67b7f06-… (role image_references). Results in jobs.json.

| file | aspect | prompt (before STYLE_OBJ) |
|------|--------|---------------------------|
| plane.png | 3:2 | A cartoon small propeller skydiving airplane flying, side view facing to the RIGHT: a boxy white body with one red stripe along the side, a high wing on top, one propeller at the nose, a big open side door near the back of the cabin, small fixed wheels, a tail fin; no logo, no text. |
| station.png | 3:2 | A cartoon space station seen from the front: a long straight white central beam, a cluster of white cylinder modules in the middle, and four pairs of long golden-orange solar panel wings; small silver radiators; no flags, no logos, no text. (Drawn vertical; rotated 90 degrees in code.) |

Code-drawn: skies, space, Earth (kit), clouds, rain, the speed graph and gauge, air columns, the altitude ruler and
markers, the 28 abstract markers, certificate, canopy (front view with cells; inflates, tilts, twists), pilot chute,
bag, slider, the 1-in-1,000 grid, malfunction cards, handles, the rigger table, the automatic opener, chain links,
Newton's thrown balls, orbits, drag specks, thruster flame.

Chapter 3 (Vulović) is told calmly: dusk palette, no wreckage imagery, no comedy sounds, she is never drawn, and the
two journalists are faceless pictograms (kit/effects/Pictogram.tsx).

Sound effects (seed_audio, no voice), trimmed into public/sfx/: wind_rush, plane_drone, canopy_open, velcro_rip,
aad_pop, thruster_burn.
