import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

// A square 1080x1080 safe stage that fits any composition: in 16:9 it fills the height, centred (the side margins
// show whatever the scene bleeds past its edges); in 9:16 it fills the width near the top, leaving room for captions
// below. Scenes draw in stage px and paint their backgrounds well past 0..1080 so both framings are filled. This is
// what lets one scene render as a long-form shot and as a vertical Short without redrawing anything.
export const STAGE = 1080;

export type StageMode = 'landscape' | 'portrait';

/** Frame-px placement of the stage: scale and top-left offset. */
export const stageBox = (width: number, height: number) => {
  const portrait = height > width;
  const s = portrait ? width / STAGE : height / STAGE;
  const left = (width - STAGE * s) / 2;
  const top = portrait ? height * 0.1 : (height - STAGE * s) / 2;
  return {s, left, top, mode: (portrait ? 'portrait' : 'landscape') as StageMode};
};

export const useStageMode = (): StageMode => {
  const {width, height} = useVideoConfig();
  return height > width ? 'portrait' : 'landscape';
};

/**
 * The part of stage space the frame actually shows (x0, y0, x1, y1 in stage px, plus a small margin). Draw
 * backgrounds over exactly this box: a fixed huge bleed made every background layer rasterise at ~8,000 px square
 * in 4K vertical renders and starved the renderer.
 */
export const useBleedBox = (): [number, number, number, number] => {
  const {width, height} = useVideoConfig();
  const {s, left, top} = stageBox(width, height);
  const m = 24;
  return [Math.floor(-left / s) - m, Math.floor(-top / s) - m, Math.ceil((width - left) / s) + m, Math.ceil((height - top) / s) + m];
};

export const Stage: React.FC<{background?: string; children: React.ReactNode}> = ({background, children}) => {
  const {width, height} = useVideoConfig();
  const {s, left, top} = stageBox(width, height);
  return (
    <AbsoluteFill style={{background, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left, top, width: STAGE, height: STAGE, transformOrigin: '0 0', transform: `scale(${s})`}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
