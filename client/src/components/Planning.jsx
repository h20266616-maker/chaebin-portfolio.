import { useCallback, useEffect, useState } from 'react'
import { planning } from '../data/planning'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import Section from './Section'

// 개별 작품 링크: #work/<id>
const HASH_PREFIX = '#work/'

const byFeatured = (a, b) => Number(b.featured) - Number(a.featured)

function idFromHash() {
  const { hash } = window.location
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null
}

export default function Planning() {
  const [openId, setOpenId] = useState(null)

  // URL 해시와 모달 상태를 맞춥니다.
  useEffect(() => {
    const sync = (initial) => {
      const project = planning.find((p) => p.id === idFromHash())
      setOpenId(project?.id ?? null)
      if (project && initial === true) document.getElementById('planning')?.scrollIntoView()
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
    if (idFromHash()) history.replaceState(null, '', '#planning')
  }, [])

  const openProject = planning.find((p) => p.id === openId) ?? null

  return (
    <Section id="planning" title="홍보·기획 작업">
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {[...planning].sort(byFeatured).map((p) => (
          <li key={p.id}>
            <ProjectCard project={p} onOpen={open} />
          </li>
        ))}
      </ul>
      <ProjectModal project={openProject} onClose={close} />
    </Section>
  )
}
