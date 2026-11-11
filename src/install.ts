export type Os = 'ios' | 'android' | 'desktop'

// Not in the DOM typings: Chromium-only event.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

const ua = navigator.userAgent
const isIos = /iPhone|iPad|iPod/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1)

export const OS: Os = isIos ? 'ios' : /Android/.test(ua) ? 'android' : 'desktop'

export const isInstalled =
  matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

// Chrome/Edge/Android hand us a real install prompt; iOS never does, so it only gets instructions.
let installPrompt: BeforeInstallPromptEvent | null = null
addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  installPrompt = event as BeforeInstallPromptEvent
})

export const canPromptInstall = (): boolean => installPrompt !== null

export async function promptInstall(): Promise<void> {
  await installPrompt?.prompt()
  installPrompt = null
}
