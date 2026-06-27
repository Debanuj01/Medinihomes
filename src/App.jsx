import { useEffect } from 'react'
import { RouterProvider, useRouter } from './context/RouterContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import RegistrationModal from './components/RegistrationModal.jsx'

import HomePage from './pages/HomePage.jsx'
import PropertiesPage from './pages/PropertiesPage.jsx'
import PropertyDetailsPage from './pages/PropertyDetailsPage.jsx'
import PromotersPage from './pages/PromotersPage.jsx'
import PromoterProfilePage from './pages/PromoterProfilePage.jsx'
import EmiCalculatorPage from './pages/EmiCalculatorPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import RoadmapPage from './pages/RoadmapPage.jsx'
import { handleGoogleCallback, apiGetMe } from './api/auth.js'

const ROUTES = {
  home: HomePage,
  properties: PropertiesPage,
  property: PropertyDetailsPage,
  promoters: PromotersPage,
  promoter: PromoterProfilePage,
  'emi-calculator': EmiCalculatorPage,
  chat: ChatPage,
  dashboard: DashboardPage,
  admin: AdminDashboardPage,
  roadmap: RoadmapPage,
}

function GoogleCallbackHandler() {
  const { onAuthSuccess } = useAuth()

  useEffect(() => {
    // Only runs if URL has ?access_token= (i.e. Google redirected back here)
    if (window.location.search.includes('access_token')) {
      const ok = handleGoogleCallback()
      if (ok) {
        apiGetMe()
          .then((user) => {
            onAuthSuccess(user)
            // Clean up the URL and go to home
            window.history.replaceState({}, '', '/')
          })
          .catch(() => {
            window.history.replaceState({}, '', '/')
          })
      }
    }
  }, [])

  return null
}

function AppShell() {
  const { segments } = useRouter()
  const routeName = segments[0] || 'home'
  const PageComponent = ROUTES[routeName] || NotFoundPage
  const hideFooter = routeName === 'chat'

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <GoogleCallbackHandler />
      <Header />
      <main className="flex-1">
        <PageComponent />
      </main>
      {!hideFooter && <Footer />}
      <RegistrationModal />
    </div>
  )
}

function NotFoundPage() {
  const { navigate } = useRouter()
  return (
    <div className="max-w-md mx-auto px-5 py-28 text-center">
      <p className="font-display font-bold text-navy text-5xl mb-4">404</p>
      <h2 className="font-display font-semibold text-navy text-lg mb-2">Page not found</h2>
      <p className="text-sm text-ink/55 mb-6">
        This page doesn't exist in the MediniHomes prototype yet.
      </p>
      <button
        onClick={() => navigate('home')}
        className="px-6 py-3 rounded-full bg-navy text-white text-sm font-medium"
      >
        Back to Home
      </button>
    </div>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </RouterProvider>
  )
}