import {continueRender, delayRender, staticFile} from 'remotion';

// The caption / label font (Lilita One, SIL Open Font License), bundled in public/fonts so renders need no
// network. Loaded once; rendering waits until it is ready.
export const fontFamily = 'Lilita One';

if (typeof window !== 'undefined' && typeof FontFace !== 'undefined') {
  const handle = delayRender('Loading Lilita One', {timeoutInMilliseconds: 60000, retries: 2});
  const face = new FontFace(fontFamily, `url(${staticFile('fonts/LilitaOne-Regular.woff2')}) format('woff2')`);
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
