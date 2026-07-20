#!/usr/bin/env node
/**
 * Downloads every image referenced by the migrated content from the old
 * WordPress site into public/, so the new site is fully self-contained.
 *
 * - Runs automatically before `next build` (see "prebuild" in package.json).
 * - Skips files that already exist, so once public/uploads is committed to
 *   git this script becomes a no-op and the old host can be shut down.
 *
 * Run manually with:  npm run download-images
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifestPath = path.join(root, 'data', 'image-manifest.json');
const publicDir = path.join(root, 'public');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entries = Object.entries(manifest);

const CONCURRENCY = 10;
let done = 0, skipped = 0, failed = [];

async function download([url, localPath]) {
  const dest = path.join(publicDir, localPath.replace(/^\//, ''));
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { skipped++; return; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    done++;
  } catch (err) {
    failed.push({ url, error: String(err.message || err) });
  }
}

const queue = [...entries];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    if (item) await download(item);
  }
}

console.log(`Image sync: ${entries.length} files in manifest...`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Downloaded ${done}, already present ${skipped}, failed ${failed.length}`);
if (failed.length) {
  fs.writeFileSync(path.join(root, 'data', 'image-download-failures.json'), JSON.stringify(failed, null, 1));
  console.log('Failures written to data/image-download-failures.json (build continues).');
}
