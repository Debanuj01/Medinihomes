import { MapPin, Navigation } from 'lucide-react'

// A stylized, deterministic map visualization (not a live tile embed, since
// this prototype has no outbound network access at runtime). Nearby facility
// pins are scattered deterministically around the property pin based on each
// facility's real distanceKm, so the layout is consistent across renders
// rather than randomized on every re-render.

const seededOffset = (seedStr, range) => {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) % 9973
  return ((hash % (range * 2)) - range)
}

export default function MapPreview({ property, nearby }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-navy-100 bg-navy-50/40 h-[340px]">
      {/* faux topographic background */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0B1F3A" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* property pin, centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center shadow-lg ring-4 ring-white">
          <MapPin size={18} className="text-gold" fill="currentColor" />
        </div>
        <span className="mt-1.5 px-2.5 py-1 rounded-full bg-navy text-white text-[11px] font-semibold whitespace-nowrap shadow-card">
          {property.name}
        </span>
      </div>

      {/* nearby facility pins, scattered proportional to relative distance */}
      {nearby.slice(0, 6).map((facility, i) => {
        const angle = (i / nearby.length) * 2 * Math.PI + seededOffset(facility.name, 10) * 0.05
        const maxDist = Math.max(...nearby.map((f) => f.distanceKm), 1)
        const radius = 40 + (facility.distanceKm / maxDist) * 110
        const x = 50 + (Math.cos(angle) * radius) / 3.4
        const y = 50 + (Math.sin(angle) * radius) / 3.4
        return (
          <div
            key={facility.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-[5]"
            style={{ left: `${Math.min(92, Math.max(8, x))}%`, top: `${Math.min(88, Math.max(12, y))}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-white border-2 border-accent flex items-center justify-center shadow-card">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-ink/70 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {facility.name} · {facility.distanceKm} km
            </span>
          </div>
        )
      })}

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs text-ink/60 shadow-card">
        <Navigation size={12} className="text-navy" />
        Approximate locations · not to scale
      </div>
    </div>
  )
}
