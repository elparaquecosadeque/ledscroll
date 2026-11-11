import type { Lang } from './strings.ts'

export type Direction = -1 | 0 | 1

/** Everything that defines how the sign looks: what a saved message or a share link carries. */
export interface Look {
  text: string
  dir: Direction
  speed: number
  blink: boolean
  blinkHz: number
  font: number
  size: number
  color: string
  bg: string
  led: boolean
  dot: number
  glow: boolean
  rainbow: boolean
  bright: number
}

export interface Settings extends Look {
  wake: boolean
  saved: Look[]
  lang: Lang
}

export const DEFAULT_LOOK: Look = {
  text: 'TEXT',
  dir: -1,
  speed: 1.5,
  blink: false,
  blinkHz: 2,
  font: 0,
  size: 70,
  color: '#00ff00',
  bg: '#000000',
  led: true,
  dot: 4,
  glow: false,
  rainbow: false,
  bright: 100,
}

const STORAGE_KEY = 'ledscroll'
const LOOK_KEYS = Object.keys(DEFAULT_LOOK) as (keyof Look)[]

/** Builds a Look from untrusted input, keeping only known keys whose type matches the default. */
export function toLook(input: object): Look {
  const look: Record<string, unknown> = { ...DEFAULT_LOOK }
  for (const key of LOOK_KEYS) {
    const value: unknown = (input as Record<string, unknown>)[key]
    if (typeof value === typeof DEFAULT_LOOK[key]) look[key] = value
  }
  if (![-1, 0, 1].includes(look.dir as number)) look.dir = DEFAULT_LOOK.dir
  return look as unknown as Look
}

export function encodeLook(look: Look): string {
  return `s=${encodeURIComponent(JSON.stringify(toLook(look)))}`
}

/** Reads a Look from a share-link hash (`#s=...`); null when the hash carries none or it is malformed. */
export function decodeLook(hash: string): Look | null {
  const raw = new URLSearchParams(hash.replace(/^#/, '')).get('s')
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? toLook(parsed) : null
  } catch {
    return null
  }
}

export function shareUrl(look: Look): string {
  return `${location.origin}${location.pathname}#${encodeLook(look)}`
}

export function loadSettings(): Settings {
  let settings: Settings = {
    ...DEFAULT_LOOK,
    wake: true,
    saved: [],
    lang: navigator.language.startsWith('es') ? 'es' : 'en',
  }
  try {
    settings = { ...settings, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
  } catch {
    // Storage blocked (private mode) or corrupt: start from defaults.
  }
  const shared = decodeLook(location.hash)
  if (shared) {
    settings = { ...settings, ...shared }
    history.replaceState(null, '', location.pathname)
  }
  return settings
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage blocked: settings just won't survive a reload.
  }
}
