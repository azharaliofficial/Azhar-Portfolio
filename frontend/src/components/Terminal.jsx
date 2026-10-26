import { useEffect, useRef, useState } from 'react'
import { slugOf } from '../lib/api.js'
import { go } from '../lib/nav.js'

const PROMPT = 'visitor@azhar:~$'
const CHIPS = ['help', 'about', 'skills', 'projects', 'certs']
const SECTIONS = ['journey', 'services', 'skills', 'projects', 'github', 'experience', 'certs', 'contact']

const bar = (level) => '█'.repeat(Math.round(level / 5)).padEnd(20, '░')

// Each command returns an array of lines: a string, or { text, href } for links.
function makeCommands({ profile, skills, projects, certificates, experiences }) {
  const byName = (arg) => {
    const q = arg.toLowerCase()
    const n = Number(q)
    if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
    return projects.find((p) => slugOf(p) === q || p.title.toLowerCase().includes(q))
  }

  return {
    help: () => [
      'Commands:',
      '  about            who I am',
      '  skills           skill levels',
      '  projects         my case studies',
      '  open <n|name>    open a case study, e.g. open 1',
      '  certs            certificates',
      '  experience       roles and leadership',
      '  contact          how to reach me',
      '  github           open my GitHub',
      '  goto <section>   journey, services, skills, projects, github, experience, certs, contact',
      '  clear            clear the screen',
    ],
    about: () => [`${profile.name} · ${profile.role} · ${profile.location}`, profile.bio],
    whoami: () => ['visitor (you), welcome.'],
    skills: () => skills.map((s) => `${s.name.padEnd(24).slice(0, 24)} ${bar(s.level)} ${s.level}%`),
    projects: () => [
      ...projects.map((p, i) => ({ text: `[${i + 1}] ${p.title}  (${p.tag.toLowerCase()})`, href: `#/p/${slugOf(p)}` })),
      'Type "open 1" or click a line to read the case study.',
    ],
    open: (arg) => {
      if (!arg) return ['Usage: open <number or name>. Try "projects" first.']
      const p = byName(arg)
      if (!p) return [`No project matches "${arg}".`]
      go(`#/p/${slugOf(p)}`)
      return [`Opening ${p.title}…`]
    },
    certs: () => certificates.map((c) => `• ${c.title} — ${c.issuer}, ${c.date_label}`),
    experience: () => experiences.map((x) => `• ${x.role} @ ${x.org} (${x.type.toLowerCase()})`),
    contact: () => {
      go('#contact')
      return [
        'Opening the contact form…',
        ...(profile.linkedin_url ? [{ text: `LinkedIn: ${profile.linkedin_url}`, href: profile.linkedin_url, external: true }] : []),
        ...(profile.github_url ? [{ text: `GitHub:   ${profile.github_url}`, href: profile.github_url, external: true }] : []),
      ]
    },
    github: () => {
      if (!profile.github_url) return ['No GitHub link set yet.']
      window.open(profile.github_url, '_blank', 'noopener')
      return [`Opening ${profile.github_url}`]
    },
    goto: (arg) => {
      const id = (arg ?? '').toLowerCase()
      if (!SECTIONS.includes(id)) return [`Unknown section. Try: ${SECTIONS.join(', ')}`]
      go(`#${id}`)
      return [`Jumping to ${id}…`]
    },
    ls: () => [SECTIONS.join('  ')],
    sudo: (arg) => {
      if (/^hire/.test(arg ?? '')) {
        go('#contact')
        return ['Permission granted. Opening the contact form…']
      }
      return ['visitor is not in the sudoers file. This incident will be reported.']
    },
    hire: () => {
      go('#contact')
      return ['Great choice. Opening the contact form…']
    },
  }
}

function Metric({ label, value, chip, caption }) {
  return (
    <div className="flex flex-col justify-between bg-surface-container-high p-3">
      <span className="font-telemetry text-telemetry text-primary-container">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-display leading-none text-primary">{value}</span>
        <span className="font-telemetry text-telemetry text-emerald-400">{chip}</span>
      </div>
      <span className="font-label-sm text-label-sm uppercase text-secondary">{caption}</span>
    </div>
  )
}

