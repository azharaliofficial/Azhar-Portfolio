import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'

// Press Ctrl+K (Cmd+K on Mac) or "/" to open. Jumps to any section, project,
// skill or certificate. items: [{ id, group, label, hint?, run }]
export default function CommandPalette({ open, onOpen, onClose, items }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        open ? onClose() : onOpen()
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        onOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpen, onClose])

  useEffect(() => {
    if (!open) {
      // Reset when closed, so typing right after opening is never wiped.
      setQuery('')
      setActive(0)
      return
    }
    const previous = document.activeElement
    inputRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open])

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return items
    return items.filter((it) => {
      const hay = `${it.label} ${it.group} ${it.hint ?? ''}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [items, query])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const choose = (item) => {
    if (!item) return
    onClose()
    // Let the dialog unmount (restoring scroll) before navigating.
    setTimeout(item.run, 0)
  }

  const onInputKey = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 px-3 pt-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="w-full max-w-[560px] bg-surface-container-high shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-surface-container-highest px-space-md py-2">
          <span className="flex items-center gap-2 font-telemetry text-telemetry text-primary-container">
            <Icon name="search" size={13} /> QUICK SEARCH
          </span>
          <button type="button" onClick={onClose} className="font-telemetry text-telemetry text-secondary hover:text-primary">
            [ESC]
          </button>
        </div>

        <div className="p-space-md pb-2">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Type a section, project, skill or certificate..."
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            className="w-full bg-surface-container-lowest p-2.5 font-body-sm text-body-sm text-primary placeholder:text-on-surface-variant/50 focus:outline-none"
          />
        </div>

        <ul id="palette-list" ref={listRef} role="listbox" className="thin-scroll m-0 max-h-[50vh] list-none overflow-y-auto px-space-md pb-space-md">
          {results.length === 0 && <li className="py-6 text-center font-telemetry text-telemetry text-secondary">Nothing matches “{query}”.</li>}
          {results.map((it, i) => (
            <li
              key={it.id}
              id={`palette-${it.id}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => choose(it)}
              className={`flex cursor-pointer items-center justify-between gap-4 px-2.5 py-2.5 ${
                i === active ? 'bg-primary-container text-on-primary-container' : 'text-primary'
              }`}
            >
              <span className="min-w-0 truncate font-label-sm text-label-sm">{it.label}</span>
              <span className={`shrink-0 font-telemetry text-telemetry ${i === active ? 'text-on-primary-container/70' : 'text-secondary'}`}>
                {it.group}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between bg-surface-container-lowest px-space-md py-2 font-telemetry text-telemetry text-secondary">
          <span>↑ ↓ to move · Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  )
}
