import { useRef, useEffect } from 'react';
import { fontCss } from './editorData.js';

// ---------- helpers ----------

function hexA(hex, a) {
  const h = hex.replace('#','');
  const n = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h, 16);
  const r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  return `rgba(${r},${g},${b},${a})`;
}

function tonePattern(p) {
  const c   = p.color || '#1b181c';
  const op  = (p.opacity ?? 35) / 100;
  const rgba = hexA(c, op);
  if (p.shape === 'lines') {
    const d = Math.max(2, p.density);
    return { backgroundImage:`repeating-linear-gradient(${p.angle||0}deg, ${rgba} 0 ${d/2}px, transparent ${d/2}px ${d}px)` };
  }
  const d = Math.max(3, p.density);
  return {
    backgroundImage:`radial-gradient(${rgba} ${Math.max(1,d*0.18)}px, transparent ${Math.max(1.2,d*0.22)}px)`,
    backgroundSize:`${d}px ${d}px`,
    transform: p.angle ? `rotate(${p.angle}deg)` : undefined,
  };
}

// ---------- editable text ----------

function EditableText({ value, onChange, editing, style, onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const r = document.createRange(); r.selectNodeContents(ref.current); r.collapse(false);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
  }, [editing]);
  return (
    <div
      ref={ref}
      className="mx-edit"
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={false}
      onInput={e => onChange(e.currentTarget.textContent)}
      onBlur={onDone}
      onKeyDown={e => { if (e.key==='Escape') { e.preventDefault(); e.currentTarget.blur(); } e.stopPropagation(); }}
      style={{ outline:'none', cursor: editing ? 'text' : 'inherit', whiteSpace:'pre-wrap', ...style }}
    >{value}</div>
  );
}

function BalloonText({ el, editing, onText, onDone, pad, align }) {
  const p = el.props;
  const s = {
    position:'absolute', inset:0, padding:pad,
    display:'flex', flexDirection:'column',
    alignItems: align==='left' ? 'flex-start' : align==='right' ? 'flex-end' : 'center',
    justifyContent:'center', textAlign: align || 'center',
    fontFamily: fontCss(p.font), fontSize:p.size, color:p.color,
    fontWeight: p.bold ? 700 : 500, lineHeight:1.18,
  };
  return (
    <div style={s}>
      <EditableText value={p.text} editing={editing} onChange={onText} onDone={onDone} style={{ width:'100%' }}/>
    </div>
  );
}

// ---------- element renderers ----------

