import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';

// Voice + sound-effect cue mixer. Each cue: file, start time (s), level in dB, optional dB keys over absolute time.

export type Cue = {
  f: string; // path under public/
  at: number;
  db: number;
  keys?: readonly (readonly [number, number])[]; // [time s, dB] envelope, absolute times; overrides db between keys
  loop?: boolean;
  until?: number; // stop at this absolute time
};

const dbAt = (c: Cue, t: number) => {
  if (!c.keys || c.keys.length === 0) return c.db;
  const k = c.keys;
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i][0]) {
      const u = (t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]);
      return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * u;
    }
  }
  return k[k.length - 1][1];
};

/**
 * `offset` (s) = the absolute time shown at frame 0, and `end` (s) = the absolute time where the window stops, so a
 * chapter of a long-form can be rendered on its own: cues outside the window are dropped, a cue already playing at
 * the window start is trimmed to begin mid-file. Without them the mixer plays the whole cue list from 0.
 */
export const Mixer: React.FC<{cues: readonly Cue[]; offset?: number; end?: number}> = ({cues, offset = 0, end = Infinity}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {cues.map((c, i) => {
        if (c.at >= end || (c.until !== undefined && c.until <= offset)) return null;
        const start = Math.max(c.at, offset);
        const from = Math.round((start - offset) * fps);
        // a looped bed that began before the window just starts afresh at the window start (trimming it by more than
        // its own length makes Remotion's <Loop> fail with a negative duration)
        const trim = c.loop ? 0 : Math.round((start - c.at) * fps);
        const stop = Math.min(c.until ?? Infinity, end);
        return (
          <Sequence key={i} from={from} durationInFrames={stop < Infinity ? Math.max(1, Math.round((stop - start) * fps)) : undefined} layout="none">
            <Audio src={staticFile(c.f)} loop={c.loop} startFrom={trim > 0 ? trim : undefined} volume={(f) => 10 ** (dbAt(c, start + f / fps) / 20)} />
          </Sequence>
        );
      })}
    </>
  );
};
