import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist/client');
let count=0;
function prepare(directory){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory()){prepare(file);continue;}
  if(!entry.name.endsWith('.html')||['index.html','404.html'].includes(entry.name))continue;
  const destination=file.slice(0,-5);
  fs.mkdirSync(destination,{recursive:true});
  fs.copyFileSync(file,path.join(destination,'index.html'));count++;
 }
}
prepare(root);
fs.writeFileSync(path.join(root,'.nojekyll'),'');
console.log(`Prepared ${count} GitHub Pages routes.`);
