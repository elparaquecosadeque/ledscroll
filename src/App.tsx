import { useEffect, useState } from 'react'
import { Colors } from './components/Colors.tsx'
import { Display } from './components/Display.tsx'
import { InstallHelp } from './components/InstallHelp.tsx'
import { Row } from './components/Row.tsx'
import { SavedMessages } from './components/SavedMessages.tsx'
import { Switch } from './components/Switch.tsx'
import { useFullscreen } from './hooks/useFullscreen.ts'
import { useWakeLock } from './hooks/useWakeLock.ts'
import { isInstalled } from './install.ts'
import { loadSettings, saveSettings, shareUrl, toLook, type Direction, type Settings } from './settings.ts'
import { FONTS } from './sign.constants.ts'
import { STRINGS, type Lang } from './strings.ts'

const LANGS: Lang[] = ['es', 'en']
const TOAST_MS = 2000

export function App() {
  const [settings, setSettings] = useState(loadSettings)
  const [toast, setToast] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const { full, enter, exit } = useFullscreen()
  const set = (patch: Partial<Settings>) => setSettings(previous => ({ ...previous, ...patch }))
  const strings = STRINGS[settings.lang]

  useEffect(() => saveSettings(settings), [settings])
  useWakeLock(settings.wake)

  const directions: [Direction, string, string][] = [
    [-1, '‹', strings.left],
    [0, '❚❚', strings.pause],
    [1, '›', strings.right],
  ]

  const saveMessage = () =>
    set({ saved: [toLook(settings), ...settings.saved.filter(look => look.text !== settings.text)] })

  const share = async () => {
    const url = shareUrl(toLook(settings))
    try {
      if (navigator.share) return await navigator.share({ title: settings.text, url })
      await navigator.clipboard.writeText(url)
      setToast(strings.copied)
      setTimeout(() => setToast(''), TOAST_MS)
    } catch {
      // The user closed the share sheet, or clipboard access was denied.
    }
  }

  if (full) return <Display look={settings} full onClick={exit} />

  return (
    <main>
      <Display look={settings} />
      <div className="panel">
        {showHelp && <InstallHelp strings={strings} onClose={() => setShowHelp(false)} />}
        <div className="lang">
          {!isInstalled && (
            <button className="install" onClick={() => setShowHelp(true)}>
              📲 {strings.install}
            </button>
          )}
          {LANGS.map(lang => (
            <button key={lang} className={settings.lang === lang ? 'on' : ''} onClick={() => set({ lang })}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="textrow">
          <input
            className="text"
            value={settings.text}
            onChange={event => set({ text: event.target.value })}
            aria-label={strings.text}
            placeholder={strings.text}
          />
          <button onClick={saveMessage} disabled={!settings.text.trim()}>
            {strings.save}
          </button>
        </div>
        <SavedMessages
          saved={settings.saved}
          strings={strings}
          onLoad={look => set(look)}
          onDelete={index => set({ saved: settings.saved.filter((_, i) => i !== index) })}
        />

        <h2>{strings.scroll}</h2>
        <Row label={strings.dir}>
          <div className="seg">
            {directions.map(([dir, icon, label]) => (
              <button
                key={dir}
                className={settings.dir === dir ? 'on' : ''}
                onClick={() => set({ dir })}
                aria-label={label}
              >
                {icon}
              </button>
            ))}
          </div>
        </Row>
        <Row label={strings.speed}>
          <input
            type="range"
            min="0.2"
            max="6"
            step="0.1"
            value={settings.speed}
            onChange={event => set({ speed: +event.target.value })}
          />
        </Row>
        <Row label={strings.blink}>
          <Switch checked={settings.blink} onChange={blink => set({ blink })} />
        </Row>
        <Row label={strings.blinkHz}>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={settings.blinkHz}
            disabled={!settings.blink}
            onChange={event => set({ blinkHz: +event.target.value })}
          />
        </Row>
        <Row label={strings.wake}>
          <Switch checked={settings.wake} onChange={wake => set({ wake })} />
        </Row>

        <h2>{strings.fontCfg}</h2>
        <Row label={strings.font}>
          <select value={settings.font} onChange={event => set({ font: +event.target.value })}>
            {FONTS.map((font, index) => (
              <option key={font.label} value={index}>
                {font.label}
              </option>
            ))}
          </select>
        </Row>
        <Row label={strings.size}>
          <div className="seg">
            <button onClick={() => set({ size: Math.max(10, settings.size - 5) })}>−</button>
            <span>{settings.size}%</span>
            <button onClick={() => set({ size: Math.min(150, settings.size + 5) })}>+</button>
          </div>
        </Row>
        <label className="block">
          {strings.color}
          <Colors value={settings.color} onChange={color => set({ color })} />
        </label>
        <label className="block">
          {strings.bg}
          <Colors value={settings.bg} onChange={bg => set({ bg })} />
        </label>

        <h2>{strings.effects}</h2>
        <Row label={strings.led}>
          <Switch checked={settings.led} onChange={led => set({ led })} />
        </Row>
        <Row label={strings.dot}>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={settings.dot}
            disabled={!settings.led}
            onChange={event => set({ dot: +event.target.value })}
          />
        </Row>
        <Row label={strings.glow}>
          <Switch checked={settings.glow} onChange={glow => set({ glow })} />
        </Row>
        <Row label={strings.rainbow}>
          <Switch checked={settings.rainbow} onChange={rainbow => set({ rainbow })} />
        </Row>
        <Row label={strings.bright}>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={settings.bright}
            onChange={event => set({ bright: +event.target.value })}
          />
        </Row>

        <button className="start" onClick={enter}>
          {strings.start}
        </button>
        <button className="start ghost" onClick={share}>
          {toast || strings.share}
        </button>
        <p className="hint">{strings.exit}</p>
      </div>
    </main>
  )
}
