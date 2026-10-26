import { SectionHead } from './Section.jsx'
import Thumb from './Thumb.jsx'

export default function Experience({ items }) {
  return (
    <section id="experience" className="flex flex-col gap-space-sm">
      <SectionHead title="Experience" note={`${items.length} roles`} />
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-3">
        {items.map((x, i) => (
          <div key={x.role} className="flex flex-col justify-between bg-surface-container-high p-space-md">
            <div>
              <div className="mb-1 flex items-center justify-between font-telemetry text-telemetry text-primary-container">
                <span>{x.type}</span>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <Thumb src={x.image_url} alt={x.role} className="mb-2 aspect-[16/9]" />
              <h3 className="m-0 font-headline-sm text-headline-sm text-primary">{x.role}</h3>
              <span className="mb-2 block font-label-sm text-label-sm text-primary-container">{x.org}</span>
              <p className="m-0 font-body-sm text-body-sm text-secondary">{x.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
