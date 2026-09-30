import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])'

// 모달이 열려 있는 동안: 배경 스크롤 잠금, ESC로 닫기, 포커스 가두기, 닫히면 원래 위치로 포커스 복귀
export default function useModal(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbar}px`

    const node = ref.current
    node?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      previous?.focus?.({ preventScroll: true })
    }
  }, [open])

  return ref
}
