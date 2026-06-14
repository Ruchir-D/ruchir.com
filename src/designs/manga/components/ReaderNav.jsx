import { Link } from 'react-router-dom';

export default function ReaderNav() {
  return (
    <nav className="mg-reader-bar">
      <div className="title">
        <span className="tag">ONE-SHOT</span>
        <b>RUCHIR DANDGE</b>
        <span className="jp-label">ルチル・ダンゲ</span>
      </div>
      <div className="pages">
        <a href="#mg-cover">Cover</a>
        <a href="#mg-p1">P.1 Intro</a>
        <a href="#mg-p2">P.2 Battles</a>
        <a href="#mg-p4">P.4 Stats</a>
        <a href="#mg-p5">P.5 Log</a>
        <a href="#mg-p6">P.6 Omake</a>
        <a href="#mg-back">Back cover</a>
      </div>
      <Link className="mg-nav-create-btn" to="/create">
        <span className="jp">作れ！</span>
        CREATE YOUR MANGA
      </Link>
    </nav>
  );
}
