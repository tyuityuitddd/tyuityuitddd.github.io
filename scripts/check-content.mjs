import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { videoEmbed, safeVideoLink, translated, localUrl } from '../lib/portfolio.ts';

const files = fs.readdirSync('content/works').filter(f=>f.endsWith('.json'));
const works = files.map(file=>JSON.parse(fs.readFileSync(path.join('content/works',file),'utf8')));
const slugs = new Set();
let imageCount=0;
for (const work of works) {
  assert.match(work.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(!slugs.has(work.slug),`Duplicate slug ${work.slug}`);slugs.add(work.slug);
  assert(['illustration','game','design'].includes(work.category));
  assert(work.title.zh && typeof work.title.zh==='string',`Missing title: ${work.slug}`);
  assert(work.images.length>0,`Missing gallery: ${work.slug}`);
  for (const image of work.images) {
    assert(image.alt,`Missing image description: ${work.slug}`);
    if (!image.src.startsWith('https://')) {
      const location=path.resolve('public',image.src.replace(/^\/+/,''));
      assert(location.startsWith(path.resolve('public')+path.sep));
      assert(fs.existsSync(location),`Missing file: ${image.src}`);
    }
    imageCount++;
  }
  if (work.video) assert(safeVideoLink(work.video),`Invalid video: ${work.slug}`);
}
const settings=JSON.parse(fs.readFileSync('content/settings.json','utf8'));
assert.equal(settings.hero.length,4);
for(const slug of settings.hero)assert(works.some(w=>w.slug===slug&&w.published),`Hero references unpublished/missing work: ${slug}`);
assert(fs.existsSync(path.join('public',settings.avatar.replace(/^\//,''))));
assert.equal(videoEmbed('https://youtu.be/dQw4w9WgXcQ'),'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(videoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=4'),'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(videoEmbed('https://www.youtube.com/shorts/dQw4w9WgXcQ'),'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(videoEmbed('https://vimeo.com/123456789'),'https://player.vimeo.com/video/123456789');
assert.equal(videoEmbed('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ'),null);
assert.equal(videoEmbed('javascript:alert(1)'),null);
assert.equal(safeVideoLink('javascript:alert(1)'),null);
assert.equal(translated({zh:'原文',en:'',ja:''},'en'),'原文');
assert.equal(localUrl('/media/a.webp'),'/media/a.webp');
console.log(`Content passed: ${works.length} projects, ${imageCount} gallery images, hero references, translations and video URLs.`);
