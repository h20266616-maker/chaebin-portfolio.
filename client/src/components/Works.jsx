import { useCallback, useEffect, useState } from 'react'
import { planning } from '../data/planning'
import Planning from './Planning'
import ProjectModal from './ProjectModal'
import Work from './Work'

// 홍보·기획 작업 개별 링크: #work/<id>
const HASH_PREFIX = '#work/'

function idFromHash() {
  const { hash } = window.location
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null
}

export default function Works() {
  const [openId, setOpenId] = useState(null)

  // URL 해시와 상세 화면 상태를 맞춥니다.
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

  const open = useCallback((id) => {
    window.location.hash = `work/${id}`
  }, [])

  const close = useCallback(() => {
    setOpenId(null)
    if (idFromHash()) history.replaceState(null, '', '#planning')
  }, [])

  const openProject = planning.find((p) => p.id === openId) ?? null

  return (
    <>
      <Planning works={planning} onOpen={open} />
      {/* 디자인 작업 — 기존 WORK 갤러리 + 상세 모달 그대로 */}
      <Work />
      <ProjectModal project={openProject} onClose={close} />
    </>
  )
}
