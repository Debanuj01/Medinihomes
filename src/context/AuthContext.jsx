import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business Owner', 'NRI', 'Retired']

export const EMPLOYMENT_TYPE_OPTIONS = EMPLOYMENT_TYPES

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [savedPropertyIds, setSavedPropertyIds] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  // After registering, we want to send the user back to whatever they were
  // trying to do (open a promoter's contact info, open chat, etc).
  const [pendingIntent, setPendingIntent] = useState(null)

  const requireAuth = useCallback(
    (intent) => {
      if (user) return true
      setPendingIntent(intent || null)
      setRegistrationModalOpen(true)
      return false
    },
    [user]
  )

  const register = useCallback((formData) => {
    setUser({
      ...formData,
      id: 'user-' + Date.now(),
      memberSince: new Date().toISOString(),
    })
    setRegistrationModalOpen(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setSavedPropertyIds([])
  }, [])

  const toggleSaveProperty = useCallback(
    (propertyId) => {
      setSavedPropertyIds((prev) =>
        prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
      )
    },
    []
  )

  const addRecentSearch = useCallback((search) => {
    setRecentSearches((prev) => [search, ...prev.filter((s) => s.label !== search.label)].slice(0, 8))
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    savedPropertyIds,
    recentSearches,
    registrationModalOpen,
    pendingIntent,
    requireAuth,
    register,
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
