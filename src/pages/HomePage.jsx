import { useState } from 'react'
import {
  Search, ShieldCheck, MessageSquareText, Calculator, MapPinned,
  ArrowRight, Quote, ChevronRight, Building2, Users, TrendingUp, Handshake
} from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { Button, Badge, SectionEyebrow, RatingStars } from '../components/ui.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import { PROPERTIES } from '../data/properties.js'
import { TOWNS } from '../data/towns.js'
import { PROMOTERS } from '../data/promoters.js'

const STATS = [
  { value: '500+', label: 'Properties Listed', icon: Building2 },
  { value: '50+', label: 'Verified Promoters', icon: ShieldCheck },
  { value: '10,000+', label: 'Monthly Visitors', icon: Users },
  { value: '1,200+', label: 'Successful Buyer Connections', icon: Handshake },
]

const HOW_IT_WORKS = [
  { title: 'Search & compare', desc: 'Filter by town, budget and BHK type across every verified listing in the district.', icon: Search },
  { title: 'Explore in depth', desc: 'Floor plans, real unit-level pricing, amenities and nearby facilities — before you ever make a call.', icon: MapPinned },
  { title: 'Plan the finance', desc: 'Run the numbers with the EMI calculator across five major banks before you commit.', icon: Calculator },
  { title: 'Talk to the promoter directly', desc: 'No broker in between — message the developer\u2019s sales team and get answers the same day.', icon: MessageSquareText },
]

const TESTIMONIALS = [
  {
    name: 'Suman Mukherjee',
    location: 'Bought in Medinipur Town',
    quote: 'I compared four projects in one afternoon instead of visiting four sales offices. The EMI calculator matched what my bank quoted almost exactly.',
  },
  {
    name: 'Ananya Pradhan',
    location: 'Bought in Haldia',
    quote: 'Being able to message the promoter directly before booking a site visit saved me at least two wasted trips from Kolkata.',
  },
  {
    name: 'Debashish Maity',
    location: 'Bought in Contai',
    quote: 'The floor plans and nearby-facility distances were more detailed than what the promoter\u2019s own brochure had.',
  },
]

