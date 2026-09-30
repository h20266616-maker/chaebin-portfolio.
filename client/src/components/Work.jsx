import { useCallback, useEffect, useMemo, useState } from 'react'
import { DESIGN_CATEGORIES, projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import Section from './Section'

const TABS = [
  { id: 'planning', label: '기획' },
  { id: 'design', label: '디자인' },
]

const HASH_PREFIX = '#work/'

const byFeatured = (a, b) => Number(b.featured) - Number(a.featured)

function idFromHash() {
  const { hash } = window.location
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null
}

const pill = (active) =>
  `rounded px-1 pb-1 transition-colors duration-fast border-b-2 ${
    active ? 'border-accent font-heading text-ink' : 'border-transparent text-muted hover:text-ink'
  }`

export default function Work() {
  const [tab, setTab] = useState('planning')
  const [category, setCategory] = useState('전체')
  const [openId, setOpenId] = useState(null)

  // URL 해시(#work/<id>)와 모달 상태를 맞춥니다.
  useEffect(() => {
    const sync = (initial) => {
      const id = idFromHash()
      const project = projects.find((p) => p.id === id)
      if (project) {
        setTab(project.group)
        setOpenId(project.id)
        if (initial === true) document.getElementById('work')?.scrollIntoView()
      } else {
        setOpenId(null)
      }
    }
    sync(true)
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const open = (id) => {
    window.location.hash = `work/${id}`
  }

  const close = useCallback(() => {
    setOpenId(null)
    if (idFromHash()) history.replaceState(null, '', '#work')
  }, [])

  const visible = useMemo(
    () =>
      projects
        .filter((p) => p.group === tab)
        .filter((p) => tab !== 'design' || category === '전체' || p.category === category)
        .sort(byFeatured),
    [tab, category],
  )

  const openProject = projects.find((p) => p.id === openId) ?? null

  return (
    <Section id="work" title="작업">
      <div role="tablist" aria-label="작업 분류" className="flex gap-6 text-h3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="work-panel"
            onClick={() => {
              setTab(t.id)
              setCategory('전체')
            }}
            className={pill(tab === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="work-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6">
        {tab === 'design' && (
          <div role="group" aria-label="디자인 세부 분류" className="flex flex-wrap gap-x-5 gap-y-2">
            {['전체', ...DESIGN_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={pill(category === c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <ul key={`${tab}-${category}`} className="mt-10 grid animate-fade-in gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} onOpen={open} />
            </li>
          ))}
        </ul>
      </div>

      <ProjectModal project={openProject} onClose={close} />
    </Section>
  )
}
