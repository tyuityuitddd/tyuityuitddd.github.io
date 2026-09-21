'use client';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Header, useLanguage } from './site-chrome';
import { ArtworkImage } from './artwork-image';
import { motionAllowed } from '@/lib/motion';
import { ringDistance, wrapIndex } from '@/lib/gallery';
import { copy, translated, localUrl, mediaUrl, showsWorkText, workLabel, type Work, type Settings, type Category } from '@/lib/portfolio';
import type { JournalPost } from '@/lib/journal';

const words = {
 zh:{title:'作品之間',drag:'拖曳旋轉畫廊',select:'移到中央',open:'開啟作品',previous:'上一件作品',next:'下一件作品',choose:'選擇作品',hint:'點選中央畫框，展開觀看',details:'作品詳情',journal:'開發日誌',keyboard:'環形畫廊：使用左右方向鍵切換，Enter 開啟作品'},
 en:{title:'Between worlds',drag:'Drag to turn the gallery',select:'Bring to centre',open:'Open artwork',previous:'Previous artwork',next:'Next artwork',choose:'Choose artwork',hint:'Select the centre frame to explore',details:'Project details',journal:'Development journal',keyboard:'Circular gallery: use arrow keys to browse, Enter to open'},
 ja:{title:'作品のあいだ',drag:'ドラッグして回す',select:'中央に移動',open:'作品を開く',previous:'前の作品',next:'次の作品',choose:'作品を選択',hint:'中央の額をクリックして鑑賞',details:'作品の詳細',journal:'開発日誌',keyboard:'環状ギャラリー：左右キーで移動、Enter で作品を開く'},
};

