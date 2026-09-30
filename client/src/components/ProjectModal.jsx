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

const pad = (n) => String(n).padStart(2, '0')

// 여러 장 이미지 넘겨보기 — 디자인 작업(WORK) 모달과 같은 방식:
// 큰 이미지(뒤에 같은 이미지를 흐리게) + 우하단 번호 + 아래 썸네일
function Gallery({ images, title }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => setIdx(0), [images])
  const src = images[idx]
  return (
    <div className="overflow-hidden rounded bg-[#EBEBEB]">
      <div className="relative aspect-video overflow-hidden bg-ink">
        <img
          key={`bd-${idx}`}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-[1.15] object-cover opacity-60 blur-[40px] saturate-[1.2]"
        />
        <Img key={`fg-${idx}`} src={src} alt={`${title} 이미지 ${idx + 1}`} className="absolute inset-0 m-auto max-h-[92%] max-w-[92%] object-contain" />
        <span className="absolute bottom-3 right-3 text-[0.6rem] font-semibold tabular-nums tracking-[0.06em] text-[rgba(247,247,247,0.7)]">
          {pad(idx + 1)} / {pad(images.length)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[#D4D4D4] px-4 py-3" role="group" aria-label="이미지 선택">
        {images.map((im, i) => (
          <button
            key={im}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`이미지 ${i + 1} 보기`}
            aria-pressed={i === idx}
            className={`h-[45px] w-[80px] shrink-0 overflow-hidden bg-[#D4D4D4] transition-[border-color,opacity] duration-fast ${
              i === idx ? 'border-2 border-accent opacity-100' : 'border border-ink/15 opacity-45 hover:opacity-80'
            }`}
          >
            <img src={im} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
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

export default function ProjectModal({ project, onClose }) {
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

  if (!project) return null

  const isBundle = project.items.length > 0
  const info = [
    { label: '기간', value: project.period },
    { label: '개인·팀', value: project.team },
    { label: '내 역할', value: project.role },
    { label: project.toolsLabel || '사용 툴', value: project.tools.join(', ') },
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

        {!isBundle && project.images.length > 1 && <Gallery images={project.images} title={project.title} />}

        {!isBundle && project.images.length === 1 && (
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
        {project.subtitle && <p className="mt-1 text-h3 text-muted">{project.subtitle}</p>}
        <p className="mt-2 text-small text-muted">
          {project.category} · {project.year}
        </p>
        {project.award && (
          <p className="mt-3 inline-block rounded bg-accent px-[10px] py-1 text-[0.62rem] font-semibold leading-[1.5] tracking-[0.02em]">
            ✦ {project.award}
          </p>
        )}

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

          {project.features?.length > 0 && (
            <Block title="주요 기능">
              <ul className="list-disc space-y-1 pl-5">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Block>
          )}

          {project.note && <p className="mt-6 text-small text-muted">{project.note}</p>}

          {project.board && (
            <p className="mt-6">
              <a href={project.board.href} target="_blank" rel="noreferrer" className="link">
                {project.board.label} ↗<span className="sr-only"> (새 창)</span>
              </a>
            </p>
          )}

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
            className="mt-10 inline-block rounded border border-ink px-4 py-2 text-[0.875rem] font-semibold tracking-[0.02em] transition-colors duration-fast hover:border-accent hover:bg-accent"
          >
            {project.linkLabel || '웹사이트'} ↗<span className="sr-only"> (새 창)</span>
          </a>
        )}

      </div>
    </div>
  )
}
