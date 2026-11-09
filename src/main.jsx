import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { step } from './scroll.js'
import './style.css'

const T = {
  en: { text: 'Text', scroll: 'Scroll settings', dir: 'Scroll direction', speed: 'Scroll speed', blink: 'Blink', blinkHz: 'Blink frequency',
    wake: 'Keep screen on', fontCfg: 'Font settings', font: 'Font', size: 'Font size', color: 'Font color', bg: 'Background color',
    effects: 'Effects', led: 'LED dots', dot: 'LED dot size', glow: 'Glow', rainbow: 'Rainbow', bright: 'Brightness',
    save: 'Save', saved: 'Saved messages', share: 'SHARE LINK', copied: 'Link copied!',
    start: 'START', exit: 'Tap the sign to exit', left: 'Left', right: 'Right', pause: 'Pause', del: 'Delete' },
  es: { text: 'Texto', scroll: 'Configuración de desplazamiento', dir: 'Dirección de desplazamiento', speed: 'Velocidad de desplazamiento',
    blink: 'Parpadeo', blinkHz: 'Frecuencia de parpadeo', wake: 'Mantener la pantalla encendida', fontCfg: 'Configuraciones de fuente',
    font: 'Fuente', size: 'Tamaño de fuente', color: 'Color de fuente', bg: 'Color de fondo',
    effects: 'Efectos', led: 'Puntos LED', dot: 'Tamaño de puntos LED', glow: 'Resplandor', rainbow: 'Arcoíris', bright: 'Brillo',
    save: 'Guardar', saved: 'Mensajes guardados', share: 'COMPARTIR ENLACE', copied: '¡Enlace copiado!',
    start: 'COMIENZO', exit: 'Toca el letrero para salir', left: 'Izquierda', right: 'Derecha', pause: 'Pausa', del: 'Borrar' },
}

const FONTS = [
  ['Roboto Regular', 'Roboto', 400], ['Roboto Light', 'Roboto', 300], ['Roboto Medium', 'Roboto', 500], ['Roboto Bold', 'Roboto', 700],
  ['Roboto Condensed Regular', 'Roboto Condensed', 400], ['Roboto Condensed Light', 'Roboto Condensed', 300],
  ['Noto Serif', 'Noto Serif', 400], ['Rowdies Regular', 'Rowdies', 400], ['Rowdies Bold', 'Rowdies', 700], ['Rowdies Light', 'Rowdies', 300],
  ['Oxygen Regular', 'Oxygen', 400], ['Oxygen Bold', 'Oxygen', 700], ['Oxygen Light', 'Oxygen', 300],
  ['Bebas Neue', 'Bebas Neue', 400], ['VT323 (pixel)', 'VT323', 400], ['Press Start 2P (pixel)', 'Press Start 2P', 400],
]

const SWATCHES = ['#ff0000', '#ff8c00', '#ffff00', '#00ff00', '#00ffff', '#0066ff', '#8a2be2', '#ff1493', '#ffffff', '#808080', '#000000', '#8b4513']

// Sign look = everything that goes into a saved message or a share link (not lang / wake / saved list).
const LOOK = { text: 'TEXT', dir: -1, speed: 1.5, blink: false, blinkHz: 2, font: 0, size: 70, color: '#00ff00', bg: '#000000',
  led: true, dot: 4, glow: false, rainbow: false, bright: 100 }
const DEFAULTS = { ...LOOK, wake: true, saved: [], lang: navigator.language?.startsWith('es') ? 'es' : 'en' }
const look = s => Object.fromEntries(Object.keys(LOOK).map(k => [k, s[k]]))

function load() {
  let s = DEFAULTS
  try { s = { ...s, ...JSON.parse(localStorage.getItem('ledscroll')) } } catch {}
  try {
    const shared = new URLSearchParams(location.hash.slice(1)).get('s')
    if (shared) { s = { ...s, ...look({ ...LOOK, ...JSON.parse(shared) }) }; history.replaceState(null, '', location.pathname) }
  } catch {}
  return s
}

