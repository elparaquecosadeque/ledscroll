import { SWATCHES } from '../sign.constants.ts'

interface ColorsProps {
  value: string
  onChange: (color: string) => void
}

export function Colors({ value, onChange }: ColorsProps) {
  return (
    <div className="colors">
      {SWATCHES.map(color => (
        <button
          key={color}
          className={color === value ? 'on' : ''}
          style={{ background: color }}
          onClick={() => onChange(color)}
          aria-label={color}
        />
      ))}
      <input type="color" value={value} onChange={event => onChange(event.target.value)} />
    </div>
  )
}
