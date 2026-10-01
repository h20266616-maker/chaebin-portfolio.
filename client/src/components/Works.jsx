import { useEffect, useRef, useState } from 'react'
import FolderFiles from './FolderFiles'
import WorkGallery from './WorkGallery'

// 작업 섹션: 맨 위 "파일 / 갤러리" 보기 방식 탭.
// 선택된 쪽만 그립니다(갤러리 탭이 아닐 때는 3D 애니메이션 루프도 돌지 않음).
// 주소: #file/작품id → 파일 탭, #work 또는 #work/작품id → 갤러리 탭.
// 각 컴포넌트는 그려질 때 주소를 읽어 해당 작품을 엽니다.
const TABS = [
  { id: 'file', label: '파일' },
  { id: 'gallery', label: '갤러리' },
]

function tabFromHash() {
  const { hash } = window.location
  if (hash === '#work' || hash.startsWith('#work/')) return 'gallery'
  if (hash === '#files' || hash.startsWith('#file/')) return 'file'
  return null
}

export default function Works({ projects, email }) {
  const [tab, setTab] = useState(() => tabFromHash() ?? 'file')
  const tabRefs = useRef([])

  useEffect(() => {
    const onHash = () => {
      const t = tabFromHash()
      if (t) setTab(t)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // 탭을 직접 고르면 주소도 맞춰서(#files / #work) 새로고침해도 같은 탭이 열리게
  const choose = (id) => {
    if (id === tab) return
    history.replaceState(null, '', id === 'gallery' ? '#work' : '#files')
    setTab(id)
  }

  // 좌우 방향키로 탭 이동 (WAI-ARIA tabs)
  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === tab)
    let j = null
    if (e.key === 'ArrowRight') j = (i + 1) % TABS.length
    if (e.key === 'ArrowLeft') j = (i - 1 + TABS.length) % TABS.length
    if (j == null) return
    e.preventDefault()
    choose(TABS[j].id)
    tabRefs.current[j]?.focus()
  }

  return (
    <section id="works" aria-labelledby="works-title" className="min-h-[calc(100vh-theme(spacing.header))] pt-8 md:pt-10">
      <div className="mx-auto flex max-w-page items-end justify-between gap-4 px-gutter md:px-8">
        <h2 id="works-title" className="text-h2">작업</h2>
        <div role="tablist" aria-label="작업 보기 방식" className="flex gap-6" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => {
            const on = tab === t.id
            return (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[i] = el }}
                type="button"
                role="tab"
                id={`works-tab-${t.id}`}
                aria-selected={on}
                aria-controls={`works-panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => choose(t.id)}
                className={`border-b-2 pb-1 text-h3 transition-colors duration-fast ${
                  on ? 'border-accent font-heading text-ink' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div id={`works-panel-${tab}`} role="tabpanel" aria-labelledby={`works-tab-${tab}`}>
        {tab === 'file' ? (
          <FolderFiles projects={projects} email={email} />
        ) : (
          <WorkGallery projects={projects} />
        )}
      </div>
    </section>
  )
}
