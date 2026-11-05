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
import {RaisingChicago} from './shorts/raising-chicago/RaisingChicago';
import {FPS as CHICAGO_FPS, T as CHICAGO_T} from './shorts/raising-chicago/beats';
import {Doomsday} from './shorts/doomsday-november-13/Doomsday';
import {FPS as DOOM_FPS, T as DOOM_T} from './shorts/doomsday-november-13/beats';
import {Crocodiles} from './shorts/crocodiles-survived/Crocodiles';
import {FPS as CROC_FPS, T as CROC_T} from './shorts/crocodiles-survived/beats';
import {Pickaxe} from './shorts/pickaxe-mountain-fallout/Pickaxe';
import {FPS as PICK_FPS, T as PICK_T} from './shorts/pickaxe-mountain-fallout/beats';
import {FPS as FALL_FPS, FallingChapter, FallingLongform, LONGFORM_END as FALL_END, chapterWindow} from './longform/falling/Falling';
import {FPS as ORCA_FPS, OrcaLongform} from './longform/orcas/OrcaLongform';
import {END as ORCA_END} from './longform/orcas/timeline';
import {OrcaThumbnail} from './longform/orcas/Thumbnail';
import {FallingThumbnail} from './longform/falling/Thumbnail';
import {ComputerChapter, ComputerLongform, FPS as COMP_FPS, LONGFORM_END as COMP_END, chapterWindow as compWindow} from './longform/computer/Computer';

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
    <Composition
      id="RaisingChicago"
      component={RaisingChicago as React.FC<Size>}
      durationInFrames={Math.round(CHICAGO_T.end * CHICAGO_FPS)}
      fps={CHICAGO_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="Doomsday"
      component={Doomsday as React.FC<Size>}
      durationInFrames={Math.round(DOOM_T.end * DOOM_FPS)}
      fps={DOOM_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="Crocodiles"
      component={Crocodiles as React.FC<Size>}
      durationInFrames={Math.round(CROC_T.end * CROC_FPS)}
      fps={CROC_FPS}
      width={1080}
      height={1920}
      defaultProps={{width: 1080, height: 1920}}
      calculateMetadata={sized}
    />
    <Composition
      id="Pickaxe"
      component={Pickaxe as React.FC<Size>}
      durationInFrames={Math.round(PICK_T.end * PICK_FPS)}
      fps={PICK_FPS}
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
    <Composition id="OrcaThumbnail" component={OrcaThumbnail} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="FallingThumbnail" component={FallingThumbnail} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition
      id="FallingLongform"
      component={FallingLongform as React.FC<Size>}
      durationInFrames={Math.round(FALL_END * FALL_FPS)}
      fps={FALL_FPS}
      width={1920}
      height={1080}
      defaultProps={{width: 1920, height: 1080}}
      calculateMetadata={sized}
    />
    {/* the four chapters of the falling long-form as vertical Shorts (chapter n = voice section n + 1) */}
    {[1, 2, 3, 4].map((n) => {
      const w = chapterWindow(n + 1);
      return (
        <Composition
          key={n}
          id={`FallingShort${n}`}
          component={FallingChapter as unknown as React.FC<Size & {chapter: number}>}
          durationInFrames={Math.round((w.to - w.from) * FALL_FPS)}
          fps={FALL_FPS}
          width={1080}
          height={1920}
          defaultProps={{width: 1080, height: 1920, chapter: n + 1}}
          calculateMetadata={({props}: {props: Size & {chapter: number}}) => ({width: props.width, height: props.height})}
        />
      );
    })}
    <Composition
      id="ComputerLongform"
      component={ComputerLongform as React.FC<Size>}
      durationInFrames={Math.round(COMP_END * COMP_FPS)}
      fps={COMP_FPS}
      width={1920}
      height={1080}
      defaultProps={{width: 1920, height: 1080}}
      calculateMetadata={sized}
    />
    {/* each of its six chapters as a vertical Short (ComputerShort n = chapter n) */}
    {[1, 2, 3, 4, 5, 6].map((n) => {
      const w = compWindow(n);
      return (
        <Composition
          key={`c${n}`}
          id={`ComputerShort${n}`}
          component={ComputerChapter as unknown as React.FC<Size & {chapter: number}>}
          durationInFrames={Math.round((w.to - w.from) * COMP_FPS)}
          fps={COMP_FPS}
          width={1080}
          height={1920}
          defaultProps={{width: 1080, height: 1920, chapter: n}}
          calculateMetadata={({props}: {props: Size & {chapter: number}}) => ({width: props.width, height: props.height})}
        />
      );
    })}
  </>
);
