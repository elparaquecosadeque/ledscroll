import type { Direction } from './settings.ts'

/** Next x position of the text. Wraps fully off one edge back to the other. */
export function step(
  x: number,
  dir: Direction,
  speed: number,
  dt: number,
  boxWidth: number,
  textWidth: number,
): number {
  const next = x + dir * speed * dt
  if (dir < 0 && next < -textWidth) return boxWidth
  if (dir > 0 && next > boxWidth) return -textWidth
  return next
}
