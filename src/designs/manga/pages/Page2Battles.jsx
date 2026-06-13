import D from '../../../data/portfolio.js';
import MgInkPipeline from '../illustrations/MgInkPipeline.jsx';
import MgInkJava from '../illustrations/MgInkJava.jsx';
import MgInkPython from '../illustrations/MgInkPython.jsx';
import MgInkBuilder from '../illustrations/MgInkBuilder.jsx';
import MgInkSql from '../illustrations/MgInkSql.jsx';

const battles = [
  { p: D.projects[1], sfx: 'ドンッ', art: <MgInkJava />,    verdict: 'VICTORY — JVM tamed in WASM' },
  { p: D.projects[2], sfx: 'シュッ', art: <MgInkPython />,  verdict: 'VICTORY — zero-install notebooks' },
  { p: D.projects[3], sfx: 'ガシャ', art: <MgInkBuilder />, verdict: 'VICTORY — drag, drop, deploy' },
  { p: D.projects[4], sfx: 'ゴゴゴ', art: <MgInkSql />,     verdict: 'FIRST BATTLE — where it began' },
];

export default function Page2Battles({ tone, tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-p2">
      <div className={`mg-page ${tiltCls('tilt-l')}`}>
        <div className="mg-chapter">
          <span className="no">PAGES 2–3</span>
          <span className="t">Battle Log — Five IDEs</span>
          <span className="jp">戦闘記録</span>
          <span className="rule" />
        </div>

        {/* spread panel — current arc */}
        <div className={`mg-panel ${tone ? 'mg-tone' : ''}`} style={{ marginBottom: 14, padding: 0, overflow: 'visible' }}>
          <div className="mg-spread-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0 }}>
            <div style={{ padding: '22px 24px', borderRight: '3px solid var(--ink)' }}>
              <div style={{ display: 'inline-block', background: 'var(--accent)', color: 'var(--paper)', fontFamily: 'Archivo Black,sans-serif', fontSize: 11, letterSpacing: '.25em', padding: '4px 10px', marginBottom: 12 }}>
                CURRENT ARC · {D.projects[0].year}
              </div>
              <div style={{ fontFamily: 'Archivo Black,sans-serif', fontSize: 30, lineHeight: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                {D.projects[0].name}
              </div>
              <div style={{ fontFamily: 'Noto Sans JP,sans-serif', fontSize: 11, letterSpacing: '.35em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
                {D.projects[0].nameJp} — 必殺技
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 14 }}>
                {D.projects[0].summary}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {D.projects[0].stack.map(s => (
                  <span key={s} style={{ fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', border: '2px solid var(--ink)', padding: '2px 8px', fontWeight: 700 }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', padding: '18px 14px 10px' }}>
              <MgInkPipeline tone={tone} />
              <div className="mg-sfx accent rumble" style={{ right: 8, top: -16, fontSize: 44, transform: 'rotate(4deg)' }}>ゴゴゴゴ</div>
              <div style={{ position: 'absolute', left: 18, bottom: 10, fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                fig.1 — the block pipeline technique
              </div>
            </div>
          </div>
        </div>

        {/* four battle panels */}
        <div className="mg-panels" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {battles.map(({ p, sfx, art, verdict }) => (
            <div key={p.id} className="mg-panel mg-battle-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 12, minHeight: 170 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>
                  {p.status} · {p.year}
                </div>
                <div style={{ fontFamily: 'Archivo Black,sans-serif', fontSize: 19, lineHeight: 1.05, textTransform: 'uppercase', marginBottom: 4 }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: 'Noto Sans JP,sans-serif', fontSize: 10, letterSpacing: '.3em', color: 'var(--ink-soft)', marginBottom: 10 }}>
                  {p.nameJp}
                </div>
                <div style={{ fontSize: 11.5, lineHeight: 1.6, marginBottom: 10 }}>{p.summary}</div>
                <div className="mg-narr" style={{ fontSize: 10, padding: '4px 9px' }}>{verdict}</div>
              </div>
              <div style={{ position: 'relative', alignSelf: 'center' }}>
                {art}
                <div className="mg-sfx" style={{ right: -4, top: -14, fontSize: 24, transform: 'rotate(8deg)' }}>{sfx}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mg-pageno">2–3</div>
      </div>
    </div>
  );
}
