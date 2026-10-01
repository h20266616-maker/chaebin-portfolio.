import { useEffect } from 'react'
import FolderFiles from './components/FolderFiles'
import Header from './components/Header'
import ResumeSheet from './components/ResumeSheet'
import WorkGallery from './components/WorkGallery'
import { projects } from './data/projects'

export default function App() {
  // 첫 로드 때 #files 같은 섹션 주소로 바로 이동 (#file/작품id는 FolderFiles, #work/작품id는 WorkGallery가 처리)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id && !id.includes('/')) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <a
        href="#files"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-modal focus:bg-bg focus:px-4 focus:py-2"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      {/* 고정 헤더 높이만큼 띄워서 첫 섹션(작업 파일)이 가려지지 않게 */}
      <main className="pt-header">
        {/* 1. 작업 파일 */}
        <FolderFiles projects={projects} email="a01022966356@gmail.com" />
        {/* 2. 이력서 (#about) */}
        <ResumeSheet />
        {/* 3. 3D 갤러리 둘러보기 */}
        <WorkGallery projects={projects} />
      </main>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-page px-gutter py-8 text-small text-muted md:px-8">© 2026 박채빈</p>
      </footer>
    </>
  )
}
