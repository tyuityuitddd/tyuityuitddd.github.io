import { mediaUrl, type Artwork, type Work } from './portfolio';

export type SphereEntry = { id: string; work: Work; imageIndex: number; artwork: Artwork; image: string };

// Interleave project images so a large project does not occupy the whole entrance.
// Every image keeps its original project and exact position for the viewer.
export function sphereEntries(works: Work[]): SphereEntry[] {
 const entries: SphereEntry[] = [];
 const rounds = Math.max(0, ...works.map(work => work.images.length));
 for (let imageIndex = 0; imageIndex < rounds; imageIndex++) {
  for (const work of works) {
   const artwork = work.images[imageIndex];
   if (!artwork) continue;
   const variants = artwork.variants || [];
   const thumbnail = variants.find(item => item.width >= 400) || variants.at(-1);
   entries.push({id:`${work.slug}:${imageIndex}`, work, imageIndex, artwork, image:mediaUrl(thumbnail?.src || artwork.thumbnail || artwork.src)});
  }
 }
 return entries;
}
