import { useEffect, useRef } from 'react'

// Full-screen image viewer. images: [{ src, alt }]. index: which one is shown.
export default function Lightbox({ images, index, onClose, onChange }) {
  const closeRef = useRef(null)
  const count = images.length

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && count > 1) onChange((index + 1) % count)
      if (e.key === 'ArrowLeft' && count > 1) onChange((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [index, count, onClose, onChange])

  const current = images[index]
  if (!current) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <img
        src={current.src}
        alt={current.alt}
        className="max-h-[85vh] max-w-full border border-white/20 object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        ref={closeRef}
        type="button"
        aria-label="Close image"
        onClick={onClose}
        className="absolute right-4 top-4 h-11 w-11 border border-white/30 bg-surface-container-lowest font-mono text-lg text-primary hover:border-primary-container hover:text-primary-container"
      >
        ×
      </button>
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation()
              onChange((index - 1 + count) % count)
            }}
            className="absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 border border-white/30 bg-surface-container-lowest font-mono text-primary hover:border-primary-container hover:text-primary-container"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation()
              onChange((index + 1) % count)
            }}
            className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 border border-white/30 bg-surface-container-lowest font-mono text-primary hover:border-primary-container hover:text-primary-container"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[2px] text-secondary">
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>
  )
}
