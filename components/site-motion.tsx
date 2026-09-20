'use client';

import { useEffect, useRef, useState } from 'react';
import { chooseMotion, motionAllowed } from '@/lib/motion';
import { Pause, Play } from 'lucide-react';

// Content is visible without JavaScript. Entrance animations are applied only
// after intersection, so loading failures cannot leave artwork hidden.
const entrances = [
  '.hero-copy',
  '.section-heading', '.work-card', '.journal-date', '.journal-card-link',
  '.journal-masthead', '.journal-article-head', '.journal-article > article > .journal-cover',
  '.journal-body section', '.about-visual', '.about-copy',
  '.contact > .eyebrow', '.contact > h2', '.contact-bottom', '.detail-heading', '.detail-figure',
].join(',');

export function SiteMotion() {
  const glow = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [language, setLanguage] = useState('zh-Hant');
  const [systemDefault, setSystemDefault] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    try {
      const saved = localStorage.getItem('tddd-motion');
      if (saved === 'on' || saved === 'off') root.dataset.motion = saved;
    } catch { /* Storage is optional. */ }
    const seen = new WeakSet<Element>();
    const active = new Map<Element, Animation>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let pointerVisible = false;
    let x = 0, y = 0, px = 0, py = 0;
    let magnet: HTMLElement | null = null;
    let tilted: HTMLElement | null = null;

    const clearTilt = () => {
      tilted?.style.removeProperty('--card-rx');
      tilted?.style.removeProperty('--card-ry');
      tilted = null;
    };

    const clearMagnet = () => {
      magnet?.style.removeProperty('translate');
      magnet = null;
    };
    const resetPointer = () => {
      pointerVisible = false;
      glow.current?.classList.remove('is-active');
      cursor.current?.classList.remove('is-active');
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
      clearMagnet();
      clearTilt();
    };
    const render = () => {
      frame = 0;
      if (!motionAllowed() || document.hidden) return;
      const total = root.scrollHeight - innerHeight;
      root.style.setProperty('--page-progress', String(total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0));
      if (!pointerVisible || !fine.matches) return;
      px += (x - px) * 0.18;
      py += (y - py) * 0.18;
      if (glow.current) glow.current.style.transform = `translate3d(${px}px,${py}px,0)`;
      if (cursor.current) cursor.current.style.transform = `translate3d(${Math.min(x + 22, innerWidth - 74)}px,${Math.min(y + 22, innerHeight - 50)}px,0)`;
      root.style.setProperty('--pointer-x', `${(px / innerWidth - 0.5) * 52}px`);
      root.style.setProperty('--pointer-y', `${(py / innerHeight - 0.5) * 40}px`);
      if (Math.abs(x - px) + Math.abs(y - py) > 0.2) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onPointer = (event: PointerEvent) => {
      if (!motionAllowed() || !fine.matches || event.pointerType !== 'mouse') return;
      if (document.querySelector('[role="dialog"]')) { resetPointer(); return; }
      x = event.clientX; y = event.clientY;
      if (!pointerVisible) { px = x; py = y; }
      pointerVisible = true;
      glow.current?.classList.add('is-active');
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest<HTMLElement>('.work-card, .hero-art');
      const nextTilt = target?.closest<HTMLElement>('.work-card') || null;
      if (nextTilt !== tilted) { clearTilt(); tilted = nextTilt; }
      if (tilted) {
        const bounds = tilted.getBoundingClientRect();
        tilted.style.setProperty('--card-rx', `${(0.5 - (y-bounds.top)/bounds.height)*5}deg`);
        tilted.style.setProperty('--card-ry', `${((x-bounds.left)/bounds.width-0.5)*7}deg`);
      }
      cursor.current?.classList.toggle('is-active', !!card);
      if (card && cursor.current) {
        const label = root.lang === 'ja' ? '見る' : root.lang === 'en' ? 'VIEW' : '查看';
        if (cursor.current.textContent !== label) cursor.current.textContent = label;
      }
      const next = target?.closest<HTMLElement>('.hero-copy .pill-link, .contact-email') || null;
      if (next !== magnet) { clearMagnet(); magnet = next; }
      if (magnet) {
        const bounds = magnet.getBoundingClientRect();
        const dx = Math.max(-5, Math.min(5, (x - bounds.left - bounds.width / 2) * 0.06));
        const dy = Math.max(-4, Math.min(4, (y - bounds.top - bounds.height / 2) * 0.12));
        magnet.style.translate = `${dx}px ${dy}px`;
      }
      schedule();
    };
    const onScroll = () => {
      // Do not leave a card hint over a different section after scrolling.
      cursor.current?.classList.remove('is-active');
      clearMagnet();
      clearTilt();
      schedule();
    };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; resetPointer(); }
      else schedule();
    };
    const onKeyboard = () => { resetPointer(); };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (const [element, animation] of active) {
        if (element.contains(event.target)) { animation.cancel(); active.delete(element); }
      }
    };
    const register = (scope: Element) => {
      if (!observer || !motionAllowed()) return;
      const candidates = [...scope.querySelectorAll(entrances)];
      if (scope.matches(entrances)) candidates.unshift(scope);
      for (const element of candidates) {
        if (!seen.has(element)) { seen.add(element); observer.observe(element); }
      }
    };
    const configure = () => {
      observer?.disconnect();
      for (const animation of active.values()) animation.cancel();
      active.clear();
      cancelAnimationFrame(frame); frame = 0; resetPointer();
      const allowed = motionAllowed();
      root.classList.toggle('motion-enabled', allowed);
      root.classList.toggle('motion-off', !allowed);
      setEnabled(allowed);
      setSystemDefault(!root.dataset.motion);
      if (!allowed || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
      observer = new IntersectionObserver(entries => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          observer?.unobserve(element);
          if (element.contains(document.activeElement) || entry.boundingClientRect.top < 0) continue;
          let offset = 'translateY(24px)';
          if (element.matches('.journal-date')) offset = 'translateX(-14px)';
          if (element.matches('.about-visual')) offset = 'translateX(-28px)';
          if (element.matches('.about-copy')) offset = 'translateX(28px)';
          if (element.matches('.contact > h2')) offset = 'translateY(36px)';
          const desktop = fine.matches;
          const artwork = element.matches('.work-card, .about-visual, .detail-figure');
          const frames: Keyframe[] = artwork ? [
            { opacity: .35, clipPath: 'inset(0 0 16% 0)', transform: 'translateY(38px)' },
            { opacity: 1, clipPath: 'inset(0 0 -12% 0)', transform: 'none' },
          ] : [
            { opacity: 0, transform: desktop ? offset : 'translateY(12px)' },
            { opacity: 1, transform: 'none' },
          ];
          const animation = element.animate(frames, { duration: artwork ? 950 : 650, delay: (order++ % 2) * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
          active.set(element, animation);
          animation.onfinish = () => active.delete(element);
        }
      }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
      // Reconfigure must also restore observation for elements not yet seen.
      document.querySelectorAll(entrances).forEach(element => {
        seen.add(element); observer?.observe(element);
      });
      schedule();
    };
    configure();
    dispatchEvent(new Event('tddd-motion-change'));
    // Keep the button in sync with the existing three-language navigation.
    setLanguage(root.lang);
    const languageObserver = new MutationObserver(() => setLanguage(root.lang));
    languageObserver.observe(root, { attributes: true, attributeFilter: ['lang'] });
    const mutations = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof Element) register(node);
      }
      for (const [element, animation] of active) {
        if (!element.isConnected) { animation.cancel(); active.delete(element); }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', resetPointer);
    document.addEventListener('keydown', onKeyboard);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', resetPointer);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    reduced.addEventListener('change', configure);
    fine.addEventListener('change', configure);
    window.addEventListener('tddd-motion-change', configure);
    return () => {
      observer?.disconnect(); mutations.disconnect(); languageObserver.disconnect();
      for (const animation of active.values()) animation.cancel();
      cancelAnimationFrame(frame); resetPointer();
      root.classList.remove('motion-enabled', 'motion-off'); root.style.removeProperty('--page-progress');
      document.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', resetPointer);
      document.removeEventListener('keydown', onKeyboard);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', resetPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      reduced.removeEventListener('change', configure);
      fine.removeEventListener('change', configure);
      window.removeEventListener('tddd-motion-change', configure);
    };
  }, []);

  const labels = language === 'en'
    ? { on: 'Motion on', off: 'Enable motion', loading: 'Motion', stop: 'Turn off motion effects', start: 'Turn on motion effects', system: 'Reduced by your system preference. Click to enable for this website.' }
    : language === 'ja'
    ? { on: '動き：オン', off: '動きをオンに', loading: '動き', stop: 'アニメーションをオフにする', start: 'アニメーションをオンにする', system: 'システム設定により動きを抑えています。このサイトで有効にできます。' }
    : { on: '動態：已開啟', off: '開啟動態效果', loading: '動態效果', stop: '關閉動態效果', start: '開啟動態效果', system: '目前依系統設定減少動態；點此可為這個網站開啟效果。' };
  return <><div className="motion-layer" aria-hidden="true">
    <div className="pointer-glow" ref={glow}/>
    <div className="work-cursor" ref={cursor}/>
  </div><button type="button" className="motion-toggle" aria-pressed={enabled === true}
    aria-label={enabled ? labels.stop : labels.start}
    title={!enabled && systemDefault ? labels.system : enabled ? labels.stop : labels.start}
    disabled={enabled === null} onClick={() => chooseMotion(!enabled)}>
    <span aria-hidden="true">{enabled ? <Pause size={15}/> : <Play size={15}/>}</span>
    {enabled === null ? labels.loading : enabled ? labels.on : labels.off}
  </button></>;
}
