import {continueRender, delayRender, getInputProps} from 'remotion';
import {LILITA_WOFF2} from './fontData';

// The caption / label font (Lilita One, SIL Open Font License), embedded as data (fontData.ts, generated from
// public/fonts/LilitaOne-Regular.woff2) so nothing is fetched. A render tab still occasionally hangs on the load
// (Remotion then retries that frame after ~58 s; 192 retries over a 25,000-frame long-form) - slow but correct.
// Do NOT switch to a CSS @font-face + document.fonts / setTimeout variant: it works for stills but every
// renderMedia run failed with "Loading Lilita One was not cleared" (tried 2026-11-03).
export const fontFamily = 'Lilita One';

// Audio-only renders (images/lib/render.mjs passes {audioOnly: true}) skip the font: every frame Remotion retries
// after a delayRender timeout adds that frame's audio a second time, which pushed a long-form's voice 3 s late by the
// end. With no delayRender there are no retries, so the separately rendered soundtrack is exact.
const audioOnly = typeof window !== 'undefined' && Boolean((getInputProps() as {audioOnly?: boolean}).audioOnly);

if (typeof window !== 'undefined' && typeof FontFace !== 'undefined' && !audioOnly) {
  // a shorter timeout made things worse (starved tabs just retried more): the real fix for slow loads was drawing
  // less (see Stage bleed boxes), so keep a generous timeout
  const handle = delayRender('Loading Lilita One', {timeoutInMilliseconds: 60000, retries: 3});
  const face = new FontFace(fontFamily, `url(data:font/woff2;base64,${LILITA_WOFF2}) format('woff2')`);
  face
    .load()
    .then(() => {
      (document.fonts as unknown as Set<FontFace>).add(face);
      continueRender(handle);
    })
    .catch((err) => {
      console.error('Lilita One failed to load', err);
      continueRender(handle);
    });
}
