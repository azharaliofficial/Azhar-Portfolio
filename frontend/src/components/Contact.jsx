import { useState } from 'react'
import { sendContact } from '../lib/api.js'
import Icon from './Icon.jsx'

const EMAIL = 'azharali.official.pk@gmail.com'

const field =
  'bg-surface-container-lowest p-2 font-body-sm text-body-sm text-primary placeholder:text-on-surface-variant/50 focus:bg-surface-container focus:outline-none'
const label = 'font-telemetry text-telemetry uppercase text-secondary'
const quick =
  'flex items-center justify-between bg-surface-container-high p-2 font-label-sm text-label-sm uppercase text-primary transition-colors hover:bg-surface-container-highest'

const empty = { name: '', email: '', subject: '', message: '', website: '' }

function Err({ id, children }) {
  if (!children) return null
  return (
    <span id={id} role="alert" className="font-telemetry text-telemetry text-error">
      {children}
    </span>
  )
}

export default function Contact({ profile }) {
  const [form, setForm] = useState(empty)
  const [state, setState] = useState({ status: 'idle', message: '', errors: {} })
  const [copied, setCopied] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the address is selectable text anyway */
    }
  }

  async function submit(e) {
    e.preventDefault()
    const errors = {}
    if (!form.name.trim()) errors.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Please enter a valid email.'
    if (form.message.trim().length < 10) errors.message = 'Please write at least 10 characters.'
    if (Object.keys(errors).length) {
      setState({ status: 'error', message: '', errors })
      return
    }

    setState({ status: 'sending', message: '', errors: {} })
    try {
      const subject = form.subject.trim()
      await sendContact({
        name: form.name,
        email: form.email,
        message: subject ? `Subject: ${subject}\n\n${form.message}` : form.message,
        website: form.website, // honeypot
      })
      setForm(empty)
      setState({ status: 'ok', message: 'Message sent. I will reply by email.', errors: {} })
    } catch (err) {
      const first = (key) => err.errors?.[key]?.[0]
      setState({
        status: 'error',
        message: err.message,
        errors: { name: first('name'), email: first('email'), message: first('message') },
      })
    }
  }

  const { errors } = state
  const links = [
    { label: 'LinkedIn Profile', href: profile.linkedin_url, icon: 'link' },
    { label: 'GitHub Code Repos', href: profile.github_url, icon: 'terminal' },
    { label: 'Download Resume', href: profile.resume_url, icon: 'arrow_forward' },
  ].filter((l) => l.href)

  return (
    <section id="contact" className="grid grid-cols-1 gap-space-md bg-surface-container-lowest p-space-md md:p-space-xl lg:grid-cols-12">
      <div className="flex flex-col justify-between lg:col-span-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-x-space-sm">
            <h2 className="m-0 font-headline-sm text-headline-sm tracking-tight text-primary">Contact Me</h2>
          </div>
          <p className="mb-4 mt-0 font-body-sm text-body-sm text-secondary">
            Open to junior backend roles, full-stack internships and projects that use Laravel, MySQL or Python.
          </p>

          <div className="mb-3 bg-surface-container-high p-3">
            <span className={`${label} mb-1 block`}>Email</span>
            <div className="flex items-center justify-between gap-2">
              <span className="select-all truncate font-label-sm text-label-sm font-bold text-primary">{EMAIL}</span>
              <button
                type="button"
                onClick={copyEmail}
                className="flex shrink-0 items-center gap-1 bg-surface-container-lowest px-2 py-1 font-telemetry text-telemetry uppercase text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <Icon name="copy" size={13} />
                <span aria-live="polite">{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a href={`mailto:${EMAIL}`} className={quick}>
              <span className="flex items-center gap-2">
                <Icon name="send" size={16} className="text-primary-container" /> Open mail app
              </span>
              <Icon name="arrow_outward" size={14} />
            </a>
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={quick}>
                <span className="flex items-center gap-2">
                  <Icon name={l.icon} size={16} className="text-primary-container" /> {l.label}
                </span>
                <Icon name="arrow_outward" size={14} />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-2">
          <span className="font-telemetry text-telemetry uppercase text-secondary">TIMEZONE: UTC+5 · SKARDU / FAISALABAD</span>
        </div>
      </div>

      <div className="bg-surface-container-high p-space-md lg:col-span-7">
        <div className="mb-3 pb-2 font-telemetry text-telemetry uppercase text-primary-container">SEND A MESSAGE</div>

        <form onSubmit={submit} className="space-y-3" noValidate>
          <div aria-live="polite">
            {state.status === 'ok' && (
              <div className="bg-emerald-950 p-3 font-telemetry text-telemetry text-emerald-300">[SENT]: {state.message}</div>
            )}
            {state.status === 'error' && state.message && (
              <div className="bg-error-container p-2 font-telemetry text-telemetry text-on-error-container">[ERROR]: {state.message}</div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="c-name" className={label}>Your name</label>
              <input id="c-name" value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="c-name-err" className={field} />
              <Err id="c-name-err">{errors.name}</Err>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="c-email" className={label}>Your email</label>
              <input id="c-email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="c-email-err" className={field} />
              <Err id="c-email-err">{errors.email}</Err>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="c-subject" className={label}>Subject (optional)</label>
            <input id="c-subject" value={form.subject} onChange={set('subject')} placeholder="Internship, project, question..." className={field} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="c-msg" className={label}>Message</label>
            <textarea id="c-msg" rows={4} value={form.message} onChange={set('message')} placeholder="Tell me about your project or role..." aria-invalid={!!errors.message} aria-describedby="c-msg-err" className={`${field} resize-none`} />
            <Err id="c-msg-err">{errors.message}</Err>
          </div>

          {/* Honeypot: real people never see or fill this field. */}
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.website}
            onChange={set('website')}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            name="website"
          />

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={state.status === 'sending'}
              className="flex items-center gap-1.5 bg-primary-container px-4 py-2 font-label-sm text-label-sm font-bold uppercase text-on-primary-container transition-colors hover:bg-primary disabled:opacity-60"
            >
              <Icon name="send" size={15} />
              <span>{state.status === 'sending' ? 'Sending...' : 'Send message'}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
