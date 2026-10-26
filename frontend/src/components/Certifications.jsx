import { SectionHead } from './Section.jsx'
import Thumb from './Thumb.jsx'

export default function Certifications({ items }) {
  return (
    <section id="certs" className="flex flex-col gap-space-sm">
      <SectionHead title="Certificates" note={`${items.length} earned`} />
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <div key={c.title} className="flex flex-col justify-between bg-surface-container-high p-3 transition-colors hover:bg-surface-container-highest">
            <div>
              <div className="flex items-center justify-between font-telemetry text-telemetry text-primary-container">
                <span>CERT-{String(i + 1).padStart(2, '0')}</span>
                <span>{c.date_label}</span>
              </div>
              <Thumb src={c.image_url} alt={`${c.title} certificate`} className="mt-2 aspect-[16/9]" />
              <h4 className="m-0 mt-1 font-label-sm text-label-sm font-bold text-primary">{c.title}</h4>
              <p className="m-0 font-telemetry text-telemetry text-secondary">{c.issuer}</p>
            </div>
            {c.url && (
              <div className="mt-3 flex items-center justify-end bg-surface-container-lowest/50 px-2 py-1">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-telemetry text-telemetry text-primary-container hover:underline">
                  {c.link_label} ↗
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
