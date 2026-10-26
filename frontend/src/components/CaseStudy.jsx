import { useEffect } from 'react'
import { slugOf, mediaUrl } from '../lib/api.js'
import { Card } from './Section.jsx'
import Thumb from './Thumb.jsx'
import { ImageGrid } from './Gallery.jsx'

const rows = [
  ['PROBLEM', 'problem'],
  ['BUILT WITH', 'built_with'],
  ['RESULT', 'result'],
]

export default function CaseStudy({ slug, projects }) {
  const index = projects.findIndex((p) => slugOf(p) === slug)
  const project = projects[index]

  useEffect(() => {
    document.title = project ? `${project.title} | Case study` : 'Project not found'
    return () => {
      document.title = 'Azhar Ali | Developer'
    }
  }, [project])

  if (!project) {
    return (
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8">
        <div className="font-mono text-[13px] tracking-[3px] text-accent">404</div>
        <h1 className="mt-3 text-4xl font-bold">That project was not found.</h1>
        <a href="#projects" className="mt-6 inline-block font-mono text-sm text-accent hover:underline">
          ← ALL PROJECTS
        </a>
      </div>
    )
  }

  const prev = projects[index - 1]
  const next = projects[index + 1]
  const story = (project.case_study ?? '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
  const shots = (project.gallery ?? []).filter(Boolean)

  return (
    <article className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 sm:py-16">
      <a href="#projects" className="font-mono text-sm tracking-[2px] text-accent hover:underline">
        ← ALL PROJECTS
      </a>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-2 font-mono text-xs tracking-[2px]">
        <span className="text-accent">{project.code}</span>
        <span className="text-paper/60">{project.tag}</span>
      </div>
      <h1 className="mt-3 text-[clamp(34px,6vw,60px)] font-bold leading-[1.05] tracking-[-1.5px]">{project.title}</h1>

      {project.cover_url && mediaUrl(project.cover_url) && (
        <Thumb src={project.cover_url} alt={`${project.title} cover`} className="mt-8 aspect-[16/9]" />
      )}

      <Card className="mt-8 !p-7">
        <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-4 text-[17px] leading-relaxed sm:grid-cols-[120px_1fr]">
          {rows.map(([label, key]) => (
            <div key={key} className="contents">
              <dt className="font-mono text-xs tracking-[2px] text-paper/55 sm:pt-1.5">{label}</dt>
              <dd className="m-0">{project[key]}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {story.length > 0 && (
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-paper/85">
          {story.map((para, i) => (
            <p key={i} className="m-0">
              {para}
            </p>
          ))}
        </div>
      )}

      {shots.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 font-mono text-xs tracking-[3px] text-accent">SCREENSHOTS</div>
          <ImageGrid images={shots} label={`${project.title} screenshot`} />
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            GITHUB
          </a>
        )}
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            LIVE DEMO
          </a>
        )}
      </div>

      <nav aria-label="More case studies" className="mt-14 grid gap-4 border-t border-white/[0.14] pt-8 font-mono text-sm sm:grid-cols-2">
        {prev ? (
          <a href={`#/p/${slugOf(prev)}`} className="text-paper/80 hover:text-accent">
            ← {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={`#/p/${slugOf(next)}`} className="text-paper/80 hover:text-accent sm:text-right">
            {next.title} →
          </a>
        )}
      </nav>
    </article>
  )
}
