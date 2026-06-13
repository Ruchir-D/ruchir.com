import D from '../../../data/portfolio.js';

export default function Page1Intro({ tone, tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-p1">
      <div className={`mg-page ${tiltCls('tilt-r')}`}>
        <div className="mg-chapter">
          <span className="no">PAGE 1</span>
          <span className="t">The Setup</span>
          <span className="jp">序章</span>
          <span className="rule" />
        </div>
        <div className="mg-panels" style={{ gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: 'auto auto' }}>
          <div className={`mg-panel ${tone ? 'mg-tone' : ''}`} style={{ minHeight: 190 }}>
            <div className="mg-narr" style={{ marginBottom: 14 }}>
              Two years ago. A fresh engineer stares at a SQL workbench install wizard…{' '}
              <b>43 minutes remaining.</b>
            </div>
            <div className="mg-bubble" style={{ marginLeft: 30 }}>
              What if the IDE just…<br />lived in the{' '}
              <span style={{ color: 'var(--accent)' }}>BROWSER?!</span>
            </div>
            <div className="mg-sfx" style={{ right: 10, bottom: 6, fontSize: 30, transform: 'rotate(-6deg)' }}>ピカッ</div>
          </div>
          <div className="mg-panel black" style={{ minHeight: 190, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'Noto Sans JP,sans-serif', letterSpacing: '.4em', color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>ナレーション</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              And so it began. No installers. No "works on my machine." Just a URL — and everything a developer needs behind it.
            </div>
          </div>
          <div className="mg-panel shaded" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 18 }}>
            <div>
              <div className="mg-narr" style={{ marginBottom: 10 }}>His obsession, in his own words:</div>
              <div style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 560 }}>{D.about.en}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 16px' }}>
              <div className="mg-shout" style={{ fontSize: 42, color: 'var(--accent)', lineHeight: 1.2 }}>タタタ</div>
              <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>typing intensifies</div>
            </div>
          </div>
        </div>
        <div className="mg-pageno">1</div>
      </div>
    </div>
  );
}
