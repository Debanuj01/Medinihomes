import { useEffect } from 'react'
import { handleGoogleCallback } from '../api/auth.js'
import { apiGetMe } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function GoogleCallbackPage() {
  const { onAuthSuccess } = useAuth()

  useEffect(() => {
    const finish = async () => {
      if (handleGoogleCallback()) {
        try {
          const user = await apiGetMe()
          onAuthSuccess(user)
        } catch {
          window.location.href = '/'
        }
      } else {
        window.location.href = '/'
      }
    }
    finish()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-navy font-medium animate-pulse">Signing you in with Google…</p>
    </div>
  )
}