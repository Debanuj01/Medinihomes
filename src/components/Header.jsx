import { useState } from 'react'
import { Menu, X, Home, User, Heart, MessageCircle, LayoutDashboard } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Button } from './ui.jsx'

const NAV_LINKS = [
  { label: 'Home', path: 'home' },
  { label: 'Properties', path: 'properties' },
  { label: 'Promoters', path: 'promoters' },
  { label: 'EMI Calculator', path: 'emi-calculator' },
  { label: 'Roadmap', path: 'roadmap' },
]

export default function Header() {
  const { navigate, segments } = useRouter()
  const { user, requireAuth, setRegistrationModalOpen } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentPath = segments[0] || 'home'

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <span className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
              <Home size={18} className="text-gold" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-lg text-navy tracking-tight">
              MediniHomes
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  currentPath === link.path
                    ? 'text-navy bg-navy-50'
                    : 'text-ink/70 hover:text-navy hover:bg-navy-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('dashboard', { tab: 'messages' })}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-ink/60 hover:text-navy hover:bg-navy-50 transition-colors"
                  aria-label="Messages"
                >
                  <MessageCircle size={19} />
                </button>
                <button
                  onClick={() => navigate('dashboard', { tab: 'saved' })}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-ink/60 hover:text-navy hover:bg-navy-50 transition-colors"
                  aria-label="Saved properties"
                >
                  <Heart size={19} />
                </button>
                <button
                  onClick={() => navigate('dashboard')}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-navy-100 hover:border-navy-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-xs font-bold text-navy">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="text-sm font-medium text-ink">{user.fullName?.split(' ')[0]}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setRegistrationModalOpen(true)}
                  className="text-sm font-medium text-ink/70 hover:text-navy px-4 py-2"
                >
                  Sign in
                </button>
                <Button size="sm" onClick={() => requireAuth()}>
                  Register Free
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-navy"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-100 bg-white px-5 py-4">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path)
                  setMobileOpen(false)
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  currentPath === link.path ? 'bg-navy-50 text-navy' : 'text-ink/70'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => {
                  navigate('dashboard')
                  setMobileOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-navy-50 text-navy text-sm font-medium"
              >
                <LayoutDashboard size={18} />
                My Dashboard
              </button>
            ) : (
              <Button
                size="md"
                className="mt-3 w-full"
                onClick={() => {
                  setRegistrationModalOpen(true)
                  setMobileOpen(false)
                }}
              >
                <User size={16} />
                Register Free
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
