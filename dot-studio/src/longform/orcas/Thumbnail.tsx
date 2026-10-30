import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DesignSpace} from '../../kit/DesignSpace';
import {Label} from '../../kit/Label';
import {Bubbles, Critter, DotRig, GOLD, H, Underwater, W} from './parts';
import {S} from './sprites';

// YouTube thumbnail (16:9): a huge orca nose to nose with Dot, "WHY NOT US?" and a big "0 KILLS".
// Rendered as a still (images/orcas/thumbnail.mjs) and saved as out/orcas-longform-thumbnail.jpg (1280x720).
export const OrcaThumbnail: React.FC = () => {
  const t = 1.3; // a frozen moment of the bob / light-ray animation
  return (
    <AbsoluteFill style={{backgroundColor: '#10427A'}}>
      <DesignSpace w={W} h={H}>
        <Underwater t={t} seabed={false} />
        {/* soft spotlight behind the pair */}
        <div style={{position: 'absolute', left: 520, top: 180, width: 1300, height: 900, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(190, 235, 255, 0.55), rgba(190, 235, 255, 0))'}} />
        <Critter sp={S.orca} x={720} y={650} w={1450} t={t} bob={0} rot={-4} />
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={1640} y={1010} headR={128} />
        <Bubbles t={t} x={1770} y={600} n={7} />
        {/* a big bold "0 KILLS" (no badge: a ring round the zero read as a donut) */}
        <Label t={t} t0={-5} x={1290} y={215} size={360} color={GOLD}>0</Label>
        <Label t={t} t0={-5} x={1290} y={440} size={140} color="#FFFFFF">KILLS</Label>
        <Label t={t} t0={-5} x={560} y={150} size={200} color="#FFFFFF">WHY NOT</Label>
        <Label t={t} t0={-5} x={560} y={340} size={220} color={GOLD}>US?</Label>
      </DesignSpace>
    </AbsoluteFill>
  );
};
