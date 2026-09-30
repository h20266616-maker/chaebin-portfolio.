import { useEffect, useRef, useState } from 'react'

// 헤더 맨 위 스크롤 진행 바 (2px, 라임). 스크롤은 프레임당 한 번만 계산.
function ProgressBar() {
  const barRef = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}

const NAV = [
  { label: '소개', href: '#about' },
  { label: '활동', href: '#experience' },
  { label: '작업', href: '#work' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-header h-header border-b border-line bg-bg">
      <ProgressBar />
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-gutter md:px-8">
        <a href="#about" className="text-h3 font-heading">
          박채빈
        </a>

        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-muted">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? '메뉴 닫기' : '메뉴 열기'}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="주요 메뉴"
          className="fixed inset-x-0 bottom-0 top-header animate-fade-in bg-bg md:hidden"
        >
          <ul className="px-gutter">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-line">
                <a href={item.href} className="block py-5 text-h2 font-heading" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
