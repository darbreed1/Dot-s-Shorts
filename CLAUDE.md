# Dot: everything in one place

Dot is the cartoon explainer behind the "Wait Why" YouTube channel (artwork: `wait-why-banner-2560x1440.png`,
`wait-why-profile-800.png`). Vertical Shorts of 20-30 s, plus 16:9 long-form compilations and explainers.

## Read this first: work happens in two places

Episodes are made both on this PC and in Claude Code cloud sessions, which push to GitHub
(`darbreed1/Dot-s-Shorts`, branch `main`). Before checking what has been covered, writing a script or starting an
episode, run `git pull` in this folder. On 2026-11-02 a local session missed three finished episodes because the
cloud work had not been pulled yet.

After finishing anything (script, episode, catalog change), commit and push so the other side sees it.

## Where everything is

| What | Where |
|------|-------|
| Every finished episode (source of truth) | `dot-studio/catalog.json` |
| Long-form bundle categories | `dot-studio/categories.json` |
| Scripts (approved, drafts and pitched ideas) | `dot-studio/scripts/<slug>.md` |
| YouTube upload text (title, description, tags) | `dot-studio/scripts/<slug>-youtube.md` |
| Beat sheet, picture prompts, Higgsfield job URLs | `dot-studio/images/<slug>/beats.md`, `prompts.md`, `jobs.json` |
| Dot's pose library (reuse before generating) | `dot-studio/images/dot/` + `prompts.md`; trimmed copies in `public/dot/` |
| Shared animation kit (camera, captions, effects, moves) | `dot-studio/src/kit/` |
| One scene per episode | `dot-studio/src/shorts/<slug>/`, long-form in `src/longform/` |
| Shared sound effects | `dot-studio/public/sfx/` |
| Renders and .srt captions | `dot-studio/out/` (copies of finished files also sit in this top folder) |

## The character (short version; full spec in the cutout-cartoon-shorts skill)

