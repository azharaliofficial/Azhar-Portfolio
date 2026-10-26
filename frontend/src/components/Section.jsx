import { motion } from 'framer-motion'

// One full-screen "page". Scrolling snaps from one page to the next.
export function Page({ children, id, className = '' }) {
  return (
    <section data-page id={id} className={`${className}`}>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-space-lg px-margin py-space-md md:px-margin-desktop">{children}</div>
    </section>
  )
}

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// "HEADING ........ right-hand note"
export function SectionHead({ title, note, as: Tag = 'h2' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-space-xs">
      <div className="flex flex-wrap items-center gap-x-space-sm gap-y-1">
        <Tag className="font-headline-sm text-headline-sm tracking-tight text-primary">{title}</Tag>
      </div>
      {note && <span className="font-telemetry text-telemetry text-secondary">{note}</span>}
    </div>
  )
}
