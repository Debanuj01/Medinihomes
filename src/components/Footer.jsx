import { Home, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { TOWNS } from '../data/towns.js'

export default function Footer() {
  const { navigate } = useRouter()

  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
                <Home size={18} className="text-navy" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-lg text-white">MediniHomes</span>
            </button>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Find Your Perfect Home in Medinipur. Verified apartments across Purba and Paschim
              Medinipur, with direct access to the promoters building them.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors cursor-pointer"
                >
                  <Icon size={15} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => navigate('properties')} className="hover:text-gold transition-colors">All Properties</button></li>
              <li><button onClick={() => navigate('promoters')} className="hover:text-gold transition-colors">Promoters</button></li>
              <li><button onClick={() => navigate('emi-calculator')} className="hover:text-gold transition-colors">EMI Calculator</button></li>
              <li><button onClick={() => navigate('roadmap')} className="hover:text-gold transition-colors">Roadmap</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4">Towns We Cover</h4>
            <ul className="space-y-2.5 text-sm">
              {TOWNS.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => navigate('properties', { town: t.id })}
                    className="hover:text-gold transition-colors"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
                <span>Sahid Khudiram Sarani, Medinipur Town, West Bengal 721101</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-gold" />
                <span>+91 98300 00000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-gold" />
                <span>hello@medinihomes.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/45">
          <p>© 2026 MediniHomes. A demonstration prototype — all listings, promoters and statistics are illustrative.</p>
          <div className="flex gap-5">
            <span className="hover:text-white/70 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer">Terms of Service</span>
            <span className="hover:text-white/70 cursor-pointer">RERA Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
