import { profile } from '../data/profile'
import Img from './Img'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="pb-16 pt-[calc(theme(spacing.header)+48px)] md:pb-section md:pt-[calc(theme(spacing.header)+80px)]">
      <div className="mx-auto grid max-w-page gap-10 px-gutter md:grid-cols-[2fr_3fr] md:gap-16 md:px-8">
        <Img
          src={profile.photo}
          alt={`${profile.name} 프로필 사진`}
          className="aspect-portrait w-full max-w-md rounded object-cover object-top"
        />

        <div className="max-w-prose">
          <h1 id="about-title" className="text-h1">
            {profile.name}
          </h1>
          <p className="mt-4 text-h3 font-heading text-muted">
            {profile.tagline[0]}
            <br />
            {profile.tagline[1]}
          </p>
          <p className="mt-8">{profile.intro}</p>

          <dl className="mt-10 grid grid-cols-[80px_1fr] gap-y-3 border-t border-line pt-6">
            {profile.info.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-muted">{row.label}</dt>
                <dd className="break-all">
                  {row.href ? (
                    <a href={row.href} className="link">
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
