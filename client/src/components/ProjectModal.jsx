import { useEffect, useRef, useState } from 'react'
import useModal from '../hooks/useModal'
import { isVideo } from '../data/images'
import Img from './Img'
import { Placeholder } from './ProjectCard'

const CLOSE_MS = 200

function Media({ src, alt, title }) {
  if (isVideo(src)) {
    // 영상은 모달이 열렸을 때만 불러옵니다.
    return (
      <video
        src={src}
        className="w-full rounded"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    )
  }
  return (
    <Img
      src={src}
      alt={alt}
      className="h-auto w-full rounded"
      fallback={title ? <Placeholder title={title} className="aspect-card w-full rounded" /> : null}
    />
  )
}

// 하위 작품의 작업 과정 문구를 묶어서, 같은 문구는 한 번만 보여줍니다.
function groupProcesses(items) {
  const groups = []
  for (const item of items) {
    if (!item.process) continue
    const found = groups.find((g) => g.process === item.process)
    if (found) found.titles.push(item.title)
    else groups.push({ process: item.process, titles: [item.title] })
  }
  return groups
}

function Block({ title, children }) {
  return (
    <section className="mt-10">
      <h3 className="text-h3">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export default function ProjectModal({ project, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false)
  const requestClose = () => {
    setClosing(true)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(onClose, reduce ? 0 : CLOSE_MS)
  }
  const ref = useModal(!!project, requestClose)

  const overlayRef = useRef(null)
  useEffect(() => {
    setClosing(false)
    overlayRef.current?.scrollTo(0, 0)
  }, [project?.id])

  // 방향키로 이전·다음 작품 (디자인 작업)
  useEffect(() => {
    if (!project || !onPrev || !onNext) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [project, onPrev, onNext])

  if (!project) return null

  const isBundle = project.items.length > 0
  const info = [
    { label: '기간', value: project.period },
    { label: '개인·팀', value: project.team },
    { label: '내 역할', value: project.role },
    { label: '사용 툴', value: project.tools.join(', ') },
  ].filter((row) => row.value)
  const processGroups = isBundle ? groupProcesses(project.items) : []

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-modal overflow-y-auto bg-ink/60 transition-opacity duration-base ${
        closing ? 'opacity-0' : 'animate-fade-in'
      }`}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative mx-auto min-h-full max-w-3xl bg-bg px-gutter pb-16 pt-16 md:my-10 md:min-h-0 md:rounded md:px-12"
      >
        <button
          type="button"
          onClick={requestClose}
          className="absolute right-3 top-3 p-2 md:right-4 md:top-4"
        >
          <span className="sr-only">닫기</span>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {!isBundle && project.images.length > 0 && (
          <div className="space-y-4">
            {project.images.map((src, i) => (
              <Media
                key={src}
                src={src}
                alt={`${project.title} 이미지 ${i + 1}`}
                title={i === 0 ? project.title : ''}
              />
            ))}
          </div>
        )}

        <h2 id="modal-title" className={`text-h2 ${isBundle ? '' : 'mt-10'}`}>
          {project.title}
        </h2>
        <p className="mt-2 text-small text-muted">
          {project.category} · {project.year}
        </p>
        {project.award && <p className="mt-3">{project.award}</p>}

        {info.length > 0 && (
          <dl className="mt-8 grid grid-cols-[80px_1fr] gap-y-2 border-y border-line py-4">
            {info.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-muted">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="max-w-prose">
          {project.seriesDescription && (
            <Block title={project.series ? `시리즈 · ${project.series}` : '시리즈'}>
              <p>{project.seriesDescription}</p>
            </Block>
          )}

          {project.description && <p className="mt-10">{project.description}</p>}

          {project.process && (
            <Block title="작업 과정">
              <p>{project.process}</p>
            </Block>
          )}
        </div>

        {isBundle && (
          <div className="mt-12 space-y-14">
            {project.items.map((item) => (
              <article key={item.title}>
                <div className="space-y-4">
                  {item.images.map((src, i) => (
                    <Media key={src} src={src} alt={`${item.title} 이미지 ${i + 1}`} title={item.title} />
                  ))}
                </div>
                <h3 className="mt-6 text-h3">{item.title}</h3>
                {item.description && <p className="mt-3 max-w-prose">{item.description}</p>}
              </article>
            ))}
          </div>
        )}

        {processGroups.length > 0 && (
          <div className="max-w-prose">
            <Block title="작업 과정">
              {processGroups.length === 1 ? (
                <p>{processGroups[0].process}</p>
              ) : (
                <ul className="space-y-4">
                  {processGroups.map((g) => (
                    <li key={g.process}>
                      <p className="text-small text-muted">{g.titles.join(' · ')}</p>
                      <p className="mt-1">{g.process}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Block>
          </div>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded border border-ink px-5 py-3 transition-colors duration-fast hover:bg-ink hover:text-bg"
          >
            {project.linkLabel || '바로가기'} ↗<span className="sr-only"> (새 창)</span>
          </a>
        )}

        {onPrev && onNext && (
          <nav aria-label="다른 작품" className="mt-12 flex justify-between border-t border-line pt-5">
            <button type="button" onClick={onPrev} className="hover:text-muted">
              ← 이전 작품
            </button>
            <button type="button" onClick={onNext} className="hover:text-muted">
              다음 작품 →
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
