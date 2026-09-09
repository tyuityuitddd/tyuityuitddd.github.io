import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
sharp.cache(false);

const pipeline=path.resolve('scripts/optimize-images.mjs');
const tempRoot=await fs.realpath(os.tmpdir());
const fixture=await fs.mkdtemp(path.join(tempRoot,'tddd-image-test-'));
try {
  await fs.mkdir(path.join(fixture,'public/media'),{recursive:true});
  await fs.mkdir(path.join(fixture,'content/works'),{recursive:true});
  const transparent=await sharp({create:{width:700,height:350,channels:4,background:{r:70,g:90,b:110,alpha:0.4}}}).png().toBuffer();
  const rotated=await sharp({create:{width:3000,height:1500,channels:3,background:'#507040'}}).jpeg().withMetadata({orientation:6}).toBuffer();
  await fs.writeFile(path.join(fixture,'public/media/透明角色.png'),transparent);
  await fs.writeFile(path.join(fixture,'public/media/photo.jpg'),rotated);
  await fs.writeFile(path.join(fixture,'content/settings.json'),JSON.stringify({avatar:'media/透明角色.png'}));
  await fs.writeFile(path.join(fixture,'content/works/test.json'),JSON.stringify({images:[{src:'media/photo.jpg'}]}));
  const run=()=>{const result=spawnSync(process.execPath,[pipeline],{cwd:fixture,encoding:'utf8'});assert.equal(result.status,0,result.stderr);};
  run();
  const manifest=JSON.parse(await fs.readFile(path.join(fixture,'generated/images.json'),'utf8'));
  const png=manifest['media/透明角色.png'];
  const jpg=manifest['media/photo.jpg'];
  assert(png.src.endsWith('.webp'));
  assert(jpg.src.endsWith('.webp'));
  assert(jpg.width<jpg.height,'JPEG EXIF rotation must be applied');
  assert(jpg.height<=2200,'Full-size image must fit the output limit');
  for(const value of Object.values(manifest)){
    assert(value.variants.length>=2);
    for(const variant of value.variants){
      const actual=await sharp(path.join(fixture,'public',variant.src)).metadata();
      assert.equal(actual.format,'webp');
      assert.equal(actual.width,variant.width,'srcset width must match real image width');
    }
  }
  assert((await sharp(path.join(fixture,'public',png.src)).metadata()).hasAlpha,'Transparent PNG must retain transparency');
  assert.deepEqual(await fs.readFile(path.join(fixture,'public/media/photo.jpg')),rotated,'Original JPEG must remain unchanged');
  assert.deepEqual(await fs.readFile(path.join(fixture,'public/media/透明角色.png')),transparent,'Original PNG must remain unchanged');
  const cached=path.join(fixture,'public',png.variants[0].src);
  const modified=(await fs.stat(cached)).mtimeMs;
  run();
  assert.equal((await fs.stat(cached)).mtimeMs,modified,'Unchanged images should reuse cached output');
  console.log('Image pipeline passed: new PNG/JPEG uploads, transparency, EXIF orientation, responsive widths, originals and cache.');
} finally {
  const resolved=await fs.realpath(fixture);
  if(path.dirname(resolved)!==tempRoot||!path.basename(resolved).startsWith('tddd-image-test-'))throw new Error('Unexpected fixture directory');
  await fs.rm(resolved,{recursive:true,force:true,maxRetries:5,retryDelay:200});
}
