import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {safeVideoLink} from '../lib/portfolio.ts';
const slugs=new Set();
function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
function image(src){if(!src)return;if(src.startsWith('https://'))return;const file=path.resolve('public',src.replace(/^\/+/,''));assert(file.startsWith(path.resolve('public')+path.sep));assert(fs.existsSync(file),`Missing journal image: ${src}`);}
for(const file of fs.readdirSync('content/journal').filter(f=>f.endsWith('.json'))){
 const post=JSON.parse(fs.readFileSync(path.join('content/journal',file),'utf8'));
 assert.match(post.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert(!slugs.has(post.slug));slugs.add(post.slug);
 assert.equal(file,`${post.slug}.json`);assert.equal(typeof post.published,'boolean');
 assert(typeof post.title==='string'&&post.title.trim());assert(typeof post.excerpt==='string'&&post.excerpt.trim());
 assert(validDate(post.date),`Invalid date: ${post.slug}`);
 if(post.updated){assert(validDate(post.updated));assert(post.updated>=post.date);}
 if(post.retrospective){assert(validDate(post.recordedOn));assert(post.recordedOn>=post.date);}
 image(post.cover);if(post.cover)assert(post.coverAlt?.trim(),`Missing cover description: ${post.slug}`);
 assert(Array.isArray(post.sections)&&post.sections.length);
 if(post.tags)assert(Array.isArray(post.tags)&&post.tags.every(tag=>typeof tag==='string'));
 for(const section of post.sections){assert(section.text?.trim()||section.image||section.video,'Empty journal section');image(section.image);if(section.image)assert(section.alt?.trim(),'Missing journal image description');if(section.video)assert(safeVideoLink(section.video),'Invalid journal video URL');}
}
console.log(`Journal passed: ${slugs.size} entries, dates, images and video URLs.`);