export default function CircularGallery({works,settings,posts}:{works:Work[];settings:Settings;posts:JournalPost[]}) {
 const [lang,changeLanguage]=useLanguage();
 const [category,setCategory]=useState<Category|'all'>('all');
 const [active,setActive]=useState(0);
 const [drag,setDrag]=useState(0);
 const [viewing,setViewing]=useState<Work|null>(null);
 const [imageIndex,setImageIndex]=useState(0);
 const [about,setAbout]=useState(false);
 const [width,setWidth]=useState(1200);
 const stage=useRef<HTMLDivElement>(null);
 const gesture=useRef<{id:number;x:number;y:number;moved:boolean;horizontal:boolean}|null>(null);
 const suppressClick=useRef(false);
 const ordered=[...settings.hero.map(slug=>works.find(w=>w.slug===slug)).filter((w):w is Work=>!!w),...works.filter(w=>!settings.hero.includes(w.slug))].filter((w,i,all)=>all.findIndex(other=>other.slug===w.slug)===i);
 const filtered=ordered.filter(w=>category==='all'||w.category===category);
 const selected=filtered[wrapIndex(active,filtered.length)];
 const t=copy[lang],g=words[lang];
 const turn=(delta:number)=>setActive(current=>wrapIndex(current+delta,filtered.length));
 const open=(work:Work)=>{setImageIndex(0);setViewing(work)};
 const resetLook=()=>{stage.current?.style.setProperty('--look-x','0deg');stage.current?.style.setProperty('--look-y','0deg')};
 useEffect(()=>{
  const el=stage.current;if(!el)return;
  const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));observer.observe(el);
  const hash=()=>{if(['#about','#contact'].includes(location.hash))setAbout(true)};hash();
  addEventListener('hashchange',hash);addEventListener('tddd-motion-change',resetLook);
  return()=>{observer.disconnect();removeEventListener('hashchange',hash);removeEventListener('tddd-motion-change',resetLook)};
 },[]);
 useEffect(()=>{document.title=`TDDD — ${g.title}`},[g.title]);
 function pointerDown(event:PointerEvent<HTMLDivElement>){
  if(event.button!==0)return;
  gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false,horizontal:false};suppressClick.current=false;
 }
 function pointerMove(event:PointerEvent<HTMLDivElement>){
  const current=gesture.current;
  if(current&&current.id===event.pointerId){
   const dx=event.clientX-current.x,dy=event.clientY-current.y;
   if(!current.moved&&Math.hypot(dx,dy)>8){current.moved=true;current.horizontal=Math.abs(dx)>Math.abs(dy);if(current.horizontal)event.currentTarget.setPointerCapture(event.pointerId)}
   if(current.horizontal){suppressClick.current=true;setDrag(Math.max(-1,Math.min(1,dx/Math.max(130,width*.24))))}
  }else if(event.pointerType==='mouse'&&motionAllowed()){
   const rect=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty('--look-x',`${((event.clientX-rect.left)/rect.width-.5)*2}deg`);event.currentTarget.style.setProperty('--look-y',`${((event.clientY-rect.top)/rect.height-.5)*-1.4}deg`);
  }
 }
 function pointerEnd(event:PointerEvent<HTMLDivElement>,cancel=false){
  const current=gesture.current;if(!current||current.id!==event.pointerId)return;
  if(!cancel&&current.horizontal&&Math.abs(event.clientX-current.x)>45)turn(event.clientX<current.x?1:-1);
  gesture.current=null;setDrag(0);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
 }
 const radius=Math.max(235,Math.min(740,width*.52));
 return <div className="arc-shell" id="top">
  <Header lang={lang} onLanguage={changeLanguage} onAbout={()=>setAbout(true)}/>
  <main className="arc-main" id="works">
   <div className="arc-heading"><div><h1>{g.title}<span>.</span></h1><p>{settings.name}<span>/</span>{t.disciplines}</p></div>
    <div className="arc-filters" role="group" aria-label={t.works}>{(['all','illustration','game','design'] as const).map(cat=><button key={cat} aria-pressed={category===cat} onClick={()=>{setCategory(cat);setActive(0);setDrag(0)}}>{t[cat]}<sup>{cat==='all'?works.length:works.filter(w=>w.category===cat).length}</sup></button>)}</div>
   </div>
   <div className={`arc-stage${drag?' is-dragging':''}`} ref={stage} role="region" aria-roledescription="carousel" aria-label={g.keyboard} tabIndex={0} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event=>pointerEnd(event)} onPointerCancel={event=>pointerEnd(event,true)} onPointerLeave={()=>{if(!gesture.current)resetLook()}} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==='ArrowRight'){event.preventDefault();turn(1)}if(event.key==='ArrowLeft'){event.preventDefault();turn(-1)}if(event.key==='Enter'&&selected)open(selected)}}>
    <div className="arc-atmosphere" aria-hidden="true"><div className="arc-orbit orbit-outer"/><div className="arc-orbit orbit-inner"/>{Array.from({length:18},(_,i)=><i key={i} style={{left:`${(i*37+11)%100}%`,top:`${(i*29+13)%83}%`,animationDelay:`${i*-.7}s`}}/>)}</div>
    <div className="arc-world">{filtered.map((work,i)=>{
     const distance=ringDistance(i,active,filtered.length);if(Math.abs(distance)>3)return null;
     const angle=(distance+drag)*42,radians=angle*Math.PI/180;
     const style={transform:`translate(-50%, -50%) translate3d(${Math.sin(radians)*radius}px, 0, ${(Math.cos(radians)-1)*radius*.85}px) rotateY(${-angle*.68}deg)`,zIndex:10-Math.abs(distance),opacity:Math.abs(distance)>2?.26:Math.abs(distance)>1?.55:1} as CSSProperties;
     return <button key={work.slug} className={`arc-frame${distance===0?' is-current':''}`} style={style} tabIndex={distance===0?0:-1} aria-label={`${distance===0?g.open:g.select} ${String(i+1).padStart(2,'0')} — ${workLabel(work,lang)}`} onClick={event=>{if(suppressClick.current&&event.detail!==0)return;if(distance===0)open(work);else setActive(i)}}>
      <span className="arc-mat"><ArtworkImage image={work.images[0]} sizes="(max-width: 600px) 65vw, 380px" alt={workLabel(work,lang)} draggable={false} loading={Math.abs(distance)<2?'eager':'lazy'} fetchPriority={distance===0?'high':undefined}/></span>
      <span className="arc-frame-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
     </button>;
    })}</div>
    {!selected&&<p className="arc-empty">{t.empty}</p>}
   </div>
   <div className="arc-console">
    <div className="arc-guide"><MoveHorizontal size={24}/><p>{g.drag}<small>{g.hint}</small></p></div>
    <div className="arc-selector"><button onClick={()=>turn(-1)} aria-label={g.previous} disabled={filtered.length<2}><ArrowLeft size={19}/></button><label className="arc-counter"><span className="sr-only">{g.choose}</span><select value={wrapIndex(active,filtered.length)} onChange={event=>setActive(Number(event.target.value))} disabled={!filtered.length}>{filtered.map((work,i)=><option key={work.slug} value={i}>{String(i+1).padStart(2,'0')} / {String(filtered.length).padStart(2,'0')}</option>)}</select></label><button onClick={()=>turn(1)} aria-label={g.next} disabled={filtered.length<2}><ArrowRight size={19}/></button></div>
    <div className="arc-current"><span aria-live="polite">{selected?workLabel(selected,lang):''}</span><button className="arc-open" onClick={()=>selected&&open(selected)} disabled={!selected}>{g.open}<ArrowUpRight size={17}/></button></div>
   </div>
  </main>
  <footer className="arc-footer"><span>© {new Date().getFullYear()} TDDD</span><a href={`${localUrl('journal/')}?lang=${lang}`}><span>{g.journal}</span>{posts[0]&&<span className="arc-latest">{posts[0].title}</span>}<ArrowUpRight size={15}/></a></footer>
  <Dialog open={!!viewing} onOpenChange={value=>{if(!value)setViewing(null)}}><DialogContent className="arc-viewer" showCloseButton={false} onKeyDown={event=>{if(!viewing)return;if(event.key==='ArrowLeft'){event.preventDefault();setImageIndex(i=>wrapIndex(i-1,viewing.images.length))}if(event.key==='ArrowRight'){event.preventDefault();setImageIndex(i=>wrapIndex(i+1,viewing.images.length))}}}>
   {viewing&&<><div className="arc-viewer-top"><DialogTitle>{workLabel(viewing,lang)}</DialogTitle><DialogDescription className="sr-only">{t.original}</DialogDescription><button className="arc-icon" onClick={()=>setViewing(null)} aria-label={t.close}><X/></button></div><img className="arc-viewer-image" src={mediaUrl(viewing.images[imageIndex].src)} alt={workLabel(viewing,lang)}/><div className="arc-viewer-bottom"><div><button className="arc-icon" onClick={()=>setImageIndex(i=>wrapIndex(i-1,viewing.images.length))} aria-label={t.previous} disabled={viewing.images.length<2}><ArrowLeft/></button><span>{imageIndex+1} / {viewing.images.length}</span><button className="arc-icon" onClick={()=>setImageIndex(i=>wrapIndex(i+1,viewing.images.length))} aria-label={t.next} disabled={viewing.images.length<2}><ArrowRight/></button></div>{showsWorkText(viewing)&&<a href={`${localUrl(`work/${viewing.slug}/`)}?lang=${lang}`}>{g.details}<ArrowUpRight size={16}/></a>}</div></>}
  </DialogContent></Dialog>
  <Dialog open={about} onOpenChange={setAbout}><DialogContent className="arc-about" showCloseButton={false}><button className="arc-icon arc-about-close" aria-label={t.close} onClick={()=>setAbout(false)}><X/></button><img src={mediaUrl(settings.avatar)} alt={settings.name}/><div><DialogTitle>{t.aboutTitle}</DialogTitle><DialogDescription>{translated(settings.bio,lang)}</DialogDescription><ul>{t.services.map(service=><li key={service}>{service}</li>)}</ul><a className="arc-mail" href={`mailto:${settings.email}`}>{settings.email}<ArrowUpRight size={18}/></a></div></DialogContent></Dialog>
 </div>;
}
