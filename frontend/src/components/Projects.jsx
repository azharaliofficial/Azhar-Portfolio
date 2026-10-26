import { slugOf } from '../lib/api.js'
import { SectionHead } from './Section.jsx'
import Icon from './Icon.jsx'
import Thumb from './Thumb.jsx'

const rows = [
  ['PROBLEM', 'problem'],
  ['BUILT WITH', 'built_with'],
  ['RESULT', 'result'],
]

const linkClass = 'flex items-center gap-1 font-telemetry text-telemetry uppercase text-secondary hover:text-primary'

export default function Projects({ items }) {
  return (
    <section id="projects" className="flex flex-col gap-space-sm">
      <SectionHead title="My Projects" note={`${items.length} projects`} />
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {items.map((p) => (
          <article key={slugOf(p)} className="flex flex-col justify-between bg-surface-container-high p-space-md transition-colors hover:bg-surface-container-highest">
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 font-telemetry text-telemetry text-primary-container">
                <span>{p.code}</span>
                <span>{p.tag}</span>
              </div>
              <Thumb src={p.cover_url} alt={`${p.title} cover`} className="my-2 h-36" />
              <h3 className="m-0 mb-1 font-headline-sm text-headline-sm text-primary">{p.title}</h3>
              <dl className="m-0 my-2 space-y-1 bg-surface-container-lowest p-2">
                {rows.map(([label, key]) => (
                  <div key={key} className="font-label-sm text-label-sm text-secondary">
                    <dt className="inline font-bold text-primary-container">{label}: </dt>
                    <dd className="m-0 inline">{p[key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex items-center justify-between pt-2">
              <a
                href={`#/p/${slugOf(p)}`}
                className="flex items-center gap-1 font-label-sm text-label-sm uppercase text-primary-container hover:underline"
              >
                <span>Case Fact Sheet</span>
                <Icon name="arrow_forward" size={14} />
              </a>
              <div className="flex items-center gap-3">
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Icon name="code" size={13} /> Repo
                  </a>
                )}
                {p.demo_url && (
                  <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Icon name="open_in_new" size={13} /> Demo
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
