export const FONTS = [
  { id:'archivo',  label:'Archivo Black',   css:"'Archivo Black', sans-serif"          },
  { id:'bangers',  label:'Bangers',         css:"'Bangers', system-ui, cursive"         },
  { id:'reggae',   label:'Reggae One',      css:"'Reggae One', sans-serif"              },
  { id:'mochiy',   label:'Mochiy Pop',      css:"'Mochiy Pop One', sans-serif"          },
  { id:'anton',    label:'Anton',           css:"'Anton', sans-serif"                   },
  { id:'comic',    label:'Comic Neue',      css:"'Comic Neue', 'Comic Sans MS', cursive"},
  { id:'patrick',  label:'Patrick Hand',    css:"'Patrick Hand', cursive"               },
  { id:'shippori', label:'Shippori Mincho', css:"'Shippori Mincho', serif"              },
  { id:'notojp',   label:'Noto Sans JP',    css:"'Noto Sans JP', sans-serif"            },
  { id:'mono',     label:'JetBrains Mono',  css:"'JetBrains Mono', monospace"           },
];

export const fontCss = (id) => (FONTS.find(f => f.id === id) || FONTS[0]).css;

export const SFX_PRESETS = [
  'ドンッ','ゴゴゴ','バンッ','ザッ','シュッ','ドキッ','ピカッ','ガシャ','ザワザワ',
  'BOOM','SLASH','POW!','WHOOSH',
];

export const TYPE_LABEL = {
  panel:'Frame', divider:'Divider', bubble:'Speech', shout:'Shout', thought:'Thought',
  narration:'Narration', text:'Text', sfx:'SFX', screentone:'Screentone',
  'tone-grad':'Gradient', speed:'Speed lines', flash:'Flash', image:'Image',
};

export const TEXTY = new Set(['bubble','shout','thought','narration','sfx','text']);

export const LIBRARY = [
  { group:'Panels', items:[
    { type:'panel',   label:'Frame',      hint:'Manga panel'    },
    { type:'divider', label:'Gutter line', hint:'Divider'        },
  ]},
  { group:'Balloons', items:[
    { type:'bubble',    label:'Speech',    hint:'Speech balloon' },
    { type:'shout',     label:'Shout',     hint:'Jagged burst'   },
    { type:'thought',   label:'Thought',   hint:'Cloud bubble'   },
    { type:'narration', label:'Narration', hint:'Caption box'    },
  ]},
  { group:'Type', items:[
    { type:'text', label:'Text', hint:'Free text'       },
    { type:'sfx',  label:'SFX',  hint:'Onomatopoeia'    },
  ]},
  { group:'Tone & FX', items:[
    { type:'screentone', label:'Screentone',  hint:'Halftone fill'  },
    { type:'tone-grad',  label:'Gradient',    hint:'Tone gradient'  },
    { type:'speed',      label:'Speed lines', hint:'Motion'         },
    { type:'flash',      label:'Flash',       hint:'Impact burst'   },
  ]},
  { group:'Art', items:[
    { type:'image', label:'Image', hint:'Your artwork' },
  ]},
];

let _seq = 1;
export const uid = (p = 'e') =>
  `${p}${(Date.now() % 100000).toString(36)}${(_seq++).toString(36)}`;

const BASE = (type, over = {}) => ({
  id: uid(), type, x: 120, y: 120, w: 240, h: 160, rot: 0, ...over,
});

