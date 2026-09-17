'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header, Footer, useLanguage } from './site-chrome';
import { JournalPreview } from './journal';
import type { JournalPost } from '@/lib/journal';
import { ArtworkImage } from './artwork-image';
import { copy, translated, localUrl, showsWorkText, workLabel, type Work, type Settings, type Category } from '@/lib/portfolio';

export default function PortfolioHome({works,settings,posts}:{works:Work[];settings:Settings;posts:JournalPost[]}) {
 const [lang, changeLanguage] = useLanguage();
 const [category,setCategory] = useState<Category|'all'>('all');
 const [limit,setLimit] = useState(12);
 const hero = useRef<HTMLElement>(null);
 const t=copy[lang];
 const filtered=works.filter(w=>category==='all'||w.category===category);
 const heroWorks=settings.hero.map(slug=>works.find(w=>w.slug===slug)).filter((w):w is Work=>!!w);
 useEffect(() => {
  let frame=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{frame=0;const el=hero.current;if(!el)return;const distance=el.offsetHeight-innerHeight;const p=reduced.matches||distance<=0?0:Math.max(0,Math.min(1,-el.getBoundingClientRect().top/distance));el.style.setProperty('--progress',String(p));};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);reduced.addEventListener('change',scroll);
  return()=>{removeEventListener('scroll',scroll);removeEventListener('resize',scroll);reduced.removeEventListener('change',scroll);cancelAnimationFrame(frame)};
 },[]);
 useEffect(()=>{document.title=lang==='zh'?'泰迪迪迪 TDDD — 插畫・遊戲・視覺設計':lang==='en'?'TDDD — Illustration, Games & Visual Design':'TDDD — イラスト・ゲーム・ビジュアルデザイン'},[lang]);
 return <div id="top"><Header lang={lang} onLanguage={changeLanguage}/><main>
 <section className={`hero language-${lang}`} ref={hero} aria-label={t.disciplines}><div className="hero-stage">
  <div className="hero-backtype" aria-hidden="true">TDDD</div>
  <div className="hero-copy"><p className="eyebrow">{t.heroTop}</p><h1>{t.headline[0]}<br/><em>{t.headline[1]}</em></h1><p className="hero-description">{t.disciplines}</p><a className="pill-link" href="#works">{t.explore}<ArrowUpRight size={20}/></a></div>
  {heroWorks.map((work,i)=><a key={work.slug} href={`${localUrl(`work/${work.slug}/`)}?lang=${lang}`} className={`hero-art art-${['a','b','c','d'][i]}`} aria-label={`${t.view} — ${workLabel(work,lang)}`}><ArtworkImage image={work.images[0]} sizes="(max-width: 760px) 38vw, 26vw" alt={workLabel(work,lang)} fetchPriority={i===0?'high':undefined}/><span className="art-number">0{i+1} / TDDD</span></a>)}
  <div className="hero-bottom"><span>ART, CHARACTERS & WORLDS.</span><a href="#works">{t.scroll}<ArrowDown size={14}/></a></div>
 </div></section>
 <div className="discipline-strip" aria-hidden="true"><span>ILLUSTRATION</span><span>✳</span><span>GAME ART</span><span>✳</span><span>VISUAL DESIGN</span><span>✳</span></div>
 <section className="works section-wrap" id="works"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORKS</p><h2>{t.selected}<span className="accent">.</span></h2></div><p>{t.intro}</p></div>
 <div className="work-controls"><div className="filter-list" role="group" aria-label={t.works}>{(['all','illustration','game','design'] as const).map(cat=><Button key={cat} variant="ghost" className="filter-button" aria-pressed={category===cat} onClick={()=>{setCategory(cat);setLimit(12)}}>{t[cat]}<sup>{cat==='all'?works.length:works.filter(w=>w.category===cat).length}</sup></Button>)}</div><span className="result-count" aria-live="polite">{filtered.length} {t.pieces}</span></div>
 <div className="work-grid">{filtered.slice(0,limit).map((work,index)=>{
  const img=work.images[0];return <a key={work.slug} href={`${localUrl(`work/${work.slug}/`)}?lang=${lang}`} className={`work-card ${work.category==='illustration'?'portrait-card':'landscape-card'}`}>
   <div className="work-image"><ArtworkImage image={img} sizes={work.category==='illustration'?"(max-width: 760px) 44vw, (max-width: 1600px) 43vw, 750px":"(max-width: 760px) 88vw, (max-width: 1600px) 43vw, 750px"} alt={workLabel(work,lang)} loading="lazy"/><span className="work-index">{String(index+1).padStart(2,'0')}</span>{work.images.length>1&&<span className="image-count">{work.images.length} {t.images}</span>}<span className="work-open" aria-hidden="true"><ArrowUpRight size={24}/></span></div>
   {showsWorkText(work)&&<div className="work-caption"><h3>{workLabel(work,lang)}</h3><span>{t[work.category]}</span></div>}
  </a>;
 })}</div>
 {filtered.length===0&&<p className="empty-state">{t.empty}</p>}
 {limit<filtered.length&&<div className="load-more"><Button className="more-button" variant="outline" onClick={()=>setLimit(n=>n+12)}>{t.more}<ArrowDown size={17}/></Button><span>{Math.min(limit,filtered.length)} / {filtered.length}</span></div>}
 </section>
 <JournalPreview posts={posts} lang={lang}/>
 <section className="about section-wrap" id="about"><div className="about-visual"><ArtworkImage image={settings.avatarImage||{src:settings.avatar,alt:settings.name}} sizes="(max-width: 760px) 300px, 440px" alt={settings.name} loading="lazy"/><span className="about-sign">TDDD<span>✳</span></span><span className="about-label">THE PERSON BEHIND THE PIXELS.</span></div><div className="about-copy"><p className="eyebrow">02 / BEHIND THE WORK</p><h2>{t.aboutTitle}</h2><p className="bio">{translated(settings.bio,lang)}</p><div className="service-list">{t.services.map((service,i)=><div key={service}><span>0{i+1}</span><p>{service}</p><ArrowUpRight size={18}/></div>)}</div></div></section>
 <section className="contact section-wrap"><p className="eyebrow">03 / LET’S CREATE SOMETHING</p><h2>{t.contactTitle}</h2><div className="contact-bottom"><p>{t.contact}</p><a href={`mailto:${settings.email}`} className="contact-email">{settings.email}<ArrowUpRight size={26}/></a></div></section>
 </main><Footer lang={lang}/></div>;
}
