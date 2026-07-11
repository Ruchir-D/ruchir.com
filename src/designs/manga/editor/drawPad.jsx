import { useEffect, useRef, useState } from 'react';
import { Seg, Slider, Toggle, SwatchRow } from './editorElements.jsx';

const SIZE   = 420;
const HEAD   = { cx:0.5,  cy:0.28, rx:0.15, ry:0.18 };
const TORSO  = { x:0.30,  y:0.49,  w:0.40,  h:0.40,  r:0.10 };

function roundRectPath(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}

export function DrawPad({ initialImage, onSave, onClose }) {
  const canvasRef   = useRef(null);
  const backdropRef = useRef(null);
  const drawing      = useRef(false);
  const lastPt       = useRef({ x:0, y:0 });
  const past         = useRef([]);
  const future       = useRef([]);

  const [tool,    setTool]    = useState('pencil');
  const [color,   setColor]   = useState('#1b181c');
  const [size,    setSize]    = useState(6);
  const [mirror,  setMirror]  = useState(false);
  const [guide,   setGuide]   = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    backdropRef.current?.focus();
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, SIZE, SIZE);
    const seed = () => { past.current = [canvasRef.current.toDataURL()]; future.current = []; sync(); };
    if (initialImage) {
      const img = new Image();
      img.onload  = () => { ctx.drawImage(img, 0, 0, SIZE, SIZE); seed(); };
      img.onerror = seed;
      img.src = initialImage;
    } else seed();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function sync() {
    setCanUndo(past.current.length > 1);
    setCanRedo(future.current.length > 0);
  }
  function snapshot() { return canvasRef.current.toDataURL(); }
  function restore(dataUrl) {
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }
  function pushHistory() { past.current.push(snapshot()); future.current = []; sync(); }
  function undo() {
    if (past.current.length <= 1) return;
    future.current.push(past.current.pop());
    restore(past.current[past.current.length-1]);
    sync();
  }
  function redo() {
    if (!future.current.length) return;
    const next = future.current.pop();
    past.current.push(next);
    restore(next);
    sync();
  }

  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x:(e.clientX-r.left)*(SIZE/r.width), y:(e.clientY-r.top)*(SIZE/r.height) };
  }
  function seg(ctx, x0, y0, x1, y1) { ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); }

  function onPointerDown(e) {
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    pushHistory();
    drawing.current = true;
    const p = getPos(e);
    lastPt.current = p;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = size;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color;
    seg(ctx, p.x, p.y, p.x+0.1, p.y+0.1);
    if (mirror) seg(ctx, SIZE-p.x, p.y, SIZE-p.x-0.1, p.y+0.1);
  }
  function onPointerMove(e) {
    if (!drawing.current) return;
    const p = getPos(e), last = lastPt.current;
    const ctx = canvasRef.current.getContext('2d');
    seg(ctx, last.x, last.y, p.x, p.y);
    if (mirror) seg(ctx, SIZE-last.x, last.y, SIZE-p.x, p.y);
    lastPt.current = p;
  }
  function onPointerUp() { drawing.current = false; }

  function stamp(fn) {
    pushHistory();
    const ctx = canvasRef.current.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = Math.max(2, size);
    ctx.strokeStyle = color;
    fn(ctx);
  }
  const stampHead  = () => stamp(ctx => { ctx.beginPath(); ctx.ellipse(SIZE*HEAD.cx, SIZE*HEAD.cy, SIZE*HEAD.rx, SIZE*HEAD.ry, 0, 0, Math.PI*2); ctx.stroke(); });
  const stampTorso = () => stamp(ctx => { roundRectPath(ctx, SIZE*TORSO.x, SIZE*TORSO.y, SIZE*TORSO.w, SIZE*TORSO.h, SIZE*TORSO.r); ctx.stroke(); });

  function clear() {
    pushHistory();
    const ctx = canvasRef.current.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  function handleKeyDown(e) {
    e.stopPropagation();
    if (e.key === 'Escape') { onClose(); return; }
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
  }

  return (
    <div className="ms-drawmodal-backdrop" ref={backdropRef} tabIndex={-1}
      onKeyDown={handleKeyDown}
      onPointerDown={e => { if (e.target === backdropRef.current) onClose(); }}>
      <div className="ms-drawmodal" onPointerDown={e => e.stopPropagation()}>
        <div className="ms-drawmodal-h">
          <span>Draw character</span>
          <button className="ms-ib" title="Close" onClick={onClose}>✕</button>
        </div>

        <div className="ms-drawbar">
          <Seg label="Tool" value={tool} opts={[['pencil','✎'],['eraser','⌫']]} onChange={setTool}/>
          <button className="ms-ib" title="Undo (⌘Z)" onClick={undo} disabled={!canUndo}>↺</button>
          <button className="ms-ib" title="Redo (⇧⌘Z)" onClick={redo} disabled={!canRedo}>↻</button>
          <Toggle label="Mirror" value={mirror} onChange={setMirror}/>
          <Toggle label="Guide" value={guide} onChange={setGuide}/>
        </div>
        <div className="ms-drawbar">
          <div style={{ flex:'1 1 200px' }}><Slider label="Size" min={1} max={28} value={size} onChange={setSize}/></div>
          <SwatchRow value={color} onChange={setColor}/>
        </div>

        <div className="ms-draw-stage" style={{ width:SIZE, height:SIZE }}>
          <canvas ref={canvasRef} width={SIZE} height={SIZE}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={onPointerUp} onPointerLeave={onPointerUp}/>
          {guide && (
            <svg className="ms-draw-guide" viewBox={`0 0 ${SIZE} ${SIZE}`}>
              <line x1={SIZE/2} y1="0" x2={SIZE/2} y2={SIZE} stroke="#e23b2e" strokeOpacity=".35" strokeDasharray="4 5"/>
              <ellipse cx={SIZE*HEAD.cx} cy={SIZE*HEAD.cy} rx={SIZE*HEAD.rx} ry={SIZE*HEAD.ry}
                fill="none" stroke="#e23b2e" strokeOpacity=".35" strokeDasharray="4 5"/>
              <rect x={SIZE*TORSO.x} y={SIZE*TORSO.y} width={SIZE*TORSO.w} height={SIZE*TORSO.h} rx={SIZE*TORSO.r}
                fill="none" stroke="#e23b2e" strokeOpacity=".35" strokeDasharray="4 5"/>
            </svg>
          )}
        </div>

        <div className="ms-draw-stencils">
          <button className="ms-draw-stencil" onClick={stampHead}>○ Stamp head</button>
          <button className="ms-draw-stencil" onClick={stampTorso}>▭ Stamp torso</button>
          <button className="ms-draw-stencil" onClick={clear}>Clear</button>
        </div>

        <div className="ms-draw-foot">
          <button className="ms-btn ghost sm" onClick={onClose}>Cancel</button>
          <button className="ms-btn" onClick={() => onSave(snapshot())}>Use as portrait →</button>
        </div>
      </div>
    </div>
  );
}
