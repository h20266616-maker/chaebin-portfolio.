import { useEffect } from 'react'
import About from './components/About'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Header from './components/Header'
import Works from './components/Works'

export default function App() {
  // 첫 로드 때 #planning 같은 섹션 주소로 바로 이동 (#work/<id>는 Planning이 처리)
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
        <Works />
      </main>
      <Contact />
    </>
  )
}