export function ElementBody({ el, editing, onText, onDone }) {
  const p = el.props || {};
  switch (el.type) {

    case 'panel': {
      const fill = p.fill==='black' ? '#1b181c' : p.fill==='white' ? '#fff' : p.fill==='tone' ? undefined : 'transparent';
      const toneStyle = p.fill==='tone' ? { ...tonePattern({ shape:'dots', density:p.tone||35, color:'#1b181c', opacity:55 }), background:'#fff' } : null;
      return <div style={{ position:'absolute', inset:0, border:`${p.border}px solid #1b181c`, borderRadius:p.radius, background:fill, ...(toneStyle||{}) }}/>;
    }

    case 'divider':
      return <div style={{ position:'absolute', left:0, right:0, top:'50%', transform:'translateY(-50%)', height:p.weight, background:p.color, borderRadius:2 }}/>;

    case 'bubble':
      return (
        <div style={{ position:'absolute', inset:0 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            <ellipse cx="50" cy="46" rx="48" ry="44" fill={p.bg} stroke="#1b181c" strokeWidth={p.stroke} vectorEffect="non-scaling-stroke"/>
          </svg>
          <svg viewBox="0 0 100 100" style={{ position:'absolute', left:0, top:0, width:'100%', height:'100%', overflow:'visible' }} preserveAspectRatio="none">
            <polygon points={`40,84 60,84 ${p.tailX},${88+p.tailY}`} fill={p.bg} stroke="#1b181c" strokeWidth={p.stroke} vectorEffect="non-scaling-stroke"/>
            <line x1="40" y1="84" x2="60" y2="84" stroke={p.bg} strokeWidth={p.stroke+1} vectorEffect="non-scaling-stroke"/>
          </svg>
          <BalloonText el={el} editing={editing} onText={onText} onDone={onDone} pad="14% 18% 22%"/>
        </div>
      );

    case 'thought':
      return (
        <div style={{ position:'absolute', inset:0 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            <path d="M18,40 Q10,22 28,20 Q34,6 54,14 Q74,4 80,22 Q96,24 88,42 Q98,58 80,64 Q78,82 56,76 Q40,88 28,72 Q8,70 18,52 Z"
                  fill={p.bg} stroke="#1b181c" strokeWidth={p.stroke} vectorEffect="non-scaling-stroke"/>
          </svg>
          <div style={{ position:'absolute', left:'12%', bottom:'-6%' }}>
            <span style={{ display:'block', width:10, height:10, borderRadius:'50%', background:p.bg, border:`${p.stroke}px solid #1b181c`, marginTop:4 }}/>
            <span style={{ display:'block', width:6, height:6, borderRadius:'50%', background:p.bg, border:`${p.stroke}px solid #1b181c`, marginTop:3, marginLeft:-6 }}/>
          </div>
          <BalloonText el={el} editing={editing} onText={onText} onDone={onDone} pad="20% 20% 24%"/>
        </div>
      );

    case 'shout': {
      const spikes=14, pts=[];
      for (let i=0; i<spikes*2; i++) {
        const a = (i/(spikes*2))*Math.PI*2 - Math.PI/2;
        const rad = i%2===0 ? 49 : 33;
        pts.push(`${50+Math.cos(a)*rad},${46+Math.sin(a)*(rad*0.92)}`);
      }
      return (
        <div style={{ position:'absolute', inset:0 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            <polygon points={pts.join(' ')} fill={p.bg} stroke="#1b181c" strokeWidth={p.stroke} vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>
          </svg>
          <BalloonText el={el} editing={editing} onText={onText} onDone={onDone} pad="22% 20%"/>
        </div>
      );
    }

    case 'narration':
      return (
        <div style={{ position:'absolute', inset:0, background:p.bg, border:`${p.stroke}px solid #1b181c`, boxShadow:'4px 4px 0 rgba(27,24,28,.25)' }}>
          <BalloonText el={el} editing={editing} onText={onText} onDone={onDone} pad="10px 13px" align={p.align}/>
        </div>
      );

    case 'sfx': {
      const s = {
        fontFamily: fontCss(p.font), fontSize:p.size, lineHeight:1, color:p.color,
        WebkitTextStroke:`${p.strokeW}px ${p.stroke}`, paintOrder:'stroke fill',
        textShadow:'3px 3px 0 rgba(27,24,28,.18)', transform:`rotate(${p.rot||0}deg)`,
        display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', textAlign:'center',
      };
      return <EditableText value={p.text} editing={editing} onChange={onText} onDone={onDone} style={s}/>;
    }

    case 'text': {
      const s = {
        fontFamily: fontCss(p.font), fontSize:p.size, color:p.color, textAlign:p.align,
        fontWeight: p.bold?700:400, fontStyle: p.italic?'italic':'normal',
        letterSpacing:(p.track||0)+'px', width:'100%', height:'100%', lineHeight:1.2,
        display:'flex', flexDirection:'column', justifyContent:'center',
      };
      return <EditableText value={p.text} editing={editing} onChange={onText} onDone={onDone} style={s}/>;
    }

    case 'screentone':
      return <div style={{ position:'absolute', inset:0, ...tonePattern(p) }}/>;

    case 'tone-grad': {
      const c = p.color || '#1b181c';
      return <div style={{ position:'absolute', inset:0, background:`linear-gradient(${p.dir}deg, ${hexA(c,(p.from||60)/100)}, ${hexA(c,(p.to||0)/100)})` }}/>;
    }

    case 'speed':
      if (p.kind === 'horizontal') {
        const d = Math.max(3, 100 - p.density + 6);
        return <div style={{ position:'absolute', inset:0,
          background:`repeating-linear-gradient(90deg, ${p.color} 0 1.5px, transparent 1.5px ${d/10+2}px)`,
          maskImage:'linear-gradient(90deg, #000, transparent)', WebkitMaskImage:'linear-gradient(90deg, #000, transparent)' }}/>;
      } else {
        const lines = Math.max(12, Math.round(p.density));
        const step  = 360 / (lines * 2);
        return <div style={{ position:'absolute', inset:0,
          background:`repeating-conic-gradient(from 0deg at ${p.cx}% ${p.cy}%, ${p.color} 0 ${step*0.45}deg, transparent ${step*0.45}deg ${step}deg)`,
          WebkitMaskImage:`radial-gradient(ellipse at ${p.cx}% ${p.cy}%, transparent 26%, #000 64%)`,
          maskImage:`radial-gradient(ellipse at ${p.cx}% ${p.cy}%, transparent 26%, #000 64%)` }}/>;
      }

    case 'flash': {
      const n=p.spikes, pts=[];
      for (let i=0; i<n*2; i++) {
        const a=(i/(n*2))*Math.PI*2 - Math.PI/2;
        const rad = i%2===0 ? 50 : (p.inner||24);
        pts.push(`${50+Math.cos(a)*rad}%,${50+Math.sin(a)*rad}%`);
      }
      return <div style={{ position:'absolute', inset:0, background:p.color, clipPath:`polygon(${pts.join(',')})` }}/>;
    }

    case 'image':
      return (
        <div style={{ position:'absolute', inset:0, border:p.frame?'4px solid #1b181c':'none', background:'#e9e1cd', overflow:'hidden' }}>
          {p.src
            ? <img src={p.src} alt="" style={{ width:'100%', height:'100%', objectFit:p.fit, display:'block' }}/>
            : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                flexDirection:'column', gap:6, color:'#8a8472', fontFamily:"'JetBrains Mono',monospace",
                fontSize:11, letterSpacing:'.1em', textAlign:'center', padding:10,
                backgroundImage:'radial-gradient(rgba(27,24,28,.12) 1px, transparent 1px)', backgroundSize:'8px 8px' }}>
                <span style={{ fontSize:22 }}>▦</span>{p.label}
              </div>}
        </div>
      );

    default:
      return null;
  }
}
