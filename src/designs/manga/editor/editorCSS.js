const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Anton&family=Comic+Neue:wght@700&family=Patrick+Hand&family=Shippori+Mincho:wght@400;700&family=Mochiy+Pop+One&display=swap');

.ms-root{
  --ink:#1b181c; --ink2:#241f26; --ink3:#2e2830;
  --paper:#f3edde; --red:#e23b2e; --line:rgba(243,237,222,.14);
  --dim:#9b94a2; --faint:#6c6573;
  position:absolute; inset:0; display:flex; flex-direction:column;
  background:#100e13; color:var(--paper);
  font-family:'JetBrains Mono', ui-monospace, monospace; font-size:13px;
  overflow:hidden; user-select:none;
}
.ms-root *{box-sizing:border-box;}
.ms-root button{font-family:inherit; cursor:pointer;}

/* ---------- top bar ---------- */
.ms-top{
  display:flex; align-items:center; justify-content:space-between; gap:18px;
  height:52px; padding:0 16px; background:var(--ink); border-bottom:1px solid var(--line);
  flex:0 0 auto; z-index:20;
}
.ms-brand{display:flex; align-items:center; gap:12px; min-width:0;}
.ms-logo{
  width:30px; height:30px; flex:0 0 auto; display:flex; align-items:center; justify-content:center;
  background:var(--red); color:var(--paper); font-family:'Archivo Black',sans-serif; font-size:13px;
  border:2px solid var(--paper); box-shadow:2px 2px 0 rgba(0,0,0,.5);
}
.ms-title{
  background:transparent; border:1px solid transparent; color:var(--paper);
  font-family:'Archivo Black',sans-serif; font-size:16px; letter-spacing:.01em; padding:4px 8px;
  min-width:120px; max-width:280px;
}
.ms-title:hover{border-color:var(--line);}
.ms-title:focus{outline:none; border-color:var(--red); background:var(--ink2);}
.ms-oneshot{
  font-family:'Reggae One',sans-serif; font-size:10px; letter-spacing:.2em;
  color:var(--red); padding:3px 8px; border:1px solid var(--red); border-radius:99px;
}
.ms-tools{display:flex; align-items:center; gap:4px;}
.ms-ib{
  width:30px; height:30px; border:1px solid var(--line); background:var(--ink2); color:var(--paper);
  border-radius:6px; font-size:15px; display:flex; align-items:center; justify-content:center; transition:.12s;
}
.ms-ib:hover{background:var(--ink3); border-color:var(--red);}
.ms-ib:disabled{opacity:.3; cursor:not-allowed;}
.ms-div{width:1px; height:22px; background:var(--line); margin:0 6px;}
.ms-zoom{font-size:11px; color:var(--dim); width:42px; text-align:center; letter-spacing:.05em;}
.ms-actions{display:flex; align-items:center; gap:8px;}
.ms-btn{
  padding:8px 16px; border-radius:6px; border:none; background:var(--red); color:var(--paper);
  font-family:'Archivo Black',sans-serif; font-size:11px; letter-spacing:.06em; transition:.12s;
}
.ms-btn:hover{filter:brightness(1.12);}
.ms-btn.ghost{background:var(--ink2); border:1px solid var(--line); font-family:'JetBrains Mono',monospace; font-weight:700;}
.ms-btn.ghost:hover{border-color:var(--red); background:var(--ink3);}
.ms-btn.danger{background:transparent; border:1px solid var(--red); color:var(--red);}
.ms-btn.danger:hover{background:var(--red); color:var(--paper);}
.ms-btn.sm{padding:6px 11px; font-size:10px;}
.ms-btn.full{width:100%; padding:10px; text-align:center;}
.ms-btn:disabled{opacity:.35; cursor:not-allowed;}
.ms-back-link{
  display:flex; align-items:center; gap:5px;
  color:var(--dim); text-decoration:none; font-size:11px;
  letter-spacing:.12em; padding:6px 10px; border:1px solid var(--line);
  border-radius:6px; background:var(--ink2); transition:.12s; white-space:nowrap;
}
.ms-back-link:hover{border-color:var(--red); color:var(--paper); background:var(--ink3);}

