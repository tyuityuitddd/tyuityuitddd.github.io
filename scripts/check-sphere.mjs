import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';

const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const portfolio = moduleUrl(readFileSync(new URL('../lib/portfolio.ts',import.meta.url),'utf8'));
const { sphereEntries } = await import(moduleUrl(readFileSync(new URL('../lib/sphere-items.ts',import.meta.url),'utf8').replace("'./portfolio'",JSON.stringify(portfolio))));
const folder = new URL('../content/works/',import.meta.url);
const works = readdirSync(folder).filter(name=>name.endsWith('.json')).map(name=>({...JSON.parse(readFileSync(new URL(name,folder),'utf8')),slug:name.replace(/\.json$/,'')})).filter(work=>work.published);
const entries = sphereEntries(works);
assert.equal(entries.length,works.reduce((sum,work)=>sum+work.images.length,0));
assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
for(const entry of entries) assert.equal(entry.artwork,entry.work.images[entry.imageIndex]);
assert.deepEqual(sphereEntries([]),[]);
const many={...works[0],images:Array.from({length:101},(_,i)=>({src:`images/${i}.webp`}))};
assert.equal(sphereEntries([many]).length,101);
assert.equal(sphereEntries([many]).at(-1).imageIndex,100);
assert.equal(sphereEntries([{...many,images:[{src:'original.png',variants:[{src:'small.webp',width:200},{src:'medium.webp',width:480},{src:'large.webp',width:1200}]}]}])[0].image,'/medium.webp');
console.log(`Sphere mapping passed: ${entries.length} images, exact project positions, no duplicates, empty and 101-image collections, thumbnail selection.`);
