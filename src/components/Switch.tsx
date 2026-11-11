interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

/** A checkbox styled as a toggle; it stays a native checkbox for keyboard and screen readers. */
export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <input type="checkbox" className="switch" checked={checked} onChange={event => onChange(event.target.checked)} />
  )
}
