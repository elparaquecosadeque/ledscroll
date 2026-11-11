import { useEffect } from 'react'

/** Keeps the screen on while enabled; the browser drops the lock when the page hides, so it is re-taken on return. */
export function useWakeLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | undefined
    const acquire = () => {
      if (document.visibilityState !== 'visible') return
      navigator.wakeLock
        .request('screen')
        .then(sentinel => (lock = sentinel))
        .catch(() => {}) // Denied (battery saver, no user gesture yet): the screen just may sleep.
    }
    acquire()
    document.addEventListener('visibilitychange', acquire)
    return () => {
      document.removeEventListener('visibilitychange', acquire)
      void lock?.release()
    }
  }, [enabled])
}
