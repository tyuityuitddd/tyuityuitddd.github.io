'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import { Header, Footer, useLanguage } from './site-chrome';
import { ArtworkImage } from './artwork-image';
import { Button } from './ui/button';
import { localUrl, safeVideoLink, videoEmbed, type Language } from '@/lib/portfolio';
import { journalCopy, journalDate, type JournalPost } from '@/lib/journal';

export function JournalCards({posts,lang}:{posts:JournalPost[];lang:Language}) {
 const t=journalCopy[lang];
 return <div className="journal-list">{posts.map(post=><article key={post.slug} className="journal-card">
  <div className="journal-date"><time dateTime={post.date}>{journalDate(post.date,lang)}</time><span>GODOT / DEVLOG</span></div>
  <a className="journal-card-link" href={`${localUrl(`journal/${post.slug}/`)}?lang=${lang}`}>
   {post.coverImage&&<div className="journal-cover"><ArtworkImage image={post.coverImage} alt={post.coverAlt||post.title} sizes="(max-width: 760px) 90vw, 65vw" loading="lazy"/></div>}
   <div className="journal-tags">{post.tags?.map(tag=><span key={tag}>{tag}</span>)}</div>
   <h2>{post.title}</h2><p>{post.excerpt}</p><span className="journal-read">{t.read}<ArrowUpRight size={18}/></span>
  </a>
 </article>)}</div>;
}
export function JournalPreview({posts,lang}:{posts:JournalPost[];lang:Language}) {
 const t=journalCopy[lang];return <section className="journal-preview section-wrap"><div className="section-heading"><div><p className="eyebrow">GODOT / DEVELOPMENT JOURNAL</p><h2>{t.latest}<span className="accent">.</span></h2></div><a className="pill-link" href={`${localUrl('journal/')}?lang=${lang}`}>{t.all}<ArrowUpRight size={18}/></a></div>{posts.length?<JournalCards posts={posts.slice(0,3)} lang={lang}/>:<p>{t.empty}</p>}</section>;
}
export function JournalIndex({posts}:{posts:JournalPost[]}) {
 const [lang,changeLanguage]=useLanguage();const t=journalCopy[lang];
 useEffect(()=>{document.title=`${t.title} — TDDD`},[t.title]);
 return <div id="top" className="detail-page journal-page"><Header lang={lang} onLanguage={changeLanguage} detail/><main id="main" className="section-wrap journal-main"><div className="journal-masthead"><p className="eyebrow">TDDD / WORK IN PROGRESS</p><h1>{t.title}<span className="accent">.</span></h1><p>{t.intro}</p>{lang!=='zh'&&<small>{t.original}</small>}</div>{posts.length?<JournalCards posts={posts} lang={lang}/>:<p className="empty-state">{t.empty}</p>}</main><Footer lang={lang}/></div>;
}
function JournalVideo({url,title,lang}:{url:string;title:string;lang:Language}) {
 const [playing,setPlaying]=useState(false);const safe=safeVideoLink(url);const embed=videoEmbed(url);const label=journalCopy[lang].video;
 if(!safe)return null;
 return embed?<div className="video-frame journal-video">{playing?<iframe src={embed} title={`${title} — ${label}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<Button className="video-play" onClick={()=>setPlaying(true)}><Play size={32}/>{label}</Button>}</div>:<a href={safe} className="pill-link" target="_blank" rel="noreferrer">{label}<ArrowUpRight size={18}/></a>;
}
export function JournalArticle({post,next}:{post:JournalPost;next:JournalPost|null}) {
 const [lang,changeLanguage]=useLanguage();const t=journalCopy[lang];
 useEffect(()=>{document.title=`${post.title} — TDDD`},[post.title]);
 return <div id="top" className="detail-page journal-page"><Header lang={lang} onLanguage={changeLanguage} detail/><main id="main" className="section-wrap journal-article"><a className="back-link" href={`${localUrl('journal/')}?lang=${lang}`}><ArrowLeft size={17}/>{t.back}</a><article lang="zh-Hant"><header className="journal-article-head"><div className="journal-meta"><time dateTime={post.date}>{journalDate(post.date,lang)}</time><span>TDDD / GODOT</span></div><h1>{post.title}</h1><p className="journal-lede">{post.excerpt}</p><div className="journal-tags">{post.tags?.map(tag=><span key={tag}>{tag}</span>)}</div>{post.updated&&post.updated!==post.date&&<p className="journal-updated">{t.updated} <time dateTime={post.updated}>{journalDate(post.updated,lang)}</time></p>}</header>
 {post.coverImage&&<figure className="journal-cover"><ArtworkImage image={post.coverImage} alt={post.coverAlt||post.title} sizes="(max-width: 1000px) 90vw, 920px"/></figure>}
 <div className="journal-body">{post.sections.map((section,index)=><section key={index}>{section.heading&&<h2>{section.heading}</h2>}{section.text?.split(/\n\s*\n/).filter(Boolean).map((paragraph,i)=><p key={i}>{paragraph}</p>)}{section.artwork&&<figure><ArtworkImage image={section.artwork} alt={section.alt||post.title} sizes="(max-width: 1000px) 90vw, 920px" loading="lazy"/>{section.caption&&<figcaption>{section.caption}</figcaption>}</figure>}{section.video&&<JournalVideo url={section.video} title={post.title} lang={lang}/>}</section>)}</div></article>
 {next&&<a className="journal-next" href={`${localUrl(`journal/${next.slug}/`)}?lang=${lang}`}><span>{t.next}</span><h2>{next.title}</h2><ArrowUpRight size={24}/></a>}
 </main><Footer lang={lang}/></div>;
}