/* ---------- body ---------- */
.ms-body{flex:1; display:flex; min-height:0;}

/* ---------- library ---------- */
.ms-lib{
  width:210px; flex:0 0 auto; background:var(--ink); border-right:1px solid var(--line);
  overflow-y:auto; padding:14px 12px;
}
.ms-lib::-webkit-scrollbar{width:5px;}
.ms-lib::-webkit-scrollbar-thumb{background:var(--ink3);}
.ms-lib-h{font-family:'Archivo Black',sans-serif; font-size:12px; letter-spacing:.1em; text-transform:uppercase; margin-bottom:14px; color:var(--paper);}
.ms-lib-g{margin-bottom:16px;}
.ms-lib-gl{font-size:9px; letter-spacing:.28em; text-transform:uppercase; color:var(--faint); margin-bottom:8px;}
.ms-lib-grid{display:grid; grid-template-columns:1fr 1fr; gap:7px;}
.ms-chip{
  display:flex; flex-direction:column; align-items:center; gap:6px; padding:11px 6px;
  background:var(--ink2); border:1px solid var(--line); border-radius:8px; color:var(--paper); transition:.12s;
}
.ms-chip:hover{border-color:var(--red); background:var(--ink3); transform:translateY(-1px);}
.ms-chip-ic{width:26px; height:26px; display:flex; align-items:center; justify-content:center; color:var(--paper);}
.ms-chip-l{font-size:10px; letter-spacing:.02em; color:var(--dim);}
.ms-lib-foot{font-size:10px; line-height:1.6; color:var(--faint); padding:10px 4px 0; border-top:1px solid var(--line); margin-top:6px;}

/* ---------- stage ---------- */
.ms-stage{
  flex:1; position:relative; min-width:0; overflow:hidden;
  background:radial-gradient(circle at 50% 40%, #16131a, #0b0a0e 80%);
  display:flex; align-items:center; justify-content:center;
}
.ms-stage::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.5;
  background-image:linear-gradient(rgba(243,237,222,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(243,237,222,.03) 1px,transparent 1px);
  background-size:40px 40px;
}
.ms-page-wrap{position:relative;}
.ms-page{position:relative; box-shadow:0 24px 70px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4); overflow:hidden;}
.ms-empty{
  position:absolute; top:18px; left:50%; transform:translateX(-50%);
  color:var(--faint); font-size:12px; letter-spacing:.05em; pointer-events:none; white-space:nowrap;
}
.ms-pagebadge{
  position:absolute; right:16px; bottom:14px; font-size:10px; letter-spacing:.2em;
  color:var(--faint); background:rgba(16,14,19,.7); padding:4px 9px; border-radius:99px; border:1px solid var(--line);
}

/* ---------- element ---------- */
.ms-el{position:absolute; touch-action:none;}
.mx-edit{min-width:8px;}
.ms-h{position:absolute; width:11px; height:11px; background:var(--paper); border:1.5px solid var(--red); border-radius:2px; z-index:60;}
.ms-h-nw{left:-6px; top:-6px; cursor:nwse-resize;}
.ms-h-n{left:50%; top:-6px; margin-left:-5.5px; cursor:ns-resize;}
.ms-h-ne{right:-6px; top:-6px; cursor:nesw-resize;}
.ms-h-e{right:-6px; top:50%; margin-top:-5.5px; cursor:ew-resize;}
.ms-h-se{right:-6px; bottom:-6px; cursor:nwse-resize;}
.ms-h-s{left:50%; bottom:-6px; margin-left:-5.5px; cursor:ns-resize;}
.ms-h-sw{left:-6px; bottom:-6px; cursor:nesw-resize;}
.ms-h-w{left:-6px; top:50%; margin-top:-5.5px; cursor:ew-resize;}
.ms-h-rot{
  position:absolute; left:50%; top:-26px; margin-left:-7px; width:14px; height:14px;
  border-radius:50%; background:var(--red); border:2px solid var(--paper); z-index:60; cursor:grab;
}
.ms-h-rot::before{
  content:""; position:absolute; left:50%; top:14px; width:1px; height:14px;
  background:var(--red); transform:translateX(-50%);
}

