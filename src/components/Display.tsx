import { useEffect, useRef, type CSSProperties } from 'react'
import { step } from '../scroll.ts'
import type { Look } from '../settings.ts'
import { FONTS } from '../sign.constants.ts'

interface DisplayProps {
  look: Look
  full?: boolean
  onClick?: () => void
}

export function Display({ look, full = false, onClick }: DisplayProps) {
  const box = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const x = useRef<number | null>(null)
  const { dir, speed } = look

  useEffect(() => {
    let last = performance.now()
    let frame = 0
    const tick = (now: number) => {
      if (box.current && text.current) {
        const boxWidth = box.current.offsetWidth
        const textWidth = text.current.offsetWidth
        // Paused: stay centered (also after text/size/font changes). Playing: carry on from where it is.
        // Speed is in sign heights per second, so the preview and fullscreen feel the same.
        const dt = Math.min(0.1, (now - last) / 1000)
        x.current =
          dir === 0
            ? (boxWidth - textWidth) / 2
            : step(x.current ?? boxWidth, dir, speed * box.current.offsetHeight, dt, boxWidth, textWidth)
        text.current.style.transform = `translateX(${x.current}px)`
      }
      last = now
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [dir, speed])

  const font = FONTS[look.font] ?? FONTS[0]
  const boxStyle = {
    background: look.bg,
    '--dot': `${look.dot}px`,
    filter: look.bright < 100 ? `brightness(${look.bright}%)` : undefined,
  } as CSSProperties

  return (
    <div
      ref={box}
      className={`display${full ? ' full' : ''}${look.led ? ' led' : ''}`}
      style={boxStyle}
      onClick={onClick}
    >
      <span
        ref={text}
        className={look.glow ? 'glow' : ''}
        style={{
          color: look.color,
          fontFamily: `'${font.family}'`,
          fontWeight: font.weight,
          fontSize: `${look.size}cqh`,
          animation: animationFor(look),
        }}
      >
        {look.text || ' '}
      </span>
    </div>
  )
}

function animationFor(look: Look): string | undefined {
  const parts = [
    look.blink && `blink ${1 / look.blinkHz}s steps(1) infinite`,
    look.rainbow && 'rainbow 4s linear infinite',
  ].filter(Boolean)
  return parts.length ? parts.join(',') : undefined
}
