import { useEffect, useRef } from 'react'
import { awards, careers } from '../data/experience'
import Section from './Section'

// 각 줄이 화면에 들어올 때 translateY 12px→0, opacity 0→1 (400ms).
// 같은 순간에 들어온 줄끼리 60ms 간격으로 차례로. 한 번만, 동작 줄이기 설정이면 바로 보임.
function useRevealRows() {
  const ref = useRef(null)
  useEffect(() => {
    const rows = [...(ref.current?.children ?? [])]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return
    rows.forEach((row) => {
      row.style.opacity = '0'
      row.style.transform = 'translateY(12px)'
    })
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => rows.indexOf(a.target) - rows.indexOf(b.target))
          .forEach((e, k) => {
            const row = e.target
            row.style.transition = `opacity 400ms ease ${k * 60}ms, transform 400ms ease ${k * 60}ms`
            row.style.opacity = '1'
            row.style.transform = 'translateY(0)'
            io.unobserve(row)
          })
      },
      { threshold: 0.2 },
    )
    rows.forEach((row) => io.observe(row))
    return () => io.disconnect()
  }, [])
  return ref
}

function List({ title, items }) {
  const listRef = useRevealRows()
  return (
    <div>
      <h3 className="border-b border-ink pb-3 text-h3">{title}</h3>
      <ul ref={listRef}>
        {items.map((item) => (
          <li key={item.title} className="grid grid-cols-[112px_1fr] gap-4 border-b border-line py-4">
            <span className="whitespace-nowrap text-muted">{item.year}</span>
            <div>
              <p>
                {item.title}
                {item.current && (
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded bg-accent px-2 py-0.5 align-middle text-[0.7rem] font-semibold leading-[1.5]">
                    <span className="live-dot" aria-hidden="true" />
                    현재
                  </span>
                )}
              </p>
              {item.description && <p className="mt-1 text-small text-muted">{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Experience() {
  return (
    <Section id="experience" title="활동">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <List title="경력" items={careers} />
        <List title="수상" items={awards} />
      </div>
    </Section>
  )
}
