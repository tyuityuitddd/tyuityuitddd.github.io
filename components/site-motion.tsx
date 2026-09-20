'use client';

import { useEffect, useRef } from 'react';

// Content is visible without JavaScript. Entrance animations are applied only
// after intersection, so loading failures cannot leave artwork hidden.
const entrances = [
  '.section-heading', '.work-card', '.journal-date', '.journal-card-link',
  '.journal-masthead', '.journal-article-head', '.journal-article > article > .journal-cover',
  '.journal-body section', '.about-visual', '.about-copy',
  '.contact > .eyebrow', '.contact > h2', '.contact-bottom', '.detail-heading', '.detail-figure',
].join(',');

export function SiteMotion() {
  const glow = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
    const seen = new WeakSet<Element>();
    const active = new Map<Element, Animation>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let pointerVisible = false;
    let x = 0, y = 0, px = 0, py = 0;
    let magnet: HTMLElement | null = null;

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
    };
    const render = () => {
      frame = 0;
      if (reduced.matches || document.hidden) return;
      const total = root.scrollHeight - innerHeight;
      root.style.setProperty('--page-progress', String(total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0));
      if (!pointerVisible || !fine.matches) return;
      px += (x - px) * 0.18;
      py += (y - py) * 0.18;
      if (glow.current) glow.current.style.transform = `translate3d(${px}px,${py}px,0)`;
      if (cursor.current) cursor.current.style.transform = `translate3d(${x + 22}px,${y + 22}px,0)`;
      root.style.setProperty('--pointer-x', `${(px / innerWidth - 0.5) * 32}px`);
      root.style.setProperty('--pointer-y', `${(py / innerHeight - 0.5) * 24}px`);
      if (Math.abs(x - px) + Math.abs(y - py) > 0.2) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onPointer = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType !== 'mouse') return;
      if (document.querySelector('[role="dialog"]')) { resetPointer(); return; }
      x = event.clientX; y = event.clientY;
      if (!pointerVisible) { px = x; py = y; }
      pointerVisible = true;
      glow.current?.classList.add('is-active');
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest('.work-card');
      cursor.current?.classList.toggle('is-active', !!card);
      if (card && cursor.current) {
        const label = root.lang === 'ja' ? '見る ↗' : root.lang === 'en' ? 'VIEW ↗' : '查看 ↗';
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
      if (!observer || reduced.matches) return;
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
      root.classList.toggle('motion-enabled', !reduced.matches);
      if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
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
          const animation = element.animate([
            { opacity: 0, transform: desktop ? offset : 'none' },
            { opacity: 1, transform: 'none' },
          ], { duration: desktop ? 680 : 350, delay: desktop ? (order++ % 3) * 70 : 0, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
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
    return () => {
      observer?.disconnect(); mutations.disconnect();
      for (const animation of active.values()) animation.cancel();
      cancelAnimationFrame(frame); resetPointer();
      root.classList.remove('motion-enabled'); root.style.removeProperty('--page-progress');
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
    };
  }, []);

  return <div className="motion-layer" aria-hidden="true">
    <div className="pointer-glow" ref={glow}/>
    <div className="work-cursor" ref={cursor}/>
  </div>;
}
