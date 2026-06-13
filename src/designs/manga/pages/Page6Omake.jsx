import D from '../../../data/portfolio.js';

export default function Page6Omake({ tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-p6">
      <div className={`mg-page ${tiltCls('tilt-r')}`}>
        <div className="mg-chapter">
          <span className="no">PAGE 6</span>
          <span className="t">Currently Airing</span>
          <span className="jp">現在</span>
          <span className="rule" />
        </div>
        <div className="mg-strip" style={{ marginBottom: 26 }}>
          {D.now.map((n, i) => (
            <div key={i} className="koma">
              <span className="k-no">{i + 1}コマ</span>
              <span className="k-txt">{n}</span>
              <span className="k-sub">— this week's panel</span>
            </div>
          ))}
        </div>
        <div className="mg-chapter" style={{ marginBottom: 16 }}>
          <span className="no">OMAKE</span>
          <span className="t">Off-panel</span>
          <span className="jp">おまけ</span>
          <span className="rule" />
        </div>
        <div className="mg-panel shaded mg-omake-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 12.5, lineHeight: 2.1 }}>
            <li><b style={{ color: 'var(--accent)' }}>★</b> Rewatching <b>Cowboy Bebop</b> for the nth time</li>
            <li><b style={{ color: 'var(--accent)' }}>★</b> Losing at chess.com blitz</li>
            <li><b style={{ color: 'var(--accent)' }}>★</b> Writing toy compilers at 2am</li>
            <li><b style={{ color: 'var(--accent)' }}>★</b> Failing latte art</li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div className="mg-bubble shout" style={{ fontSize: 14 }}>
              AUTHOR'S NOTE:<br />
              <span style={{ color: 'var(--accent)' }}>deadlines are a boss fight</span>
            </div>
          </div>
        </div>
        <div className="mg-pageno">6</div>
      </div>
    </div>
  );
}
