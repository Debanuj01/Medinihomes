import { useState, useEffect } from 'react'
import {
  Heart, Clock, Calculator, MessageCircle, User, Bell,
  ChevronRight, LogOut
} from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Button, Badge } from '../components/ui.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import { PROPERTIES } from '../data/properties.js'
import { CHAT_SEEDS } from '../data/chatSeeds.js'
import { getPromoterById } from '../data/promoters.js'

const TABS = [
  { id: 'saved', label: 'Saved Properties', icon: Heart },
  { id: 'searches', label: 'Recent Searches', icon: Clock },
  { id: 'emi', label: 'EMI Calculations', icon: Calculator },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

const MOCK_NOTIFICATIONS = [
  { title: 'New unit available', body: 'A 2 BHK just opened up in Green Valley Residency, matching your saved search.', time: '2 hours ago', unread: true },
  { title: 'Price drop alert', body: 'Kanthi Coral Residency reduced pricing on remaining 3 BHK units by 4%.', time: '1 day ago', unread: true },
  { title: 'Promoter replied', body: 'Medinipur Infra Group responded to your message about IIT Vista Residency.', time: '2 days ago', unread: false },
  { title: 'Site visit reminder', body: 'Your scheduled visit to Digha Sands Residency is this Saturday at 11 AM.', time: '3 days ago', unread: false },
]

export default function DashboardPage() {
  const { params, navigate } = useRouter()
  const { user, savedPropertyIds, recentSearches, logout } = useAuth()
  const [activeTab, setActiveTab] = useState(params.get('tab') || 'saved')

  // Re-sync if the user re-navigates to /dashboard with a different ?tab=
  // while already on this page (e.g. clicking the header's message bell
  // while sitting on the "saved" tab) — component won't unmount, so the
  // useState initializer alone wouldn't pick this up.
  useEffect(() => {
    const tabFromUrl = params.get('tab')
    if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl)
  }, [params])

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <User size={32} className="text-navy/30 mx-auto mb-4" />
        <h2 className="font-display font-bold text-navy text-xl mb-2">Sign in to view your dashboard</h2>
        <p className="text-sm text-ink/55">Register or sign in to access saved properties, messages and more.</p>
      </div>
    )
  }

  const savedProperties = PROPERTIES.filter((p) => savedPropertyIds.includes(p.id))
  const conversations = Object.entries(CHAT_SEEDS).filter(([propertyId]) =>
    PROPERTIES.some((p) => p.id === propertyId)
  )

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-10">
        <span className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-xl font-bold text-navy">
          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </span>
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">{user.fullName}</h1>
          <p className="text-sm text-ink/50">{user.email} · {user.city}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar lg:overflow-visible">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                activeTab === tab.id ? 'bg-navy text-white' : 'text-ink/60 hover:bg-navy-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
          <button
            onClick={logout}
            className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left text-red-500 hover:bg-red-50 mt-2"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </aside>

        <div>
          {activeTab === 'saved' && (
            <div>
              <h2 className="font-display font-bold text-navy text-xl mb-5">
                Saved Properties ({savedProperties.length})
              </h2>
              {savedProperties.length === 0 ? (
                <EmptyState
                  text="You haven't saved any properties yet."
                  actionLabel="Browse Properties"
                  onAction={() => navigate('properties')}
                />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {savedProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'searches' && (
            <div>
              <h2 className="font-display font-bold text-navy text-xl mb-5">Recent Searches</h2>
              {recentSearches.length === 0 ? (
                <EmptyState text="No recent searches yet — try filtering properties by town or budget." />
              ) : (
                <div className="space-y-2">
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => navigate('properties', search.filters)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-navy-50 hover:border-navy-100 text-left"
                    >
                      <span className="text-sm font-medium text-ink">{search.label}</span>
                      <ChevronRight size={15} className="text-ink/30" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'emi' && (
            <div>
              <h2 className="font-display font-bold text-navy text-xl mb-5">EMI Calculations</h2>
              <p className="text-sm text-ink/55 mb-5">
                Your calculator sessions aren\u2019t saved automatically in this preview — run a fresh
                estimate any time from the calculator page.
              </p>
              <Button onClick={() => navigate('emi-calculator')}>
                <Calculator size={15} /> Open EMI Calculator
              </Button>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="font-display font-bold text-navy text-xl mb-5">Messages</h2>
              {conversations.length === 0 ? (
                <EmptyState text="No conversations yet — start one from any property page." />
              ) : (
                <div className="space-y-2">
                  {conversations.map(([propertyId, msgs]) => {
                    const property = PROPERTIES.find((p) => p.id === propertyId)
                    const promoter = getPromoterById(property.promoterId)
                    const lastMsg = msgs[msgs.length - 1]
                    return (
                      <button
                        key={propertyId}
                        onClick={() => navigate('chat', { property: propertyId })}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-navy-50 hover:border-navy-100 text-left"
                      >
                        <img src={promoter.logo} alt={promoter.name} className="w-11 h-11 rounded-full shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-navy">{promoter.name}</p>
                            <span className="text-[11px] text-ink/40">{lastMsg.time}</span>
                          </div>
                          <p className="text-xs text-ink/50 truncate">{property.name}</p>
                          <p className="text-xs text-ink/60 truncate mt-0.5">{lastMsg.text}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-md">
              <h2 className="font-display font-bold text-navy text-xl mb-5">Profile</h2>
              <div className="bg-white rounded-2xl border border-navy-50 p-6 space-y-4">
                <ProfileRow label="Full Name" value={user.fullName} />
                <ProfileRow label="Mobile Number" value={'+91 ' + user.mobile} />
                <ProfileRow label="Email" value={user.email} />
                <ProfileRow label="City" value={user.city} />
                <ProfileRow label="Employment Type" value={user.employmentType} />
                <ProfileRow label="Monthly Income" value={user.income || 'Not specified'} />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="font-display font-bold text-navy text-xl mb-5">Notifications</h2>
              <div className="space-y-2">
                {MOCK_NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-navy-50">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-accent' : 'bg-navy-100'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{n.title}</p>
                        {n.unread && <Badge tone="accent">New</Badge>}
                      </div>
                      <p className="text-xs text-ink/55 mt-0.5">{n.body}</p>
                      <p className="text-[11px] text-ink/35 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-navy-50 last:border-0">
      <span className="text-xs text-ink/45">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  )
}

function EmptyState({ text, actionLabel, onAction }) {
  return (
    <div className="text-center py-16 bg-navy-50/40 rounded-2xl">
      <p className="text-sm text-ink/55 mb-4">{text}</p>
      {actionLabel && <Button variant="outline" onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
