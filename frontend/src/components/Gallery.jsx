import { useState } from 'react'
import { mediaUrl } from '../lib/api.js'
import { SectionHead } from './Section.jsx'
import Lightbox from './Lightbox.jsx'

// Photo grid with a viewer. Used for the profile "Moments" section and for
// project screenshots. Renders nothing when there are no images.
export function ImageGrid({ images, label }) {
  const [index, setIndex] = useState(null)
  const list = (images ?? []).map(mediaUrl).filter(Boolean).map((src, i) => ({ src, alt: `${label} ${i + 1}` }))
  if (list.length === 0) return null

  return (
    <>
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(min(100%,150px),1fr))]">
        {list.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View larger: ${img.alt}`}
            className="aspect-[4/3] overflow-hidden bg-surface-container-lowest transition-opacity hover:opacity-80"
          >
            <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {index !== null && <Lightbox images={list} index={index} onClose={() => setIndex(null)} onChange={setIndex} />}
    </>
  )
}

export default function Gallery({ images }) {
  if (!images || images.length === 0) return null
  return (
    <section id="moments" className="flex flex-col gap-space-sm">
      <SectionHead title="Moments" note={`${images.length} photos`} />
      <ImageGrid images={images} label="Moment" />
    </section>
  )
}
