import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve('dist/client');
const prefix='';
const works=fs.readdirSync('content/works').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join('content/works',f),'utf8'))).filter(w=>w.published&&w.images.length);
const posts=fs.readdirSync('content/journal').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join('content/journal',f),'utf8'))).filter(p=>p.published);
const pages=['index.html','404.html','journal/index.html',...posts.map(p=>`journal/${p.slug}/index.html`),...works.map(w=>`work/${w.slug}/index.html`)];
let checked=0;
for(const page of pages){
 const file=path.join(root,page);assert(fs.existsSync(file),`Missing exported page ${page}`);
 const html=fs.readFileSync(file,'utf8');
 assert(!html.includes('Untitled site'));assert(!html.includes('Your site is taking shape'));
 const references=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match=>match[1]);
 for(const match of html.matchAll(/srcset="([^"]+)"/gi))references.push(...match[1].split(',').map(candidate=>candidate.trim().split(/\s+/)[0]));
 for(const raw of references){
  if(!raw.startsWith('/')||raw.startsWith('//'))continue;
  const url=new URL(raw,'https://portfolio.example');
  assert(!prefix||url.pathname.startsWith(prefix+'/'),`Wrong base path in ${page}: ${raw}`);
  const relative=decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^\//,'');
  let target=path.join(root,relative);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),`Broken asset/link in ${page}: ${raw}`);checked++;
 }
}
assert(fs.existsSync(path.join(root,'.nojekyll')));
console.log(`Export passed: ${pages.length} pages, ${checked} local links/assets, base path ${prefix||'/'}.`);