export default function HomePage() {
  const { navigate } = useRouter()
  const [search, setSearch] = useState({ town: '', budget: '', bhk: '' })

  const featured = PROPERTIES.slice(0, 6)

  const handleSearch = () => {
    navigate('properties', {
      ...(search.town && { town: search.town }),
      ...(search.budget && { budget: search.budget }),
      ...(search.bhk && { bhk: search.bhk }),
    })
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&h=1000&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-28 lg:pt-32 lg:pb-36">
          <Badge tone="gold" className="mb-6">
            Purba &amp; Paschim Medinipur, West Bengal
          </Badge>
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.08] max-w-3xl">
            Discover Your Dream Apartment in Medinipur
          </h1>
          <p className="text-white/70 text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
            Explore verified apartments, compare options and connect directly with trusted
            promoters — no broker, no guesswork.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 mt-10 max-w-3xl grid sm:grid-cols-[1.3fr_1fr_1fr_auto] gap-2">
            <SearchField
              label="Location"
              value={search.town}
              onChange={(v) => setSearch((s) => ({ ...s, town: v }))}
              options={[{ value: '', label: 'Any town' }, ...TOWNS.map((t) => ({ value: t.id, label: t.name }))]}
            />
            <SearchField
              label="Budget"
              value={search.budget}
              onChange={(v) => setSearch((s) => ({ ...s, budget: v }))}
              options={[
                { value: '', label: 'Any budget' },
                { value: '0-3000000', label: 'Under ₹30 L' },
                { value: '3000000-6000000', label: '₹30 L – ₹60 L' },
                { value: '6000000-10000000', label: '₹60 L – ₹1 Cr' },
                { value: '10000000-99999999', label: 'Above ₹1 Cr' },
              ]}
            />
            <SearchField
              label="BHK Type"
              value={search.bhk}
              onChange={(v) => setSearch((s) => ({ ...s, bhk: v }))}
              options={[
                { value: '', label: 'Any BHK' },
                { value: '1 BHK', label: '1 BHK' },
                { value: '2 BHK', label: '2 BHK' },
                { value: '3 BHK', label: '3 BHK' },
                { value: '4 BHK', label: '4 BHK' },
              ]}
            />
            <Button size="md" className="justify-self-stretch" onClick={handleSearch}>
              <Search size={16} />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </section>

      {/* DISTRICT STRIP — signature element */}
      <section className="bg-navy-900 py-3 overflow-hidden">
        <div className="flex items-center gap-0 animate-none">
          <div className="shrink-0 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold border-r border-white/10">
            Markets we cover
          </div>
          <div className="flex overflow-x-auto no-scrollbar">
            {TOWNS.map((town, i) => (
              <button
                key={town.id}
                onClick={() => navigate('properties', { town: town.id })}
                className="shrink-0 flex items-center gap-2 px-6 py-2 text-sm text-white/70 hover:text-white border-r border-white/10 transition-colors group"
              >
                <span className="font-medium">{town.name}</span>
                <span className="text-white/30 group-hover:text-gold transition-colors text-xs">
                  {PROPERTIES.filter((p) => p.townId === town.id).length} listings
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionEyebrow>Handpicked this week</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-3xl">Featured Properties</h2>
          </div>
          <button
            onClick={() => navigate('properties')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy hover:gap-2.5 transition-all"
          >
            View all properties <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <Button variant="outline" className="w-full mt-8 sm:hidden" onClick={() => navigate('properties')}>
          View all properties
        </Button>
      </section>

      {/* TRENDING LOCATIONS */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionEyebrow>Where the demand is</SectionEyebrow>
          <h2 className="font-display font-bold text-navy text-3xl mb-10">Trending Locations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOWNS.slice(0, 4).map((town) => (
              <button
                key={town.id}
                onClick={() => navigate('properties', { town: town.id })}
                className="text-left bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-navy">{town.name}</h3>
                  <ChevronRight size={16} className="text-ink/30 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-ink/55 leading-relaxed mb-4 line-clamp-3">{town.blurb}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink/45">
                    {PROPERTIES.filter((p) => p.townId === town.id).length} listings
                  </span>
                  <span className="font-semibold text-navy">₹{town.avgPricePerSqft.toLocaleString('en-IN')}/sqft avg</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionEyebrow>Why MediniHomes</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-3xl mb-5 leading-tight">
              Built for buyers who are tired of guessing
            </h2>
            <p className="text-ink/60 leading-relaxed mb-8">
              Most listings in this district circulate through brokers and word of mouth, with
              pricing that shifts depending on who\u2019s asking. MediniHomes verifies every promoter\u2019s
              RERA registration and lists real unit-level pricing, so the number you see is the
              number you negotiate from — not a starting point for a different conversation.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: ShieldCheck, title: 'RERA-verified listings', desc: 'Every project carries a checked registration number.' },
                { icon: TrendingUp, title: 'Real unit-level pricing', desc: 'Price by floor and size, not a vague starting figure.' },
                { icon: MessageSquareText, title: 'Direct promoter access', desc: 'No broker margin sitting between you and the seller.' },
                { icon: Calculator, title: 'Built-in EMI planning', desc: 'Know your monthly number before you visit a single site.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-navy" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-ink text-sm">{item.title}</h4>
                    <p className="text-xs text-ink/50 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=620&fit=crop&q=80"
              alt="Modern apartment living room"
              className="rounded-2xl object-cover w-full h-full shadow-card"
            />
            <div className="flex flex-col gap-4">
              <img
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=290&fit=crop&q=80"
                alt="Modern kitchen interior"
                className="rounded-2xl object-cover w-full shadow-card"
              />
              <img
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&h=290&fit=crop&q=80"
                alt="Apartment bedroom interior"
                className="rounded-2xl object-cover w-full shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionEyebrow>The process</SectionEyebrow>
          <h2 className="font-display font-bold text-white text-3xl mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <step.icon size={20} className="text-gold" />
                </div>
                <h4 className="font-display font-semibold text-white text-sm mb-2">{step.title}</h4>
                <p className="text-xs text-white/55 leading-relaxed">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -right-3 w-6 h-px bg-white/15" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROMOTERS */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionEyebrow>Who you\u2019ll be talking to</SectionEyebrow>
            <h2 className="font-display font-bold text-navy text-3xl">Featured Promoters</h2>
          </div>
          <button
            onClick={() => navigate('promoters')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy hover:gap-2.5 transition-all"
          >
            View all promoters <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMOTERS.slice(0, 3).map((promoter) => (
            <button
              key={promoter.id}
              onClick={() => navigate(`promoter/${promoter.id}`)}
              className="text-left bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={promoter.logo} alt={promoter.name} className="w-12 h-12 rounded-xl" />
                <div>
                  <h3 className="font-display font-semibold text-navy text-sm">{promoter.name}</h3>
                  <p className="text-xs text-ink/45">{promoter.headquarters} · {promoter.yearsExperience} yrs</p>
                </div>
              </div>
              <RatingStars rating={promoter.rating} reviewCount={promoter.reviewCount} size={12} />
              <p className="text-xs text-ink/55 mt-3 leading-relaxed line-clamp-3">{promoter.description}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-navy-50 text-xs text-ink/55">
                <span>{promoter.completedProjects} completed</span>
                <span>{promoter.ongoingProjects} ongoing</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionEyebrow>From real buyers</SectionEyebrow>
          <h2 className="font-display font-bold text-navy text-3xl mb-10">What Buyers Say</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card">
                <Quote size={22} className="text-gold mb-4" />
                <p className="text-sm text-ink/70 leading-relaxed mb-5">{t.quote}</p>
                <p className="text-sm font-semibold text-navy">{t.name}</p>
                <p className="text-xs text-ink/45">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS (investor-facing) */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon size={20} className="text-gold mx-auto mb-3" />
                <p className="font-display font-bold text-white text-3xl">{stat.value}</p>
                <p className="text-xs text-white/55 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SearchField({ label, value, onChange, options }) {
  return (
    <label className="relative block px-3.5 py-2.5 rounded-xl hover:bg-navy-50 transition-colors">
      <span className="block text-[10px] font-semibold text-ink/45 uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm font-medium text-ink bg-transparent focus:outline-none mt-0.5"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
