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

export const Mixer: React.FC<{cues: readonly Cue[]}> = ({cues}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {cues.map((c, i) => {
        const from = Math.round(c.at * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={c.until ? Math.round((c.until - c.at) * fps) : undefined} layout="none">
            <Audio src={staticFile(c.f)} loop={c.loop} volume={(f) => 10 ** (dbAt(c, (from + f) / fps) / 20)} />
          </Sequence>
        );
      })}
    </>
  );
};
