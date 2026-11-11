import { useEffect, useState } from 'react'

/** Fullscreen sign mode. iPhone Safari has no element fullscreen, so `full` still switches the layout there. */
export function useFullscreen() {
  const [full, setFull] = useState(false)

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setFull(false) // Left via Esc or the back gesture.
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enter = () => {
    setFull(true)
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
  const exit = () => {
    setFull(false)
    if (document.fullscreenElement) void document.exitFullscreen()
  }

  return { full, enter, exit }
}
