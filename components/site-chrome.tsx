'use client';
import { useEffect, useState } from 'react';
import { journalCopy } from '@/lib/journal';
import { Button } from '@/components/ui/button';
import { copy, localUrl, type Language } from '@/lib/portfolio';

export function useLanguage() {
  const [lang, setLang] = useState<Language>('zh');
  useEffect(() => {
    const restore = () => {
      const requested = new URLSearchParams(location.search).get('lang');
      let saved: string | null = null;
      try { saved = localStorage.getItem('tddd-language'); } catch { /* Storage is optional. */ }
      const value = requested || saved;
      if (value === 'zh' || value === 'en' || value === 'ja') setLang(value);
    };
    restore();addEventListener('popstate',restore);return()=>removeEventListener('popstate',restore);
  }, []);
  useEffect(() => { document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : lang; }, [lang]);
  function changeLanguage(value: Language) {
    setLang(value);
    try { localStorage.setItem('tddd-language',value); } catch { /* Storage is optional. */ }
    const url = new URL(location.href);url.searchParams.set('lang',value);history.replaceState(null,'',url);
  }
  return [lang, changeLanguage] as const;
}

export function Header({lang,onLanguage,detail=false}:{lang:Language;onLanguage:(lang:Language)=>void;detail?:boolean}) {
  const t = copy[lang];
  const home = detail ? `${localUrl('')}?lang=${lang}` : '';
  return <><a className="skip-link" href={detail ? '#main' : '#works'}>{t.skip}</a><header className="site-header">
    <a className="wordmark" href={`${home}#top`} aria-label="TDDD — Home">TDDD</a>
    <nav aria-label={t.works}><a href={`${home}#works`}>{t.works}</a><a href={`${localUrl('journal/')}?lang=${lang}`}>{journalCopy[lang].title}</a><a href={`${home}#about`}>{t.about}</a></nav>
    <div className="language-switch" role="group" aria-label={t.language}>{(['zh','en','ja'] as const).map(value=><Button key={value} variant="ghost" className="language-button" aria-pressed={lang===value} lang={value==='zh'?'zh-Hant':value} onClick={()=>onLanguage(value)}>{value==='zh'?'中':value==='en'?'EN':'日'}</Button>)}</div>
  </header></>;
}
export function Footer({lang}:{lang:Language}) {
  const t=copy[lang];
  return <footer className="section-wrap site-footer"><a className="footer-wordmark" href="#top">TDDD</a><div><p>© {new Date().getFullYear()} TDDD · 泰迪迪迪</p><p>{t.footer}</p></div><a href="#top" className="top-link">{t.up} ↑</a></footer>;
}
