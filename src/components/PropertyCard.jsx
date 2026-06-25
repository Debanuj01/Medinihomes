import { Heart, MapPin, Calendar, Layers } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Card, Badge, RatingStars, StatusPill, Button } from './ui.jsx'
import { formatINR } from '../data/properties.js'
import { getTownById } from '../data/towns.js'

export default function PropertyCard({ property }) {
  const { navigate } = useRouter()
  const { savedPropertyIds, toggleSaveProperty, requireAuth } = useAuth()
  const town = getTownById(property.townId)
  const isSaved = savedPropertyIds.includes(property.id)

  const handleSave = (e) => {
    e.stopPropagation()
    if (!requireAuth('save')) return
    toggleSaveProperty(property.id)
  }

  return (
    <Card
      hoverable
      className="overflow-hidden cursor-pointer group flex flex-col h-full"
      onClick={() => navigate(`property/${property.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.coverImage}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <StatusPill status={property.possessionStatus} />
        </div>
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : 'text-navy/60'} />
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge tone="white">
            <MapPin size={11} />
            {town?.name}
          </Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-navy text-base leading-snug">
            {property.name}
          </h3>
        </div>
        <RatingStars rating={property.rating} reviewCount={property.reviewCount} size={12} />

        <p className="text-sm text-ink/55 mt-3 leading-relaxed line-clamp-2 flex-1">
          {property.shortDescription}
        </p>

        <div className="flex items-center gap-4 mt-4 text-xs text-ink/55">
          <span className="flex items-center gap-1">
            <Layers size={13} />
            {property.bhkTypes.join(' / ')}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {property.possession}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-50">
          <div>
            <p className="text-[11px] text-ink/45 uppercase tracking-wide">Price Range</p>
            <p className="font-display font-bold text-navy text-sm">
              {formatINR(property.priceMin)} – {formatINR(property.priceMax)}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`property/${property.id}`)
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}
