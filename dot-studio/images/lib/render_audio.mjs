// render_audio.mjs COMP_ID OUT.wav - render only a composition's soundtrack (no frames) through the Node API.
// Used to check / repair audio sync: a long-form MP4 came out with its audio stretched ~0.7 % (3 s over 7 min), so
// the soundtrack is rendered on its own and muxed back onto the picture (see remux in CLAUDE.md).
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', '..');
const [id, outRel] = process.argv.slice(2);
const shortBrowser = path.join(process.env.LOCALAPPDATA ?? '', 'dot-studio-chs', 'chrome-headless-shell.exe');
const browserExecutable = process.env.REMOTION_BROWSER ?? (fs.existsSync(shortBrowser) ? shortBrowser : null);
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), outDir: path.join(root, 'build', 'bundle')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
await renderMedia({composition, serveUrl, codec: 'wav', outputLocation: path.resolve(root, outRel), browserExecutable, timeoutInMilliseconds: 120000});
console.log('done', outRel);
