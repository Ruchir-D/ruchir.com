import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import simpleCSS from '../styles.js';

const postCSS = `
.s-post-table{width:100%; border-collapse:collapse; font-size:13px; margin-top:20px;}
.s-post-table th, .s-post-table td{
  text-align:left; padding:9px 14px 9px 0; border-bottom:1px solid var(--border);
  vertical-align:top; line-height:1.5;
}
.s-post-table th{color:var(--dim); font-weight:400; text-transform:uppercase; font-size:11px; letter-spacing:0.08em;}
.s-post-table td:first-child, .s-post-table th:first-child{color:var(--text);}
.s-post-table td{color:var(--muted);}
.s-post-scroll{overflow-x:auto; -webkit-overflow-scrolling:touch;}
.s-post p{font-size:14.5px; line-height:1.8; color:var(--body); margin:0 0 18px;}
.s-post p:last-child{margin-bottom:0;}
.s-post strong{color:var(--strong); font-weight:600;}
.s-post code{
  font-family:inherit; font-size:0.92em; color:var(--link);
  background:var(--btnHover); padding:1px 5px; border-radius:4px;
}
.s-back{color:var(--dim); font-size:13px; transition:color 0.15s;}
.s-back:hover{color:var(--fg);}
.s-stats{
  display:grid; grid-template-columns:repeat(4, 1fr); gap:1px;
  background:var(--border); border:1px solid var(--border); border-radius:8px;
  overflow:hidden; margin:32px 0 40px;
}
.s-stat{background:var(--bg); padding:16px 14px;}
.s-stat-num{font-size:20px; font-weight:700; color:var(--accent); letter-spacing:-0.01em;}
.s-stat-label{font-size:11.5px; color:var(--dim); margin-top:6px; line-height:1.4;}
@media (max-width:560px){
  .s-stats{grid-template-columns:repeat(2, 1fr);}
}
`;

function Change({ title, children }) {
  return (
    <p>
      <strong>{title}</strong> {children}
    </p>
  );
}

function Stat({ num, label }) {
  return (
    <div className="s-stat">
      <div className="s-stat-num">{num}</div>
      <div className="s-stat-label">{label}</div>
    </div>
  );
}

