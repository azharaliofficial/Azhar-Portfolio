import { useState } from 'react'
import { motion } from 'framer-motion'
import { mediaUrl } from '../lib/api.js'
import Icon from './Icon.jsx'

// Corner placement of the four academic cards (from sm up).
const corner = {
  tl: 'sm:-left-6 sm:-top-1',
  tr: 'sm:-right-6 sm:-top-1',
  bl: 'sm:-bottom-2 sm:-left-6',
  br: 'sm:-bottom-2 sm:-right-6',
}

// The photo uploaded in the admin panel (served by Laravel) wins. Otherwise the
// file at frontend/public/profile.jpg is used, and then the placeholder.
function photoSrc(photoUrl) {
  return mediaUrl(photoUrl) ?? '/profile.jpg'
}

function Photo({ photoUrl, name }) {
  const [missing, setMissing] = useState(false)

  return (
    <div className="relative aspect-[4/5] w-56 overflow-hidden bg-surface-container-high">
      {!missing ? (
        <img src={photoSrc(photoUrl)} alt={name} onError={() => setMissing(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-secondary">
          <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#FFD60A" strokeWidth="1.5" strokeOpacity="0.7" aria-hidden="true">
            <circle cx="60" cy="42" r="20" />
            <path d="M20 108 C20 80 38 70 60 70 C82 70 100 80 100 108" />
          </svg>
          <span className="font-telemetry text-telemetry tracking-[3px]">[ YOUR PHOTO ]</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-70" aria-hidden="true" />
    </div>
  )
}

function AcademicCard({ a, className = '' }) {
  const [label, ...rest] = a.kind.split(' · ')
  return (
    <div className={`bg-surface-container-high p-2 shadow-md transition-all hover:bg-surface-container-highest ${className}`}>
      <div className="flex items-center justify-between gap-2 font-telemetry text-telemetry text-primary-container">
        <span>{label}</span>
        <span>{rest.join(' · ')}</span>
      </div>
      <p className="m-0 truncate font-label-sm text-label-sm font-bold text-primary">{a.title}</p>
      <p className="m-0 truncate font-telemetry text-telemetry text-secondary">{a.subtitle}</p>
    </div>
  )
}

export default function Hero({ profile, academics }) {
  const chip =
    'inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-2 font-telemetry text-telemetry uppercase text-secondary transition-colors hover:bg-surface-container hover:text-primary'

  return (
    <section id="top" className="relative w-full overflow-hidden bg-surface-container-lowest p-space-lg md:p-space-xl">
      {['left-2 top-2', 'right-2 top-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
        <span key={pos} aria-hidden="true" className={`absolute ${pos} select-none font-telemetry text-telemetry text-primary-container`}>
          +
        </span>
      ))}

      <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
        <motion.div
          className="flex min-w-0 flex-col gap-space-md lg:col-span-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="bg-surface-container-high px-2 py-0.5 font-telemetry text-telemetry uppercase tracking-wider text-primary-container">
              {profile.role}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-2 py-0.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="font-label-sm text-label-sm tracking-wider text-emerald-400">OPEN TO INTERNSHIPS &amp; FREELANCE</span>
            </span>
          </div>

          <h1 className="m-0 font-display text-display tracking-tight text-primary sm:text-[44px] sm:leading-[48px]">{profile.headline}</h1>

          <p className="m-0 max-w-xl font-body-lg text-body-lg text-secondary">{profile.bio}</p>

          <div className="flex items-center gap-space-sm text-secondary">
            <Icon name="near_me" size={16} className="text-primary-container" />
            <span className="font-label-sm text-label-sm uppercase">{profile.location} · studying at GCU Faisalabad</span>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-primary-container px-space-md py-2 font-label-sm text-label-sm font-bold uppercase text-on-primary-container transition-colors hover:bg-primary"
            >
              <Icon name="terminal" size={15} />
              <span>View Projects</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-surface-container-high px-space-md py-2 font-label-sm text-label-sm uppercase text-primary transition-colors hover:bg-surface-container-highest"
            >
              <Icon name="mail" size={15} />
              <span>Contact Me</span>
            </a>
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className={chip}>
                <Icon name="code" size={14} />
                <span>GitHub</span>
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className={chip}>
                <Icon name="link" size={14} />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className={chip}>
                <Icon name="link" size={14} />
                <span>Resume</span>
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto flex w-full max-w-[460px] flex-col items-center justify-center py-3 sm:py-6 lg:col-span-5"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
        >
          {/* key resets the "missing" state when the API later supplies a photo */}
          <Photo key={profile.photo_url ?? 'none'} photoUrl={profile.photo_url} name={profile.name} />

          {/* Phones: a tidy 2x2 grid under the photo. From sm up: corner cards around it. */}
          <div className="mt-space-md grid w-full grid-cols-2 gap-space-sm sm:mt-0 sm:block sm:w-auto">
            {academics.map((a) => (
              <AcademicCard key={a.position} a={a} className={`sm:absolute sm:w-[170px] ${corner[a.position]}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
