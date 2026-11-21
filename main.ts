// THE WORLD TODAY — a one-image front page of Saturday, November 21, 2026.
// Node 22, standard library only, no network. The page is drawn ahead of time from design/front.html
// (design/render.mjs) and committed as entry.png; this program copies those exact bytes to /output/entry.png,
// so every run writes the same file.
//
// Locally, MAKEFUN_OUTPUT_DIR stands in for /output:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, chmodSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
copyFileSync(new URL('./entry.png', import.meta.url), target);
chmodSync(target, 0o644);
