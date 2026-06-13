export default function MgInkJava() {
  return (
    <svg className="mg-ink-svg" viewBox="0 0 160 110" style={{ width: '100%', height: 'auto' }}>
      <path d="M40,46 h64 v34 a16,16 0 0 1 -16,16 h-32 a16,16 0 0 1 -16,-16 z" fill="#f3edde" stroke="#1b181c" strokeWidth="3.5" />
      <path d="M104,54 h14 a12,12 0 0 1 0,26 h-14" fill="none" stroke="#1b181c" strokeWidth="3.5" />
      <path d="M60,36 c-6,-8 6,-10 0,-18 M78,36 c-6,-8 6,-10 0,-18" fill="none" stroke="#1b181c" strokeWidth="3" strokeLinecap="round" />
      <text x="72" y="74" textAnchor="middle" fontFamily="Archivo Black" fontSize="12" fill="#1b181c">JVM</text>
      <text x="72" y="104" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#e23b2e">compiled in-browser · 0.4s</text>
    </svg>
  );
}
