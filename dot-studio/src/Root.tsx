import React from 'react';
import {Composition} from 'remotion';
import {SpiderSleep} from './shorts/spider-sleep/SpiderSleep';
import {FPS as SPIDER_FPS, T as SPIDER_T} from './shorts/spider-sleep/beats';
import {OnionTears} from './shorts/onion-tears/OnionTears';
import {FPS as ONION_FPS, T as ONION_T} from './shorts/onion-tears/beats';
import {DwarfPlanet} from './shorts/dwarf-planet-ed138/DwarfPlanet';
import {FPS as DWARF_FPS, T as DWARF_T} from './shorts/dwarf-planet-ed138/beats';
import {TerracottaArmy} from './shorts/terracotta-fingerprints/TerracottaArmy';
import {FPS as TERRA_FPS, T as TERRA_T} from './shorts/terracotta-fingerprints/beats';
import {AirplaneWindow} from './shorts/airplane-window-hole/AirplaneWindow';
import {FPS as PLANE_FPS, T as PLANE_T} from './shorts/airplane-window-hole/beats';
import {FPS as ORCA_FPS, OrcaLongform} from './longform/orcas/OrcaLongform';
import {END as ORCA_END} from './longform/orcas/timeline';

// Every Short takes its size as props (default vertical 1080x1920) so it can be re-framed for 16:9 later.
type Size = {width: number; height: number};
const sized = ({props}: {props: Size}) => ({width: props.width, height: props.height});

export const Root: React.FC = () => (
  <>
    <Composition
      id="SpiderSleep"
      component={SpiderSleep as React.FC<Size>}
      durationInFrames={Math.round(SPIDER_T.end * SPIDER_FPS)}
      fps={SPIDER_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="OnionTears"
      component={OnionTears as React.FC<Size>}
      durationInFrames={Math.round(ONION_T.end * ONION_FPS)}
      fps={ONION_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="DwarfPlanet"
      component={DwarfPlanet as React.FC<Size>}
      durationInFrames={Math.round(DWARF_T.end * DWARF_FPS)}
      fps={DWARF_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="TerracottaArmy"
      component={TerracottaArmy as React.FC<Size>}
      durationInFrames={Math.round(TERRA_T.end * TERRA_FPS)}
      fps={TERRA_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="AirplaneWindow"
      component={AirplaneWindow as React.FC<Size>}
      durationInFrames={Math.round(PLANE_T.end * PLANE_FPS)}
      fps={PLANE_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    {/* long-form: 16:9 */}
    <Composition
      id="OrcaLongform"
      component={OrcaLongform as React.FC<Size>}
      durationInFrames={Math.round(ORCA_END * ORCA_FPS)}
      fps={ORCA_FPS}
      width={1920}
      height={1080}
      defaultProps={{width: 1920, height: 1080}}
      calculateMetadata={sized}
    />
  </>
);
