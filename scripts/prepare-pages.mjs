import fs from 'node:fs';
import path from 'node:path';

// vinext exports flat .html routes. GitHub Pages also needs directory indexes
// so shared /work/name/ URLs resolve without a server-side router.
const root = path.resolve('dist/client');
const workRoot = path.join(root, 'work');
let count = 0;
for (const entry of fs.readdirSync(workRoot)) {
  if (!entry.endsWith('.html')) continue;
  const slug = entry.slice(0, -5);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Unsafe work slug: ${slug}`);
  const destination = path.join(workRoot, slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.copyFileSync(path.join(workRoot, entry), path.join(destination, 'index.html'));
  count++;
}
fs.writeFileSync(path.join(root, '.nojekyll'), '');
console.log(`Prepared ${count} GitHub Pages project routes.`);
