const simpleCSS = `
.simple-root{
  --bg:#0b0c0f; --fg:#f2f3f5; --body:#aeb0b8; --text:#c8c9cf;
  --strong:#e6e7ea; --accent:#6bb389; --link:#7fb3e8; --muted:#80828c;
  --dim:#5d5f68; --border:#1c1e24; --footer:#4d4f58;
  --btnBorder:#2a3d31; --btnHover:#13211a;
  position:fixed; inset:0; overflow-y:auto; overflow-x:hidden;
  background:var(--bg); color:var(--text);
  font-family:'JetBrains Mono',ui-monospace,monospace;
}
.simple-root *{box-sizing:border-box;}
.simple-root[data-theme="light"]{
  --bg:#ffffff; --fg:#18181b; --body:#52525b; --text:#27272a;
  --strong:#18181b; --accent:#2f8f5b; --link:#2563eb; --muted:#71717a;
  --dim:#a1a1aa; --border:#e6e6e9; --footer:#a1a1aa;
  --btnBorder:#d4d4d8; --btnHover:#f4f4f5;
}
.simple-root::-webkit-scrollbar{width:8px;}
.simple-root::-webkit-scrollbar-thumb{background:var(--border);}

a{text-decoration:none; color:inherit;}
.simple-root button{font-family:inherit; background:none; border:none; padding:0; cursor:pointer;}

.s-inner{max-width:640px; margin:0 auto; padding:64px 28px 120px;}

.s-nav{display:flex; align-items:center; gap:24px; margin-bottom:48px;}
.s-tab{font-size:13px; letter-spacing:0.02em; transition:color 0.15s; color:var(--dim);}
.s-tab.active{color:var(--fg);}
.s-tab:hover{color:var(--fg);}
.s-theme-btn{display:inline-flex; align-items:center; gap:7px; font-size:13px; color:var(--dim); transition:color 0.15s;}
.s-theme-btn:hover{color:var(--fg);}

.s-cursor{display:inline-block; width:7px; height:14px; background:var(--accent); margin-left:7px; animation:s-blink 1.15s steps(1) infinite;}
@keyframes s-blink{ 0%, 50% { opacity:1; } 50.01%, 100% { opacity:0; } }

.s-h1{font-size:30px; font-weight:700; color:var(--fg); margin:0 0 20px; letter-spacing:-0.01em;}
.s-section-label{font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:var(--accent);}

.s-row{display:flex; justify-content:space-between; gap:24px; align-items:baseline; transition:opacity 0.2s ease, transform 0.2s ease;}
.s-row:hover{opacity:0.65; transform:translateX(4px);}
.s-row-sm{display:flex; justify-content:space-between; gap:24px; transition:opacity 0.2s ease, transform 0.2s ease;}
.s-row-sm:hover{opacity:0.65; transform:translateX(3px);}

.s-elsewhere a{color:var(--link); transition:opacity 0.2s ease, transform 0.2s ease; display:inline-block;}
.s-elsewhere a:hover{opacity:0.65; transform:translateX(3px);}

.s-dlbtn{transition:background 0.15s;}
.s-dlbtn:hover{background:var(--btnHover);}

@media (max-width:560px){
  .s-inner{padding:48px 20px 96px;}
  .s-h1{font-size:26px;}
  .s-row, .s-resume-row{flex-direction:column; align-items:flex-start; gap:4px;}
}
`;

export default simpleCSS;
