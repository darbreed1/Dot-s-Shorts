// render.mjs COMP_ID OUT.mp4 [SCALE=2] - final render through the Node API (bundled once to build/bundle).
// The CLI's progress bar crashes when retried frames push "rendered" past the total (RangeError: Invalid count
// value) and kills the job before stitching; this prints plain progress lines instead.
//
// Audio: every frame Remotion retries (after a delayRender timeout) adds that frame's audio again, so a render with
// retries comes out with its soundtrack progressively late (a 7-min long-form ended 3 s out of sync). So the picture
// is rendered first, then the soundtrack is rendered on its own with {audioOnly: true} (no font load, so no
// delayRender and no retries) and muxed onto the picture. `node render.mjs COMP OUT.mp4 --remux-only` redoes just
// the soundtrack of an existing render.
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', '..');
const args = process.argv.slice(2);
const remuxOnly = args.includes('--remux-only');
const [id, outRel, scaleArg] = args.filter((a) => !a.startsWith('--'));
const scale = Number(scaleArg ?? 2);
const out = path.resolve(root, outRel);
const shortBrowser = path.join(process.env.LOCALAPPDATA ?? '', 'dot-studio-chs', 'chrome-headless-shell.exe');
const browserExecutable = process.env.REMOTION_BROWSER ?? (fs.existsSync(shortBrowser) ? shortBrowser : null);
const ffmpegLocal = path.join(root, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');
const ffmpeg = fs.existsSync(ffmpegLocal) ? ffmpegLocal : 'ffmpeg';
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), outDir: path.join(root, 'build', 'bundle')});

const t0 = Date.now();
const picture = out.replace(/\.mp4$/, '.picture.mp4');
if (!remuxOnly) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: picture,
    scale,
    imageFormat: 'png',
    crf: 16,
    pixelFormat: 'yuv420p',
    timeoutInMilliseconds: 120000,
    browserExecutable,
    chromiumOptions: {gl: 'angle'},
    muted: true,
    onProgress: ({progress, renderedFrames, encodedFrames}) => {
      const pct = Math.floor(progress * 100);
      if (pct >= last + 5) {
        last = pct;
        console.log(`${pct}%  rendered ${renderedFrames}  encoded ${encodedFrames}  ${((Date.now() - t0) / 60000).toFixed(1)} min`);
      }
    },
  });
} else {
  // reuse the existing render's picture
  fs.copyFileSync(out, picture);
}

// the soundtrack, rendered alone (no font, no retries) and muxed onto the picture
const inputProps = {audioOnly: true};
const audioComp = await selectComposition({serveUrl, id, browserExecutable, inputProps});
const wav = out.replace(/\.mp4$/, '.audio.wav');
await renderMedia({composition: audioComp, serveUrl, codec: 'wav', outputLocation: wav, browserExecutable, inputProps, timeoutInMilliseconds: 120000});
execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', picture, '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest', out]);
fs.rmSync(picture);
fs.rmSync(wav);
console.log(`done ${outRel} (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
