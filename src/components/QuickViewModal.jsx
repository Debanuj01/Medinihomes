import { X, MapPin, Calendar, Layers, Building2 } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { Button, RatingStars, StatusPill, Badge } from './ui.jsx'
import { formatINR } from '../data/properties.js'
import { getTownById } from '../data/towns.js'
import { getPromoterById } from '../data/promoters.js'

export default function QuickViewModal({ property, onClose }) {
  const { navigate } = useRouter()
  if (!property) return null
  const town = getTownById(property.townId)
  const promoter = getPromoterById(property.promoterId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-navy-50 flex items-center justify-center text-ink/60"
          aria-label="Close quick view"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[16/9]">
          <img src={property.coverImage} alt={property.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
            <StatusPill status={property.possessionStatus} />
          </div>
        </div>

        <div className="p-7">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-xl font-bold text-navy">{property.name}</h3>
            <Badge tone="navy">
              <MapPin size={11} />
              {town?.name}
            </Badge>
          </div>
          <RatingStars rating={property.rating} reviewCount={property.reviewCount} />

          <p className="text-sm text-ink/65 leading-relaxed mt-4">{property.shortDescription}</p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <QuickStat icon={Layers} label="BHK Types" value={property.bhkTypes.join(', ')} />
            <QuickStat icon={Calendar} label="Possession" value={property.possession} />
            <QuickStat icon={Building2} label="Available" value={`${property.availableUnits} units`} />
          </div>

          <div className="flex items-center gap-2 mt-5 text-sm text-ink/55">
            <img src={promoter.logo} alt={promoter.name} className="w-6 h-6 rounded" />
            By <span className="font-medium text-ink">{promoter.name}</span>
          </div>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-navy-50">
            <div>
              <p className="text-[11px] text-ink/45 uppercase tracking-wide">Price Range</p>
              <p className="font-display font-bold text-navy text-lg">
                {formatINR(property.priceMin)} – {formatINR(property.priceMax)}
              </p>
            </div>
            <Button onClick={() => navigate(`property/${property.id}`)}>
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-navy-50/60 rounded-xl p-3">
      <Icon size={15} className="text-navy/50 mb-1.5" />
      <p className="text-[10px] text-ink/45 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-ink mt-0.5">{value}</p>
    </div>
  )
}
