import Img from './Img'

export function Placeholder({ title, className = '' }) {
  return (
    <div className={`flex items-end bg-placeholder p-5 ${className}`}>
      <span className="text-h3 font-heading">{title}</span>
    </div>
  )
}

export default function ProjectCard({ project, onOpen }) {
  const thumb = project.images[0]
  return (
    <button
      type="button"
      onClick={() => onOpen(project.id)}
      className="group block w-full text-left"
      aria-haspopup="dialog"
    >
      <div className="overflow-hidden rounded">
        <Img
          src={thumb}
          alt={`${project.title} 썸네일`}
          className="aspect-card w-full object-cover transition-opacity duration-fast group-hover:opacity-90"
          fallback={<Placeholder title={project.title} className="aspect-card w-full" />}
        />
      </div>
      <h3 className="mt-4 text-h3 group-hover:underline group-hover:decoration-accent group-hover:decoration-link group-hover:underline-offset-link">
        {project.title}
      </h3>
      <p className="mt-1 text-small text-muted">
        {project.category} · {project.year}
      </p>
      {project.award && <p className="mt-2 text-small">{project.award}</p>}
      {project.summary && <p className="mt-2">{project.summary}</p>}
    </button>
  )
}
