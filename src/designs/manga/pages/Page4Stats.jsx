import D from '../../../data/portfolio.js';

const ranks = [
  { nm: 'TypeScript / JavaScript', rank: 'S', fill: 5 },
  { nm: 'React & friends',         rank: 'S', fill: 5 },
  { nm: 'WASM & browser runtimes', rank: 'A', fill: 4 },
  { nm: 'Python · Java · SQL',     rank: 'A', fill: 4 },
  { nm: 'Node graphs & compilers', rank: 'A', fill: 4 },
  { nm: 'Rust (training arc)',      rank: 'B', fill: 2 },
];

export default function Page4Stats({ tone, tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-p4">
      <div className={`mg-page ${tiltCls('tilt-r')}`}>
        <div className="mg-chapter">
          <span className="no">PAGE 4</span>
          <span className="t">Character Stats</span>
          <span className="jp">能力値</span>
          <span className="rule" />
        </div>
        <div className="mg-stats">
          <div className={`mg-panel ${tone ? 'mg-tone' : ''}`}>
            <div style={{ fontFamily: 'Archivo Black,sans-serif', fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12 }}>
              ABILITY RANKINGS
            </div>
            {ranks.map(r => (
              <div key={r.nm} className="mg-stat-row">
                <span className={`mg-rank ${r.rank}`}>{r.rank}</span>
                <span className="nm">{r.nm}</span>
                <span className="meter">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={i < r.fill ? (r.rank === 'S' ? 'fa' : 'f') : ''} />
                  ))}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="mg-special">
              <div className="lbl">必殺技 — SPECIAL MOVE</div>
              <div className="nm">BLOCK PIPELINE <span>!!</span></div>
              <div className="desc">
                Connects any model, prompt, transform or branch into a living graph — visual, inspectable, and fast enough to feel like play. Currently being perfected in the AI IDE arc.
              </div>
              <div className="mg-sfx" style={{ right: 6, bottom: 2, fontSize: 30, color: 'var(--accent)', WebkitTextStroke: '1px #f3edde' }}>バンッ</div>
            </div>
            <div className="mg-panel shaded" style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Archivo Black,sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                EQUIPMENT
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {[...D.skills.frontend, ...D.skills.runtimes, ...D.skills.tools].map(s => (
                  <span key={s} style={{ fontSize: 10.5, border: '2px solid var(--ink)', padding: '3px 9px', fontWeight: 700, background: 'var(--paper)' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mg-pageno">4</div>
      </div>
    </div>
  );
}
