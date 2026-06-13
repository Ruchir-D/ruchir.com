import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.querySelector('.mg-scroll');
    if (!el) return;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setPct(scrollTop / (scrollHeight - clientHeight) * 100);
    };
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 'var(--nav-h, 60px)', left: 0, zIndex: 50,
      height: 3, width: `${pct}%`,
      background: 'var(--accent)',
      boxShadow: '0 0 10px var(--accent), 0 0 3px var(--accent)',
      transition: 'width .08s linear',
      pointerEvents: 'none',
    }} />
  );
}
