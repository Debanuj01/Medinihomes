import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// A deliberately small router: enough for a clickable prototype's navigation
// (named routes + params + browser back/forward via hash) without pulling in
// react-router-dom, so this file behaves identically whether it's bundled by
// Vite or transpiled in-browser for a live preview.

const RouterContext = createContext(null)

const parseHash = () => {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const [path, query] = hash.split('?')
  const segments = path.split('/').filter(Boolean)
  const params = new URLSearchParams(query || '')
  return { segments, params }
}

export function RouterProvider({ children }) {
  const [{ segments, params }, setLocation] = useState(parseHash)

  useEffect(() => {
    const onHashChange = () => setLocation(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((path, queryObj) => {
    const query = queryObj
      ? '?' + new URLSearchParams(queryObj).toString()
      : ''
    window.location.hash = '/' + path.replace(/^\//, '') + query
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  const value = { segments, params, navigate }

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}
