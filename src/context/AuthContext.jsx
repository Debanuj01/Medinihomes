import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { tokens, apiLogout, apiGetMe } from '../api/auth.js'

const AuthContext = createContext(null)

const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business Owner', 'NRI', 'Retired']
export const EMPLOYMENT_TYPE_OPTIONS = EMPLOYMENT_TYPES

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokens.getUser()) // restore from localStorage
  const [savedPropertyIds, setSavedPropertyIds] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [pendingIntent, setPendingIntent] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // On mount: verify stored token is still valid
  useEffect(() => {
    const verify = async () => {
      if (tokens.getAccess()) {
        try {
          const me = await apiGetMe()
          setUser(me)
          tokens.saveUser(me)
        } catch {
          tokens.clear()
          setUser(null)
        }
      }
      setAuthLoading(false)
    }
    verify()
  }, [])

  const requireAuth = useCallback(
    (intent) => {
      if (user) return true
      setPendingIntent(intent || null)
      setRegistrationModalOpen(true)
      return false
    },
    [user]
  )

  // Called by RegistrationModal after successful API register/login
  const onAuthSuccess = useCallback((userData) => {
    setUser(userData)
    setRegistrationModalOpen(false)
    setPendingIntent(null)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
    setSavedPropertyIds([])
    setRecentSearches([])
  }, [])

  const toggleSaveProperty = useCallback((propertyId) => {
    setSavedPropertyIds((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    )
  }, [])

  const addRecentSearch = useCallback((search) => {
    setRecentSearches((prev) =>
      [search, ...prev.filter((s) => s.label !== search.label)].slice(0, 8)
    )
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    authLoading,
    savedPropertyIds,
    recentSearches,
    registrationModalOpen,
    pendingIntent,
    requireAuth,
    onAuthSuccess,
    logout,
    toggleSaveProperty,
    addRecentSearch,
    setRegistrationModalOpen,
    setPendingIntent,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}