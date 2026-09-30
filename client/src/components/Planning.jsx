import ProjectCard from './ProjectCard'
import Section from './Section'

const byFeatured = (a, b) => Number(b.featured) - Number(a.featured)

export default function Planning({ works, onOpen }) {
  return (
    <Section id="planning" title="홍보·기획 작업">
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {[...works].sort(byFeatured).map((p) => (
          <li key={p.id}>
            <ProjectCard project={p} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
