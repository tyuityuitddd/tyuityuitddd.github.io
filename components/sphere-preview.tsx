'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Grid2X2, Minus, Pause, Play, Plus, RotateCcw, X } from 'lucide-react';
import SphereGallery3D, { type SphereControls } from './sphere-gallery-3d';
import { sphereEntries, type SphereEntry } from '@/lib/sphere-items';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { ArtworkImage } from './artwork-image';
import { useLanguage } from './site-chrome';
import { motionAllowed } from '@/lib/motion';
import { wrapIndex } from '@/lib/gallery';
import { copy, localUrl, mediaUrl, translated, workLabel, showsWorkText, videoEmbed, type Work, type Settings, type Category } from '@/lib/portfolio';

const words={
 zh:{preview:'球面互動預覽',headline:'每個片段，\n都在這裡。',hint:'拖曳旋轉 · 滾輪縮放 · 點選看大圖',touch:'拖曳旋轉 · 雙指縮放',index:'作品索引',motion:'自動旋轉',attraction:'滑鼠吸附',reset:'重設視角',zoomIn:'放大',zoomOut:'縮小',images:'張圖片',projects:'組作品',detail:'完整專案',video:'播放影片',back:'回到圖片',fallback:'目前無法顯示 3D，可從作品索引查看全部圖片。',canvas:'球面作品空間。拖曳旋轉，滾輪縮放；鍵盤方向鍵旋轉，加減鍵縮放。作品索引可逐張開啟。'},
 en:{preview:'Sphere concept',headline:'Every fragment,\nin one world.',hint:'Drag to rotate · Scroll to zoom · Select to view',touch:'Drag to rotate · Pinch to zoom',index:'Artwork index',motion:'Auto rotation',attraction:'Cursor attraction',reset:'Reset view',zoomIn:'Zoom in',zoomOut:'Zoom out',images:'images',projects:'projects',detail:'Full project',video:'Play video',back:'Back to images',fallback:'3D is unavailable. Browse every image in the artwork index.',canvas:'Spherical artwork space. Drag or arrow keys to rotate, scroll or plus/minus to zoom. Use the artwork index to select any image.'},
 ja:{preview:'球体ギャラリー・プレビュー',headline:'創作のかけらが、\nひとつの世界に。',hint:'ドラッグで回転・スクロールでズーム・クリックで鑑賞',touch:'ドラッグで回転・ピンチでズーム',index:'作品一覧',motion:'自動回転',attraction:'カーソル吸着',reset:'視点を戻す',zoomIn:'拡大',zoomOut:'縮小',images:'枚',projects:'プロジェクト',detail:'作品の詳細',video:'動画を再生',back:'画像に戻る',fallback:'3D を表示できません。作品一覧からすべての画像をご覧いただけます。',canvas:'球体ギャラリー。ドラッグまたは矢印キーで回転、スクロールまたは加減キーでズーム。作品一覧から各画像を開けます。'},
};

