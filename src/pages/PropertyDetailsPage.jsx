import { useState } from 'react'
import {
  MapPin, Calendar, Layers, Building2, ShieldCheck, Heart, Share2,
  Lock, MessageCircle, Phone, Mail, ChevronRight, CheckCircle2
} from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Button, Badge, RatingStars, StatusPill, SectionEyebrow, Card } from '../components/ui.jsx'
import PropertyGallery from '../components/PropertyGallery.jsx'
import MapPreview from '../components/MapPreview.jsx'
import EmiTeaser from '../components/EmiTeaser.jsx'
import { getPropertyById, formatINR, AMENITY_CATALOG } from '../data/properties.js'
import { getTownById } from '../data/towns.js'
import { getPromoterById } from '../data/promoters.js'
import * as Icons from 'lucide-react'

export default function PropertyDetailsPage() {
  const { segments, navigate } = useRouter()
  const propertyId = segments[1]
  const property = getPropertyById(propertyId)
  const { user, requireAuth, savedPropertyIds, toggleSaveProperty } = useAuth()
  const [activeUnitFilter, setActiveUnitFilter] = useState('all')

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h2 className="font-display font-bold text-navy text-2xl mb-3">Property not found</h2>
        <p className="text-ink/55 mb-6">This listing may have been removed or the link is incorrect.</p>
        <Button onClick={() => navigate('properties')}>Browse All Properties</Button>
      </div>
    )
  }

  const town = getTownById(property.townId)
  const promoter = getPromoterById(property.promoterId)
  const isSaved = savedPropertyIds.includes(property.id)
  const isUnlocked = !!user

  const unitTypes = ['all', ...new Set(property.units.map((u) => u.type))]
  const visibleUnits =
    activeUnitFilter === 'all' ? property.units : property.units.filter((u) => u.type === activeUnitFilter)

  const handleContactPromoter = () => {
    if (!requireAuth('contact')) return
  }

  const handleStartChat = () => {
    if (!requireAuth('chat')) return
    navigate('chat', { property: property.id })
  }

  return (
    <div className="pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-6">
        <div className="flex items-center gap-1.5 text-xs text-ink/45 mb-5">
          <button onClick={() => navigate('home')} className="hover:text-navy">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('properties')} className="hover:text-navy">Properties</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('properties', { town: town.id })} className="hover:text-navy">{town.name}</button>
          <ChevronRight size={12} />
          <span className="text-ink/70">{property.name}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <StatusPill status={property.possessionStatus} />
              <Badge tone="navy"><ShieldCheck size={11} /> RERA: {property.reraId}</Badge>
            </div>
            <h1 className="font-display font-bold text-navy text-2xl sm:text-3xl mb-1.5">{property.name}</h1>
            <div className="flex items-center gap-3 text-sm text-ink/55">
              <span className="flex items-center gap-1"><MapPin size={13} />{property.address}</span>
              <RatingStars rating={property.rating} reviewCount={property.reviewCount} size={13} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => requireAuth('save') && toggleSaveProperty(property.id)}
              className="w-11 h-11 rounded-full border border-navy-100 flex items-center justify-center hover:border-navy-400 transition-colors"
            >
              <Heart size={17} className={isSaved ? 'fill-red-500 text-red-500' : 'text-ink/50'} />
            </button>
            <button className="w-11 h-11 rounded-full border border-navy-100 flex items-center justify-center hover:border-navy-400 transition-colors">
              <Share2 size={17} className="text-ink/50" />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <PropertyGallery gallery={property.gallery} />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-12 grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Main column */}
        <div className="space-y-12">
          {/* Quick facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickFact icon={Layers} label="BHK Types" value={property.bhkTypes.join(', ')} />
            <QuickFact icon={Calendar} label="Possession" value={property.possession} />
            <QuickFact icon={Building2} label="Total Units" value={property.totalUnits} />
            <QuickFact icon={CheckCircle2} label="Available" value={property.availableUnits} accent />
          </div>

          {/* Description */}
          <section>
            <SectionEyebrow>About this property</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-xl mb-4">Property Description</h2>
            <p className="text-sm text-ink/65 leading-relaxed">{property.description}</p>
          </section>

          {/* Available units */}
          <section>
            <SectionEyebrow>Pricing &amp; inventory</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-xl mb-4">Available Units</h2>
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {unitTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveUnitFilter(type)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                    activeUnitFilter === type ? 'bg-navy text-white' : 'bg-navy-50 text-ink/60'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-navy-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-50/60 text-left text-xs text-ink/50 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Floors Available</th>
                    <th className="px-4 py-3 font-medium">Units Left</th>
                    <th className="px-4 py-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUnits.map((unit, i) => (
                    <tr key={i} className="border-t border-navy-50 hover:bg-navy-50/30">
                      <td className="px-4 py-3.5 font-medium text-ink">{unit.type}</td>
                      <td className="px-4 py-3.5 text-ink/65">{unit.sizeSqft} sq ft</td>
                      <td className="px-4 py-3.5 text-ink/65">{unit.floorsAvailable}</td>
                      <td className="px-4 py-3.5">
                        <Badge tone={unit.count <= 2 ? 'gold' : 'success'}>{unit.count} left</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right font-display font-bold text-navy">
                        {formatINR(unit.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <SectionEyebrow>What\u2019s included</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-xl mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((id) => {
                const meta = AMENITY_CATALOG.find((a) => a.id === id)
                if (!meta) return null
                const Icon = Icons[meta.icon] || Icons.CheckCircle2
                return (
                  <div key={id} className="flex items-center gap-3 bg-navy-50/50 rounded-xl p-3.5">
                    <span className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-card">
                      <Icon size={16} className="text-navy" />
                    </span>
                    <span className="text-sm font-medium text-ink">{meta.name}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Nearby facilities + map */}
          <section>
            <SectionEyebrow>Getting around</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-xl mb-4">Nearby Facilities</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <MapPreview property={property} nearby={property.nearby} />
              <div className="space-y-2.5">
                {property.nearby.map((facility, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-navy-50 hover:border-navy-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{facility.name}</p>
                      <p className="text-xs text-ink/45">{facility.category}</p>
                    </div>
                    <Badge tone="navy">{facility.distanceKm} km</Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            <p className="text-[11px] text-ink/45 uppercase tracking-wide">Price Range</p>
            <p className="font-display font-bold text-navy text-2xl mb-5">
              {formatINR(property.priceMin)} – {formatINR(property.priceMax)}
            </p>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-50/50 mb-5">
              <img src={promoter.logo} alt={promoter.name} className="w-11 h-11 rounded-xl" />
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`promoter/${promoter.id}`)}
                  className="text-sm font-semibold text-navy hover:underline truncate block"
                >
                  {promoter.name}
                </button>
                <p className="text-xs text-ink/45">{promoter.yearsExperience} years experience</p>
              </div>
            </div>

            {isUnlocked ? (
              <div className="space-y-2.5">
                <a
                  href={`tel:${promoter.contact.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-navy-100 hover:border-navy-400 transition-colors"
                >
                  <Phone size={16} className="text-navy" />
                  <span className="text-sm font-medium text-ink">{promoter.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${promoter.contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-navy-100 hover:border-navy-400 transition-colors"
                >
                  <Mail size={16} className="text-navy" />
                  <span className="text-sm font-medium text-ink truncate">{promoter.contact.email}</span>
                </a>
                <Button className="w-full mt-2" onClick={handleStartChat}>
                  <MessageCircle size={16} />
                  Message Promoter
                </Button>
              </div>
            ) : (
              <button
                onClick={handleContactPromoter}
                className="w-full p-4 rounded-xl border-2 border-dashed border-navy-200 hover:border-gold bg-navy-50/30 transition-colors text-center group"
              >
                <Lock size={18} className="text-navy/40 mx-auto mb-2 group-hover:text-gold transition-colors" />
                <p className="text-sm font-semibold text-navy mb-0.5">Contact details locked</p>
                <p className="text-xs text-ink/50">Register free to view phone, email &amp; chat</p>
              </button>
            )}

            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-navy-50 text-xs text-ink/45">
              <ShieldCheck size={13} className="text-success" />
              RERA Registered · {property.reraId}
            </div>
          </Card>

          <EmiTeaser defaultPrice={property.priceMin} />
        </div>
      </div>
    </div>
  )
}

function QuickFact({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-navy-50 rounded-xl p-4">
      <Icon size={16} className={accent ? 'text-success' : 'text-navy/50'} />
      <p className="text-[10px] text-ink/45 uppercase tracking-wide mt-2">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${accent ? 'text-success' : 'text-navy'}`}>{value}</p>
    </div>
  )
}