export default function TerminalFacts(props) {
  const { projects, certificates, experiences, profile } = props
  const commands = makeCommands(props)
  const [lines, setLines] = useState([
    { text: `${profile.name} · type a command, or tap one below.`, muted: true },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(null)
  const screen = useRef(null)
  const input = useRef(null)

  // Keep the newest output in view inside the terminal only (not the page).
  useEffect(() => {
    const el = screen.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const run = (raw) => {
    const typed = raw.trim()
    if (!typed) return
    const [name, ...rest] = typed.split(/\s+/)
    const arg = rest.join(' ')
    setHistory((h) => [...h, typed])
    setCursor(null)

    if (name === 'clear') {
      setLines([])
      return
    }
    const fn = commands[name.toLowerCase()]
    const out = fn ? fn(arg) : [`command not found: ${name}. Type "help".`]
    setLines((l) => [...l, { text: `${PROMPT} ${typed}`, input: true }, ...out.map((o) => (typeof o === 'string' ? { text: o } : o))])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = cursor === null ? history.length - 1 : Math.max(cursor - 1, 0)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault()
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(null)
        setValue('')
      } else {
        setCursor(next)
        setValue(history[next])
      }
    }
  }

  const internships = experiences.filter((x) => x.type?.toUpperCase() === 'INTERNSHIP').length
  const pad = (n) => String(n).padStart(2, '0')
  const chipBtn =
    'bg-surface-container-high px-2 py-0.5 font-telemetry text-telemetry text-secondary transition-colors hover:bg-primary-container hover:text-on-primary-container'

  return (
    <section id="terminal" className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
      <div className="flex h-[230px] flex-col justify-between bg-[#07080A] p-space-md lg:col-span-7">
        <div className="-mx-space-md -mt-space-md flex items-center justify-between bg-surface-container-high/40 px-2 py-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
            <span className="ml-2 font-telemetry text-telemetry uppercase text-secondary">Terminal</span>
          </div>
          <span className="font-telemetry text-telemetry font-bold text-primary-container">ONLINE</span>
        </div>

        <div
          ref={screen}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          onClick={() => input.current?.focus()}
          className="thin-scroll my-2 h-[125px] space-y-1 overflow-y-auto whitespace-pre-wrap break-words pr-1 font-code-block text-code-block text-primary"
        >
          {lines.map((l, i) =>
            l.href ? (
              <div key={i}>
                <a
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="text-primary-container underline-offset-2 hover:underline"
                >
                  {l.text}
                </a>
              </div>
            ) : (
              <div key={i} className={l.input ? 'text-primary-container' : l.muted ? 'text-secondary' : 'text-emerald-400'}>
                {l.text}
              </div>
            )
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="term-input" className="shrink-0 text-secondary">
              {PROMPT}
            </label>
            <input
              id="term-input"
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="Terminal command"
              className="min-w-0 flex-1 bg-transparent font-[inherit] text-primary outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-surface-container-lowest/80 px-1 py-1">
          <span className="mr-1 font-telemetry text-telemetry text-secondary">RUN:</span>
          {CHIPS.map((c) => (
            <button key={c} type="button" onClick={() => run(c)} className={chipBtn}>
              {c}
            </button>
          ))}
          <button
            type="button"
            onClick={() => run('clear')}
            className="ml-auto bg-surface-container-high px-2 py-0.5 font-telemetry text-telemetry text-secondary transition-colors hover:bg-red-500/80 hover:text-white"
          >
            clear
          </button>
        </div>
      </div>

      <div className="grid h-auto grid-cols-2 gap-space-sm lg:col-span-5 lg:h-[230px]">
        <Metric label="Projects" value={pad(projects.length)} chip="done" caption="Built so far" />
        <Metric label="Certificates" value={pad(certificates.length)} chip="earned" caption="Courses finished" />
        <Metric label="Internships" value={pad(internships)} chip="hands-on" caption="Industry roles" />
        <div className="flex min-h-[110px] flex-col justify-between bg-surface-container-high p-3">
          <span className="font-telemetry text-telemetry text-primary-container">Tech I Use</span>
          <p className="m-0 font-label-sm text-label-sm font-bold leading-tight text-primary">
            Laravel · MySQL
            <br />
            React · Python
          </p>
          <span className="font-telemetry text-telemetry uppercase text-secondary">PHP / REST API</span>
        </div>
      </div>
    </section>
  )
}
