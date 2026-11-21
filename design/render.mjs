// Renders design/front.html to entry.png (1024x1024) with a local Chromium-based browser in headless mode.
// This runs only on the author's machine; the entry's main.ts just copies the committed entry.png,
// so every run of the entry writes the same bytes and needs no network.
//
//   node design/render.mjs            (set BROWSER to override the browser path)

import { execFileSync } from 'node:child_process';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const html = join(here, 'front.html');
const out = join(root, 'entry.png');

const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error('No Chromium-based browser found; set BROWSER');

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1024,1024',
  '--default-background-color=00000000',
  `--screenshot=${out}`,
  pathToFileURL(html).href,
], { stdio: 'inherit' });

const buf = readFileSync(out);
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
const size = statSync(out).size;
console.log(`wrote ${out}: ${w}x${h}, ${size} bytes`);
if (w > 1024 || h > 1024) throw new Error('image larger than 1024x1024');
if (size > 1048576) throw new Error('image larger than 1 MiB');
