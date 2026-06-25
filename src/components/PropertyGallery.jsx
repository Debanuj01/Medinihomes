import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Building2, Sofa, BedDouble, ChefHat, Ruler } from 'lucide-react'

const CATEGORY_META = {
  exterior: { label: 'Exterior', icon: Building2 },
  living: { label: 'Living Room', icon: Sofa },
  bedroom: { label: 'Bedroom', icon: BedDouble },
  kitchen: { label: 'Kitchen', icon: ChefHat },
  blueprint: { label: 'Floor Plans', icon: Ruler },
}

export default function PropertyGallery({ gallery }) {
  const categories = Object.keys(gallery).filter((k) => gallery[k]?.length)
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const images = gallery[activeCategory] || []

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const showNext = () => setLightboxIndex((i) => (i + 1) % images.length)
  const showPrev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat] || { label: cat, icon: Building2 }
          const Icon = meta.icon
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-navy text-white'
                  : 'bg-navy-50 text-ink/60 hover:bg-navy-100'
              }`}
            >
              <Icon size={14} />
              {meta.label}
              <span className="text-xs opacity-60">({gallery[cat].length})</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[260px] sm:h-[420px]">
        {images.slice(0, 5).map((src, i) => {
          let tileClass
          if (images.length === 1) {
            tileClass = 'col-span-2 sm:col-span-4 row-span-2'
          } else if (images.length === 2) {
            // Both tiles fill the 2x2 grid evenly on every breakpoint.
            tileClass = 'col-span-2 sm:col-span-2 row-span-2'
          } else if (i === 0) {
            tileClass = 'col-span-2 row-span-2'
          } else {
            // 3+ images: only the hero tile shows on mobile; the rest
            // appear in the 4-column desktop grid (tap hero -> lightbox
            // to browse the rest on mobile instead of cramming thumbnails).
            tileClass = 'hidden sm:block sm:col-span-1 sm:row-span-1'
          }
          return (
            <button key={i} onClick={() => openLightbox(i)} className={`relative overflow-hidden group ${tileClass}`}>
              <img
                src={src}
                alt={`${activeCategory} view ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {i === 4 && images.length > 5 && (
                <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center text-white font-semibold text-sm">
                  +{images.length - 5} more
                </div>
              )}
            </button>
          )
        })}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-navy-900/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>
          <button
            onClick={showPrev}
            className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`${activeCategory} full view`}
            className="max-h-[85vh] max-w-[88vw] object-contain rounded-lg"
          />
          <button
            onClick={showNext}
            className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
