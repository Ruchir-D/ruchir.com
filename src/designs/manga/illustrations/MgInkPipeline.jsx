import { useState, useEffect } from 'react';

export default function MgInkPipeline({ tone }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dash = -(t * 22);

  return (
    <svg className="mg-ink-svg" viewBox="0 0 560 240" style={{ width: '100%', height: 'auto' }}>
      <g fill="none" strokeLinecap="round">
        <path d="M96,70 C150,70 150,118 208,118" stroke="#1b181c" strokeWidth="3" />
        <path d="M96,178 C150,178 150,124 208,124" stroke="#1b181c" strokeWidth="3" />
        <path d="M312,120 C350,120 354,120 392,120" stroke="#e23b2e" strokeWidth="4" strokeDasharray="10 8" strokeDashoffset={dash} />
        <path d="M312,132 C340,132 344,176 380,176 L392,176" stroke="#1b181c" strokeWidth="2.5" />
        <path d="M468,176 C490,176 484,134 500,128" stroke="#1b181c" strokeWidth="2.5" />
      </g>
      <g>
        <rect x="14" y="44" width="82" height="52" fill="#f3edde" stroke="#1b181c" strokeWidth="3.5" />
        <rect x="20" y="50" width="70" height="9" fill="#1b181c" />
        <text x="55" y="84" textAnchor="middle" fontFamily="Archivo Black" fontSize="13" fill="#1b181c">SRC</text>

        <rect x="14" y="152" width="82" height="52" fill="#f3edde" stroke="#1b181c" strokeWidth="3.5" />
        <rect x="20" y="158" width="70" height="9" fill="#1b181c" />
        <text x="55" y="192" textAnchor="middle" fontFamily="Archivo Black" fontSize="13" fill="#1b181c">DOC</text>

        <rect x="208" y="92" width="104" height="62" fill="#e23b2e" stroke="#1b181c" strokeWidth="4" transform="rotate(-1 260 123)" />
        <text x="260" y="118" textAnchor="middle" fontFamily="Archivo Black" fontSize="15" fill="#f3edde">LLM</text>
        <text x="260" y="138" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#f3edde">temp 0.3 · 8k</text>

        <rect x="392" y="96" width="76" height="48" fill="#f3edde" stroke="#1b181c" strokeWidth="3.5" />
        <text x="430" y="125" textAnchor="middle" fontFamily="Archivo Black" fontSize="12" fill="#1b181c">OUT</text>

        <rect x="392" y="156" width="76" height="42" fill="#f3edde" stroke="#1b181c" strokeWidth="3" />
        <text x="430" y="182" textAnchor="middle" fontFamily="Archivo Black" fontSize="10" fill="#1b181c">FORMAT</text>

        <circle cx="514" cy="122" r="16" fill="#1b181c" />
        <text x="514" y="127" textAnchor="middle" fontFamily="Archivo Black" fontSize="11" fill="#f3edde">!!</text>
      </g>
      <g stroke="#1b181c" strokeWidth="2">
        <line x1="196" y1="76" x2="212" y2="88" />
        <line x1="324" y1="86" x2="310" y2="96" />
        <line x1="200" y1="166" x2="214" y2="156" />
        <line x1="330" y1="160" x2="316" y2="152" />
      </g>
      {tone && <rect x="0" y="0" width="560" height="240" fill="url(#mgtone)" opacity=".5" />}
      <defs>
        <pattern id="mgtone" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="rgba(27,24,28,.22)" />
        </pattern>
      </defs>
    </svg>
  );
}
