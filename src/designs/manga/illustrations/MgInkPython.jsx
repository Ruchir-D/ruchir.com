export default function MgInkPython() {
  return (
    <svg className="mg-ink-svg" viewBox="0 0 160 110" style={{ width: '100%', height: 'auto' }}>
      <rect x="10" y="12" width="140" height="86" fill="#f3edde" stroke="#1b181c" strokeWidth="3" />
      <polyline
        points="22,80 42,58 62,68 86,38 108,50 134,26"
        fill="none" stroke="#e23b2e" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <g fill="#1b181c">
        <circle cx="42" cy="58" r="4" />
        <circle cx="86" cy="38" r="4" />
        <circle cx="134" cy="26" r="4" />
      </g>
      <line x1="22" y1="86" x2="138" y2="86" stroke="#1b181c" strokeWidth="2.5" />
      <line x1="22" y1="86" x2="22" y2="20" stroke="#1b181c" strokeWidth="2.5" />
    </svg>
  );
}
