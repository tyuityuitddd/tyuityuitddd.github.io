'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Play, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Header, Footer, useLanguage } from './site-chrome';
import { ArtworkImage } from './artwork-image';
import { copy, translated, showsWorkText, workLabel, localUrl, mediaUrl, videoEmbed, safeVideoLink, type Work } from '@/lib/portfolio';

export default function WorkDetail({work,next}:{work:Work;next:Work|null}) {
 const [lang,changeLanguage]=useLanguage();
 const [selected,setSelected]=useState<number|null>(null);
 const [playing,setPlaying]=useState(false);
 const t=copy[lang];const title=workLabel(work,lang);const showText=showsWorkText(work);const embed=videoEmbed(work.video);const externalVideo=safeVideoLink(work.video);
 useEffect(()=>{document.title=`${title} — TDDD`},[title]);
 const move=(delta:number)=>setSelected(current=>current===null?null:Math.max(0,Math.min(work.images.length-1,current+delta)));
 return <div id="top" className="detail-page"><Header lang={lang} onLanguage={changeLanguage} detail/>
 <main id="main"><section className={`detail-intro section-wrap ${showText?'':'image-only-intro'}`}><a className="back-link" href={`${localUrl('')}?lang=${lang}#works`}><ArrowLeft size={17}/>{t.back}</a>{showText?<><div className="detail-heading"><div><p className="eyebrow">TDDD / {t[work.category]}</p><h1>{title}</h1></div><span className="detail-count">{String(work.images.length).padStart(2,'0')}<small>{t.images}</small></span></div><div className="detail-description"><span>{t.overview}</span><p>{translated(work.description,lang)}</p></div></>:<h1 className="sr-only">{title}</h1>}</section>
 <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}>
 <section className={`detail-gallery section-wrap category-${work.category}`} aria-label={t.gallery}>{work.images.map((img,i)=><figure key={`${img.src}-${i}`} className="detail-figure"><DialogTrigger render={<button className="gallery-image"/>} onClick={()=>setSelected(i)} aria-label={`${t.original} — ${img.alt||title}`}><ArtworkImage image={img} sizes={work.category==='illustration'?"(max-width: 760px) 88vw, (max-width: 1150px) 86vw, 950px":"(max-width: 1800px) 86vw, 1550px"} alt={img.alt||title} loading={i===0?'eager':'lazy'}/><span className="expand-image"><Maximize2 size={18}/>{t.original}</span></DialogTrigger><figcaption><span>{String(i+1).padStart(2,'0')} / {String(work.images.length).padStart(2,'0')}</span>{showText&&<span>{title}</span>}</figcaption></figure>)}</section>
 <DialogContent className="lightbox" showCloseButton={false} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}}}>
 <div className="lightbox-top"><div><DialogTitle className={showText?undefined:'sr-only'}>{title}</DialogTitle><DialogDescription className="sr-only">{t.original}</DialogDescription></div><DialogClose render={<Button variant="ghost" className="lightbox-close" aria-label={t.close}/>}><X size={23}/></DialogClose></div>
 {selected!==null&&<img className="lightbox-image" src={mediaUrl(work.images[selected].src)} alt={work.images[selected].alt||title}/>}
 <div className="lightbox-bottom"><Button variant="ghost" className="lightbox-control" disabled={selected===0} onClick={()=>move(-1)} aria-label={t.previous}><ArrowLeft size={22}/></Button><span>{(selected??0)+1} / {work.images.length}</span><Button variant="ghost" className="lightbox-control" disabled={selected===work.images.length-1} onClick={()=>move(1)} aria-label={t.next}><ArrowRight size={22}/></Button></div>
 </DialogContent></Dialog>
 {externalVideo&&<section className="video-section section-wrap"><p className="eyebrow">VIDEO</p><h2>{t.video}</h2>{embed?<div className="video-frame">{playing?<iframe src={embed} title={`${title} — ${t.video}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<Button className="video-play" onClick={()=>setPlaying(true)}><Play size={36}/>{t.videoPlay}</Button>}</div>:<a className="pill-link" href={externalVideo} target="_blank" rel="noreferrer">{t.video}<ArrowUpRight size={18}/></a>}</section>}
 {next&&<a className="next-project section-wrap" href={`${localUrl(`work/${next.slug}/`)}?lang=${lang}`}><div><p className="eyebrow">{t.nextWork}</p>{showsWorkText(next)&&<h2>{workLabel(next,lang)}</h2>}</div><ArrowUpRight size={54}/></a>}
 </main><Footer lang={lang}/></div>;
}
