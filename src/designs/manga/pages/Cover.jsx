export default function Cover({ tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-cover">
      <div className={`mg-page mg-cover ${tiltCls('tilt-l')}`} style={{ padding: 0 }}>
        <div className="mg-cover-banner">
          <span className="jp">週刊・エンジニア</span>
          <span className="banner-mid">WEEKLY ENGINEER — NEW SERIES</span>
          <span>NO. 001</span>
        </div>
        <div className="mg-cover-main">
          <div className="mg-speedlines" />
          <div className="mg-cover-oneshot">
            <span className="jp">読切</span>
            <span>One-shot · 52 pages</span>
          </div>
          <h1 className="mg-cover-title">
            <span className="outline">RUCHIR</span><br />
            <span className="solid">DANDGE</span>
          </h1>
          <div className="mg-cover-sub">
            The story of an engineer who refused to install anything — and built{' '}
            <b>five IDEs that live entirely in the browser</b>. His latest technique:
            an AI IDE where pipelines snap together like blocks.
          </div>
          <div className="mg-cover-statbox">
            <div className="hd"><span>CHARACTER</span><span className="jp">主人公</span></div>
            <div className="row"><span>Class</span><span className="v">SW ENGINEER</span></div>
            <div className="row"><span>Years active</span><span className="v">02</span></div>
            <div className="row"><span>IDEs shipped</span><span className="v">05</span></div>
            <div className="row"><span>Current arc</span><span className="v">AI BLOCKS</span></div>
          </div>
          <div className="mg-sfx vert" style={{ right: 300, top: 80, fontSize: 54, opacity: .85 }}>
            ブラウザの男
          </div>
        </div>
        <div className="mg-cover-footer">
          <span>STORY &amp; ART — R. DANDGE</span>
          <span className="jp">第一話・ブラウザ編</span>
          <span>CHAPTER 1 — THE BROWSER ARC</span>
        </div>
      </div>
    </div>
  );
}
