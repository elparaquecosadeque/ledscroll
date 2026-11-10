import type { Look } from '../settings.ts'
import type { Strings } from '../strings.ts'

interface SavedMessagesProps {
  saved: Look[]
  strings: Strings
  onLoad: (look: Look) => void
  onDelete: (index: number) => void
}

export function SavedMessages({ saved, strings, onLoad, onDelete }: SavedMessagesProps) {
  if (saved.length === 0) return null
  return (
    <>
      <h2>{strings.saved}</h2>
      <div className="chips">
        {saved.map((look, index) => (
          <span key={look.text} className="chip" style={{ color: look.color, background: look.bg }}>
            <button onClick={() => onLoad(look)}>{look.text}</button>
            <button onClick={() => onDelete(index)} aria-label={strings.del}>
              ×
            </button>
          </span>
        ))}
      </div>
    </>
  )
}
