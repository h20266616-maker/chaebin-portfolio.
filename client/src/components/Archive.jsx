import { useState } from 'react'
import { ARCHIVE_TYPES, archive } from '../data/archive'
import Img from './Img'
import Section from './Section'

const pill = (active) =>
  `pb-1 border-b-2 transition-colors duration-fast ${
    active ? 'border-accent font-heading text-ink' : 'border-transparent text-muted hover:text-ink'
  }`

export default function Archive() {
  const [type, setType] = useState('전체')
  const list = archive.filter((e) => type === '전체' || e.type === type)

  return (
    <Section id="archive" title="아카이브">
      <div role="group" aria-label="기록 종류" className="flex flex-wrap gap-x-5 gap-y-2">
        {['전체', ...ARCHIVE_TYPES].map((t) => (
          <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={pill(type === t)}>
            {t}
          </button>
        ))}
      </div>

      <ol key={type} className="mt-10 animate-fade-in border-t border-line">
        {list.length === 0 && <li className="py-6 text-muted">아직 기록이 없습니다.</li>}
        {list.map((entry) => (
          <li key={entry.id} className="grid gap-2 border-b border-line py-6 md:grid-cols-[120px_120px_1fr] md:gap-6">
            <time className="text-muted">{entry.date}</time>
            <span className="text-small text-muted md:text-body">{entry.type}</span>
            <div className="max-w-prose">
              <h3 className="text-h3">{entry.title}</h3>
              {entry.body && <p className="mt-2">{entry.body}</p>}
              {entry.images.length > 0 && (
                <ul className="mt-4 flex gap-2 overflow-x-auto">
                  {entry.images.map((src, i) => (
                    <li key={src} className="shrink-0">
                      <Img
                        src={src}
                        alt={`${entry.title} 기록 이미지 ${i + 1}`}
                        className="h-24 w-auto rounded object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
