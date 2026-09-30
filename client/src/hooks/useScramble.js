import { useState, useCallback, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%'

export function useScramble(originalText) {
  const [display, setDisplay] = useState(originalText)
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const DURATION = 600

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    startTimeRef.current = null

    const tick = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / DURATION, 1)
      const revealedCount = Math.floor(progress * originalText.length)

      setDisplay(
        originalText
          .split('')
          .map((char, i) => {
            if (char === ' ' || char === '·') return char
            if (i < revealedCount) return originalText[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(originalText)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [originalText])

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setDisplay(originalText)
  }, [originalText])

  return { display, start, stop }
}
