import React from 'react';
import {Composition} from 'remotion';
import {SpiderSleep} from './shorts/spider-sleep/SpiderSleep';
import {FPS as SPIDER_FPS, T as SPIDER_T} from './shorts/spider-sleep/beats';
import {OnionTears} from './shorts/onion-tears/OnionTears';
import {FPS as ONION_FPS, T as ONION_T} from './shorts/onion-tears/beats';

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
  </>
);
