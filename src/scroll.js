// Next x position of the text. dir: -1 left, 1 right, 0 paused. Wraps fully off one edge back to the other.
export function step(x, dir, speed, dt, boxW, textW) {
  x += dir * speed * dt
  if (dir < 0 && x < -textW) x = boxW
  if (dir > 0 && x > boxW) x = -textW
  return x
}
