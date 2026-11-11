import type { ReactNode } from 'react'

interface RowProps {
  label: string
  children: ReactNode
}

/** A settings line: label on the left, its control on the right. The <label> wrapper names the control. */
export function Row({ label, children }: RowProps) {
  return (
    <label className="row">
      <span>{label}</span>
      {children}
    </label>
  )
}
