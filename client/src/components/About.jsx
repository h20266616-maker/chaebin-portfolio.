import { profile } from '../data/profile'
import Img from './Img'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-16 md:py-section">
      <div className="mx-auto max-w-page px-gutter md:px-8">
        {/* 사진 + 이름 가로 배치 (아래쪽 정렬) */}
        <div className="flex items-end gap-6">
          <Img
            src={profile.photo}
            alt={`${profile.name} 프로필 사진`}
            className="h-[117px] w-[88px] flex-none rounded object-cover object-top md:h-[160px] md:w-[120px]"
          />
          <h1 id="about-title" className="text-h1" aria-label={profile.name}>
            {/* 글자 단위로 아래에서 위로 등장 (80ms 간격) */}
            <span className="rise-mask" aria-hidden="true">
              {[...profile.name].map((ch, i) => (
                <span key={i} className="rise-char" style={{ animationDelay: `${i * 80}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div>
          <dl className="mt-8 grid grid-cols-[80px_1fr] gap-y-3 border-t border-line pt-6">
            {profile.info.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-muted">{row.label}</dt>
                <dd className="break-all">
                  {row.href ? (
                    <a
                      href={row.href}
                      className="link"
                      {...(row.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 text-h3">스킬</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <li key={skill} className="rounded border border-line px-3 py-1 text-small">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