export function makeElement(type, at) {
  let el;
  switch (type) {
    case 'panel':
      el = BASE('panel', { w:360, h:280, props:{ border:5, radius:0, fill:'none', tone:35 } });
      break;
    case 'bubble':
      el = BASE('bubble', { w:220, h:130, props:{ text:'Like this?!', font:'comic', size:22, align:'center', bold:true, stroke:3, tailX:28, tailY:30, color:'#1b181c', bg:'#ffffff' } });
      break;
    case 'shout':
      el = BASE('shout', { w:250, h:170, props:{ text:'WHAT?!', font:'bangers', size:30, align:'center', color:'#1b181c', bg:'#ffffff', stroke:3 } });
      break;
    case 'thought':
      el = BASE('thought', { w:220, h:140, props:{ text:'hmm…', font:'comic', size:20, align:'center', color:'#1b181c', bg:'#ffffff', stroke:3 } });
      break;
    case 'narration':
      el = BASE('narration', { w:260, h:90, props:{ text:'And so, the story began.', font:'shippori', size:15, align:'left', color:'#1b181c', bg:'#f3edde', stroke:2.5 } });
      break;
    case 'sfx':
      el = BASE('sfx', { w:200, h:110, props:{ text:'ドンッ', font:'reggae', size:64, color:'#1b181c', stroke:'#f3edde', strokeW:6, rot:-8 } });
      break;
    case 'text':
      el = BASE('text', { w:240, h:60, props:{ text:'Double-click to edit', font:'archivo', size:26, align:'left', color:'#1b181c', bold:false, italic:false, track:0 } });
      break;
    case 'screentone':
      el = BASE('screentone', { w:260, h:200, props:{ shape:'dots', density:7, angle:0, color:'#1b181c', opacity:35 } });
      break;
    case 'speed':
      el = BASE('speed', { w:300, h:240, props:{ kind:'radial', color:'#1b181c', density:50, cx:50, cy:46 } });
      break;
    case 'flash':
      el = BASE('flash', { w:260, h:260, props:{ color:'#1b181c', spikes:26, inner:24 } });
      break;
    case 'tone-grad':
      el = BASE('tone-grad', { w:300, h:200, props:{ color:'#1b181c', dir:180, from:60, to:0 } });
      break;
    case 'image':
      el = BASE('image', { w:260, h:260, props:{ src:'', fit:'cover', frame:true, label:'Drop / click to add art' } });
      break;
    case 'divider':
      el = BASE('divider', { w:320, h:14, props:{ color:'#1b181c', weight:5 } });
      break;
    default:
      el = BASE('text');
  }
  if (at) { el.x = Math.round(at.x - el.w / 2); el.y = Math.round(at.y - el.h / 2); }
  return el;
}

export function starterProject() {
  return {
    v: 1,
    title: 'Untitled One-Shot',
    author: '',
    pages: [starterPage(), { id: uid('pg'), bg: 'paper', els: [] }],
    cur: 0,
  };
}

function starterPage() {
  const panel  = makeElement('panel');    panel.x=40; panel.y=40; panel.w=520; panel.h=300;
  const tone   = makeElement('screentone'); tone.x=70; tone.y=70; tone.w=300; tone.h=240; tone.props.density=6; tone.props.opacity=22;
  const speed  = makeElement('speed');    speed.x=300; speed.y=70; speed.w=250; speed.h=240; speed.props.kind='radial'; speed.props.density=42;
  const sfx    = makeElement('sfx');      sfx.x=360; sfx.y=120; sfx.props.text='ドンッ'; sfx.props.size=72;
  const narr   = makeElement('narration'); narr.x=60; narr.y=60; narr.w=240; narr.props.text='The browser flickered to life…';
  const bubble = makeElement('bubble');   bubble.x=330; bubble.y=210; bubble.props.text='It actually runs?!';
  const title  = makeElement('text');     title.x=44; title.y=360; title.w=540; title.props.text='CHAPTER 01 — THE BROWSER ARC'; title.props.font='archivo'; title.props.size=30;
  return { id: uid('pg'), bg: 'paper', els: [panel, tone, speed, narr, bubble, sfx, title] };
}

export function bgStyle(bg) {
  switch (bg) {
    case 'white':     return { background:'#fff' };
    case 'tone-soft': return { background:'#fff', backgroundImage:'radial-gradient(rgba(27,24,28,.16) 1px, transparent 1.4px)', backgroundSize:'7px 7px' };
    case 'grid':      return { background:'#f3edde', backgroundImage:'linear-gradient(rgba(27,24,28,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(27,24,28,.12) 1px,transparent 1px)', backgroundSize:'28px 28px' };
    case 'speed':     return { background:'#fff', backgroundImage:'repeating-conic-gradient(from 0deg at 50% 0%, rgba(27,24,28,.05) 0 2deg, transparent 2deg 5deg)' };
    default:          return { background:'#f3edde' };
  }
}

export function thumbColor(el) {
  if (['screentone','speed','tone-grad'].includes(el.type)) return 'rgba(27,24,28,.4)';
  if (el.type === 'flash')   return '#1b181c';
  if (el.type === 'sfx' || el.type === 'text') return 'rgba(27,24,28,.7)';
  if (['bubble','shout','thought'].includes(el.type)) return '#fff';
  if (el.type === 'narration') return '#e9e1cd';
  if (el.type === 'image')     return '#cfc8b6';
  return 'transparent';
}

export function toHex(c) {
  if (!c) return '#000000';
  if (c[0] === '#' && c.length === 7) return c;
  if (c[0] === '#' && c.length === 4) return '#' + c.slice(1).split('').map(x => x + x).join('');
  return '#1b181c';
}

export function encodeProject(p) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(p)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); } catch(e) { return ''; } }
export function decodeProject(s)  { try { return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/'))))); } catch(e) { return null; } }
