import { motion } from 'framer-motion'
import { SectionHead } from './Section.jsx'

function Bar({ skill }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-label-sm text-label-sm text-primary">
        <span>{skill.name}</span>
        <span className="font-telemetry text-telemetry text-primary-container">{skill.level}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden bg-surface-container-high"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={skill.name}
      >
        <motion.div
          className="h-full bg-primary-container"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function Skills({ items }) {
  const groups = [...new Set(items.map((s) => s.group))]
  const half = Math.ceil(items.length / 2)

  return (
    <section id="skills" className="flex flex-col gap-space-md bg-surface-container-lowest p-space-md">
      <SectionHead title="My Skills" note="Honest levels, still growing" />
      <div className="flex flex-wrap gap-1.5 pb-2">
        {groups.map((g) => (
          <span key={g} className="bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm uppercase text-primary">
            #{g.replace(/\s+/g, '_')}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 md:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          {items.slice(0, half).map((s) => (
            <Bar key={s.name} skill={s} />
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {items.slice(half).map((s) => (
            <Bar key={s.name} skill={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
