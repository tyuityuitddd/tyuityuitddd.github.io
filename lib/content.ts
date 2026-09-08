import fs from 'node:fs';
import path from 'node:path';
import assets from '../content/assets.json';
import rawSettings from '../content/settings.json';
import type { Work, Settings } from './portfolio';

export const settings = rawSettings as Settings;
export function getWorks(): Work[] {
  return fs.readdirSync(path.join(process.cwd(), 'content/works'))
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/works', file), 'utf8')) as Work)
    .filter(work => work.published && work.images?.length)
    .map(work => ({ ...work, images: work.images.map(image => {
      const asset = assets.find(a => a.image === image.src.replace(/^\//, ''));
      return { ...image, thumbnail: asset?.thumbnail, width: asset?.width, height: asset?.height };
    }) }))
    .sort((a,b) => (a.order || 0) - (b.order || 0) || a.slug.localeCompare(b.slug));
}
