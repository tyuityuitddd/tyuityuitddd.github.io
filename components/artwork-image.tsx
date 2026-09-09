import type { ComponentProps } from 'react';
import { mediaUrl, type Artwork } from '@/lib/portfolio';

type Props = Omit<ComponentProps<'img'>,'src'|'srcSet'|'width'|'height'> & { image: Artwork };
export function ArtworkImage({image,sizes='100vw',...props}:Props) {
  const variants=image.variants||[];
  const fallback=variants.find(variant=>variant.width>=800)||variants.at(-1);
  return <img {...props} src={mediaUrl(fallback?.src||image.thumbnail||image.src)}
    srcSet={variants.length?variants.map(variant=>`${mediaUrl(variant.src)} ${variant.width}w`).join(', '):undefined}
    sizes={variants.length?sizes:undefined} width={image.width} height={image.height} decoding="async"/>;
}
