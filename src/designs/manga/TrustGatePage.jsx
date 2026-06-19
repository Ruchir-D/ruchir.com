import { useState, useCallback } from 'react';
import { scan } from '@trustgate/kernel';
import { Link } from 'react-router-dom';
import mangaCSS from './styles.js';

const RISK = {
  low:    { color: '#2a7d46', label: 'CLEAR',   sfx: 'セーフ！',  jp: '安全', narr: 'Package passed all checks. Safe to proceed.' },
  medium: { color: '#c47a0a', label: 'CAUTION', sfx: '注意！',    jp: '警戒', narr: 'Suspicious signals detected. Review before trusting.' },
  high:   { color: '#e23b2e', label: 'DANGER',  sfx: '危険！！',  jp: '危険', narr: 'High-risk package. Do not install without manual review.' },
};

const ECOSYSTEMS = ['npm', 'pypi', 'mcp'];

const TG_CSS = `
.tg-page { min-height: 80vh; }
.tg-back {
  display: inline-flex; align-items: center; gap: 7px;
  color: var(--ink-soft); text-decoration: none;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  margin-bottom: 18px; transition: .12s;
}
.tg-back:hover { color: var(--accent); }
.tg-input {
  width: 100%;
  background: var(--paper);
  border: 2.5px solid var(--ink);
  color: var(--ink);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 13px;
  padding: 9px 12px;
  outline: none;
}
.tg-input:focus { border-color: var(--accent); }
.tg-input::placeholder { color: var(--ink-soft); opacity: 0.5; }
.tg-select {
  width: 100%;
  background: var(--paper);
  border: 2.5px solid var(--ink);
  color: var(--ink);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  padding: 9px 10px;
  outline: none;
  appearance: none;
  cursor: pointer;
}
.tg-select:focus { border-color: var(--accent); }
.tg-scan-btn {
  background: var(--ink);
  color: var(--paper);
  border: 2.5px solid var(--ink);
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px;
  letter-spacing: .2em;
  padding: 9px 24px;
  cursor: pointer;
  white-space: nowrap;
  transition: .1s;
  align-self: flex-end;
}
.tg-scan-btn:hover:not(:disabled) { background: var(--accent); border-color: var(--accent); }
.tg-scan-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.tg-scanning {
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 0 4px; gap: 2px;
}
.tg-scanning-label {
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px; letter-spacing: .3em; text-transform: uppercase;
  color: var(--accent);
  animation: tg-blink .65s step-end infinite;
}
@keyframes tg-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
.tg-risk-banner {
  display: flex; justify-content: space-between; align-items: center;
  border: 3px solid; padding: 22px 28px; gap: 24px;
  margin-bottom: 16px;
}
.tg-risk-level {
  font-family: 'Archivo Black', sans-serif;
  font-size: 40px; line-height: 1; text-transform: uppercase; margin-bottom: 2px;
}
.tg-risk-score {
  display: flex; align-items: baseline; gap: 8px; margin-top: 10px;
}
.tg-risk-number {
  font-family: 'Archivo Black', sans-serif;
  font-size: 52px; line-height: 1;
}
.tg-risk-denom {
  font-size: 10px; color: var(--ink-soft); line-height: 1.4;
}
.tg-sfx {
  font-family: 'Reggae One', 'Noto Sans JP', sans-serif;
  font-size: 56px; line-height: 1;
  transform: rotate(-6deg); display: block;
}
.tg-signals-header {
  font-size: 9px; letter-spacing: .3em; text-transform: uppercase;
  color: var(--ink-soft); margin-bottom: 10px;
}
.tg-signal {
  border-left: 3px solid var(--ink-soft);
  padding: 8px 14px;
  background: rgba(27,24,28,.04);
  margin-bottom: 8px;
}
.tg-signal-top {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;
}
.tg-signal-name {
  font-family: 'Archivo Black', sans-serif;
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
}
.tg-signal-weight {
  font-size: 9px; font-weight: 700; letter-spacing: .18em;
}
.tg-signal-reason {
  font-size: 11.5px; color: var(--ink-soft); line-height: 1.55;
}
.tg-signal-meta {
  font-size: 10px; color: var(--ink-soft); margin-top: 4px;
  font-style: italic;
}
.tg-timestamp {
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  color: var(--ink-soft); text-align: right; margin-top: 18px;
}
.tg-idle {
  text-align: center; padding: 32px 16px;
}
.tg-idle-jp {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 12px; letter-spacing: .25em; color: var(--ink-soft);
  display: block; margin-top: 6px;
}
`;

