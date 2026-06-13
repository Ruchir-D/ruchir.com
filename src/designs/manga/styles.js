const mangaCSS = `
.mg-root{
  --gutter:#17161a;
  --paper:#f3edde;
  --paper-2:#e9e1cd;
  --ink:#1b181c;
  --ink-soft:#46404a;
  --accent:#e23b2e;
  --tone-size:7px;
  --nav-h:60px;
  background:var(--gutter);
  color:var(--ink);
  font-family:'JetBrains Mono',ui-monospace,monospace;
  font-size:13px;
  line-height:1.6;
  position:relative;
  overflow:hidden;
  width:100%;
  height:100%;
}
.mg-root *{box-sizing:border-box;}
.mg-scroll{
  position:absolute; inset:0;
  overflow-y:auto; overflow-x:hidden;
}
.mg-scroll::-webkit-scrollbar{width:8px;}
.mg-scroll::-webkit-scrollbar-thumb{background:var(--accent);}
.mg-scroll::-webkit-scrollbar-track{background:#0e0d10;}

.mg-display{font-family:'Archivo Black','Arial Black',sans-serif;}
.mg-shout{font-family:'Reggae One','Noto Sans JP',sans-serif;}
.mg-jp{font-family:'Noto Sans JP',sans-serif;}

/* ============ reader chrome ============ */
.mg-reader-bar{
  position:sticky; top:0; z-index:40;
  display:flex; align-items:center; justify-content:space-between;
  height:60px; padding:0 32px;
  background:rgba(14,13,16,.95);
  backdrop-filter:blur(8px);
  border-bottom:2px solid rgba(243,237,222,.15);
  color:#b9b2a4;
  font-size:11px; letter-spacing:.22em; text-transform:uppercase;
}
.mg-reader-bar .title{display:flex; gap:14px; align-items:center;}
.mg-reader-bar .title b{color:var(--paper); font-weight:700; font-size:13px; letter-spacing:.18em;}
.mg-reader-bar .title .tag{
  background:var(--accent); color:var(--paper);
  font-family:'Archivo Black',sans-serif;
  padding:4px 12px; font-size:10px; letter-spacing:.22em;
}
.mg-reader-bar .pages{display:flex; gap:20px;}
.mg-reader-bar .pages a{color:#b9b2a4; text-decoration:none; transition:.15s; font-size:11px;}
.mg-reader-bar .pages a:hover{color:var(--paper);}

/* ============ page shell ============ */
.mg-pagewrap{
  max-width:1400px;
  margin:0 auto;
  padding:36px 16px 0;
}
.mg-pagewrap:last-of-type{padding-bottom:48px;}
.mg-page{
  position:relative;
  background:var(--paper);
  border:3px solid var(--ink);
  box-shadow:10px 10px 0 rgba(0,0,0,.55);
  padding:34px;
}
.mg-page.tilt-l{transform:rotate(-.4deg);}
.mg-page.tilt-r{transform:rotate(.35deg);}
.mg-page.dark{
  background:var(--ink); color:var(--paper);
  border-color:var(--paper);
}
.mg-pageno{
  position:absolute; bottom:-14px; left:50%;
  transform:translateX(-50%);
  width:30px; height:30px; border-radius:50%;
  background:var(--paper); border:3px solid var(--ink);
  display:flex; align-items:center; justify-content:center;
  font-family:'Archivo Black',sans-serif; font-size:12px; color:var(--ink);
  z-index:2;
}

/* halftone screentone */
.mg-tone{
  background-image:radial-gradient(rgba(27,24,28,.25) 1px, transparent 1.4px);
  background-size:var(--tone-size) var(--tone-size);
}
.mg-tone-accent{
  background-image:radial-gradient(color-mix(in srgb, var(--accent) 60%, transparent) 1.2px, transparent 1.5px);
  background-size:6px 6px;
}

/* speed lines (radial, slowly rotating) */
@property --sl-rot {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes mg-spin-lines { to { --sl-rot: 360deg; } }
.mg-speedlines{
  position:absolute; inset:0; pointer-events:none; overflow:hidden;
  background:repeating-conic-gradient(from var(--sl-rot) at 50% 42%,
    transparent 0deg 4deg,
    rgba(27,24,28,.85) 4deg 4.7deg,
    transparent 4.7deg 9deg);
  mask-image:radial-gradient(ellipse at 50% 42%, transparent 32%, black 75%);
  -webkit-mask-image:radial-gradient(ellipse at 50% 42%, transparent 32%, black 75%);
  animation: mg-spin-lines 28s linear infinite;
}

/* ============ panels ============ */
.mg-panels{
  display:grid;
  gap:14px;
}
.mg-panel{
  position:relative;
  border:3px solid var(--ink);
  background:var(--paper);
  padding:18px;
  overflow:hidden;
}
.mg-panel.shaded{background:var(--paper-2);}
.mg-panel.black{background:var(--ink); color:var(--paper);}

/* narration box */
.mg-narr{
  display:inline-block;
  background:var(--paper);
  border:2.5px solid var(--ink);
  padding:7px 12px;
  font-size:11.5px; line-height:1.55;
  box-shadow:4px 4px 0 rgba(27,24,28,.25);
}
.mg-panel.black .mg-narr{color:var(--ink);}

/* speech bubble */
.mg-bubble{
  position:relative;
  background:#fff;
  border:3px solid var(--ink);
  border-radius:50% / 46%;
  padding:20px 30px;
  text-align:center;
  font-weight:700;
  width:fit-content;
}
.mg-bubble::before{
  content:"";
  position:absolute;
  bottom:-16px; left:24%;
  width:24px; height:20px;
  background:#fff;
  border:3px solid var(--ink);
  border-top:none; border-right:none;
  transform:skewX(36deg) rotate(-12deg);
  border-radius:0 0 0 100%;
}
.mg-bubble.shout{
  border-radius:0;
  clip-path:polygon(2% 16%, 10% 8%, 22% 12%, 32% 2%, 44% 10%, 56% 0%, 66% 10%, 78% 4%, 88% 12%, 98% 8%, 96% 30%, 100% 44%, 95% 60%, 99% 78%, 90% 88%, 78% 84%, 66% 96%, 54% 88%, 42% 100%, 32% 90%, 18% 96%, 10% 84%, 0% 76%, 5% 58%, 0% 40%, 6% 28%);
  padding:30px 38px;
}
.mg-bubble.shout::before{display:none;}

/* onomatopoeia */
.mg-sfx{
  font-family:'Reggae One','Noto Sans JP',sans-serif;
  position:absolute;
  color:var(--ink);
  -webkit-text-stroke:1px var(--paper);
  text-shadow:3px 3px 0 rgba(27,24,28,.18);
  pointer-events:none;
  line-height:1;
  z-index:3;
}
.mg-sfx.vert{writing-mode:vertical-rl;}
.mg-sfx.accent{color:var(--accent); -webkit-text-stroke:1.5px var(--ink);}

/* chapter heading strip */
.mg-chapter{
  display:flex; align-items:center; gap:16px;
  margin-bottom:20px;
}
.mg-chapter .no{
  background:var(--ink); color:var(--paper);
  font-family:'Archivo Black',sans-serif;
  padding:6px 14px; font-size:13px; letter-spacing:.14em;
  white-space:nowrap;
}
.mg-chapter .t{
  font-family:'Archivo Black',sans-serif;
  font-size:26px; letter-spacing:.02em; line-height:1;
  text-transform:uppercase;
}
.mg-chapter .jp{
  font-family:'Noto Sans JP',sans-serif;
  font-size:11px; letter-spacing:.4em; color:var(--accent); font-weight:700;
}
.mg-chapter .rule{flex:1; border-top:3px solid var(--ink); position:relative; top:1px;}

/* ============ COVER ============ */
.mg-cover{
  position:relative;
  padding:0; overflow:hidden;
  min-height:660px;
  display:flex; flex-direction:column;
}
.mg-cover-banner{
  display:flex; justify-content:space-between; align-items:center;
  background:var(--accent);
  color:var(--paper);
  padding:10px 26px;
  border-bottom:3px solid var(--ink);
  font-family:'Archivo Black',sans-serif;
  font-size:13px; letter-spacing:.25em; text-transform:uppercase;
}
.mg-cover-banner .jp{font-family:'Reggae One',sans-serif; letter-spacing:.3em;}
.mg-cover-main{
  position:relative; flex:1;
  padding:48px 48px 110px;
}
.mg-cover-oneshot{
  display:inline-flex; align-items:center; gap:10px;
  background:var(--ink); color:var(--paper);
  padding:6px 16px;
  font-size:11px; letter-spacing:.35em; text-transform:uppercase;
  margin-bottom:26px;
}
.mg-cover-oneshot .jp{color:var(--accent); font-weight:700;}
.mg-cover-title{
  position:relative; z-index:2;
  font-family:'Archivo Black',sans-serif;
  font-size:clamp(64px, 9.5vw, 118px);
  line-height:.88;
  text-transform:uppercase;
  margin:0;
  letter-spacing:-.01em;
}
.mg-cover-title .outline{
  color:var(--paper);
  -webkit-text-stroke:3.5px var(--ink);
  text-shadow:6px 6px 0 var(--accent);
}
.mg-cover-title .solid{color:var(--ink); text-shadow:6px 6px 0 rgba(226,59,46,.35);}
.mg-cover-sub{
  position:relative; z-index:2;
  margin-top:22px;
  font-size:13px; line-height:1.7; max-width:430px;
  background:var(--paper);
  border:2.5px solid var(--ink);
  padding:12px 16px;
  box-shadow:5px 5px 0 rgba(27,24,28,.3);
}
.mg-cover-sub b{color:var(--accent);}
.mg-cover-statbox{
  position:absolute; right:42px; top:120px; z-index:2;
  background:var(--paper);
  border:3px solid var(--ink);
  box-shadow:6px 6px 0 rgba(27,24,28,.4);
  width:230px;
  transform:rotate(1.2deg);
}
.mg-cover-statbox .hd{
  background:var(--ink); color:var(--paper);
  font-family:'Archivo Black',sans-serif;
  font-size:11px; letter-spacing:.25em; text-transform:uppercase;
  padding:7px 12px;
  display:flex; justify-content:space-between;
}
.mg-cover-statbox .hd .jp{color:var(--accent); font-family:'Noto Sans JP',sans-serif;}
.mg-cover-statbox .row{
  display:flex; justify-content:space-between; align-items:baseline;
  padding:9px 12px;
  border-bottom:1.5px solid rgba(27,24,28,.25);
  font-size:10px; letter-spacing:.2em; text-transform:uppercase;
}
.mg-cover-statbox .row:last-child{border-bottom:none;}
.mg-cover-statbox .row .v{
  font-family:'Archivo Black',sans-serif; font-size:16px;
  color:var(--accent);
}
.mg-cover-footer{
  position:absolute; bottom:0; left:0; right:0;
  display:flex; justify-content:space-between; align-items:center;
  background:var(--ink); color:var(--paper);
  padding:12px 26px;
  font-size:10px; letter-spacing:.3em; text-transform:uppercase;
}
.mg-cover-footer .jp{font-family:'Reggae One',sans-serif; color:var(--accent); font-size:13px;}

/* ============ STATS PAGE ============ */
.mg-stats{display:grid; grid-template-columns:1.1fr .9fr; gap:14px;}
.mg-stat-row{
  display:grid; grid-template-columns:34px 1fr auto; gap:12px; align-items:center;
  padding:9px 0;
  border-bottom:2px dashed rgba(27,24,28,.3);
}
.mg-stat-row:last-child{border-bottom:none;}
.mg-rank{
  width:34px; height:34px;
  display:flex; align-items:center; justify-content:center;
  font-family:'Archivo Black',sans-serif; font-size:16px;
  border:2.5px solid var(--ink);
  background:var(--paper);
}
.mg-rank.S{background:var(--accent); color:var(--paper); transform:rotate(-4deg);}
.mg-rank.A{background:var(--ink); color:var(--paper);}
.mg-stat-row .nm{font-weight:700; font-size:13px;}
.mg-stat-row .meter{
  display:flex; gap:3px;
}
.mg-stat-row .meter i{
  width:11px; height:14px;
  border:1.5px solid var(--ink);
  background:transparent;
}
.mg-stat-row .meter i.f{background:var(--ink);}
.mg-stat-row .meter i.fa{background:var(--accent); border-color:var(--accent);}

.mg-special{
  border:3px solid var(--ink);
  background:var(--ink); color:var(--paper);
  padding:22px;
  position:relative; overflow:hidden;
}
.mg-special .lbl{
  font-family:'Noto Sans JP',sans-serif;
  color:var(--accent); font-weight:700;
  letter-spacing:.4em; font-size:11px;
  margin-bottom:10px;
}
.mg-special .nm{
  font-family:'Archivo Black',sans-serif;
  font-size:26px; line-height:1.05; text-transform:uppercase;
  margin-bottom:10px;
}
.mg-special .nm span{color:var(--accent);}
.mg-special .desc{font-size:11.5px; opacity:.85; line-height:1.65;}

/* ============ chapters (timeline) ============ */
.mg-chapters{display:grid; grid-template-columns:repeat(4,1fr); gap:14px;}
.mg-chap{
  border:3px solid var(--ink);
  background:var(--paper);
  transition:.15s;
  position:relative;
}
.mg-chap:hover{transform:translate(-2px,-2px); box-shadow:5px 5px 0 rgba(27,24,28,.35);}
.mg-chap .thumb{
  height:84px;
  border-bottom:3px solid var(--ink);
  position:relative; overflow:hidden;
  display:flex; align-items:center; justify-content:center;
}
.mg-chap .thumb .yr{
  font-family:'Archivo Black',sans-serif;
  font-size:38px; color:var(--ink);
  position:relative; z-index:1;
}
.mg-chap .body{padding:12px 14px;}
.mg-chap .no{
  font-size:9px; letter-spacing:.3em; color:var(--accent);
  font-weight:700; text-transform:uppercase;
}
.mg-chap .ti{
  font-family:'Archivo Black',sans-serif;
  font-size:13px; text-transform:uppercase; line-height:1.2;
  margin:5px 0;
}
.mg-chap .bd{font-size:10.5px; color:var(--ink-soft); line-height:1.5;}

/* ============ omake / now ============ */
.mg-strip{
  display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
}
.mg-strip .koma{
  border:3px solid var(--ink);
  background:var(--paper);
  padding:14px;
  position:relative;
  min-height:120px;
  display:flex; flex-direction:column; gap:8px;
}
.mg-strip .koma .k-no{
  position:absolute; top:-2px; right:-2px;
  background:var(--ink); color:var(--paper);
  font-family:'Archivo Black',sans-serif;
  font-size:10px; padding:3px 8px;
}
.mg-strip .koma .k-txt{font-size:11.5px; line-height:1.6; font-weight:700;}
.mg-strip .koma .k-sub{font-size:9.5px; color:var(--ink-soft); letter-spacing:.1em;}

/* ============ back cover / contact ============ */
.mg-next{
  text-align:center;
  padding:26px 0 8px;
}
.mg-next .jp{
  font-family:'Reggae One',sans-serif;
  color:var(--accent); font-size:15px; letter-spacing:.5em;
  margin-bottom:14px;
}
.mg-next .big{
  font-family:'Archivo Black',sans-serif;
  font-size:clamp(38px, 5.5vw, 62px);
  line-height:.95; text-transform:uppercase;
  color:var(--paper);
  margin-bottom:8px;
}
.mg-next .big span{
  color:var(--ink);
  -webkit-text-stroke:2px var(--paper);
  text-shadow:4px 4px 0 var(--accent);
}
.mg-contact{
  display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
  margin-top:30px;
}
.mg-contact a{
  border:2.5px solid var(--paper);
  color:var(--paper); text-decoration:none;
  padding:16px 14px;
  display:flex; flex-direction:column; gap:6px;
  transition:.15s;
  background:transparent;
}
.mg-contact a:hover{background:var(--accent); border-color:var(--accent);}
.mg-contact .label{font-size:9px; letter-spacing:.3em; text-transform:uppercase; opacity:.7;}
.mg-contact .val{font-family:'Archivo Black',sans-serif; font-size:13px; letter-spacing:.04em;}
.mg-tbc{
  display:flex; justify-content:space-between; align-items:center;
  margin-top:30px; padding-top:18px;
  border-top:2px dashed rgba(243,237,222,.35);
  font-size:10px; letter-spacing:.3em; text-transform:uppercase; opacity:.75;
}
.mg-tbc .jp{font-family:'Reggae One',sans-serif; font-size:14px; color:var(--accent); letter-spacing:.4em;}

/* ink line-art bits */
.mg-ink-svg{display:block;}
.mg-typing-cur{display:inline-block; width:7px; height:13px; background:var(--accent); animation:mg-blink 1s infinite; vertical-align:middle;}
@keyframes mg-blink{50%{opacity:0;}}

/* ============ motion (scroll-triggered, print-flavored) ============ */
@keyframes mg-stamp{
  from{opacity:0; transform:scale(.92) rotate(-1.2deg); filter:brightness(3);}
  25%{filter:brightness(1);}
}
@keyframes mg-stamp-hard{
  0%{opacity:0; transform:scale(1.25); filter:brightness(4);}
  20%{filter:brightness(1);}
  60%{opacity:1; transform:scale(.97);}
}
@keyframes mg-pop{
  from{opacity:0; transform:scale(.2) rotate(-14deg);}
}
@keyframes mg-rumble{
  0%{translate:0 0;} 25%{translate:1.5px -1px;} 50%{translate:-1.5px 1px;} 75%{translate:1px 1.5px;} 100%{translate:0 0;}
}
@keyframes mg-float{
  0%,100%{translate:0 0;} 50%{translate:0 -7px;}
}
@keyframes mg-glitch{
  0%,93%,100%{clip-path:none; transform:none;}
  94%{clip-path:inset(18% 0 58% 0); transform:translate(-5px,0);}
  95%{clip-path:inset(62% 0 6% 0); transform:translate(5px,0);}
  96%{clip-path:inset(38% 0 32% 0); transform:translate(-2px,0);}
  97%{clip-path:none; transform:none;}
}
@keyframes mg-heartbeat{
  0%,100%{transform:rotate(-4deg) scale(1);}
  14%{transform:rotate(-4deg) scale(1.35);}
  28%{transform:rotate(-4deg) scale(1);}
  42%{transform:rotate(-4deg) scale(1.18);}
}
@keyframes mg-shimmer{
  0%{background-position:200% 0;}
  100%{background-position:-200% 0;}
}

/* always-on ambient animations */
.mg-rank.S{animation:mg-heartbeat 2.5s ease-in-out infinite;}
.mg-cover-title{animation:mg-glitch 9s steps(1) 2s infinite;}
.mg-panel{transition:transform .18s, box-shadow .18s;}
.mg-panel:hover{transform:translate(-2px,-3px); box-shadow:6px 8px 0 rgba(27,24,28,.45);}
.mg-chap .thumb{position:relative; overflow:hidden;}
.mg-chap .thumb::after{
  content:''; position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,.16) 50%, transparent 100%);
  background-size:200% 100%;
  animation:mg-shimmer 2.8s linear infinite;
}

@media (prefers-reduced-motion: no-preference){
  .mg-anim .mg-page:not(.mg-in) .mg-panel,
  .mg-anim .mg-page:not(.mg-in) .mg-cover-statbox,
  .mg-anim .mg-page:not(.mg-in) .mg-cover-title,
  .mg-anim .mg-page:not(.mg-in) .mg-cover-sub,
  .mg-anim .mg-page:not(.mg-in) .mg-chap,
  .mg-anim .mg-page:not(.mg-in) .koma,
  .mg-anim .mg-page:not(.mg-in) .mg-sfx,
  .mg-anim .mg-page:not(.mg-in) .mg-contact a{visibility:hidden;}

  .mg-anim .mg-page.mg-in .mg-panel{animation:mg-stamp .42s cubic-bezier(.2,1.4,.4,1) both;}
  .mg-anim .mg-page.mg-in .mg-panels > .mg-panel:nth-child(2){animation-delay:.12s;}
  .mg-anim .mg-page.mg-in .mg-panels > .mg-panel:nth-child(3){animation-delay:.24s;}
  .mg-anim .mg-page.mg-in .mg-panels > .mg-panel:nth-child(4){animation-delay:.36s;}

  .mg-anim .mg-page.mg-in .mg-cover-title{animation:mg-stamp-hard .5s cubic-bezier(.2,1.3,.4,1) both, mg-glitch 9s steps(1) 2s infinite;}
  .mg-anim .mg-page.mg-in .mg-cover-sub{animation:mg-stamp .45s cubic-bezier(.2,1.4,.4,1) .25s both;}
  .mg-anim .mg-page.mg-in .mg-cover-statbox{animation:mg-stamp-hard .45s cubic-bezier(.2,1.3,.4,1) .4s both;}

  .mg-anim .mg-page.mg-in .mg-chap{animation:mg-stamp .4s cubic-bezier(.2,1.4,.4,1) both;}
  .mg-anim .mg-page.mg-in .mg-chap:nth-child(2){animation-delay:.1s;}
  .mg-anim .mg-page.mg-in .mg-chap:nth-child(3){animation-delay:.2s;}
  .mg-anim .mg-page.mg-in .mg-chap:nth-child(4){animation-delay:.3s;}
  .mg-anim .mg-page.mg-in .koma{animation:mg-stamp .4s cubic-bezier(.2,1.4,.4,1) both;}
  .mg-anim .mg-page.mg-in .koma:nth-child(2){animation-delay:.1s;}
  .mg-anim .mg-page.mg-in .koma:nth-child(3){animation-delay:.2s;}
  .mg-anim .mg-page.mg-in .koma:nth-child(4){animation-delay:.3s;}
  .mg-anim .mg-page.mg-in .mg-contact a{animation:mg-stamp .4s cubic-bezier(.2,1.4,.4,1) both;}
  .mg-anim .mg-page.mg-in .mg-contact a:nth-child(2){animation-delay:.1s;}
  .mg-anim .mg-page.mg-in .mg-contact a:nth-child(3){animation-delay:.2s;}
  .mg-anim .mg-page.mg-in .mg-contact a:nth-child(4){animation-delay:.3s;}

  .mg-anim .mg-page.mg-in .mg-sfx{animation:mg-pop .38s cubic-bezier(.2,1.6,.4,1) .45s both, mg-float 3.2s ease-in-out 1.2s infinite;}
  .mg-anim .mg-page.mg-in .mg-sfx.rumble{animation:mg-pop .38s cubic-bezier(.2,1.6,.4,1) .45s both, mg-rumble .28s steps(2) .85s infinite;}
}

/* ============ RESPONSIVE ============ */

/* Tablet — collapse 4-col grids to 2 */
@media (max-width: 900px) {
  .mg-chapters { grid-template-columns:repeat(2,1fr); }
  .mg-strip    { grid-template-columns:repeat(2,1fr); }
  .mg-contact  { grid-template-columns:repeat(2,1fr); }
}

/* Mobile */
@media (max-width: 640px) {
  .mg-root { --nav-h:52px; }

  /* reader bar */
  .mg-reader-bar { height:52px; padding:0 16px; font-size:10px; }
  .mg-reader-bar .pages { display:none; }
  .mg-reader-bar .title .jp-label { display:none; }

  /* page wrap & page box */
  .mg-pagewrap { padding:16px 10px 0; }
  .mg-page     { padding:18px 14px; }
  .mg-page.tilt-l, .mg-page.tilt-r { transform:none; }
  .mg-pageno   { bottom:-12px; }

  /* chapter heading */
  .mg-chapter  { gap:10px; margin-bottom:14px; }
  .mg-chapter .t  { font-size:17px; }
  .mg-chapter .jp { display:none; }

  /* cover */
  .mg-cover         { min-height:auto; }
  .mg-cover-banner  { padding:8px 12px; font-size:9px; letter-spacing:.12em; }
  .mg-cover-banner .banner-mid { display:none; }
  .mg-cover-main    { padding:22px 16px 78px; }
  .mg-cover-title   { font-size:clamp(44px,13vw,80px); }
  .mg-cover-sub     { max-width:100%; font-size:12px; }
  .mg-cover-statbox { position:static; width:100%; transform:none; margin-top:18px; }
  .mg-cover-footer  { font-size:8px; padding:10px 12px; }
  .mg-cover-footer .jp { display:none; }
  .mg-cover .mg-sfx.vert { display:none; }

  /* all panel grids collapse to 1 col (overrides inline styles) */
  .mg-panels { grid-template-columns:1fr !important; }
  .mg-stats  { grid-template-columns:1fr; }

  /* battle spread two-col → one col */
  .mg-spread-inner { grid-template-columns:1fr !important; }
  .mg-spread-inner > div:first-child { border-right:none !important; border-bottom:3px solid var(--ink); }

  /* individual battle panels stacked */
  .mg-battle-panel { grid-template-columns:1fr !important; }
  .mg-battle-panel > div:last-child { display:none; }

  /* omake inner split */
  .mg-omake-split { grid-template-columns:1fr !important; }

  /* back cover */
  .mg-next .big { font-size:clamp(26px,9vw,44px); }
  .mg-contact   { grid-template-columns:repeat(2,1fr); }
}

/* Small mobile */
@media (max-width: 420px) {
  .mg-chapters { grid-template-columns:1fr; }
  .mg-strip    { grid-template-columns:1fr; }
  .mg-contact  { grid-template-columns:1fr; }
  .mg-cover-title { font-size:clamp(40px,14vw,70px); }
}
`;

export default mangaCSS;
