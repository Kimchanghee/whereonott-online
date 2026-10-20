// Convert QA-passed generated PNGs into the queued post's WebP files and sync <img> width/height in the manuscript.
//   node scripts/build-queue-images.mjs ops/queue/image-specs/<slug>.json
// Spec: { slug, manuscript, jobs: [{ name: "<basename>.webp", src: "<abs png>", crop?: {left,top,width,height}, width, square? }] }
// Output: ops/queue/images/<slug>/<name>. Existing outputs are replaced only when the spec is re-run on purpose.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specFile = path.resolve(process.argv[2] ?? '');
if (!fs.existsSync(specFile)) { console.error('usage: node scripts/build-queue-images.mjs <spec.json>'); process.exit(2); }
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
if (!/^[a-z0-9-]+$/.test(spec.slug)) throw Error('bad slug');
// Published posts set spec.outDir to public/images/picks/<slug>; queued posts default to ops/queue/images/<slug>.
const outDir = path.join(root, spec.outDir ?? path.join('ops/queue/images', spec.slug));
if (!path.resolve(outDir).startsWith(path.join(root, 'ops', 'queue', 'images')) && !path.resolve(outDir).startsWith(path.join(root, 'public', 'images', 'picks'))) throw Error('outDir must be under ops/queue/images or public/images/picks');
fs.mkdirSync(outDir, { recursive: true });
const dims = {};
for (const j of spec.jobs) {
  if (!/^[a-z0-9-]+\.webp$/.test(j.name)) throw Error('bad output name ' + j.name);
  if (!fs.existsSync(j.src)) throw Error('missing source ' + j.src);
  let img = sharp(j.src);
  if (j.crop) img = img.extract(j.crop);
  img = j.square ? img.resize(j.width, j.width, { fit: 'cover' }) : img.resize({ width: j.width, withoutEnlargement: true });
  const info = await img.webp({ quality: 80 }).toFile(path.join(outDir, j.name));
  dims[j.name] = { width: info.width, height: info.height, bytes: info.size };
  console.log(j.name, `${info.width}x${info.height}`, info.size);
}
// Sync intrinsic sizes into inline <img> tags of the manuscript.
const md = path.join(root, spec.manuscript);
let text = fs.readFileSync(md, 'utf8');
text = text.replace(/<img src="(\/images\/picks\/[^"]+)"([^>]*?)width="\d+" height="\d+"/g, (m, src, mid) => {
  const d = dims[path.posix.basename(src)];
  return d ? `<img src="${src}"${mid}width="${d.width}" height="${d.height}"` : m;
});
fs.writeFileSync(md, text);
fs.writeFileSync(path.join(path.dirname(specFile), `${spec.slug}.built.json`), JSON.stringify({ builtAt: new Date().toISOString(), dims }, null, 2));
