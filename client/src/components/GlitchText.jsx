import { useState, useEffect, useRef, useCallback } from 'react'

export default function GlitchText({ children, className = '', style = {}, tag: Tag = 'span' }) {
  const [isGlitching, setIsGlitching] = useState(false)
  const glitchingRef = useRef(false)

  const triggerGlitch = useCallback(() => {
    if (glitchingRef.current) return
    glitchingRef.current = true
    setIsGlitching(true)
    setTimeout(() => {
      setIsGlitching(false)
      glitchingRef.current = false
    }, 600)
  }, [])

  useEffect(() => {
    const initTimer = setTimeout(triggerGlitch, 300)
    const interval = setInterval(triggerGlitch, 4000)
    return () => {
      clearTimeout(initTimer)
      clearInterval(interval)
    }
  }, [triggerGlitch])

  return (
    <Tag
      className={`${className}${isGlitching ? ' glitch-active' : ''}`}
      style={style}
      onMouseEnter={triggerGlitch}
    >
      {children}
    </Tag>
  )
}
