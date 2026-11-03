// still.mjs COMP_ID OUT.png [FRAME=0] - render one frame of a composition (thumbnails, QA stills) through the Node
// API, with the short-path headless browser Windows needs (see render.mjs).
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', '..');
const [id, outRel, frameArg] = process.argv.slice(2);
const shortBrowser = path.join(process.env.LOCALAPPDATA ?? '', 'dot-studio-chs', 'chrome-headless-shell.exe');
const browserExecutable = process.env.REMOTION_BROWSER ?? (fs.existsSync(shortBrowser) ? shortBrowser : null);
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), outDir: path.join(root, 'build', 'bundle')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
await renderStill({composition, serveUrl, frame: Number(frameArg ?? 0), browserExecutable, chromiumOptions: {gl: 'angle'},
  timeoutInMilliseconds: 120000, output: path.resolve(root, outRel)});
console.log('done', outRel);
