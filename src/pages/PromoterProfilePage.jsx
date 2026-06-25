import { Phone, Mail, MapPin, ShieldCheck, Building2, TrendingUp, Star, ChevronRight } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Button, Badge, RatingStars, SectionEyebrow } from '../components/ui.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import { getPromoterById } from '../data/promoters.js'
import { getPropertiesByPromoter } from '../data/properties.js'

export default function PromoterProfilePage() {
  const { segments, navigate } = useRouter()
  const { user, requireAuth } = useAuth()
  const promoterId = segments[1]
  const promoter = getPromoterById(promoterId)

  if (!promoter) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h2 className="font-display font-bold text-navy text-2xl mb-3">Promoter not found</h2>
        <Button onClick={() => navigate('promoters')}>Browse All Promoters</Button>
      </div>
    )
  }

  const listings = getPropertiesByPromoter(promoter.id)

  return (
    <div className="pb-20">
      <div className="bg-navy">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          <div className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <button onClick={() => navigate('home')} className="hover:text-white">Home</button>
            <ChevronRight size={12} />
            <button onClick={() => navigate('promoters')} className="hover:text-white">Promoters</button>
            <ChevronRight size={12} />
            <span className="text-white/70">{promoter.name}</span>
          </div>

          <div className="flex flex-wrap items-start gap-6">
            <img src={promoter.logo} alt={promoter.name} className="w-20 h-20 rounded-2xl shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <h1 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">{promoter.name}</h1>
              <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                <span className="flex items-center gap-1"><MapPin size={13} />{promoter.headquarters}</span>
                <RatingStars rating={promoter.rating} reviewCount={promoter.reviewCount} size={13} />
              </div>
              <Badge tone="gold"><ShieldCheck size={11} /> RERA: {promoter.reraRegistration}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-10">
          <section>
            <SectionEyebrow>About</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-xl mb-4">{promoter.name}</h2>
            <p className="text-sm text-ink/65 leading-relaxed mb-5">{promoter.description}</p>
            <div className="flex flex-wrap gap-2">
              {promoter.specialties.map((s) => (
                <Badge key={s} tone="navy">{s}</Badge>
              ))}
            </div>
          </section>

          <section>
            <SectionEyebrow>Track record</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-xl mb-4">By the Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Building2} value={promoter.completedProjects} label="Completed Projects" />
              <StatCard icon={TrendingUp} value={promoter.ongoingProjects} label="Ongoing Projects" />
              <StatCard icon={Star} value={promoter.rating.toFixed(1)} label="Customer Rating" />
              <StatCard icon={ShieldCheck} value={`${promoter.yearsExperience}y`} label="Experience" />
            </div>
          </section>

          {promoter.portfolioGallery?.length > 0 && (
            <section>
              <SectionEyebrow>Past work</SectionEyebrow>
              <h2 className="font-display font-bold text-navy text-xl mb-4">Portfolio Gallery</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {promoter.portfolioGallery.map((src, i) => (
                  <img key={i} src={src} alt={`${promoter.name} portfolio ${i + 1}`} className="rounded-xl aspect-[4/3] object-cover" />
                ))}
              </div>
            </section>
          )}

          {listings.length > 0 && (
            <section>
              <SectionEyebrow>Currently live</SectionEyebrow>
              <h2 className="font-display font-bold text-navy text-xl mb-4">
                Active Listings ({listings.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {listings.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
            <h3 className="font-display font-semibold text-navy text-sm mb-4">Contact {promoter.name}</h3>
            {user ? (
              <div className="space-y-2.5">
                <a href={`tel:${promoter.contact.phone}`} className="flex items-center gap-3 p-3 rounded-xl border border-navy-100 hover:border-navy-400 transition-colors">
                  <Phone size={15} className="text-navy" />
                  <span className="text-sm font-medium text-ink">{promoter.contact.phone}</span>
                </a>
                <a href={`mailto:${promoter.contact.email}`} className="flex items-center gap-3 p-3 rounded-xl border border-navy-100 hover:border-navy-400 transition-colors">
                  <Mail size={15} className="text-navy" />
                  <span className="text-sm font-medium text-ink truncate">{promoter.contact.email}</span>
                </a>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-50/50">
                  <MapPin size={15} className="text-navy mt-0.5" />
                  <span className="text-xs text-ink/65">{promoter.contact.office}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => requireAuth('contact')}
                className="w-full p-4 rounded-xl border-2 border-dashed border-navy-200 hover:border-gold bg-navy-50/30 transition-colors text-center"
              >
                <p className="text-sm font-semibold text-navy mb-0.5">Contact details locked</p>
                <p className="text-xs text-ink/50">Register free to view</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white border border-navy-50 rounded-xl p-4 text-center">
      <Icon size={16} className="text-gold mx-auto mb-2" />
      <p className="font-display font-bold text-navy text-lg">{value}</p>
      <p className="text-[10px] text-ink/45 mt-0.5">{label}</p>
    </div>
  )
}
