import { useEffect } from 'react'
import About from './components/About'
import Experience from './components/Experience'
import FolderFiles from './components/FolderFiles'
import Header from './components/Header'
import { projects } from './data/projects'

// 예전 갤러리 링크(#work, #work/작품id)를 파일철 주소(#files, #file/작품id)로 바꿉니다.
// 바꾼 뒤 hashchange를 알려 FolderFiles가 해당 파일을 열게 합니다.
function redirectOldWorkHash() {
  const { hash } = window.location
  const m = hash.match(/^#work\/(.+)$/)
  if (m) {
    history.replaceState(null, '', `#file/${m[1]}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return true
  }
  if (hash === '#work') {
    history.replaceState(null, '', '#files')
    document.getElementById('files')?.scrollIntoView()
    return true
  }
  return false
}

export default function App() {
  useEffect(() => {
    // 첫 로드: 예전 주소면 바꾸고, 아니면 #about 같은 섹션 주소로 바로 이동
    if (!redirectOldWorkHash()) {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (id && !id.includes('/')) document.getElementById(id)?.scrollIntoView()
    }
    const onHash = () => redirectOldWorkHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
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
        {/* 작업 섹션: 파일철 (#file/작품id 로 특정 파일 바로 열기) */}
        <FolderFiles projects={projects} email="a01022966356@gmail.com" />
      </main>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-page px-gutter py-8 text-small text-muted md:px-8">© 2026 박채빈</p>
      </footer>
    </>
  )
}
