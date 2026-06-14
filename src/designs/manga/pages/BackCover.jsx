import { Link } from 'react-router-dom';
import D from '../../../data/portfolio.js';

export default function BackCover({ tiltCls }) {
  return (
    <div className="mg-pagewrap" id="mg-back">
      <div className={`mg-page dark ${tiltCls('tilt-l')}`}>
        <div className="mg-next">
          <div className="jp">次回予告</div>
          <div className="big">NEXT CHAPTER:<br /><span>YOUR PROJECT?</span></div>
          <div style={{ fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', opacity: .7, marginTop: 14 }}>
            Open to dev tools · AI infra · creative coding
          </div>
        </div>
        <Link className="mg-create-btn" to="/create">
          <span className="mg-create-btn-jp">作れ！</span>
          <span className="mg-create-btn-main">CREATE YOUR OWN<br />ONE-SHOT MANGA</span>
        </Link>

        <div className="mg-contact">
          <a href={`mailto:${D.contact.email}`}>
            <span className="label">Email</span>
            <span className="val">{D.contact.email}</span>
          </a>
          <a href={`https://github.com/${D.contact.github}`}>
            <span className="label">GitHub</span>
            <span className="val">@{D.contact.github}</span>
          </a>
          <a href={`https://linkedin.com/in/${D.contact.linkedin}`}>
            <span className="label">LinkedIn</span>
            <span className="val">{D.contact.linkedin}</span>
          </a>
          <a href={`https://twitter.com/${D.contact.twitter}`}>
            <span className="label">Twitter</span>
            <span className="val">@{D.contact.twitter}</span>
          </a>
        </div>
        <div className="mg-tbc">
          <span>© 2026 R. DANDGE — WEEKLY ENGINEER</span>
          <span className="jp">つづく</span>
          <span>TO BE CONTINUED ➤</span>
        </div>
      </div>
    </div>
  );
}
