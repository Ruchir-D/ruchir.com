import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import simpleCSS from './styles.js';
import DATA from './data.js';

function Section({ label, children, style }) {
  return (
    <div style={{ marginTop: 56, ...style }}>
      <div className="s-section-label">{label}</div>
      {children}
    </div>
  );
}

function IndexView() {
  return (
    <div>
      <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center' }}>
        {DATA.heroLabel}
        <span className="s-cursor" />
      </div>
      <h1 className="s-h1">{DATA.name}</h1>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--body)', margin: 0, maxWidth: 560 }}>{DATA.intro}</p>

      <Section label="// now">
        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--body)', margin: '16px 0 0' }}>{DATA.now}</p>
      </Section>

      <Section label="// selected work">
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {DATA.projects.map((p) => (
            <div className="s-row" key={p.title}>
              <div>
                <span style={{ color: 'var(--link)', fontSize: 15 }}>{p.title}</span>
                <div style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 5, lineHeight: 1.6 }}>{p.description}</div>
              </div>
              <span style={{ color: 'var(--dim)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{p.tag}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section label="// side quests">
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {DATA.sideQuests.map((q) => (
            <Link className="s-row" to={q.to} key={q.title}>
              <div>
                <span style={{ color: 'var(--link)', fontSize: 15 }}>{q.title}</span>
                <div style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 5, lineHeight: 1.6 }}>{q.description}</div>
              </div>
              <span style={{ color: 'var(--dim)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{q.tag}</span>
            </Link>
          ))}
        </div>
      </Section>

      {DATA.writingPosts.length > 0 && (
        <Section label="// writing">
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DATA.writingPosts.map((post) => (
              <div className="s-row-sm" key={post.title}>
                <span style={{ color: 'var(--text)', fontSize: 15 }}>{post.title}</span>
                <span style={{ color: 'var(--dim)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{post.year}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section label="// experience">
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {DATA.experience.map((job) => (
            <div className="s-row-sm" key={job.company}>
              <span style={{ color: 'var(--text)', fontSize: 15 }}>
                {job.title} &middot; <span style={{ color: 'var(--muted)' }}>{job.company}</span>
              </span>
              <span style={{ color: 'var(--dim)', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                {job.start}&ndash;{job.end}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section label="// elsewhere">
        <div className="s-elsewhere" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
          <a href={`mailto:${DATA.links.email}`}>email</a>
          <a href={DATA.links.github} target="_blank" rel="noreferrer">github</a>
          <a href={DATA.links.x} target="_blank" rel="noreferrer">x</a>
          <a href={DATA.links.linkedin} target="_blank" rel="noreferrer">linkedin</a>
        </div>
      </Section>
    </div>
  );
}

function ResumeView() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 className="s-h1" style={{ marginBottom: 8 }}>{DATA.name}</h1>
          <div style={{ fontSize: 13, color: 'var(--accent)' }}>{DATA.role} &middot; {DATA.location}</div>
        </div>
        {DATA.resumePdfUrl && (
          <a
            href={DATA.resumePdfUrl}
            className="s-dlbtn"
            style={{
              fontSize: 13, color: 'var(--link)', border: '1px solid var(--btnBorder)',
              borderRadius: 6, padding: '8px 14px', whiteSpace: 'nowrap',
            }}
          >
            download pdf &darr;
          </a>
        )}
      </div>

      <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--body)', margin: '28px 0 0', maxWidth: 560 }}>
        {DATA.resumeSummary}
      </p>

      <Section label="// experience" style={{ marginTop: 48 }}>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 30 }}>
          {DATA.experience.map((job) => (
            <div key={job.company}>
              <div className="s-resume-row" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'baseline' }}>
                <span style={{ color: 'var(--fg)', fontSize: 15, fontWeight: 500 }}>{job.title}</span>
                <span style={{ color: 'var(--dim)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{job.start} &ndash; {job.end}</span>
              </div>
              <div style={{ color: 'var(--link)', fontSize: 13.5, marginTop: 4 }}>{job.company}</div>
              <ul style={{ margin: '12px 0 0', paddingLeft: 18, color: 'var(--body)', fontSize: 14, lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {job.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section label="// skills" style={{ marginTop: 48 }}>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
          {DATA.skills.map((s) => (
            <div style={{ display: 'flex', gap: 16 }} key={s.label}>
              <span style={{ color: 'var(--dim)', width: 130, flexShrink: 0 }}>{s.label}</span>
              <span style={{ color: 'var(--text)', lineHeight: 1.6 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section label="// education" style={{ marginTop: 48 }}>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'baseline' }}>
            <span style={{ color: 'var(--text)', fontSize: 15 }}>{DATA.education.degree}</span>
            <span style={{ color: 'var(--dim)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{DATA.education.start}&ndash;{DATA.education.end}</span>
          </div>
          <div style={{ color: 'var(--link)', fontSize: 13.5, marginTop: 4 }}>{DATA.education.school}</div>
        </div>
      </Section>

      <Section label="// links" style={{ marginTop: 48 }}>
        <div className="s-elsewhere" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
          <a href={`mailto:${DATA.links.email}`}>email</a>
          <a href={DATA.links.github} target="_blank" rel="noreferrer">github</a>
          <a href={DATA.links.linkedin} target="_blank" rel="noreferrer">linkedin</a>
        </div>
      </Section>
    </div>
  );
}

export default function SimplePortfolio() {
  const [tab, setTab] = useState('home');
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('simple-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('simple-theme', theme);
  }, [theme]);

  return (
    <div className="simple-root" data-theme={theme}>
      <style>{simpleCSS}</style>
      <div className="s-inner">
        <nav className="s-nav">
          <button className={`s-tab${tab === 'home' ? ' active' : ''}`} onClick={() => setTab('home')}>index</button>
          <button className={`s-tab${tab === 'resume' ? ' active' : ''}`} onClick={() => setTab('resume')}>resume</button>
          <div style={{ flex: 1 }} />
          <button className="s-theme-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
            <span style={{ fontSize: 12 }}>&#9680;</span>
            {theme === 'dark' ? 'light' : 'dark'}
          </button>
        </nav>

        {tab === 'home' ? <IndexView /> : <ResumeView />}

        <div style={{ marginTop: 72, paddingTop: 24, borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--footer)' }}>
          &copy; {new Date().getFullYear()} {DATA.name}
        </div>
      </div>
    </div>
  );
}
