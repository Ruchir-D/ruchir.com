export default function MgInkSql() {
  return (
    <svg className="mg-ink-svg" viewBox="0 0 160 110" style={{ width: '100%', height: 'auto' }}>
      <ellipse cx="55" cy="26" rx="36" ry="12" fill="#f3edde" stroke="#1b181c" strokeWidth="3" />
      <path d="M19,26 L19,74 A36,12 0 0,0 91,74 L91,26" fill="#f3edde" stroke="#1b181c" strokeWidth="3" />
      <path d="M19,42 A36,12 0 0,0 91,42 M19,58 A36,12 0 0,0 91,58" fill="none" stroke="#1b181c" strokeWidth="2" />
      <g fontFamily="JetBrains Mono" fontSize="9" fill="#1b181c">
        <text x="104" y="34">SELECT</text>
        <text x="104" y="48">FROM</text>
        <text x="104" y="62">WHERE</text>
      </g>
      <line x1="98" y1="70" x2="146" y2="70" stroke="#e23b2e" strokeWidth="3" />
      <text x="104" y="88" fontFamily="Archivo Black" fontSize="9" fill="#e23b2e">12.4K ROWS!</text>
    </svg>
  );
}
