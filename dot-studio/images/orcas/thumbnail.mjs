// thumbnail.mjs - render the OrcaThumbnail still at 1920x1080 to images/orcas/qa/thumbnail.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), outDir: path.join(root, 'build', 'bundle')});
const composition = await selectComposition({serveUrl, id: 'OrcaThumbnail', browserExecutable});
await renderStill({composition, serveUrl, frame: 0, browserExecutable, output: path.join(root, 'images', 'orcas', 'qa', 'thumbnail.png')});
console.log('done');
