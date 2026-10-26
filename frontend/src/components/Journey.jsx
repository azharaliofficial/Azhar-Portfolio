import { SectionHead } from './Section.jsx'
import Thumb from './Thumb.jsx'

export default function Journey({ items }) {
  return (
    <section id="journey" className="flex flex-col gap-space-sm bg-surface-container-lowest">
      <SectionHead title="My Journey" note={`${items.length} milestones`} />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
        {items.map((e) => (
          <div
            key={`${e.date_label}-${e.title}`}
            className={`flex min-h-[140px] flex-col justify-between p-2.5 transition-colors ${
              e.is_current
                ? 'bg-primary-container text-on-primary-container shadow-lg'
                : 'bg-surface-container-high hover:bg-surface-container-highest'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`font-telemetry text-telemetry ${e.is_current ? 'font-extrabold' : 'text-secondary'}`}>
                {e.is_current ? 'ACTIVE NOW' : e.date_label}
              </span>
              {e.is_current && <span className="h-2 w-2 animate-ping rounded-full bg-red-600" aria-hidden="true" />}
            </div>
            <div className="my-1">
              <Thumb src={e.image_url} alt={e.title} className="mb-1.5 aspect-[16/9]" />
              <span className={`block font-label-sm text-label-sm font-bold leading-tight ${e.is_current ? '' : 'text-primary'}`}>{e.title}</span>
              <span className={`mt-0.5 block font-telemetry text-telemetry normal-case leading-snug ${e.is_current ? '' : 'text-secondary'}`} style={{ letterSpacing: 0 }}>
                {e.description}
              </span>
            </div>
            {e.is_current && <span className="font-telemetry text-telemetry font-bold uppercase tracking-wider">{e.date_label}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
