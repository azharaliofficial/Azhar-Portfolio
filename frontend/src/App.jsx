import { useCallback, useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useApi, slugOf } from './lib/api.js'
import { go } from './lib/nav.js'
import { Page } from './components/Section.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Terminal from './components/Terminal.jsx'
import Journey from './components/Journey.jsx'
import Gallery from './components/Gallery.jsx'
import Services from './components/Services.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import CaseModal from './components/CaseModal.jsx'
import ApiPanel from './components/ApiPanel.jsx'
import GithubCard, { useGithub } from './components/GithubLive.jsx'
import Experience from './components/Experience.jsx'
import Certifications from './components/Certifications.jsx'
import Contact from './components/Contact.jsx'
import CommandPalette from './components/CommandPalette.jsx'

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

const SECTION_LINKS = [
  ['Terminal', '#terminal', 'command line shell explore'],
  ['Journey', '#journey', 'timeline story'],
  ['Services', '#services', 'hire offer'],
  ['Skills', '#skills', 'stack levels'],
  ['Projects', '#projects', 'case studies work'],
  ['API and GitHub', '#api', 'commits repos activity'],
  ['Experience', '#experience', 'internship leadership'],
  ['Certificates', '#certs', 'certs certifications'],
  ['Contact', '#contact', 'email message hire'],
]

export default function App() {
  const profile = useApi('profile').data
  const academics = useApi('academics').data
  const timeline = useApi('timeline').data
  const services = useApi('services').data
  const skills = useApi('skills').data
  const projects = useApi('projects').data
  const experiences = useApi('experiences').data
  const certificates = useApi('certificates').data
  const github = useGithub(profile.github_url)

  const hash = useHash()
  const slug = hash.match(/^#\/p\/([\w-]+)/)?.[1] ?? null
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  // Section links scroll once the page is showing (the case-study pop-up sits on top of it).
  useEffect(() => {
    if (hash.length > 1 && !hash.startsWith('#/')) {
      const id = hash.slice(1)
      const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
      return () => cancelAnimationFrame(frame)
    }
  }, [hash])

  const paletteItems = useMemo(() => {
    const open = (url) => () => window.open(url, '_blank', 'noopener')
    return [
      ...SECTION_LINKS.map(([label, h, hint]) => ({ id: `s-${h.slice(1)}`, group: 'SECTION', label, hint, run: () => go(h) })),
      ...projects.map((p) => ({
        id: `p-${slugOf(p)}`,
        group: 'CASE FILE',
        label: p.title,
        hint: p.tag,
        run: () => go(`#/p/${slugOf(p)}`),
      })),
      ...skills.map((s) => ({ id: `k-${s.name}`, group: 'SKILL', label: `${s.name} (${s.level}%)`, hint: s.group, run: () => go('#skills') })),
      ...certificates.map((c, i) => ({ id: `c-${i}`, group: 'CERTIFICATE', label: c.title, hint: c.issuer, run: () => go('#certs') })),
      ...(profile.github_url ? [{ id: 'l-github', group: 'LINK', label: 'Open GitHub', run: open(profile.github_url) }] : []),
      ...(profile.linkedin_url ? [{ id: 'l-linkedin', group: 'LINK', label: 'Open LinkedIn', run: open(profile.linkedin_url) }] : []),
      ...(profile.resume_url ? [{ id: 'l-resume', group: 'LINK', label: 'Download resume', run: open(profile.resume_url) }] : []),
    ]
  }, [projects, skills, certificates, profile])

  const showGithub = github.status === 'loading' || github.status === 'ok'

  return (
    <MotionConfig reducedMotion="user">
      <Navbar name={profile.name} onSearch={openPalette} onHome={!slug} />
      <main className="blueprint-grid w-full bg-surface-container-lowest pt-14 text-primary">
        <Page id="home">
          <Hero profile={profile} academics={academics} />
          <Terminal profile={profile} skills={skills} projects={projects} certificates={certificates} experiences={experiences} />
        </Page>
        <Page>
          <Journey items={timeline} />
          <Gallery images={profile.gallery} />
          <Services items={services} />
        </Page>
        <Page>
          <Skills items={skills} />
          <section id="api" className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
            <ApiPanel wide={!showGithub} />
            {showGithub && <GithubCard github={github} githubUrl={profile.github_url} />}
          </section>
        </Page>
        <Page>
          <Projects items={projects} />
        </Page>
        <Page>
          <Experience items={experiences} />
          <Certifications items={certificates} />
        </Page>
        <Page>
          <Contact profile={profile} />
        </Page>
      </main>
      <footer className="border-t border-white/10 bg-surface-container-lowest">
        <div className="mx-auto max-w-[1120px] px-margin py-space-md font-telemetry text-telemetry text-secondary md:px-margin-desktop">
          © {new Date().getFullYear()} {profile.name} · Skardu / Faisalabad
        </div>
      </footer>
      {slug && <CaseModal slug={slug} projects={projects} />}
      <CommandPalette open={paletteOpen} onOpen={openPalette} onClose={closePalette} items={paletteItems} />
    </MotionConfig>
  )
}