export default function TrustGatePage() {
  const [pkg, setPkg]       = useState('');
  const [eco, setEco]       = useState('npm');
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [error, setError]   = useState(null);

  const handleScan = useCallback(async (e) => {
    e.preventDefault();
    const id = pkg.trim();
    if (!id) return;
    setLoading(true);
    setVerdict(null);
    setError(null);
    try {
      const v = await scan(id, eco);
      setVerdict(v);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [pkg, eco]);

  const risk = verdict ? RISK[verdict.riskLevel] : null;

  return (
    <div className="mg-root">
      <style>{mangaCSS}</style>
      <style>{TG_CSS}</style>
      <div className="mg-scroll">
        <div className="mg-pagewrap">
          <div className="mg-page tg-page">

            <Link to="/" className="tg-back">← Back to portfolio</Link>

            {/* Chapter header */}
            <div className="mg-chapter">
              <span className="no">TOOL</span>
              <span className="t">TrustGate — Package Scanner</span>
              <span className="jp">パッケージ信頼スキャナー</span>
              <span className="rule" />
            </div>

            {/* Input panel */}
            <div className="mg-panel mg-tone" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, marginBottom: 12 }}>
                MISSION BRIEFING — パッケージを入力
              </div>
              <form onSubmit={handleScan} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: 6, color: 'var(--ink-soft)' }}>
                    PACKAGE IDENTIFIER
                  </label>
                  <input
                    className="tg-input"
                    value={pkg}
                    onChange={e => setPkg(e.target.value)}
                    placeholder="lodash · requests · owner/repo"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <div style={{ minWidth: 90 }}>
                  <label style={{ display: 'block', fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: 6, color: 'var(--ink-soft)' }}>
                    ECOSYSTEM
                  </label>
                  <select className="tg-select" value={eco} onChange={e => setEco(e.target.value)} disabled={loading}>
                    {ECOSYSTEMS.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
                  </select>
                </div>
                <button className="tg-scan-btn" type="submit" disabled={loading || !pkg.trim()}>
                  {loading ? 'SCANNING…' : '>> SCAN'}
                </button>
              </form>

              {loading && (
                <div className="tg-scanning">
                  <div className="tg-scanning-label">QUERYING REGISTRY…</div>
                  <div className="mg-sfx accent" style={{ fontSize: 26, position: 'static', marginTop: 2 }}>ビビビビ</div>
                </div>
              )}
            </div>

            {/* Error state */}
            {error && (
              <div className="mg-narr" style={{ color: 'var(--accent)', marginBottom: 16 }}>
                SCAN ERROR: {error}
              </div>
            )}

            {/* Verdict */}
            {verdict && risk && (
              <>
                {/* Risk banner */}
                <div className="tg-risk-banner mg-tone-accent" style={{ borderColor: risk.color }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: '.28em', color: risk.color, fontWeight: 700, marginBottom: 4 }}>
                      {verdict.ecosystem.toUpperCase()} · {verdict.identifier}
                    </div>
                    <div className="tg-risk-level" style={{ color: risk.color }}>{risk.label}</div>
                    <div style={{ fontFamily: 'Noto Sans JP,sans-serif', fontSize: 11, letterSpacing: '.3em', color: risk.color }}>{risk.jp}</div>
                    <div className="tg-risk-score">
                      <div className="tg-risk-number" style={{ color: risk.color }}>{verdict.score}</div>
                      <div className="tg-risk-denom">RISK<br />SCORE<br />/100</div>
                    </div>
                  </div>
                  <div className="tg-sfx" style={{ color: risk.color }}>{risk.sfx}</div>
                </div>

                {/* Narration */}
                <div className="mg-narr" style={{ marginBottom: 16 }}>{risk.narr}</div>

                {/* Signal list */}
                {verdict.signals.length > 0 ? (
                  <>
                    <div className="tg-signals-header">SIGNALS DETECTED — 検出シグナル ({verdict.signals.length})</div>
                    {verdict.signals.map(s => (
                      <div key={s.checkName} className="tg-signal" style={{ borderLeftColor: s.passed ? 'var(--ink-soft)' : risk.color }}>
                        <div className="tg-signal-top">
                          <div className="tg-signal-name">
                            {s.passed ? '✓' : '✗'} {s.checkName}
                          </div>
                          {s.weight > 0 && (
                            <div className="tg-signal-weight" style={{ color: risk.color }}>+{s.weight} RISK</div>
                          )}
                        </div>
                        <div className="tg-signal-reason">{s.reason}</div>
                        {s.metadata?.candidates && (
                          <div className="tg-signal-meta">
                            Candidates: {s.metadata.candidates.map(c => `${c.name} (d=${c.dist})`).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="mg-narr">No risk signals fired — all checks passed clean.</div>
                )}

                <div className="tg-timestamp">
                  SCANNED {new Date(verdict.checkedAt).toLocaleString()}
                </div>
              </>
            )}

            {/* Idle state */}
            {!verdict && !loading && !error && (
              <div className="tg-idle">
                <div className="mg-narr">
                  Type a package name above and hit SCAN.
                  <br />Checks: existence · age · lookalike · adoption · blocklist
                </div>
                <span className="tg-idle-jp">パッケージ名を入力してください</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