/* ---------- inspector ---------- */
.ms-insp{width:248px; flex:0 0 auto; background:var(--ink); border-left:1px solid var(--line); overflow-y:auto;}
.ms-insp::-webkit-scrollbar{width:5px;}
.ms-insp::-webkit-scrollbar-thumb{background:var(--ink3);}
.ms-insp-in{padding:14px 14px 40px;}
.ms-insp-h{display:flex; align-items:baseline; justify-content:space-between; margin-bottom:14px;}
.ms-insp-h>span:first-child{font-family:'Archivo Black',sans-serif; font-size:15px;}
.ms-insp-sub{font-size:10px; color:var(--faint); letter-spacing:.1em;}
.ms-sec{margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line);}
.ms-sec:last-child{border-bottom:none;}
.ms-sec-t{font-size:9px; letter-spacing:.28em; text-transform:uppercase; color:var(--red); margin-bottom:10px;}
.ms-f{display:flex; align-items:center; gap:10px; margin-bottom:9px; font-size:11px;}
.ms-f>span{width:58px; flex:0 0 auto; color:var(--dim);}
.ms-f-c{flex:1; min-width:0; display:flex; align-items:center; gap:8px;}
.ms-slid input[type=range]{flex:1; accent-color:var(--red); height:3px;}
.ms-slid b{font-size:10px; color:var(--paper); width:30px; text-align:right; font-weight:400;}
.ms-sel,.ms-in,.ms-ta{
  width:100%; background:var(--ink2); border:1px solid var(--line); color:var(--paper);
  border-radius:5px; padding:7px 8px; font-family:inherit; font-size:11px;
}
.ms-sel:focus,.ms-in:focus,.ms-ta:focus{outline:none; border-color:var(--red);}
.ms-ta{resize:vertical; min-height:48px; margin-bottom:9px; line-height:1.4;}
.ms-seg{display:flex; gap:3px;}
.ms-seg button{flex:1; padding:6px 0; background:var(--ink2); border:1px solid var(--line); color:var(--dim); border-radius:5px; font-size:13px;}
.ms-seg button.on{background:var(--red); color:var(--paper); border-color:var(--red);}
.ms-tog{width:38px; height:21px; border-radius:99px; background:var(--ink3); border:1px solid var(--line); position:relative; transition:.15s;}
.ms-tog span{position:absolute; left:2px; top:1.5px; width:15px; height:15px; border-radius:50%; background:var(--dim); transition:.15s;}
.ms-tog.on{background:var(--red); border-color:var(--red);}
.ms-tog.on span{left:19px; background:var(--paper);}
.ms-swrow{display:flex; gap:5px; flex-wrap:wrap;}
.ms-sw{width:22px; height:22px; border-radius:5px; border:1.5px solid var(--line); position:relative; overflow:hidden; cursor:pointer;}
.ms-sw.on{border-color:var(--red); box-shadow:0 0 0 1.5px var(--red);}
.ms-sw.custom{display:flex; align-items:center; justify-content:center;}
.ms-sw.custom input{position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%;}
.ms-arrange{display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:4px; margin-bottom:10px;}
.ms-arrange button{padding:7px 0; font-size:10px; background:var(--ink2); border:1px solid var(--line); color:var(--paper); border-radius:5px;}
.ms-arrange button:hover{border-color:var(--red);}
.ms-pos{display:grid; grid-template-columns:repeat(5,1fr); gap:4px; margin-bottom:10px;}
.ms-nf{display:flex; flex-direction:column; gap:3px;}
.ms-nf span{font-size:9px; color:var(--faint); text-align:center;}
.ms-nf input{width:100%; background:var(--ink2); border:1px solid var(--line); color:var(--paper); border-radius:4px; padding:5px 3px; font-family:inherit; font-size:10px; text-align:center;}
.ms-nf input:focus{outline:none; border-color:var(--red);}
.ms-elactions{display:flex; gap:6px;}
.ms-elactions .ms-btn{flex:1;}
.ms-hint{font-size:10px; line-height:1.6; color:var(--faint); margin-top:8px;}
.ms-sfxgrid{display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;}
.ms-sfxbtn{
  padding:8px 4px; background:var(--ink2); border:1px solid var(--line); color:var(--paper);
  border-radius:5px; font-family:'Reggae One',sans-serif; font-size:13px;
}
.ms-sfxbtn:hover{border-color:var(--red); background:var(--ink3);}
.ms-bggrid{display:grid; grid-template-columns:1fr 1fr; gap:7px;}
.ms-bgsw{
  display:flex; flex-direction:column; gap:6px; align-items:stretch; padding:7px;
  background:var(--ink2); border:1px solid var(--line); border-radius:7px; color:var(--dim); font-size:10px;
}
.ms-bgsw .sw{height:34px; border-radius:4px; border:1px solid rgba(0,0,0,.3);}
.ms-bgsw.on{border-color:var(--red); color:var(--paper);}