export default function SpherePreview({works,settings,preview=true}:{works:Work[];settings:Settings;preview?:boolean}){
 const [lang,changeLanguage]=useLanguage();
 const [category,setCategory]=useState<Category|'all'>('all');
 const [motion,setMotion]=useState(false);
 const [autoRotate,setAutoRotate]=useState(false);
 const [viewing,setViewing]=useState<Work|null>(null);
 const [imageIndex,setImageIndex]=useState(0);
 const [playing,setPlaying]=useState(false);
 const [indexOpen,setIndexOpen]=useState(false);
 const [about,setAbout]=useState(false);
 const [unavailable,setUnavailable]=useState(false);
 const controls=useRef<SphereControls|null>(null);
 const ordered=useMemo(()=>[...settings.hero.map(slug=>works.find(w=>w.slug===slug)).filter((w):w is Work=>!!w),...works.filter(w=>!settings.hero.includes(w.slug))],[works,settings.hero]);
 const filtered=useMemo(()=>ordered.filter(work=>category==='all'||work.category===category),[ordered,category]);
 const entries=useMemo(()=>sphereEntries(filtered),[filtered]);
 const textures=useMemo(()=>entries.map(entry=>({image:entry.image})),[entries]);
 const t=copy[lang],g=words[lang];
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{let enabled=!reduced.matches;try{const saved=localStorage.getItem('tddd-sphere-interaction');if(saved!==null)enabled=saved==='on'}catch{/* Optional preference. */}setMotion(enabled)};update();reduced.addEventListener('change',update);
  // Rotation is independent of pointer attraction. The old global switch must not disable hover.
  let rotation=motionAllowed();
  try { const saved=localStorage.getItem('tddd-sphere-rotation');if(saved!==null)rotation=saved==='on'; } catch { /* Optional preference. */ }
  setAutoRotate(rotation);
  return()=>reduced.removeEventListener('change',update);
 },[]);
 useEffect(()=>{document.title=preview?`TDDD — ${g.preview}`:`${settings.name} — ${t.disciplines}`},[g.preview,preview,settings.name,t.disciplines]);
 function open(entry:SphereEntry){setImageIndex(entry.imageIndex);setViewing(entry.work);setPlaying(false);setIndexOpen(false)}
 function close(){setViewing(null);setPlaying(false)}
 return <div className="sphere-experience float-experience" style={{height:'100svh'}}><div className="float-viewport">
  <header className="float-header"><button className="float-logo sphere-home" onClick={()=>controls.current?.reset()} aria-label={g.reset}>TDDD</button>{preview&&<span className="float-preview-label">{g.preview}</span>}<nav><a href={`${localUrl('journal/')}?lang=${lang}`}>{lang==='en'?'Journal':'開發日誌'}</a><button onClick={()=>setAbout(true)}>{t.about}</button></nav><div className="float-languages">{(['zh','en','ja'] as const).map(value=><button key={value} aria-pressed={value===lang} onClick={()=>changeLanguage(value)}>{value==='zh'?'中':value==='ja'?'日':'EN'}</button>)}</div></header>
  <div className="float-toolbar"><div className="float-filters" role="group" aria-label={t.works}>{(['all','illustration','game','design'] as const).map(cat=><button key={cat} aria-pressed={category===cat} onClick={()=>{setCategory(cat);controls.current?.reset()}}>{t[cat]}<sup>{works.filter(w=>cat==='all'||w.category===cat).reduce((count,w)=>count+w.images.length,0)}</sup></button>)}</div><button className="sphere-index-button" onClick={()=>setIndexOpen(true)}><Grid2X2 size={14}/>{g.index}</button></div>
  <main className="sphere-stage"><div className="sphere-intro"><h1>{g.headline}</h1><p>{t.disciplines}</p></div>
   <SphereGallery3D images={textures} background="#121416" scale={94} size={entries.length<10?39:entries.length<35?30:25} scatter={12} speed={autoRotate?8:0} hover={motion?200:0} rounded={3} core={{coreSize:5,coreColor:'#b7c1c518',lineColor:'#a9b0b314'}} controlsRef={controls} motionEnabled={motion||autoRotate} paused={!!viewing||indexOpen||about} onSelect={index=>{const entry=entries[index];if(entry)open(entry)}} onUnavailable={setUnavailable} label={g.canvas}/>
   {unavailable&&<div className="sphere-fallback"><p>{g.fallback}</p><button onClick={()=>setIndexOpen(true)}>{g.index}<ArrowUpRight size={16}/></button></div>}
   <div className="sphere-caption" aria-live="polite">{entries.length} {g.images}<span>/</span>{filtered.length} {g.projects}</div>
  </main>
  <footer className="float-footer sphere-footer"><span className="sphere-hint">{g.hint}</span><span className="sphere-touch-hint">{g.touch}</span><div className="sphere-controls"><button aria-label={g.zoomOut} onClick={()=>controls.current?.zoom(4)}><Minus size={17}/></button><button aria-label={g.reset} onClick={()=>controls.current?.reset()}><RotateCcw size={16}/></button><button aria-label={g.zoomIn} onClick={()=>controls.current?.zoom(-4)}><Plus size={17}/></button></div><div className="sphere-modes"><button className="float-motion" aria-label={g.attraction} aria-pressed={motion} onClick={()=>{const next=!motion;setMotion(next);try{localStorage.setItem('tddd-sphere-interaction',next?'on':'off')}catch{/* Optional preference. */}}}>{motion?<Pause size={14}/>:<Play size={14}/>}<span>{g.attraction}</span></button><button className="float-motion" aria-label={g.motion} aria-pressed={autoRotate} onClick={()=>{const next=!(autoRotate);setAutoRotate(next);try{localStorage.setItem('tddd-sphere-rotation',next?'on':'off')}catch{/* Optional preference. */}}}>{autoRotate?<Pause size={14}/>:<Play size={14}/>}<span>{g.motion}</span></button></div></footer>
 </div>
 <Dialog open={!!viewing} onOpenChange={value=>{if(!value)close()}}><DialogContent className="float-viewer sphere-viewer" showCloseButton={false} onKeyDown={event=>{if(!viewing||playing)return;if(event.key==='ArrowLeft'){event.preventDefault();setImageIndex(i=>wrapIndex(i-1,viewing.images.length))}if(event.key==='ArrowRight'){event.preventDefault();setImageIndex(i=>wrapIndex(i+1,viewing.images.length))}}}>
  {viewing&&<><div className="float-viewer-top"><DialogTitle>{workLabel(viewing,lang)}</DialogTitle><DialogDescription className="sr-only">{t.original}</DialogDescription><button aria-label={t.close} onClick={close}><X size={22}/></button></div><div className="float-media">{playing&&videoEmbed(viewing.video)?<iframe title={workLabel(viewing,lang)} src={videoEmbed(viewing.video)!} allow="fullscreen; picture-in-picture" allowFullScreen/>:<img src={mediaUrl(viewing.images[imageIndex].src)} alt={workLabel(viewing,lang)}/>}</div><div className="float-viewer-bottom"><div><button aria-label={t.previous} disabled={playing||viewing.images.length<2} onClick={()=>setImageIndex(i=>wrapIndex(i-1,viewing.images.length))}><ArrowLeft size={18}/></button><span aria-live="polite">{imageIndex+1} / {viewing.images.length}</span><button aria-label={t.next} disabled={playing||viewing.images.length<2} onClick={()=>setImageIndex(i=>wrapIndex(i+1,viewing.images.length))}><ArrowRight size={18}/></button></div><div>{videoEmbed(viewing.video)&&<button onClick={()=>setPlaying(!playing)}>{playing?g.back:g.video}<Play size={14}/></button>}{showsWorkText(viewing)&&<a href={`${localUrl(`work/${viewing.slug}/`)}?lang=${lang}`}>{g.detail}<ArrowUpRight size={14}/></a>}</div></div></>}
 </DialogContent></Dialog>
 <Dialog open={indexOpen} onOpenChange={setIndexOpen}><DialogContent className="sphere-index" showCloseButton={false}><div className="sphere-index-top"><div><DialogTitle>{g.index}</DialogTitle><DialogDescription>{entries.length} {g.images} / {filtered.length} {g.projects}</DialogDescription></div><button aria-label={t.close} onClick={()=>setIndexOpen(false)}><X size={22}/></button></div><div className="sphere-index-scroll">{filtered.map((work,workIndex)=><section key={work.slug}><h2>{workLabel(work,lang)}<span>{String(workIndex+1).padStart(2,'0')} · {work.images.length} {g.images}</span></h2><div className="sphere-index-grid">{work.images.map((artwork,i)=><button key={`${work.slug}:${i}`} aria-label={`${t.view} — ${workLabel(work,lang)} ${i+1} / ${work.images.length}`} onClick={()=>open({id:`${work.slug}:${i}`,work,imageIndex:i,artwork,image:mediaUrl(artwork.src)})}><ArtworkImage image={artwork} alt={workLabel(work,lang)} sizes="180px" loading="lazy"/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div></section>)}</div></DialogContent></Dialog>
 <Dialog open={about} onOpenChange={setAbout}><DialogContent className="float-about" showCloseButton={false}><button className="float-close" aria-label={t.close} onClick={()=>setAbout(false)}><X size={22}/></button><DialogTitle>{t.aboutTitle}</DialogTitle><DialogDescription>{translated(settings.bio,lang)}</DialogDescription><a href={`mailto:${settings.email}`}>{settings.email}<ArrowUpRight size={16}/></a></DialogContent></Dialog>
 </div>;
}
