import { useEffect, useRef } from 'react'
import { slugOf } from '../lib/api.js'
import { go } from '../lib/nav.js'
import { ImageGrid } from './Gallery.jsx'
import Thumb from './Thumb.jsx'
import Icon from './Icon.jsx'

const rows = [
  ['PROBLEM', 'problem'],
  ['BUILT WITH', 'built_with'],
  ['RESULT', 'result'],
]

// Case-study pop-up. Opened by the #/p/<slug> address, so a link to one project
// can be shared, and the browser Back button closes it.
export default function CaseModal({ slug, projects }) {
  const closeRef = useRef(null)
  const index = projects.findIndex((p) => slugOf(p) === slug)
  const project = projects[index]
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  const close = () => go('#projects')

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => {
      // An open image viewer handles Escape itself.
      if (e.key === 'Escape' && !document.querySelector('[aria-label="Image viewer"]')) go('#projects')
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  useEffect(() => {
    if (project) document.title = `${project.title} | Azhar Ali`
    return () => {
      document.title = 'Azhar Ali | Developer'
    }
  }, [project])

  const story = (project?.case_study ?? '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
  const shots = (project?.gallery ?? []).filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project ? `${project.title} case study` : 'Project not found'}
        className="thin-scroll max-h-[92vh] w-full max-w-[680px] overflow-y-auto bg-surface-container-high"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-surface-container-highest px-space-md py-2">
          <span className="font-telemetry text-telemetry text-primary-container">
            {project ? `CASE FILE // ${project.code}` : '404 // NOT FOUND'}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="flex items-center gap-1 font-telemetry text-telemetry text-secondary hover:text-primary"
          >
            [CLOSE <Icon name="close" size={11} />]
          </button>
        </div>

        {!project ? (
          <div className="p-space-xl">
            <h3 className="m-0 font-headline-sm text-headline-sm text-primary">That project was not found.</h3>
            <p className="font-body-sm text-body-sm text-secondary">The link may be old. Go back to the list of projects.</p>
            <button type="button" onClick={close} className="bg-primary-container px-space-md py-2 font-label-sm text-label-sm font-bold uppercase text-on-primary-container">
              All projects
            </button>
          </div>
        ) : (
          <div className="p-space-md sm:p-space-xl">
            <div className="font-telemetry text-telemetry uppercase text-secondary">{project.tag}</div>
            <h3 className="m-0 mt-1 font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary sm:font-headline-lg sm:text-headline-lg">
              {project.title}
            </h3>

            <Thumb src={project.cover_url} alt={`${project.title} cover`} className="mt-space-md aspect-[16/9]" />

            <dl className="m-0 mt-space-md space-y-3 bg-surface-container-lowest p-space-md">
              {rows.map(([label, key]) => (
                <div key={key}>
                  <dt className="font-telemetry text-telemetry uppercase text-primary-container">{label}</dt>
                  <dd className="m-0 mt-1 font-body-sm text-body-sm text-primary">{project[key]}</dd>
                </div>
              ))}
            </dl>

            {story.length > 0 && (
              <div className="mt-space-md space-y-3">
                {story.map((para, i) => (
                  <p key={i} className="m-0 font-body-lg text-body-lg text-secondary">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {shots.length > 0 && (
              <div className="mt-space-md">
                <div className="mb-2 font-telemetry text-telemetry uppercase text-primary-container">SCREENSHOTS</div>
                <ImageGrid images={shots} label={`${project.title} screenshot`} />
              </div>
            )}

            <div className="mt-space-md flex flex-wrap gap-x-5 gap-y-2">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-label-sm text-label-sm uppercase text-primary-container hover:underline">
                  <Icon name="code" size={14} /> Repo
                </a>
              )}
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-label-sm text-label-sm uppercase text-primary-container hover:underline">
                  <Icon name="open_in_new" size={14} /> Live demo
                </a>
              )}
            </div>

            {projects.length > 1 && (
              <div className="mt-space-xl flex items-center justify-between gap-3 border-t border-white/10 pt-space-md">
                <a href={`#/p/${slugOf(prev)}`} className="min-w-0 truncate font-telemetry text-telemetry uppercase text-secondary hover:text-primary-container">
                  ← {prev.title}
                </a>
                <a href={`#/p/${slugOf(next)}`} className="min-w-0 truncate text-right font-telemetry text-telemetry uppercase text-secondary hover:text-primary-container">
                  {next.title} →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
