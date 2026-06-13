import { useEffect, useRef } from 'react';
import mangaCSS from './styles.js';
import ReaderNav from './components/ReaderNav.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Cover from './pages/Cover.jsx';
import Page1Intro from './pages/Page1Intro.jsx';
import Page2Battles from './pages/Page2Battles.jsx';
import Page4Stats from './pages/Page4Stats.jsx';
import Page5Timeline from './pages/Page5Timeline.jsx';
import Page6Omake from './pages/Page6Omake.jsx';
import BackCover from './pages/BackCover.jsx';

const tone = true;
const tilt = true;
const motion = true;

export default function MangaPortfolio() {
  const rootRef = useRef(null);
  const tiltCls = (c) => tilt ? c : '';

  useEffect(() => {
    if (!motion || !rootRef.current) return;
    const el = rootRef.current;
    const scroller = el.querySelector('.mg-scroll');
    if (!scroller) return;

    let pending = Array.from(el.querySelectorAll('.mg-page'))
      .filter(p => !p.classList.contains('mg-in'));

    const check = () => {
      if (!pending.length) return;
      const sr = scroller.getBoundingClientRect();
      pending = pending.filter(p => {
        const r = p.getBoundingClientRect();
        const visible = r.top < sr.bottom - 60 && r.bottom > sr.top + 20;
        if (visible) { p.classList.add('mg-in'); return false; }
        return true;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; check(); });
    };

    check();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={`mg-root ${motion ? 'mg-anim' : ''}`} ref={rootRef}>
      <style>{mangaCSS}</style>
      <ScrollProgress />
      <div className="mg-scroll">
        <ReaderNav />
        <Cover tiltCls={tiltCls} />
        <Page1Intro tone={tone} tiltCls={tiltCls} />
        <Page2Battles tone={tone} tiltCls={tiltCls} />
        <Page4Stats tone={tone} tiltCls={tiltCls} />
        <Page5Timeline tone={tone} tiltCls={tiltCls} />
        <Page6Omake tiltCls={tiltCls} />
        <BackCover tiltCls={tiltCls} />
      </div>
    </div>
  );
}
