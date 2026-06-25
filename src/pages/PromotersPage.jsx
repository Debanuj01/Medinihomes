import { ShieldCheck, Building2, TrendingUp } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { SectionEyebrow, RatingStars, Badge } from '../components/ui.jsx'
import { PROMOTERS } from '../data/promoters.js'
import { getPropertiesByPromoter } from '../data/properties.js'

export default function PromotersPage() {
  const { navigate } = useRouter()

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <SectionEyebrow>Verified developers</SectionEyebrow>
        <h1 className="font-display font-bold text-navy text-3xl mb-3">Our Promoters</h1>
        <p className="text-sm text-ink/55">
          Every promoter on MediniHomes is RERA-registered and reviewed by past buyers — no
          anonymous sellers, no unverified brokers.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROMOTERS.map((promoter) => {
          const activeListings = getPropertiesByPromoter(promoter.id).length
          return (
            <button
              key={promoter.id}
              onClick={() => navigate(`promoter/${promoter.id}`)}
              className="text-left bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={promoter.logo} alt={promoter.name} className="w-14 h-14 rounded-xl" />
                <div>
                  <h3 className="font-display font-semibold text-navy">{promoter.name}</h3>
                  <p className="text-xs text-ink/45">{promoter.headquarters}</p>
                </div>
              </div>

              <RatingStars rating={promoter.rating} reviewCount={promoter.reviewCount} size={12} />

              <p className="text-sm text-ink/55 mt-3 leading-relaxed line-clamp-3">{promoter.description}</p>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-navy-50">
                <Stat icon={Building2} value={promoter.completedProjects} label="Completed" />
                <Stat icon={TrendingUp} value={promoter.ongoingProjects} label="Ongoing" />
                <Stat icon={ShieldCheck} value={`${promoter.yearsExperience}y`} label="Experience" />
              </div>

              {activeListings > 0 ? (
                <Badge tone="success" className="mt-4">{activeListings} active listings on MediniHomes</Badge>
              ) : (
                <Badge tone="navy" className="mt-4">Onboarding in progress</Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <Icon size={14} className="text-navy/40 mx-auto mb-1" />
      <p className="text-sm font-bold text-navy">{value}</p>
      <p className="text-[10px] text-ink/40">{label}</p>
    </div>
  )
}
