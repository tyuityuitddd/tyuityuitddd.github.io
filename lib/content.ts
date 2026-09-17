import fs from 'node:fs';
import path from 'node:path';
import assets from '../content/assets.json';
import rawSettings from '../content/settings.json';
import optimizedImages from '../generated/images.json';
import type { Artwork, Work, Settings } from './portfolio';
import type { JournalPost } from './journal';

const optimized = optimizedImages as Record<string, Omit<Artwork,'alt'> | undefined>;
function journalImage(src?:string,alt=''): Artwork|undefined { return src?{src,alt,...optimized[src.replace(/^\//,'')]}:undefined; }
export function getJournalPosts(): JournalPost[] {
  const directory=path.join(process.cwd(),'content/journal');
  if(!fs.existsSync(directory))return [];
  return fs.readdirSync(directory).filter(file=>file.endsWith('.json'))
    .map(file=>JSON.parse(fs.readFileSync(path.join(directory,file),'utf8')) as JournalPost)
    .filter(post=>post.published)
    .sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug))
    .map(post=>({...post,coverImage:journalImage(post.cover,post.coverAlt||post.title),sections:post.sections.map(section=>({...section,artwork:journalImage(section.image,section.alt||post.title)}))}));
}
export const settings: Settings = { ...rawSettings, avatarImage: {src:rawSettings.avatar,alt:rawSettings.name,...optimized[rawSettings.avatar.replace(/^\//,'')]} };
export function getWorks(): Work[] {
  return fs.readdirSync(path.join(process.cwd(), 'content/works'))
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/works', file), 'utf8')) as Work)
    .filter(work => work.published && work.images?.length)
    .map(work => ({ ...work, images: work.images.map(image => {
      const asset = assets.find(a => a.image === image.src.replace(/^\//, ''));
      return { ...image, thumbnail: asset?.thumbnail, width: asset?.width, height: asset?.height, ...optimized[image.src.replace(/^\//,'')] };
    }) }))
    .sort((a,b) => (a.order || 0) - (b.order || 0) || a.slug.localeCompare(b.slug));
}