/* ---------- pages rail ---------- */
.ms-rail{
  height:96px; flex:0 0 auto; background:var(--ink); border-top:1px solid var(--line);
  display:flex; align-items:center; justify-content:space-between; padding:0 14px; gap:14px;
}
.ms-rail-scroll{display:flex; align-items:center; gap:10px; overflow-x:auto; padding:8px 0; flex:1;}
.ms-rail-scroll::-webkit-scrollbar{height:5px;}
.ms-rail-scroll::-webkit-scrollbar-thumb{background:var(--ink3); border-radius:4px;}
.ms-thumb{position:relative; flex:0 0 auto; background:none; border:none; padding:0; cursor:pointer;}
.ms-thumb-page{
  width:52px; height:74px; position:relative; overflow:hidden;
  border:2px solid var(--line); border-radius:3px; transition:.12s;
}
.ms-thumb.on .ms-thumb-page{border-color:var(--red); box-shadow:0 0 0 2px rgba(226,59,46,.3);}
.ms-thumb-n{
  position:absolute; bottom:-3px; right:-3px; background:var(--ink3); color:var(--paper);
  font-size:9px; padding:1px 5px; border-radius:99px; border:1px solid var(--line);
}
.ms-thumb.add{
  width:52px; height:74px; border:2px dashed var(--line); border-radius:3px;
  color:var(--faint); font-size:24px; display:flex; align-items:center; justify-content:center; background:var(--ink2);
}
.ms-thumb.add:hover{border-color:var(--red); color:var(--red);}
.ms-rail-actions{display:flex; gap:7px; flex:0 0 auto;}

/* ---------- toast / badge ---------- */
.ms-toast{
  position:absolute; bottom:108px; left:50%; transform:translateX(-50%);
  background:var(--ink); color:var(--paper); border:1px solid var(--red);
  padding:10px 18px; border-radius:8px; font-size:12px; z-index:200;
  box-shadow:0 10px 30px rgba(0,0,0,.5); animation:ms-pop .2s;
}
@keyframes ms-pop{from{opacity:0; transform:translate(-50%,8px);}}
.ms-robadge{
  position:absolute; top:62px; left:50%; transform:translateX(-50%);
  background:var(--red); color:var(--paper); font-family:'Archivo Black',sans-serif;
  font-size:10px; letter-spacing:.1em; padding:5px 14px; border-radius:99px; z-index:200;
}

/* ---------- snap guides ---------- */
.ms-guide-v{
  position:absolute; top:0; bottom:0; width:1px;
  background:#e23b2e; pointer-events:none; z-index:200;
  box-shadow:0 0 5px 1px rgba(226,59,46,.45);
}
.ms-guide-h{
  position:absolute; left:0; right:0; height:1px;
  background:#e23b2e; pointer-events:none; z-index:200;
  box-shadow:0 0 5px 1px rgba(226,59,46,.45);
}

/* ---------- align panel ---------- */
.ms-align-row{ display:flex; flex-direction:column; gap:4px; }
.ms-align-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
.ms-align-btn{
  padding:8px 0; background:var(--ink2); border:1px solid var(--line);
  color:var(--dim); border-radius:5px; font-size:15px;
  display:flex; align-items:center; justify-content:center; transition:.12s;
}
.ms-align-btn:hover{ border-color:var(--red); color:var(--paper); background:var(--ink3); }
.ms-align-labels{ display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
.ms-align-labels span{
  font-size:8px; color:var(--faint); letter-spacing:.1em;
  text-align:center; text-transform:uppercase;
}
`;

export default CSS;
