import { Store, LayoutDashboard, Sparkles, Glasses, Smartphone, CheckCircle2 } from 'lucide-react'
import { SectionEyebrow, Badge } from '../components/ui.jsx'

const PHASES = [
  {
    phase: 'Phase 1',
    title: 'Apartment Marketplace',
    status: 'live',
    icon: Store,
    description: 'Verified listings, direct promoter contact, EMI planning and the registration-gated chat system — the foundation this prototype demonstrates today.',
  },
  {
    phase: 'Phase 2',
    title: 'Promoter Dashboard',
    status: 'next',
    icon: LayoutDashboard,
    description: 'Self-serve listing management for promoters — uploading floor plans, updating unit availability in real time, and responding to leads from one console instead of over phone and WhatsApp.',
  },
  {
    phase: 'Phase 3',
    title: 'AI Recommendations',
    status: 'planned',
    icon: Sparkles,
    description: 'Matching buyers to listings based on budget, commute patterns and stated preferences, surfaced proactively rather than requiring manual filtering every visit.',
  },
  {
    phase: 'Phase 4',
    title: 'Virtual Property Tours',
    status: 'planned',
    icon: Glasses,
    description: '360° walkthroughs and live video site visits for buyers outside the district — particularly relevant for the NRI and out-of-state segment buying in Digha.',
  },
  {
    phase: 'Phase 5',
    title: 'Mobile Applications',
    status: 'planned',
    icon: Smartphone,
    description: 'Native iOS and Android apps with push notifications for price drops, new matching listings and promoter replies.',
  },
]

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-14">
      <div className="text-center mb-14">
        <SectionEyebrow>Where this is going</SectionEyebrow>
        <h1 className="font-display font-bold text-navy text-3xl mb-3">Future Roadmap</h1>
        <p className="text-sm text-ink/55 max-w-lg mx-auto">
          MediniHomes is launching as a focused apartment marketplace, with a deliberate path toward
          becoming the operating system for real estate transactions across the district.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-navy-100 hidden sm:block" />
        <div className="space-y-6">
          {PHASES.map((p, i) => (
            <div key={i} className="relative flex gap-5">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-white border-2 border-navy-100 items-center justify-center z-10">
                {p.status === 'live' ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <p.icon size={18} className={p.status === 'next' ? 'text-gold' : 'text-navy/30'} />
                )}
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-navy-50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-ink/40 uppercase tracking-wide">{p.phase}</span>
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'live') return <Badge tone="success">Live Today</Badge>
  if (status === 'next') return <Badge tone="gold">Up Next</Badge>
  return <Badge tone="navy">Planned</Badge>
}
