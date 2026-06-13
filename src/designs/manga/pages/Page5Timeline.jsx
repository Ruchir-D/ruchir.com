import D from '../../../data/portfolio.js';

export default function Page5Timeline({ tone, tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-p5">
      <div className={`mg-page ${tiltCls('tilt-l')}`}>
        <div className="mg-chapter">
          <span className="no">PAGE 5</span>
          <span className="t">Previous Chapters</span>
          <span className="jp">これまでの話</span>
          <span className="rule" />
        </div>
        <div className="mg-chapters">
          {D.timeline.map((it, i) => (
            <div key={i} className="mg-chap">
              <div className={`thumb ${tone ? 'mg-tone' : ''}`}>
                <span className="yr">{it.year}</span>
              </div>
              <div className="body">
                <div className="no">CH.{String(i + 1).padStart(3, '0')} · {it.jp}</div>
                <div className="ti">{it.title}</div>
                <div className="bd">{it.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mg-pageno">5</div>
      </div>
    </div>
  );
}
