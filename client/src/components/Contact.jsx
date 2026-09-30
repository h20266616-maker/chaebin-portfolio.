import { contacts } from '../data/profile'
import Section from './Section'

export default function Contact() {
  return (
    <>
      <Section id="contact" title="연락처">
        <dl className="grid max-w-prose grid-cols-[80px_1fr] gap-y-3">
          {contacts.map((c) => (
            <div key={c.label} className="contents">
              <dt className="text-muted">{c.label}</dt>
              <dd className="break-all">
                <a
                  href={c.href}
                  className="link"
                  {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {c.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-page px-gutter py-8 text-small text-muted md:px-8">© 2026 박채빈</p>
      </footer>
    </>
  )
}
