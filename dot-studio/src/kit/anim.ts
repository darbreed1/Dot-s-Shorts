// Small timing helpers shared by every episode. All times are in seconds.

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const progress = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));

export const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOutCubic = (u: number) => 1 - Math.pow(1 - u, 3);
export const easeInCubic = (u: number) => u * u * u;
export const easeOutBack = (u: number, s = 1.70158) => 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2);

/** Damped spring kick started at t0: 0 before, amp at t0, oscillating back to 0. */
export const kick = (t: number, t0: number, amp: number, freq = 3.2, decay = 6) =>
  t < t0 ? 0 : amp * Math.exp(-decay * (t - t0)) * Math.cos(2 * Math.PI * freq * (t - t0));

/** Like kick but starts at 0 (sine): a settle wobble that must not jump on its first frame. */
export const wobble = (t: number, t0: number, amp: number, freq = 3.2, decay = 6) =>
  t < t0 ? 0 : amp * Math.exp(-decay * (t - t0)) * Math.sin(2 * Math.PI * freq * (t - t0));

/** Sum of kicks for a list of trigger times. */
export const kicks = (t: number, times: readonly number[], amp: number, freq = 3.2, decay = 6) =>
  times.reduce((s, t0) => s + kick(t, t0, amp, freq, decay), 0);

/** Pop in with overshoot over `inDur`, hold, shrink away over `outDur` ending at t1. Returns a scale 0..~1.1. */
export const popScale = (t: number, t0: number, t1: number, inDur = 0.28, outDur = 0.22) => {
  if (t < t0 || t > t1) return 0;
  const a = easeOutBack(clamp01((t - t0) / inDur), 2.2);
  const b = 1 - easeInCubic(clamp01((t - (t1 - outDur)) / outDur));
  return Math.max(0, a * b);
};

/** The last event at or before t (list sorted by `at`). */
export function lastAt<E extends {at: number}>(list: readonly E[], t: number): E {
  let cur = list[0];
  for (const e of list) if (e.at <= t) cur = e;
  return cur;
}

/** Deterministic pseudo-random in [0, 1) from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
