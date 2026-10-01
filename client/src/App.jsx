import { useEffect } from 'react'
import About from './components/About'
import Experience from './components/Experience'
import FolderFiles from './components/FolderFiles'
import Header from './components/Header'
import WorkGallery from './components/WorkGallery'
import { projects } from './data/projects'

export default function App() {
  // 첫 로드 때 #files 같은 섹션 주소로 바로 이동 (#file/작품id, #work/작품id는 각 컴포넌트가 처리)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id && !id.includes('/')) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-modal focus:bg-bg focus:px-4 focus:py-2"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      <main>
        <About />
        <Experience />
        {/* 작업 섹션: 파일철(#file/작품id) + 3D 갤러리(#work/작품id → 상세 모달) */}
        <FolderFiles projects={projects} email="a01022966356@gmail.com" />
        <WorkGallery projects={projects} />
      </main>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-page px-gutter py-8 text-small text-muted md:px-8">© 2026 박채빈</p>
      </footer>
    </>
  )
}
