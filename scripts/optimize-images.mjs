import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const publicRoot = path.resolve('public');
const output = path.join(publicRoot, 'optimized');
const manifestPath = 'generated/images.json';
const widths = [400, 800, 1400];
const recipe = 'responsive-v1-quality78-full86-max2200';
const settings = JSON.parse(await fs.readFile('content/settings.json', 'utf8'));
const sources = new Set([settings.avatar]);
for (const file of await fs.readdir('content/works')) {
  if (!file.endsWith('.json')) continue;
  const work = JSON.parse(await fs.readFile(path.join('content/works', file), 'utf8'));
  for (const image of work.images || []) sources.add(image.src);
}
await fs.mkdir(output, { recursive: true });
await fs.mkdir('generated', { recursive: true });
const manifest = {};
const retained = new Set();
let originalBytes = 0;
let smallBytes = 0;
for (const source of sources) {
  if (/^https:\/\//.test(source)) continue;
  const key = source.replace(/^\/+/, '');
  const file = path.resolve(publicRoot, key);
  if (!file.startsWith(publicRoot + path.sep)) throw new Error(`Image outside public directory: ${source}`);
  const input = await fs.readFile(file);
  const metadata = await sharp(input).metadata();
  const swapped = metadata.orientation >= 5 && metadata.orientation <= 8;
  const width = swapped ? metadata.height : metadata.width;
  const height = swapped ? metadata.width : metadata.height;
  if (!width || !height) throw new Error(`Cannot read image dimensions: ${source}`);
  // Preserve animation rather than silently replacing a GIF/WebP with a still.
  if ((metadata.pages || 1) > 1) {
    manifest[key] = { src: key, width, height: metadata.pageHeight || height, variants: [] };
    continue;
  }
  const hash = crypto.createHash('sha256').update(input).update(recipe).update(sharp.versions.sharp).digest('hex').slice(0,16);
  const variants = [];
  for (const requested of widths) {
    if (variants.some(item => item.width === Math.min(requested,width))) continue;
    const name = `img-${hash}-${requested}.webp`;
    retained.add(name);
    const destination = path.join(output,name);
    let info;
    try { info = await sharp(destination).metadata(); }
    catch {
      await sharp(input).rotate().resize({ width: requested, withoutEnlargement: true }).webp({ quality:78, effort:4 }).toFile(destination);
      info = await sharp(destination).metadata();
    }
    variants.push({ src: `optimized/${name}`, width: info.width, height: info.height, bytes: (await fs.stat(destination)).size });
  }
  let full = key;
  let fullWidth = width;
  let fullHeight = height;
  if (metadata.format !== 'webp' || Math.max(width,height)>2200 || metadata.orientation>1) {
    const name=`img-${hash}-full.webp`;
    retained.add(name);
    const destination=path.join(output,name);
    try { await fs.access(destination); }
    catch { await sharp(input).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:86,effort:4}).toFile(destination); }
    const info=await sharp(destination).metadata();
    full=`optimized/${name}`;fullWidth=info.width;fullHeight=info.height;
  }
  manifest[key] = { src:full, width:fullWidth, height:fullHeight, variants };
  originalBytes += input.length;
  smallBytes += variants[0].bytes;
}
// Only prune files owned by this generator; never remove uploaded media.
for (const file of await fs.readdir(output)) {
  if (/^img-[a-f0-9]{16}-(400|800|1400|full)\.webp$/.test(file) && !retained.has(file)) await fs.unlink(path.join(output,file));
}
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${Object.keys(manifest).length} images: smallest variants ${(smallBytes/1024/1024).toFixed(2)} MB vs source ${(originalBytes/1024/1024).toFixed(2)} MB. Originals preserved.`);