- Big round cream head (#FFF1D6), small soft body, noodle arms, no nose, no hair, thick black outlines, flat colours.
- Navy wizard hat (#2B3A8C) with a gold pyramid and dots; curly antenna through the tip with a red ball (#E8483F);
  oversized navy dive watch, always on the wrist on the LEFT side of the image.
- Gags: taps the watch to "travel back" (history) or time things (science); antenna springs up on surprise, droops
  when things go wrong; hat slips on a blast; red ball glows on an "aha".
- Reference picture for every new pose: `dot-studio/images/dot/dot-hero.png`.
- Voice is locked: Higgsfield `seed_audio`, preset voice "Archie"
  (`bd072316-f77c-588b-b6e5-e46b9b03d008`), `pitch_rate` 2, `speech_rate` 3, 48 kHz wav.
- Personality: curious and fair, never mocking. No "!" lines, no hype words, no greetings or calls to action.
- Real people (scientists, officials) are never drawn as characters: use faceless pictograms
  (`src/kit/effects/Pictogram.tsx`), objects or Dot's reaction instead.

## Pipeline

1. `/dot-script`: research and pitch, saved to `scripts/<slug>.md`, user approves.
2. `/cutout-cartoon-shorts`: pictures and voice from Higgsfield, Remotion scene, 4K vertical render with captions,
   `.srt`, catalog entry. Write `scripts/<slug>-youtube.md` while the render runs.
3. Straight after the render is verified, post the YouTube title, description and tags in the reply (each in its own
   code block, ready to paste) together with the MP4 and .srt, without waiting to be asked. Format: section 14 of the
   skill.
4. Commit and push.

The skill itself lives in the user's claude.ai account; the local copy syncs from there. `skills/` in this folder holds
the latest edited version (`SKILL.md` + a `.zip` for re-uploading) so changes are not lost when the sync overwrites
the local copy (both `dot-script` and `cutout-cartoon-shorts` are kept there).

Tools: Higgsfield is used through the Higgsfield connector tools (generate_image_batch / generate_audio_batch, then
jobs_wait; record result files in `images/<slug>/jobs.json` and download with `python images/lib/fetch.py`). The
`higgsfield` command-line tool is not installed on this PC. Shared helpers in `dot-studio/images/lib/`: `words.py`
(word times), `captions.py` (burned-in captions + .srt), `sfx.py` (trim and normalise sounds), `tighten.py`,
`cutout.py`, `stills.mjs` (contact-sheet stills), `render.mjs` (final render).

Rendering on this PC: use `node images/lib/render.mjs <CompId> out/<slug>-4K.mp4` (from `dot-studio/`; about 20 min
for a 28 s Short). It renders the picture muted, then the soundtrack on its own (input prop `audioOnly`, which skips
the font load) and muxes them: every frame Remotion retries after a delayRender timeout adds its audio a second
time, so renders with retries came out with the voice progressively late (3 s by the end of a 7-min long-form; up to
1 s on a Short). `--remux-only` redoes just the soundtrack of an existing render. Check sync on long renders by
transcribing a few 20 s windows of the final MP4 and comparing word times with the captions. Not the `npx remotion render` CLI: when slow frames are retried, its progress bar crashes
("Invalid count value") right before stitching and the whole render is lost. The script also picks up the
short-path headless browser (`%LOCALAPPDATA%\dot-studio-chs`) that Windows needs. The caption font is embedded as data (`src/kit/fontData.ts`): when it was fetched from the render server,
frames regularly timed out ("Loading Lilita One") and were retried, slowing renders down. Never put a live CSS
`blur` on a big layer; at 4K it made a render estimate jump from ~20 min to ~5 hours (pre-blur the picture instead,
`cutout.blur_copy`). Remotion Studio: `npm --prefix dot-studio run studio` (port 3000,
also in `.claude/launch.json`). Python 3.13 with pillow, numpy, opencv and faster-whisper is installed.

## What the analytics say (keep in mind for every script)

- Hook: put the stakes in the first ~5 words and have something moving in frame 0. "If the US bombs Iran's Pickaxe
  Mountain..." opened on a still scene: 43 % stayed to watch, against 48-69 % for the stronger Shorts (Nov 2026,
  only ~100 views, so a small sample).
- Payoff: open one question early and answer it in the last 5-8 s. The same Short answered its title question at
  9 s of 32, and the average view was 54 %. Both rules are now in the dot-script and cutout skills.

## Long-forms that cut into Shorts

Build long-forms as chapters that each work alone (own hook, nothing that depends on earlier chapters), and draw
every shot on the kit Stage (`src/kit/Stage.tsx`: a 1080x1080 safe square that fits 16:9 centred and 9:16 near the
top; backgrounds bleed far past it). Then one chapter = one vertical Short from the same code: a composition that
renders a time window of the long-form (see `src/longform/falling/Falling.tsx`, `FallingChapter`, with the kit
`Mixer` `offset`/`end` props for its audio and the chapter's own captions). Keep focal action above stage y ~860 so
the 16:9 captions don't cover it. Paint backgrounds over `useBleedBox()` (the part of stage space the frame really
shows), never a fixed huge bleed: a 1,500 px bleed made each layer rasterise at ~8,000 px square in 4K vertical
renders, which starved the renderer (fonts timing out, renders crawling). Render a chapter Short with
`node images/lib/render.mjs FallingShort1 out/falling-short1-4K.mp4 2` (FallingShort1-4).

## Episodes

Keep this table in step with `catalog.json` (add a row when an episode is finished).

| Date | Slug | Title | Type | Bundle | Length |
|------|------|-------|------|--------|--------|
| 2026-10-28 | spider-sleep | Do spiders sleep in stages? | current affairs | animals-nature | 29.2 s |
| 2026-10-29 | onion-tears | Why do onions make you cry? | fun fact | food-kitchen | 30.9 s |
| 2026-10-30 | dwarf-planet-ed138 | Is there a new dwarf planet past Pluto? | current affairs | space-earth | 28.8 s |
| 2026-10-30 | terracotta-fingerprints | Who built the Terracotta Army? | current affairs | history | 26.5 s |
| 2026-10-30 | airplane-window-hole | Why is there a tiny hole in airplane windows? | fun fact | science-tech | 30.8 s |
| 2026-10-30 | orcas-longform | Why don't wild orcas kill people? (long-form, 16:9) | fun fact | animals-nature | 5 min 49 s |
| 2026-11-02 | raising-chicago | Why did Chicago lift its buildings? | niche | history | 27.6 s |
| 2026-11-02 | doomsday-november-13 | Is the world ending on November 13th? | trending | history | 30.2 s |
| 2026-11-03 | crocodiles-survived | Why did crocodiles survive the asteroid? | current affairs | animals-nature | 30.9 s |
| 2026-11-03 | falling-longform | What actually happens when you fall (long-form, 16:9; 4 chapter Shorts FallingShort1-4) | fun fact | science-tech | 6 min 59 s |
| 2026-11-03 | pickaxe-mountain-fallout | Would bombing Pickaxe Mountain cause nuclear fallout? | trending | science-tech | 32.1 s |

Content types so far: current affairs 4, fun fact 3 (one long-form), trending 2, niche 1. Coverage gaps to fill
next: no human-body or everyday-mysteries episode yet (wrinkly-fingers and recorded-voice are ready to go);
niche is the thinnest type.

## Scripts not produced yet

| Slug | Status |
|------|--------|
| perseverance-driving-record | Pitched 2026-11-02, not chosen (current affairs, space; dates quickly) |
| brain-chip-longform | Long-form draft (~6-7 min), not produced |
| wrinkly-fingers | Pitched 2026-11-03, not chosen yet (fun fact, human body; evergreen) |
| recorded-voice | Pitched 2026-11-03, not chosen yet (everyday mystery, human body; evergreen) |

When an idea is produced, move it to the episode table. When an idea goes stale, mark it here rather than deleting
the script.
