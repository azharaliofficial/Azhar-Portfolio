import { useState } from 'react'
import { mediaUrl } from '../lib/api.js'
import Lightbox from './Lightbox.jsx'

// A clickable image that opens full size. Renders nothing without a source or if
// the file fails to load, so cards never show a broken image.
export default function Thumb({ src, alt, className = '' }) {
  const [open, setOpen] = useState(false)
  const [broken, setBroken] = useState(false)
  const url = mediaUrl(src)
  if (!url || broken) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className={`block w-full overflow-hidden bg-surface-container-lowest transition-opacity hover:opacity-85 ${className}`}
      >
        <img src={url} alt={alt} loading="lazy" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      </button>
      {open && <Lightbox images={[{ src: url, alt }]} index={0} onClose={() => setOpen(false)} onChange={() => {}} />}
    </>
  )
}
