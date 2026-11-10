import { useEffect, useRef } from 'react'
import { OS, canPromptInstall, promptInstall, type Os } from '../install.ts'
import type { Strings } from '../strings.ts'

interface InstallHelpProps {
  strings: Strings
  onClose: () => void
}

const SYSTEMS: Os[] = ['ios', 'android', 'desktop']

export function InstallHelp({ strings, onClose }: InstallHelpProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal() // Guard: StrictMode runs effects twice.
  }, [])

  const install = async () => {
    await promptInstall()
    onClose()
  }

  return (
    <dialog ref={dialog} className="help" onClose={onClose}>
      <h2>{strings.installTitle}</h2>
      {canPromptInstall() && (
        <button className="start" onClick={install}>
          {strings.installNow}
        </button>
      )}
      {SYSTEMS.map(os => {
        const [name, ...steps] = strings.howto[os]
        return (
          <details key={os} open={os === OS}>
            <summary>{name}</summary>
            <ol>
              {steps.map(text => (
                <li key={text}>{text}</li>
              ))}
            </ol>
          </details>
        )
      })}
      <form method="dialog">
        <button className="start ghost">{strings.close}</button>
      </form>
    </dialog>
  )
}
