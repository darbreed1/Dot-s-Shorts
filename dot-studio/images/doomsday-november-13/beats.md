# doomsday-november-13 — beat sheet

Script: scripts/doomsday-november-13.md (approved 2026-11-02). Spoken with years as words ("twenty twenty-six",
"nineteen sixty", "two thousand"); captions show numerals. Voice 29.4 s after cutting a 5 s silent gap after
"2026" (images/lib/tighten.py; original in vo_raw.wav). One false loudness pause (inside "Science") was removed
from words.json so "Three" is timed right.

All scenes are screen-space (1080x1920 design space), floor line at y 1250, captions at 0.72 below it.

| # | words (t) | on screen | pictures | sound |
|---|-----------|-----------|----------|-------|
| 1 | Is the world ending on Friday, November 13th, 2026? (0.3) | FRAME 0: Dot trembling beside a wall calendar "NOVEMBER 2026 / 13 / FRIDAY"; a black cat strolls past on "Friday"; red circle drawn round 13; on "2026" the window turns stormy, lightning, the room dims | dot_scared, black_cat | ticking, meow, zing, doom sting |
| 2 | That date comes from a real 1960 paper (5.3) | Dot taps his watch, "1960" pops up | dot_watch | watch taps, time warp |
|   | in the journal Science. (6.7) | the old paper on a desk: "1960 / DOOMSDAY: Friday, 13 November, A.D. 2026", a tiny curve in the corner; "the journal Science" | code | paper rustle, ting, pop |
| 3 | Three researchers fitted 2,000 years of population estimates to one curve. (9.4) | the chart: three faceless pictogram researchers (real people, so no characters); 24 estimate dots pop along the axis; "2,000 years" bracket; the red curve draws through them | Pictogram (kit), dot_lookup | pops, pencil scribble |
| 4 | Growth kept speeding up, so their curve hit infinite people on that exact Friday. (14.7) | the curve bends up and shoots off the top; shake; "∞"; Dot surprised; dashed wall at 2026 + "Fri 13 Nov" | dot_surprised | scribble, slide whistle, boing, ting |
| 5 | It was a warning, not a prophecy. (20.9) | Dot raises a finger between a yellow warning sign and a crystal ball; a red X slams onto the ball | dot_aha | pop, chime, thud |
| 6 | And it didn't hold. (24.3) | back on the chart, zooming into 1880-2030: the curve turns dashed; the gold real-numbers line rides it from 1900 to about 1990, then starts to fall behind | dot_lookup | whoosh, slide |
| 7 | Families got smaller, and real numbers fell behind the curve. (25.8) | a family of 6 pictograms; two kids pop away on "smaller"; Dot shrugs; the real line reaches 2026 far below the curve ("real", "1960 curve"); the cat strolls back past | dot_shrug, black_cat | pops, chime, meow |

Chart: the curve is K / (2026.87 - year) with K set so it passes about 3 billion in 1960 (the shape of the 1960
fit, not its exact constants); the real line is UN world-population estimates (1900 1.6 bn ... 2026 8.2 bn). The 24
estimate dots are illustrative positions along the curve, not the paper's data points.
