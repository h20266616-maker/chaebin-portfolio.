export default function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-16 md:py-section">
      <div className="mx-auto max-w-page px-gutter md:px-8">
        <h2 id={`${id}-title`} className="mb-10 text-h2 md:mb-12">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}