export default function CanvasPerformance() {
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
      <style>{postCSS}</style>
      <div className="s-inner">
        <nav className="s-nav">
          <Link className="s-back" to="/">&larr; index</Link>
          <div style={{ flex: 1 }} />
          <button className="s-theme-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
            <span style={{ fontSize: 12 }}>&#9680;</span>
            {theme === 'dark' ? 'light' : 'dark'}
          </button>
        </nav>

        <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 18 }}>
          performance engineering &middot; react &middot; 2026
        </div>
        <h1 className="s-h1" style={{ maxWidth: 620 }}>
          Diagnosing and fixing render bottlenecks in a node-graph canvas
        </h1>

        <div className="s-post">
          <p>
            The AI IDE is a node-graph canvas where engineers build ML pipelines by wiring
            blocks together &mdash; think Figma's canvas model applied to a visual programming
            surface. Canvas apps live or die by frame budget: at 60&nbsp;fps you have
            16.7&nbsp;ms per frame, and every dropped frame reads as stutter under a cursor.
            This is a case study of a focused performance pass on that canvas &mdash; what was
            slow, how it was diagnosed, and what fixed it.
          </p>

          <div className="s-stats">
            <Stat num="92% faster" label="zoom render time (253ms &rarr; 19.1ms)" />
            <Stat num="30 &rarr; 60 fps" label="block-drag frame rate" />
            <Stat num="0 renders" label="during a pan gesture (was 1/frame)" />
            <Stat num="87% faster" label="block-drag total render time" />
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="s-section-label">// approach</div>
            <div style={{ marginTop: 20 }}>
              <p>
                Every number in this write-up comes from React DevTools Profiler recordings of a
                real interaction, captured before and after each change &mdash; not synthetic
                benchmarks. Profiles were taken per gesture (zoom, pan, block drag) so each fix
                could be attributed to a specific, measured cost rather than a guess. That
                discipline mattered: two of my early hypotheses about the cause turned out to be
                wrong, and the profiler is what caught it (more on that below).
              </p>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="s-section-label">// results</div>
            <div className="s-post-scroll">
              <table className="s-post-table">
                <thead>
                  <tr>
                    <th>Interaction</th>
                    <th>Before</th>
                    <th>After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Zoom</td>
                    <td>137 commits, 253.0&nbsp;ms, 1.85&nbsp;ms/commit</td>
                    <td>45 commits, 19.1&nbsp;ms, 0.42&nbsp;ms/commit</td>
                  </tr>
                  <tr>
                    <td>Pan</td>
                    <td>1 commit per frame, 30&nbsp;fps</td>
                    <td>0 commits during the drag, 1 on release</td>
                  </tr>
                  <tr>
                    <td>Block drag</td>
                    <td>116 commits, 171.5&nbsp;ms</td>
                    <td>49 commits, 22.3&nbsp;ms</td>
                  </tr>
                  <tr>
                    <td>Block drag frames</td>
                    <td>33&nbsp;ms cadence (30&nbsp;fps)</td>
                    <td>41 commits, 8.30&nbsp;ms total, 0.202&nbsp;ms each, 16.7&nbsp;ms cadence (60&nbsp;fps)</td>
                  </tr>
                  <tr>
                    <td>Post-gesture autosave cascade</td>
                    <td>109.2&nbsp;ms, plus a network save</td>
                    <td>removed for view-only changes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 20 }}>
              A block-drag frame now renders three components &mdash; the canvas, the connection
              layer, and the block being moved &mdash; at about 1.2% of the 16.7&nbsp;ms frame
              budget. Before, each frame also re-rendered the output panel, the block palette,
              and their icons.
            </p>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="s-section-label">// key fixes</div>
            <div style={{ marginTop: 20 }}>
              <Change title="Static JSX hoisted out of the render path.">
                Three icons in the canvas toolbar accounted for 154&nbsp;ms of the original
                253&nbsp;ms zoom profile; four more in the output panel accounted for
                84.9&nbsp;ms of a 171.5&nbsp;ms block-drag profile. Hoisting the elements to
                module constants gives them stable identity, so React skips the subtree instead
                of re-rendering the same SVGs every frame.
              </Change>
              <Change title="Pan moved off React state entirely.">
                The pan offset is now held in a ref and written straight to the DOM inside the
                existing animation frame loop; React state commits once, on mouse-up. Two layout
                effects keep the imperative and rendered values from diverging: one re-asserts
                the live offset if an unrelated render lands mid-gesture, the other hands the
                styles back to React when the gesture ends.
              </Change>
              <Change title="Grid converted to a composited layer.">
                The dot grid was a tiled radial gradient repositioned via{' '}
                <code>background-position</code>, which repaints the full viewport every frame
                &mdash; this was the real pan bottleneck, not React. Because the pattern is
                periodic, shifting it by <code>pan mod cell</code> is visually identical and can
                be done with a CSS <code>transform</code>, which composites instead of repainting.
                Panning is now two composited transforms and zero paint.
              </Change>
              <Change title="Block-drag position moved from global to local state.">
                Every frame was writing position to the global store, waking every subscriber in
                the app. It's now local to the canvas, overlaid onto the blocks handed to the
                connection layer, and committed to the store once on drop &mdash; which also
                stopped a drag from marking the project dirty roughly 30 times per second.
              </Change>
              <Change title="Store subscriptions narrowed to selectors.">
                Eleven call sites subscribed to the whole store with no selector, so any write
                re-rendered them. Narrowing the two on the hot path removed the largest cascade.
                One of them had an existing hook written for exactly this problem, but a
                non-selective subscription upstream of it was defeating it &mdash; the hook
                stabilised what flowed downstream but couldn't stop its own component from
                re-rendering.
              </Change>
              <Change title="Memoisation, and the identity bugs quietly defeating it.">
                The three heaviest components were wrapped in <code>memo</code>, with their
                callbacks made stable via <code>useCallback</code>. Separately, a defensive{' '}
                <code>?? []</code> fallback was allocating a fresh array on every render, which
                broke a downstream <code>useMemo</code> and, through it, defeated the connection
                layer's memoisation on every single frame. A module-level constant fixed it.
              </Change>
              <Change title="Redundant work removed from the per-frame path.">
                A graph walk computing which blocks have live inputs was re-running on every
                drag frame despite depending only on types, properties, and edges &mdash; it's
                now cached against a position-free key. A resize handler was calling{' '}
                <code>getBoundingClientRect</code> per event instead of per gesture, forcing a
                layout each time.
              </Change>
              <Change title="Autosave separated from view state.">
                The viewport was part of the saved document, so panning or zooming marked the
                project dirty and triggered a full network save 1.4&nbsp;s later. View-only
                changes now skip the dirty check and get their own longer debounce, so the view
                still persists but no longer costs a save.
              </Change>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="s-section-label">// trade-offs</div>
            <div style={{ marginTop: 20 }}>
              <p>
                A block drag still commits once per frame. The edges attached to a moving block
                have to re-route, and they're React-rendered SVG paths. Removing that commit
                would mean computing path geometry outside React and keeping a second copy of the
                routing logic in sync &mdash; for a measured saving of 8.3&nbsp;ms across a
                2.6-second drag. Not worth the maintenance cost at this margin, so I left it.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="s-section-label">// what i got wrong</div>
            <div style={{ marginTop: 20 }}>
              <p>
                Two early hypotheses didn't survive contact with the data. I first attributed a
                cluster of commits to the viewport-save debounce, until the gaps between commits
                ruled it out. I also started optimising pan assuming React was the bottleneck,
                when the profiler showed React accounted for 1&nbsp;ms of a 33&nbsp;ms frame
                &mdash; the actual cost was a full-viewport repaint (see the grid fix above). In
                both cases the profile, not the assumption, decided the fix.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 72, paddingTop: 24, borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--footer)' }}>
          <Link className="s-back" to="/">&larr; back to index</Link>
        </div>
      </div>
    </div>
  );
}
