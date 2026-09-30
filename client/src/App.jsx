import About from './components/About'
import Archive from './components/Archive'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Header from './components/Header'
import Work from './components/Work'

export default function App() {
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
        <Work />
        <Archive />
      </main>
      <Contact />
    </>
  )
}
