// Dot's signature moves as reusable timing curves (pose swaps carry the drawing; these add the motion).

/** Fast side-to-side rock while ringing / shaking something, eased in and out of the window. Degrees. */
export const ringRock = (t: number, t0: number, t1: number, amp = 2.5, hz = 8) => {
  if (t < t0 || t > t1) return 0;
  const env = Math.min(1, (t - t0) / 0.08, (t1 - t) / 0.15);
  return amp * env * Math.sin(2 * Math.PI * hz * (t - t0));
};

/** Watch-tap bounce times: one small dip per tap (feed into Dot `bounces`). */
export const watchTaps = (t0: number, n = 2, gap = 0.32) => Array.from({length: n}, (_, i) => t0 + i * gap);
