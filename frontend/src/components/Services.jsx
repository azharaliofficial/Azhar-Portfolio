import { SectionHead } from './Section.jsx'

export default function Services({ items }) {
  return (
    <section id="services" className="flex flex-col gap-space-sm">
      <SectionHead title="What I Do" note={`${items.length} services`} />
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <div
            key={s.code}
            className="flex min-h-[180px] flex-col justify-between bg-surface-container-high p-space-md transition-colors hover:bg-surface-container-highest"
          >
            <div>
              <div className="mb-2 font-telemetry text-telemetry text-primary-container">{s.code}</div>
              <h3 className="m-0 mb-2 font-headline-sm text-headline-sm leading-tight text-primary">{s.title}</h3>
              <p className="m-0 font-body-sm text-body-sm text-secondary">{s.description}</p>
            </div>
            <div className="pt-3">
              <span className="bg-surface-container-lowest px-2 py-0.5 font-telemetry text-telemetry uppercase text-primary-container">{s.stack}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
