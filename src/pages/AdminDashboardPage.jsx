import { useState } from 'react'
import {
  Building2, Users, UserCog, TrendingUp, BarChart3, IndianRupee,
  Rocket, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react'
import { Badge, SectionEyebrow } from '../components/ui.jsx'
import { PROPERTIES, formatINR } from '../data/properties.js'
import { PROMOTERS } from '../data/promoters.js'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'properties', label: 'Property Management', icon: Building2 },
  { id: 'promoters', label: 'Promoter Management', icon: UserCog },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'leads', label: 'Lead Management', icon: TrendingUp },
  { id: 'revenue', label: 'Revenue', icon: IndianRupee },
]

const MOCK_LEADS = [
  { name: 'Suman Mukherjee', property: 'Green Valley Residency', stage: 'Site Visit Scheduled', value: 4500000 },
  { name: 'Ananya Pradhan', property: 'Haldia Port Residency', stage: 'Negotiating', value: 6200000 },
  { name: 'Debashish Maity', property: 'Kanthi Coral Residency', stage: 'New Lead', value: 2900000 },
  { name: 'Riya Banerjee', property: 'Digha Sands Residency', stage: 'Booking Confirmed', value: 6800000 },
  { name: 'Arjun Das', property: 'IIT Vista Residency', stage: 'New Lead', value: 5800000 },
]

const MOCK_USERS = [
  { name: 'Suman Mukherjee', city: 'Medinipur Town', joined: 'Mar 2026', saved: 4 },
  { name: 'Ananya Pradhan', city: 'Haldia', joined: 'Apr 2026', saved: 2 },
  { name: 'Debashish Maity', city: 'Contai', joined: 'May 2026', saved: 6 },
  { name: 'Riya Banerjee', city: 'Digha', joined: 'May 2026', saved: 1 },
]

const REVENUE_STREAMS = [
  { label: 'Promoter Listing Subscriptions', value: 1840000, change: 12.4, up: true },
  { label: 'Featured Placement Fees', value: 620000, change: 8.1, up: true },
  { label: 'Lead Referral Commissions', value: 940000, change: -3.2, up: false },
  { label: 'Verified Badge Fees', value: 215000, change: 21.0, up: true },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <SectionEyebrow>Internal / investor view</SectionEyebrow>
          <h1 className="font-display font-bold text-navy text-3xl">Admin Dashboard</h1>
        </div>
        <Badge tone="gold">Demo data — illustrative only</Badge>
      </div>
      <p className="text-sm text-ink/55 mb-8 max-w-2xl">
        A lighter-weight preview of the operator-facing console. The buyer-facing product is the
        primary focus of this prototype; this view exists to show the platform\u2019s operational shape.
      </p>

      <div className="flex gap-1 overflow-x-auto no-scrollbar mb-8 border-b border-navy-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-navy text-navy' : 'border-transparent text-ink/50 hover:text-navy'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={Building2} label="Active Listings" value={PROPERTIES.length} change="+3 this month" />
            <MetricCard icon={UserCog} label="Verified Promoters" value={PROMOTERS.length} change="+1 this month" />
            <MetricCard icon={Users} label="Registered Users" value="1,284" change="+18% MoM" />
            <MetricCard icon={TrendingUp} label="Active Leads" value={MOCK_LEADS.length} change="2 closing this week" />
          </div>

          <div className="bg-white rounded-2xl border border-navy-50 p-6">
            <h3 className="font-display font-semibold text-navy text-sm mb-4">Future Features Placeholder</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {['Automated RERA verification', 'Promoter self-serve listing portal', 'In-app document e-signing'].map((f) => (
                <div key={f} className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-50/50 text-xs text-ink/60">
                  <Rocket size={14} className="text-gold shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="overflow-x-auto rounded-2xl border border-navy-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/60 text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Units</th>
                <th className="px-4 py-3 font-medium">Price Range</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {PROPERTIES.map((p) => (
                <tr key={p.id} className="border-t border-navy-50">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.possessionStatus === 'ready' ? 'success' : 'accent'}>
                      {p.possessionStatus === 'ready' ? 'Ready' : 'Under Construction'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink/65">{p.availableUnits} / {p.totalUnits}</td>
                  <td className="px-4 py-3 text-ink/65">{formatINR(p.priceMin)} – {formatINR(p.priceMax)}</td>
                  <td className="px-4 py-3 text-right"><MoreHorizontal size={15} className="text-ink/30 inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'promoters' && (
        <div className="overflow-x-auto rounded-2xl border border-navy-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/60 text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Promoter</th>
                <th className="px-4 py-3 font-medium">RERA No.</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Ongoing</th>
                <th className="px-4 py-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {PROMOTERS.map((p) => (
                <tr key={p.id} className="border-t border-navy-50">
                  <td className="px-4 py-3 font-medium text-ink flex items-center gap-2.5">
                    <img src={p.logo} alt={p.name} className="w-7 h-7 rounded-md" />
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-ink/55 text-xs">{p.reraRegistration}</td>
                  <td className="px-4 py-3 text-ink/65">{p.completedProjects}</td>
                  <td className="px-4 py-3 text-ink/65">{p.ongoingProjects}</td>
                  <td className="px-4 py-3 text-ink/65">{p.rating.toFixed(1)} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-navy-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/60 text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Saved Properties</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u, i) => (
                <tr key={i} className="border-t border-navy-50">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink/65">{u.city}</td>
                  <td className="px-4 py-3 text-ink/65">{u.joined}</td>
                  <td className="px-4 py-3 text-ink/65">{u.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-2">
          {MOCK_LEADS.map((lead, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-navy-50">
              <div>
                <p className="text-sm font-semibold text-ink">{lead.name}</p>
                <p className="text-xs text-ink/50">{lead.property}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={lead.stage === 'Booking Confirmed' ? 'success' : lead.stage === 'New Lead' ? 'navy' : 'accent'}>
                  {lead.stage}
                </Badge>
                <span className="font-display font-semibold text-navy text-sm w-20 text-right">
                  {formatINR(lead.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-3">
          {REVENUE_STREAMS.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-navy-50">
              <span className="text-sm font-medium text-ink">{r.label}</span>
              <div className="flex items-center gap-4">
                <span className={`flex items-center gap-1 text-xs font-semibold ${r.up ? 'text-success' : 'text-red-500'}`}>
                  {r.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(r.change)}%
                </span>
                <span className="font-display font-bold text-navy text-sm w-24 text-right">{formatINR(r.value)}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 rounded-xl bg-navy text-white mt-4">
            <span className="text-sm font-semibold">Total Monthly Revenue (demo)</span>
            <span className="font-display font-bold text-lg">
              {formatINR(REVENUE_STREAMS.reduce((sum, r) => sum + r.value, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, change }) {
  return (
    <div className="bg-white rounded-2xl border border-navy-50 p-5">
      <Icon size={17} className="text-navy/50 mb-3" />
      <p className="font-display font-bold text-navy text-2xl">{value}</p>
      <p className="text-xs text-ink/45 mt-0.5">{label}</p>
      <p className="text-[11px] text-success mt-1.5">{change}</p>
    </div>
  )
}
