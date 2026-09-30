import { awards, careers } from '../data/experience'
import Section from './Section'

function List({ title, items }) {
  return (
    <div>
      <h3 className="border-b border-ink pb-3 text-h3">{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.title} className="grid grid-cols-[104px_1fr] gap-4 border-b border-line py-4">
            <span className="text-muted">{item.year}</span>
            <div>
              <p>{item.title}</p>
              {item.description && <p className="mt-1 text-small text-muted">{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Experience() {
  return (
    <Section id="experience" title="활동">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <List title="경력" items={careers} />
        <List title="수상" items={awards} />
      </div>
    </Section>
  )
}
