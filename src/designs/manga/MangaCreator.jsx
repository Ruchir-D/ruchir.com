import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CSS from './editor/editorCSS.js';
import {
  FONTS, SFX_PRESETS, LIBRARY, TYPE_LABEL, TEXTY,
  makeElement, starterProject, bgStyle, thumbColor, toHex,
  encodeProject, decodeProject, uid,
} from './editor/editorData.js';
import { ElementBody } from './editor/editorElements.jsx';

const PAGE_W = 600, PAGE_H = 848;
const SWATCHES = ['#1b181c','#e23b2e','#f3edde','#ffffff','#e9e1cd','#cfc8b6','#3a6ea5','#d99a2b'];
const AUTOSAVE_KEY = 'manga-studio:autosave:v1';
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const snap  = p => JSON.parse(JSON.stringify(p));

export default function MangaCreator() {
  const [project, setProject] = useState(() => {
    const m = location.hash.match(/[#&]p=([^&]+)/);
    if (m) { const d = decodeProject(m[1]); if (d) return d; }
    try { const a = localStorage.getItem(AUTOSAVE_KEY); if (a) { const d=JSON.parse(a); if (d&&d.pages) return d; } } catch(e) {}
    return starterProject();
  });
  const [sel,     setSel]     = useState(null);
  const [editing, setEditing] = useState(null);
  const [zoom,    setZoom]    = useState(1);
  const [toast,   setToast]   = useState(null);
  const [readonly,   setReadonly]   = useState(() => /[#&]ro=1/.test(location.hash));
  const [snapGuides, setSnapGuides] = useState([]);

  const stageRef  = useRef(null);
  const past      = useRef([]);
  const future    = useRef([]);
  const histMeta  = useRef({ tag:null, t:0 });
  const drag      = useRef(null);
  const fileRef   = useRef(null);
  const scaleRef  = useRef(1);

  const page = project.pages[project.cur];

  // autosave
  useEffect(() => {
    const id = setTimeout(() => { try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project)); } catch(e){} }, 400);
    return () => clearTimeout(id);
  }, [project]);

  // fit zoom
  const [fit, setFit] = useState(0.8);
  useEffect(() => {
    const calc = () => {
      const el = stageRef.current; if (!el) return;
      const pad = 80;
      const s = Math.min((el.clientWidth-pad)/PAGE_W, (el.clientHeight-pad)/PAGE_H);
      setFit(clamp(s, 0.2, 2));
    };
    calc(); window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  const scale = fit * zoom;
  scaleRef.current = scale;

  // ---------- snap helpers ----------
  function buildSnapTargets(excludeId, els) {
    const others = els.filter(e => e.id !== excludeId);
    return {
      x: [0, PAGE_W / 2, PAGE_W, ...others.flatMap(e => [e.x, e.x + e.w / 2, e.x + e.w])],
      y: [0, PAGE_H / 2, PAGE_H, ...others.flatMap(e => [e.y, e.y + e.h / 2, e.y + e.h])],
    };
  }
  function applySnap(rawX, rawY, w, h, targets) {
    const THRESH = 7 / scaleRef.current;
    const guides = [];
    let snappedX = rawX, snappedY = rawY;
    // check left edge, center-x, right edge of moving element
    for (const [pt, offset] of [[rawX, 0], [rawX + w / 2, w / 2], [rawX + w, w]]) {
      let best = null, bestDist = THRESH;
      for (const t of targets.x) {
        const d = Math.abs(pt - t); if (d < bestDist) { bestDist = d; best = t; }
      }
      if (best !== null) { snappedX = rawX + (best - pt); guides.push({ type:'v', pos: best }); break; }
    }
    // check top edge, center-y, bottom edge
    for (const [pt] of [[rawY], [rawY + h / 2], [rawY + h]]) {
      let best = null, bestDist = THRESH;
      for (const t of targets.y) {
        const d = Math.abs(pt - t); if (d < bestDist) { bestDist = d; best = t; }
      }
      if (best !== null) { snappedY = rawY + (best - pt); guides.push({ type:'h', pos: best }); break; }
    }
    return { x: snappedX, y: snappedY, guides };
  }

  // ---------- align to page ----------
  function alignEl(id, dir) {
    const el = page.els.find(e => e.id === id); if (!el) return;
    pushHistory();
    const patch = {
      left:    { x: 0 },
      centerH: { x: Math.round((PAGE_W - el.w) / 2) },
      right:   { x: PAGE_W - el.w },
      top:     { y: 0 },
      middleV: { y: Math.round((PAGE_H - el.h) / 2) },
      bottom:  { y: PAGE_H - el.h },
    }[dir];
    if (patch) updateEl(id, patch);
  }

  // ---------- history ----------
  function pushHistory(tag) {
    const now = Date.now();
    if (tag && histMeta.current.tag===tag && now-histMeta.current.t < 700) {
      histMeta.current.t = now; return;
    }
    histMeta.current = { tag, t:now };
    past.current.push(JSON.stringify(project));
    if (past.current.length > 80) past.current.shift();
    future.current.length = 0;
  }
  function undo() {
    if (!past.current.length) return;
    future.current.push(JSON.stringify(project));
    setProject(JSON.parse(past.current.pop()));
    setEditing(null);
  }
  function redo() {
    if (!future.current.length) return;
    past.current.push(JSON.stringify(project));
    setProject(JSON.parse(future.current.pop()));
    setEditing(null);
  }

  // ---------- mutations ----------
  function mutatePage(fn) {
    setProject(p => { const np=snap(p); np.pages[np.cur]=fn(np.pages[np.cur], np); return np; });
  }
  function updateEl(id, patch, opts={}) {
    if (opts.history !== false) pushHistory(opts.tag);
    mutatePage(pg => { pg.els = pg.els.map(e => e.id===id ? deepPatch(e, patch) : e); return pg; });
  }
  function updateProps(id, propPatch, opts={}) { updateEl(id, { props:propPatch }, opts); }
  function deepPatch(e, patch) {
    const out = {...e};
    for (const k in patch) { if (k==='props') out.props={...e.props, ...patch.props}; else out[k]=patch[k]; }
    return out;
  }

  function addElement(type, at) {
    pushHistory();
    const el = makeElement(type, at || { x:PAGE_W/2, y:PAGE_H/3 });
    mutatePage(pg => { pg.els=[...pg.els, el]; return pg; });
    setSel(el.id);
    if (TEXTY.has(type) && type!=='sfx') setTimeout(() => setEditing(el.id), 30);
  }
  function deleteEl(id) {
    if (!id) return; pushHistory();
    mutatePage(pg => { pg.els=pg.els.filter(e=>e.id!==id); return pg; });
    setSel(null); setEditing(null);
  }
  function duplicateEl(id) {
    const e = page.els.find(x=>x.id===id); if (!e) return; pushHistory();
    const copy=snap(e); copy.id=uid(); copy.x+=24; copy.y+=24;
    mutatePage(pg => { pg.els=[...pg.els, copy]; return pg; });
    setSel(copy.id);
  }
  function reorder(id, dir) {
    pushHistory();
    mutatePage(pg => {
      const i=pg.els.findIndex(e=>e.id===id); if(i<0) return pg;
      const arr=[...pg.els]; const [it]=arr.splice(i,1);
      const j = dir==='front'?arr.length : dir==='back'?0 : dir==='up'?Math.min(arr.length,i+1):Math.max(0,i-1);
      arr.splice(j,0,it); pg.els=arr; return pg;
    });
  }

  // ---------- pages ----------
  function addPage() { pushHistory(); setProject(p=>{const np=snap(p);np.pages.push({id:uid('pg'),bg:'paper',els:[]});np.cur=np.pages.length-1;return np;}); setSel(null); }
  function dupPage() { pushHistory(); setProject(p=>{const np=snap(p);const c=snap(np.pages[np.cur]);c.id=uid('pg');c.els.forEach(e=>e.id=uid());np.pages.splice(np.cur+1,0,c);np.cur++;return np;}); }
  function delPage() { if(project.pages.length<=1) return; pushHistory(); setProject(p=>{const np=snap(p);np.pages.splice(np.cur,1);np.cur=clamp(np.cur,0,np.pages.length-1);return np;}); setSel(null); }
  function gotoPage(i) { setSel(null); setEditing(null); setProject(p=>({...p,cur:i})); }
  function setPageBg(bg) { pushHistory(); mutatePage(pg=>{pg.bg=bg;return pg;}); }

  // ---------- drag/resize/rotate ----------
  function onElPointerDown(e, el) {
    if (readonly) return;
    if (editing===el.id) return;
    e.stopPropagation();
    setSel(el.id);
    if (e.target.dataset && e.target.dataset.handle) return;
    pushHistory();
    drag.current = {
      mode:'move', id:el.id,
      start:{ px:e.clientX, py:e.clientY, x:el.x, y:el.y, w:el.w, h:el.h },
      snapTargets: buildSnapTargets(el.id, page.els),
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
  function onHandleDown(e, el, handle) {
    if (readonly) return;
    e.stopPropagation(); e.preventDefault();
    setSel(el.id); pushHistory();
    drag.current = { mode:handle==='rot'?'rotate':'resize', id:el.id, handle,
      start:{ px:e.clientX, py:e.clientY, x:el.x, y:el.y, w:el.w, h:el.h, rot:el.rot, cx:el.x+el.w/2, cy:el.y+el.h/2 } };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
  function onMove(e) {
    const d=drag.current; if(!d) return;
    const dx=(e.clientX-d.start.px)/scale, dy=(e.clientY-d.start.py)/scale;
    if (d.mode==='move') {
      const rawX = d.start.x + dx, rawY = d.start.y + dy;
      const { x, y, guides } = applySnap(rawX, rawY, d.start.w, d.start.h, d.snapTargets);
      setSnapGuides(guides);
      updateEl(d.id, { x:Math.round(x), y:Math.round(y) }, { history:false });
    } else if (d.mode==='resize') {
      let {x,y,w,h}=d.start; const H=d.handle;
      if(H.includes('e')) w=d.start.w+dx;
      if(H.includes('s')) h=d.start.h+dy;
      if(H.includes('w')){ w=d.start.w-dx; x=d.start.x+dx; }
      if(H.includes('n')){ h=d.start.h-dy; y=d.start.y+dy; }
      if(w<24){ if(H.includes('w')) x=d.start.x+d.start.w-24; w=24; }
      if(h<18){ if(H.includes('n')) y=d.start.y+d.start.h-18; h=18; }
      updateEl(d.id, { x:Math.round(x), y:Math.round(y), w:Math.round(w), h:Math.round(h) }, { history:false });
    } else if (d.mode==='rotate') {
      const r  = stageRef.current.getBoundingClientRect();
      const ox = r.left + (r.width  - PAGE_W*scale)/2;
      const oy = r.top  + (r.height - PAGE_H*scale)/2;
      const ang = Math.atan2(e.clientY-(oy+d.start.cy*scale), e.clientX-(ox+d.start.cx*scale))*180/Math.PI;
      updateEl(d.id, { rot:Math.round(ang+90) }, { history:false });
    }
  }
  function onUp() { drag.current=null; setSnapGuides([]); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }

  // ---------- keyboard ----------
  useEffect(() => {
    const onKey = e => {
      if (editing) return;
      const meta = e.metaKey||e.ctrlKey;
      if (meta && e.key.toLowerCase()==='z') { e.preventDefault(); e.shiftKey?redo():undo(); return; }
      if (meta && e.key.toLowerCase()==='d') { e.preventDefault(); if(sel) duplicateEl(sel); return; }
      if ((e.key==='Delete'||e.key==='Backspace') && sel) { e.preventDefault(); deleteEl(sel); return; }
      if (sel && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault(); const step=e.shiftKey?10:1;
        const el=page.els.find(x=>x.id===sel); if(!el) return;
        updateEl(sel, { x:el.x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),
                        y:el.y+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0) }, { tag:'nudge' });
      }
      if (e.key==='Escape') setSel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, editing, page, scale, project]);

  // ---------- share / export ----------
  function shareLink(ro) {
    const code = encodeProject(project);
    const url  = `${location.origin}${location.pathname}#p=${code}${ro?'&ro=1':''}`;
    navigator.clipboard?.writeText(url).then(
      () => showToast(ro ? 'Read-only link copied' : 'Edit link copied'),
      () => showToast('Copy failed — link in console'),
    );
    if (!navigator.clipboard) console.log(url);
  }
  function exportJSON() {
    const blob=new Blob([JSON.stringify(project,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=(project.title||'manga').replace(/\s+/g,'-').toLowerCase()+'.manga.json'; a.click();
    showToast('Project downloaded');
  }
  function importJSON(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.pages){ pushHistory(); setProject(d); showToast('Project loaded'); } }catch(err){ showToast('Invalid file'); } };
    r.readAsText(f); e.target.value='';
  }
  function newProject() {
    if (!confirm('Start a new blank one-shot? Current work autosaves.')) return;
    pushHistory(); setProject({ v:1,title:'Untitled One-Shot',author:'',pages:[{id:uid('pg'),bg:'paper',els:[]}],cur:0 }); setSel(null);
  }
  function showToast(m) { setToast(m); clearTimeout(showToast._t); showToast._t=setTimeout(()=>setToast(null),2200); }

  function onUploadImage(id, file) {
    const r=new FileReader(); r.onload=()=>updateProps(id,{src:r.result}); r.readAsDataURL(file);
  }

  const selEl = page.els.find(e=>e.id===sel) || null;

  // ==================== RENDER ====================
  return (
    <div className="ms-root">
      <style>{CSS}</style>

      {/* top bar */}
      <header className="ms-top">
        <div className="ms-brand">
          <span className="ms-logo">RD</span>
          <input className="ms-title" value={project.title}
            onChange={e => setProject(p=>({...p,title:e.target.value}))}
            onFocus={() => pushHistory('title')} disabled={readonly}/>
          <span className="ms-oneshot">読切 ONE-SHOT</span>
        </div>
        <div className="ms-tools">
          <button className="ms-ib" title="Undo (⌘Z)" onClick={undo} disabled={readonly}>↺</button>
          <button className="ms-ib" title="Redo (⇧⌘Z)" onClick={redo} disabled={readonly}>↻</button>
          <span className="ms-div"/>
          <button className="ms-ib" title="Zoom out" onClick={()=>setZoom(z=>clamp(z-0.15,0.4,2.5))}>−</button>
          <span className="ms-zoom">{Math.round(scale*100)}%</span>
          <button className="ms-ib" title="Zoom in" onClick={()=>setZoom(z=>clamp(z+0.15,0.4,2.5))}>+</button>
          <button className="ms-ib" title="Reset zoom" onClick={()=>setZoom(1)}>⤢</button>
        </div>
        <div className="ms-actions">
          {!readonly && <button className="ms-btn ghost" onClick={newProject}>New</button>}
          {!readonly && <button className="ms-btn ghost" onClick={()=>fileRef.current.click()}>Import</button>}
          <button className="ms-btn ghost" onClick={exportJSON}>Export</button>
          <button className="ms-btn" onClick={()=>shareLink(false)}>Share ↗</button>
          <Link className="ms-back-link" to="/">← Portfolio</Link>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importJSON}/>
        </div>
      </header>

      <div className="ms-body">
        {/* library */}
        {!readonly && (
          <aside className="ms-lib">
            <div className="ms-lib-h">Elements</div>
            {LIBRARY.map(g => (
              <div key={g.group} className="ms-lib-g">
                <div className="ms-lib-gl">{g.group}</div>
                <div className="ms-lib-grid">
                  {g.items.map(it => (
                    <button key={it.type} className="ms-chip" title={it.hint} onClick={()=>addElement(it.type)}>
                      <span className="ms-chip-ic"><LibIcon type={it.type}/></span>
                      <span className="ms-chip-l">{it.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="ms-lib-foot">Click to drop an element onto the page, then drag to position.</div>
          </aside>
        )}

        {/* canvas */}
        <main className="ms-stage" ref={stageRef}
          onPointerDown={() => { setSel(null); setEditing(null); }}>
          <div className="ms-page-wrap" style={{ width:PAGE_W*scale, height:PAGE_H*scale }}>
            <div className="ms-page"
              style={{ width:PAGE_W, height:PAGE_H, transform:`scale(${scale})`, transformOrigin:'top left', ...bgStyle(page.bg) }}
              onPointerDown={e=>e.stopPropagation()}>
              {page.els.map(el => (
                <ElFrame key={el.id} el={el} scale={scale}
                  selected={sel===el.id} editing={editing===el.id} readonly={readonly}
                  onDown={e=>onElPointerDown(e,el)}
                  onHandle={(e,h)=>onHandleDown(e,el,h)}
                  onDouble={()=>{ if(TEXTY.has(el.type)) setEditing(el.id); }}
                  onText={t=>updateProps(el.id,{text:t},{history:false})}
                  onTextDone={()=>{ pushHistory('edit-'+el.id); setEditing(null); }}
                  onDropImage={f=>onUploadImage(el.id,f)}
                />
              ))}
              {/* snap guides */}
              {snapGuides.map((g, i) =>
                g.type === 'v'
                  ? <div key={i} className="ms-guide-v" style={{ left: g.pos }}/>
                  : <div key={i} className="ms-guide-h" style={{ top:  g.pos }}/>
              )}
            </div>
          </div>
          {page.els.length===0 && <div className="ms-empty">Empty page — add elements from the left panel ◀</div>}
          <div className="ms-pagebadge">{project.cur+1} / {project.pages.length}</div>
        </main>

        {/* inspector */}
        {!readonly && (
          <aside className="ms-insp">
            {selEl ? (
              <Inspector
                el={selEl}
                updateProps={(pp,o)=>updateProps(selEl.id,pp,o)}
                updateEl={(pp,o)=>updateEl(selEl.id,pp,o)}
                reorder={d=>reorder(selEl.id,d)}
                align={d=>alignEl(selEl.id,d)}
                del={()=>deleteEl(selEl.id)}
                dup={()=>duplicateEl(selEl.id)}
                pushHistory={pushHistory}
                onUpload={f=>onUploadImage(selEl.id,f)}
              />
            ) : (
              <PageInspector
                page={page} setPageBg={setPageBg} project={project}
                setAuthor={a=>setProject(p=>({...p,author:a}))}
                pushHistory={pushHistory}
                onShareRO={()=>shareLink(true)}
              />
            )}
          </aside>
        )}
      </div>

      {/* pages rail */}
      <footer className="ms-rail">
        <div className="ms-rail-scroll">
          {project.pages.map((pg,i) => (
            <button key={pg.id} className={`ms-thumb${i===project.cur?' on':''}`} onClick={()=>gotoPage(i)}>
              <div className="ms-thumb-page" style={bgStyle(pg.bg)}>
                {pg.els.slice(0,40).map(el => (
                  <div key={el.id} style={{
                    position:'absolute',
                    left:`${el.x/PAGE_W*100}%`, top:`${el.y/PAGE_H*100}%`,
                    width:`${el.w/PAGE_W*100}%`, height:`${el.h/PAGE_H*100}%`,
                    background:thumbColor(el), border:el.type==='panel'?'1px solid #1b181c':'none',
                    borderRadius:1, transform:`rotate(${el.rot}deg)`,
                  }}/>
                ))}
              </div>
              <span className="ms-thumb-n">{i+1}</span>
            </button>
          ))}
          {!readonly && <button className="ms-thumb add" onClick={addPage} title="Add page">+</button>}
        </div>
        {!readonly && (
          <div className="ms-rail-actions">
            <button className="ms-btn ghost sm" onClick={dupPage}>Duplicate</button>
            <button className="ms-btn ghost sm" onClick={delPage} disabled={project.pages.length<=1}>Delete page</button>
          </div>
        )}
      </footer>

      {toast && <div className="ms-toast">{toast}</div>}
      {readonly && <div className="ms-robadge">VIEWING — read-only share</div>}
    </div>
  );
}

// ==================== element frame ====================
function ElFrame({ el, scale, selected, editing, readonly, onDown, onHandle, onDouble, onText, onTextDone, onDropImage }) {
  const handles = ['nw','n','ne','e','se','s','sw','w'];
  return (
    <div className="ms-el" data-type={el.type}
      style={{ left:el.x, top:el.y, width:el.w, height:el.h, transform:`rotate(${el.rot}deg)`,
        outline:selected?'1.5px solid #e23b2e':'none', outlineOffset:2,
        cursor:readonly?'default':(editing?'text':'move'), zIndex:selected?50:1 }}
      onPointerDown={onDown}
      onDoubleClick={onDouble}
      onDragOver={el.type==='image'?e=>e.preventDefault():undefined}
      onDrop={el.type==='image'?e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) onDropImage(f); }:undefined}
    >
      <ElementBody el={el} editing={editing} onText={onText} onDone={onTextDone}/>
      {selected && !readonly && !editing && (
        <>
          {handles.map(h => (
            <span key={h} data-handle={h} className={`ms-h ms-h-${h}`}
              style={{ transform:`scale(${1/scale})` }}
              onPointerDown={e=>onHandle(e,h)}/>
          ))}
          <span className="ms-h-rot" data-handle="rot" style={{ transform:`scale(${1/scale})` }}
            onPointerDown={e=>onHandle(e,'rot')}/>
        </>
      )}
    </div>
  );
}

// ==================== inspector ====================
function Inspector({ el, updateProps, updateEl, reorder, align, del, dup, pushHistory, onUpload }) {
  const p = el.props || {};
  const set = (k,v,tag) => updateProps({[k]:v},{tag:tag||k});
  const fileRef = useRef(null);
  return (
    <div className="ms-insp-in">
      <div className="ms-insp-h">
        <span>{TYPE_LABEL[el.type]||el.type}</span>
        <span className="ms-insp-sub">{Math.round(el.w)}×{Math.round(el.h)}</span>
      </div>

      {('text' in p) && (
        <Section title="Text">
          <textarea className="ms-ta" value={p.text}
            onFocus={()=>pushHistory('t'+el.id)}
            onChange={e=>set('text',e.target.value,'t'+el.id)}/>
          <Field label="Font">
            <select className="ms-sel" value={p.font} onChange={e=>set('font',e.target.value)}>
              {FONTS.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </Field>
          <Slider label="Size" min={8} max={el.type==='sfx'?160:80} value={p.size} onChange={v=>set('size',v,'size')}/>
          {('align' in p) && <Seg label="Align" value={p.align} opts={[['left','◧'],['center','▣'],['right','◨']]} onChange={v=>set('align',v)}/>}
          {('bold' in p) && <Toggle label="Bold" value={!!p.bold} onChange={v=>set('bold',v)}/>}
          {('italic' in p) && <Toggle label="Italic" value={!!p.italic} onChange={v=>set('italic',v)}/>}
          <Field label="Color"><SwatchRow value={p.color} onChange={v=>set('color',v)}/></Field>
        </Section>
      )}

      {el.type==='sfx' && (
        <Section title="Outline">
          <Field label="Stroke"><SwatchRow value={p.stroke} onChange={v=>set('stroke',v)}/></Field>
          <Slider label="Width" min={0} max={16} value={p.strokeW} onChange={v=>set('strokeW',v,'sw')}/>
          <Slider label="Tilt" min={-45} max={45} value={p.rot||0} onChange={v=>set('rot',v,'tilt')}/>
        </Section>
      )}

      {('bg' in p) && (
        <Section title="Balloon">
          <Field label="Fill"><SwatchRow value={p.bg} onChange={v=>set('bg',v)}/></Field>
          {('stroke' in p) && el.type!=='sfx' && <Slider label="Line" min={1} max={8} value={p.stroke} onChange={v=>set('stroke',v,'ln')}/>}
          {el.type==='bubble' && <>
            <Slider label="Tail X"    min={0} max={100} value={p.tailX} onChange={v=>set('tailX',v,'tx')}/>
            <Slider label="Tail drop" min={0} max={60}  value={p.tailY} onChange={v=>set('tailY',v,'ty')}/>
          </>}
        </Section>
      )}

      {el.type==='panel' && (
        <Section title="Frame">
          <Slider label="Border" min={0} max={16} value={p.border} onChange={v=>set('border',v,'b')}/>
          <Slider label="Radius" min={0} max={60} value={p.radius} onChange={v=>set('radius',v,'r')}/>
          <Seg label="Fill" value={p.fill} opts={[['none','◻'],['white','▢'],['black','■'],['tone','▦']]} onChange={v=>set('fill',v)}/>
          {p.fill==='tone' && <Slider label="Tone" min={3} max={60} value={p.tone} onChange={v=>set('tone',v,'tone')}/>}
        </Section>
      )}

      {el.type==='divider' && (
        <Section title="Divider">
          <Slider label="Weight" min={1} max={20} value={p.weight} onChange={v=>set('weight',v,'w')}/>
          <Field label="Color"><SwatchRow value={p.color} onChange={v=>set('color',v)}/></Field>
        </Section>
      )}

      {el.type==='screentone' && (
        <Section title="Screentone">
          <Seg label="Shape"   value={p.shape}   opts={[['dots','⣿'],['lines','≣']]}  onChange={v=>set('shape',v)}/>
          <Slider label="Density" min={3}  max={28}  value={p.density} onChange={v=>set('density',v,'d')}/>
          <Slider label="Angle"   min={0}  max={180} value={p.angle}   onChange={v=>set('angle',v,'a')}/>
          <Slider label="Opacity" min={5}  max={100} value={p.opacity} onChange={v=>set('opacity',v,'o')}/>
          <Field label="Color"><SwatchRow value={p.color} onChange={v=>set('color',v)}/></Field>
        </Section>
      )}

      {el.type==='tone-grad' && (
        <Section title="Gradient">
          <Slider label="Direction" min={0}  max={360} value={p.dir}  onChange={v=>set('dir',v,'dir')}/>
          <Slider label="From"      min={0}  max={100} value={p.from} onChange={v=>set('from',v,'f')}/>
          <Slider label="To"        min={0}  max={100} value={p.to}   onChange={v=>set('to',v,'t')}/>
          <Field label="Color"><SwatchRow value={p.color} onChange={v=>set('color',v)}/></Field>
        </Section>
      )}

      {el.type==='speed' && (
        <Section title="Speed lines">
          <Seg label="Kind" value={p.kind} opts={[['radial','✺'],['horizontal','≡']]} onChange={v=>set('kind',v)}/>
          <Slider label="Density" min={14} max={90} value={p.density} onChange={v=>set('density',v,'d')}/>
          {p.kind==='radial' && <>
            <Slider label="Center X" min={0} max={100} value={p.cx} onChange={v=>set('cx',v,'cx')}/>
            <Slider label="Center Y" min={0} max={100} value={p.cy} onChange={v=>set('cy',v,'cy')}/>
          </>}
          <Field label="Color"><SwatchRow value={p.color} onChange={v=>set('color',v)}/></Field>
        </Section>
      )}

      {el.type==='flash' && (
        <Section title="Flash">
          <Slider label="Spikes" min={6}  max={48} value={p.spikes} onChange={v=>set('spikes',v,'s')}/>
          <Slider label="Inner"  min={5}  max={45} value={p.inner}  onChange={v=>set('inner',v,'i')}/>
          <Field label="Color"><SwatchRow value={p.color} onChange={v=>set('color',v)}/></Field>
        </Section>
      )}

      {el.type==='image' && (
        <Section title="Image">
          <button className="ms-btn full" onClick={()=>fileRef.current.click()}>Upload art</button>
          <input ref={fileRef} type="file" accept="image/*" hidden
            onChange={e=>{ const f=e.target.files[0]; if(f) onUpload(f); e.target.value=''; }}/>
          <Seg label="Fit" value={p.fit} opts={[['cover','▣'],['contain','▢']]} onChange={v=>set('fit',v)}/>
          <Toggle label="Frame" value={!!p.frame} onChange={v=>set('frame',v)}/>
          <div className="ms-hint">Tip: drag an image file straight onto the image box.</div>
        </Section>
      )}

      {el.type==='sfx' && (
        <Section title="Presets">
          <div className="ms-sfxgrid">
            {SFX_PRESETS.map(s=><button key={s} className="ms-sfxbtn" onClick={()=>set('text',s,'p')}>{s}</button>)}
          </div>
        </Section>
      )}

      <Section title="Align to page">
        <div className="ms-align-row">
          <div className="ms-align-grid">
            <button className="ms-align-btn" title="Align left edge"        onClick={()=>align('left')}   >├</button>
            <button className="ms-align-btn" title="Center horizontally"    onClick={()=>align('centerH')}>↔</button>
            <button className="ms-align-btn" title="Align right edge"       onClick={()=>align('right')}  >┤</button>
            <button className="ms-align-btn" title="Align top edge"         onClick={()=>align('top')}    >┬</button>
            <button className="ms-align-btn" title="Center vertically"      onClick={()=>align('middleV')}>↕</button>
            <button className="ms-align-btn" title="Align bottom edge"      onClick={()=>align('bottom')} >┴</button>
          </div>
          <div className="ms-align-labels">
            <span>L</span><span>C</span><span>R</span>
            <span>T</span><span>M</span><span>B</span>
          </div>
        </div>
      </Section>

      <Section title="Arrange">
        <div className="ms-arrange">
          <button onClick={()=>reorder('front')}>Front</button>
          <button onClick={()=>reorder('up')}>Up</button>
          <button onClick={()=>reorder('down')}>Down</button>
          <button onClick={()=>reorder('back')}>Back</button>
        </div>
        <div className="ms-pos">
          <NumField label="X" value={Math.round(el.x)} onChange={v=>updateEl({x:v},{tag:'x'})}/>
          <NumField label="Y" value={Math.round(el.y)} onChange={v=>updateEl({y:v},{tag:'y'})}/>
          <NumField label="W" value={Math.round(el.w)} onChange={v=>updateEl({w:Math.max(8,v)},{tag:'w'})}/>
          <NumField label="H" value={Math.round(el.h)} onChange={v=>updateEl({h:Math.max(8,v)},{tag:'h'})}/>
          <NumField label="↻" value={Math.round(el.rot)} onChange={v=>updateEl({rot:v},{tag:'rot'})}/>
        </div>
        <div className="ms-elactions">
          <button className="ms-btn ghost sm" onClick={dup}>Duplicate</button>
          <button className="ms-btn danger sm" onClick={del}>Delete</button>
        </div>
      </Section>
    </div>
  );
}

function PageInspector({ page, setPageBg, project, setAuthor, pushHistory, onShareRO }) {
  const BGS = [['paper','Paper'],['white','White'],['tone-soft','Soft tone'],['grid','Grid'],['speed','Speed']];
  return (
    <div className="ms-insp-in">
      <div className="ms-insp-h"><span>Page</span><span className="ms-insp-sub">600×848</span></div>
      <Section title="Background">
        <div className="ms-bggrid">
          {BGS.map(([v,l])=>(
            <button key={v} className={`ms-bgsw${page.bg===v?' on':''}`} onClick={()=>setPageBg(v)}>
              <span className="sw" style={bgStyle(v)}/>
              <span>{l}</span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Story">
        <Field label="Author">
          <input className="ms-in" value={project.author} placeholder="Your name"
            onFocus={()=>pushHistory('author')} onChange={e=>setAuthor(e.target.value)}/>
        </Field>
      </Section>
      <Section title="Share">
        <button className="ms-btn full" onClick={onShareRO}>Copy read-only link</button>
        <div className="ms-hint">Read-only hides the editor — perfect for sharing your finished one-shot.</div>
      </Section>
      <div className="ms-hint" style={{marginTop:14}}>Click any element to style it. Nothing selected = page options.</div>
    </div>
  );
}

// ==================== small controls ====================
const Section = ({ title, children }) => (
  <div className="ms-sec"><div className="ms-sec-t">{title}</div>{children}</div>
);
const Field = ({ label, children }) => (
  <label className="ms-f"><span>{label}</span><div className="ms-f-c">{children}</div></label>
);
function Slider({ label, min, max, value, onChange }) {
  return (
    <label className="ms-f"><span>{label}</span>
      <div className="ms-f-c ms-slid">
        <input type="range" min={min} max={max} value={value} onChange={e=>onChange(+e.target.value)}/>
        <b>{value}</b>
      </div></label>
  );
}
function Seg({ label, value, opts, onChange }) {
  return (
    <label className="ms-f"><span>{label}</span>
      <div className="ms-f-c ms-seg">
        {opts.map(([v,ic])=><button key={v} className={value===v?'on':''} onClick={()=>onChange(v)} title={v}>{ic}</button>)}
      </div></label>
  );
}
function Toggle({ label, value, onChange }) {
  return (
    <label className="ms-f"><span>{label}</span>
      <div className="ms-f-c">
        <button className={`ms-tog${value?' on':''}`} onClick={()=>onChange(!value)}><span/></button>
      </div></label>
  );
}
function SwatchRow({ value, onChange }) {
  return (
    <div className="ms-swrow">
      {SWATCHES.map(c=><button key={c} className={`ms-sw${value===c?' on':''}`} style={{background:c}} onClick={()=>onChange(c)}/>)}
      <label className="ms-sw custom" style={{background:value}}>
        <input type="color" value={toHex(value)} onChange={e=>onChange(e.target.value)}/>
      </label>
    </div>
  );
}
function NumField({ label, value, onChange }) {
  return (
    <label className="ms-nf"><span>{label}</span>
      <input type="number" value={value} onChange={e=>onChange(+e.target.value||0)}/>
    </label>
  );
}
function LibIcon({ type }) {
  const m = { panel:'▭', divider:'─', bubble:'💬', shout:'💥', thought:'☁', narration:'▤',
               text:'T', sfx:'ド', screentone:'⣿', 'tone-grad':'◑', speed:'✺', flash:'✶', image:'▦' };
  if (type==='text') return <b style={{fontFamily:"'Archivo Black'"}}>T</b>;
  if (type==='sfx')  return <b style={{fontFamily:"'Reggae One'"}}>ド</b>;
  return <span style={{fontSize:16}}>{m[type]||'◆'}</span>;
}
