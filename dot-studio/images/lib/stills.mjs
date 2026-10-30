// stills.mjs COMP_ID OUT_DIR [times...] - bundle once to build/bundle, render 0.5x stills at the given seconds.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', '..');
const [id, outRel, ...secs] = process.argv.slice(2);
const outDir = path.resolve(root, outRel);
fs.mkdirSync(outDir, {recursive: true});
// the bundled headless shell can sit past Windows' 260-char path limit; use a copy on a short path if present
const shortBrowser = path.join(process.env.LOCALAPPDATA ?? '', 'dot-studio-chs', 'chrome-headless-shell.exe');
const browserExecutable = fs.existsSync(shortBrowser) ? shortBrowser : null;
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), outDir: path.join(root, 'build', 'bundle')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const s of secs.map(Number)) {
  const frame = Math.min(Math.round(s * composition.fps), composition.durationInFrames - 1);
  await renderStill({composition, serveUrl, frame, scale: 0.5, browserExecutable, output: path.join(outDir, `t${s.toFixed(2).padStart(5, '0')}.png`)});
  process.stdout.write(`${s} `);
}
console.log('done');
