import { useCallback, useEffect, useState } from 'react'
import { designWorks } from '../data/designWorks'
import { planning } from '../data/planning'
import Planning from './Planning'
import ProjectModal from './ProjectModal'
import RingGallery from './RingGallery'

// 개별 작품 링크: #work/<id> (홍보·기획, 디자인 공통)
const HASH_PREFIX = '#work/'
const ALL = [...planning, ...designWorks]

function idFromHash() {
  const { hash } = window.location
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null
}

export default function Works() {
  const [openId, setOpenId] = useState(null)

  // URL 해시와 상세 화면 상태를 맞춥니다.
  useEffect(() => {
    const sync = (initial) => {
      const project = ALL.find((p) => p.id === idFromHash())
      setOpenId(project?.id ?? null)
      if (project && initial === true) document.getElementById(project.group)?.scrollIntoView()
    }
    sync(true)
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const open = useCallback((id) => {
    const project = ALL.find((p) => p.id === id)
    if (idFromHash()) history.replaceState(null, '', `#work/${id}`)
    else window.location.hash = `work/${id}`
    setOpenId(project?.id ?? null)
  }, [])

  const openProject = ALL.find((p) => p.id === openId) ?? null

  const close = useCallback(() => {
    const group = ALL.find((p) => p.id === openId)?.group ?? 'planning'
    setOpenId(null)
    if (idFromHash()) history.replaceState(null, '', `#${group}`)
  }, [openId])

  // 디자인 작업 상세에서는 기존 갤러리처럼 이전·다음 작품으로 이동
  let onPrev
  let onNext
  if (openProject?.group === 'design') {
    const i = designWorks.findIndex((p) => p.id === openId)
    const n = designWorks.length
    onPrev = () => open(designWorks[(i - 1 + n) % n].id)
    onNext = () => open(designWorks[(i + 1) % n].id)
  }

  return (
    <>
      <Planning works={planning} onOpen={open} />
      <RingGallery works={designWorks} onOpen={open} paused={openProject?.group === 'design'} />
      <ProjectModal project={openProject} onClose={close} onPrev={onPrev} onNext={onNext} />
    </>
  )
}
