import { useCallback, useEffect, useState } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import Section from './Section'

const SECTIONS = [
  { id: 'planning', title: '홍보·기획 작업' },
  { id: 'design', title: '디자인 작업' },
]

// 개별 작품 링크: #work/<id>
const HASH_PREFIX = '#work/'

const byFeatured = (a, b) => Number(b.featured) - Number(a.featured)

function idFromHash() {
  const { hash } = window.location
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null
}

export default function Work() {
  const [openId, setOpenId] = useState(null)

  // URL 해시와 모달 상태를 맞춥니다.
  useEffect(() => {
    const sync = (initial) => {
      const project = projects.find((p) => p.id === idFromHash())
      setOpenId(project?.id ?? null)
      if (project && initial === true) document.getElementById(project.group)?.scrollIntoView()
    }
    sync(true)
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const open = (id) => {
    window.location.hash = `work/${id}`
  }

  const close = useCallback(() => {
    const project = projects.find((p) => p.id === openId)
    setOpenId(null)
    if (idFromHash()) history.replaceState(null, '', `#${project?.group ?? 'planning'}`)
  }, [openId])

  const openProject = projects.find((p) => p.id === openId) ?? null

  return (
    <>
      {SECTIONS.map((section) => (
        <Section key={section.id} id={section.id} title={section.title}>
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {projects
              .filter((p) => p.group === section.id)
              .sort(byFeatured)
              .map((p) => (
                <li key={p.id}>
                  <ProjectCard project={p} onOpen={open} />
                </li>
              ))}
          </ul>
        </Section>
      ))}
      <ProjectModal project={openProject} onClose={close} />
    </>
  )
}