function Display({ s, full, onClick }) {
  const box = useRef(), txt = useRef(), pos = useRef(null)
  useEffect(() => {
    let last = performance.now(), raf
    const tick = now => {
      const bw = box.current.offsetWidth, bh = box.current.offsetHeight, tw = txt.current.offsetWidth
      // Paused: stay centered (also re-centers after text/size/font changes); playing: resume from wherever it is.
      if (s.dir === 0) pos.current = (bw - tw) / 2
      else pos.current = step(pos.current ?? bw, s.dir, s.speed * bh, Math.min(0.1, (now - last) / 1000), bw, tw)
      last = now
      txt.current.style.transform = `translateX(${pos.current}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [s.dir, s.speed])
  const [, family, weight] = FONTS[s.font] ?? FONTS[0]
  const animation = [s.blink && `blink ${1 / s.blinkHz}s steps(1) infinite`, s.rainbow && 'rainbow 4s linear infinite'].filter(Boolean).join(',')
  return (
    <div ref={box} className={`display${full ? ' full' : ''}${s.led ? ' led' : ''}`} onClick={onClick}
      style={{ background: s.bg, '--dot': `${s.dot}px`, filter: s.bright < 100 ? `brightness(${s.bright}%)` : undefined }}>
      <span ref={txt} className={s.glow ? 'glow' : ''} style={{ color: s.color, fontFamily: `'${family}'`, fontWeight: weight,
        fontSize: `${s.size}cqh`, animation: animation || undefined }}>{s.text || ' '}</span>
    </div>
  )
}

function Colors({ value, onChange }) {
  return (
    <div className="colors">
      {SWATCHES.map(c => <button key={c} className={c === value ? 'on' : ''} style={{ background: c }} onClick={() => onChange(c)} aria-label={c} />)}
      <input type="color" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function App() {
  const [s, setS] = useState(load)
  const [full, setFull] = useState(false)
  const [toast, setToast] = useState('')
  const set = patch => setS(p => ({ ...p, ...patch }))
  const t = T[s.lang]

  useEffect(() => { try { localStorage.setItem('ledscroll', JSON.stringify(s)) } catch {} }, [s])

  useEffect(() => {
    if (!s.wake || !('wakeLock' in navigator)) return
    let lock
    const get = () => document.visibilityState === 'visible' && navigator.wakeLock.request('screen').then(l => (lock = l)).catch(() => {})
    get()
    document.addEventListener('visibilitychange', get)
    return () => { document.removeEventListener('visibilitychange', get); lock?.release() }
  }, [s.wake])

  useEffect(() => {
    const onFs = () => !document.fullscreenElement && setFull(false)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const start = () => { setFull(true); document.documentElement.requestFullscreen?.().catch(() => {}) }
  const stop = () => { setFull(false); document.fullscreenElement && document.exitFullscreen() }

  const save = () => set({ saved: [look(s), ...s.saved.filter(m => m.text !== s.text)] })
  const share = async () => {
    const url = `${location.origin}${location.pathname}#s=${encodeURIComponent(JSON.stringify(look(s)))}`
    try {
      if (navigator.share) return await navigator.share({ title: s.text, url })
      await navigator.clipboard.writeText(url)
      setToast(t.copied); setTimeout(() => setToast(''), 2000)
    } catch {} // user closed the share sheet
  }

  if (full) return <Display s={s} full onClick={stop} />

  return (
    <main>
      <Display s={s} />
      <div className="panel">
        <div className="lang">
          {['es', 'en'].map(l => <button key={l} className={s.lang === l ? 'on' : ''} onClick={() => set({ lang: l })}>{l.toUpperCase()}</button>)}
        </div>
        <div className="textrow">
          <input className="text" value={s.text} onChange={e => set({ text: e.target.value })} aria-label={t.text} placeholder={t.text} />
          <button onClick={save} disabled={!s.text.trim()}>{t.save}</button>
        </div>
        {s.saved.length > 0 && <>
          <h2>{t.saved}</h2>
          <div className="chips">
            {s.saved.map((m, i) => (
              <span key={i} className="chip" style={{ color: m.color, background: m.bg }}>
                <button onClick={() => set(m)}>{m.text}</button>
                <button onClick={() => set({ saved: s.saved.filter((_, j) => j !== i) })} aria-label={t.del}>×</button>
              </span>
            ))}
          </div>
        </>}

        <h2>{t.scroll}</h2>
        <Row label={t.dir}>
          <div className="seg">
            {[[-1, '‹', t.left], [0, '❚❚', t.pause], [1, '›', t.right]].map(([d, icon, label]) =>
              <button key={d} className={s.dir === d ? 'on' : ''} onClick={() => set({ dir: d })} aria-label={label}>{icon}</button>)}
          </div>
        </Row>
        <Row label={t.speed}><input type="range" min="0.2" max="6" step="0.1" value={s.speed} onChange={e => set({ speed: +e.target.value })} /></Row>
        <Row label={t.blink}><Switch s={s} set={set} k="blink" /></Row>
        <Row label={t.blinkHz}><input type="range" min="0.5" max="10" step="0.5" value={s.blinkHz} disabled={!s.blink} onChange={e => set({ blinkHz: +e.target.value })} /></Row>
        <Row label={t.wake}><Switch s={s} set={set} k="wake" /></Row>

        <h2>{t.fontCfg}</h2>
        <Row label={t.font}>
          <select value={s.font} onChange={e => set({ font: +e.target.value })}>
            {FONTS.map(([label], i) => <option key={i} value={i}>{label}</option>)}
          </select>
        </Row>
        <Row label={t.size}>
          <div className="seg">
            <button onClick={() => set({ size: Math.max(10, s.size - 5) })}>−</button>
            <span>{s.size}%</span>
            <button onClick={() => set({ size: Math.min(150, s.size + 5) })}>+</button>
          </div>
        </Row>
        <label className="block">{t.color}<Colors value={s.color} onChange={color => set({ color })} /></label>
        <label className="block">{t.bg}<Colors value={s.bg} onChange={bg => set({ bg })} /></label>

        <h2>{t.effects}</h2>
        <Row label={t.led}><Switch s={s} set={set} k="led" /></Row>
        <Row label={t.dot}><input type="range" min="2" max="20" step="1" value={s.dot} disabled={!s.led} onChange={e => set({ dot: +e.target.value })} /></Row>
        <Row label={t.glow}><Switch s={s} set={set} k="glow" /></Row>
        <Row label={t.rainbow}><Switch s={s} set={set} k="rainbow" /></Row>
        <Row label={t.bright}><input type="range" min="10" max="100" step="5" value={s.bright} onChange={e => set({ bright: +e.target.value })} /></Row>

        <button className="start" onClick={start}>{t.start}</button>
        <button className="start ghost" onClick={share}>{toast || t.share}</button>
        <p className="hint">{t.exit}</p>
      </div>
    </main>
  )
}

const Row = ({ label, children }) => <label className="row"><span>{label}</span>{children}</label>
const Switch = ({ s, set, k }) => <input type="checkbox" className="switch" checked={s[k]} onChange={e => set({ [k]: e.target.checked })} />

createRoot(document.getElementById('root')).render(<App />)
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('sw.js')
