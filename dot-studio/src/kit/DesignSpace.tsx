import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

// A screen-space canvas in fixed design units (default 1080x1920) scaled to cover the composition, centred
// ("slice"), for inserts drawn in screen coordinates (diagrams, close-up cards). Children use design px.
export const DesignSpace: React.FC<{w?: number; h?: number; background?: string; children: React.ReactNode}> = ({
  w = 1080, h = 1920, background, children,
}) => {
  const {width, height} = useVideoConfig();
  const s = Math.max(width / w, height / h);
  return (
    <AbsoluteFill style={{background, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: (width - w * s) / 2,
          top: (height - h * s) / 2,
          width: w,
          height: h,
          transformOrigin: '0 0',
          transform: `scale(${s})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
