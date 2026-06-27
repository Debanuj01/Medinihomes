// Base URL — switches automatically between local and production
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// ─── Token helpers (localStorage for persistence across refreshes) ────────────

export const tokens = {
  getAccess: () => localStorage.getItem('mh_access_token'),
  getRefresh: () => localStorage.getItem('mh_refresh_token'),
  set: (access, refresh) => {
    localStorage.setItem('mh_access_token', access)
    localStorage.setItem('mh_refresh_token', refresh)
  },
  clear: () => {
    localStorage.removeItem('mh_access_token')
    localStorage.removeItem('mh_refresh_token')
    localStorage.removeItem('mh_user')
  },
  saveUser: (user) => localStorage.setItem('mh_user', JSON.stringify(user)),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('mh_user')) } catch { return null }
  },
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  const token = tokens.getAccess()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // If access token expired, try refresh once
  if (res.status === 401 && tokens.getRefresh()) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${tokens.getAccess()}`
      const retry = await fetch(`${BASE_URL}${path}`, { ...options, headers })
      return handleResponse(retry)
    } else {
      tokens.clear()
      window.location.reload()
      return
    }
  }

  return handleResponse(res)
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || `Error ${res.status}`)
  return data
}

async function tryRefresh() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokens.getRefresh() }),
    })
    if (!res.ok) return false
    const data = await res.json()
    tokens.set(data.access_token, data.refresh_token)
    return true
  } catch {
    return false
  }
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function apiRegister({ name, email, password, phone, city, employment_type, income_band }) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone, city, employment_type, income_band }),
  })
  tokens.set(data.access_token, data.refresh_token)
  tokens.saveUser(data.user)
  return data.user
}

export async function apiLogin({ email, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  tokens.set(data.access_token, data.refresh_token)
  tokens.saveUser(data.user)
  return data.user
}

export async function apiLogout() {
  try {
    await request('/api/auth/logout', { method: 'POST' })
  } finally {
    tokens.clear()
  }
}

export async function apiGetMe() {
  return request('/api/auth/me')
}

export async function apiSendOTP(phone) {
  return request('/api/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })
}

export async function apiVerifyOTP({ phone, otp_code, name, city, employment_type, income_band }) {
  const data = await request('/api/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp_code, name, city, employment_type, income_band }),
  })
  tokens.set(data.access_token, data.refresh_token)
  tokens.saveUser(data.user)
  return data.user
}

export async function apiGoogleLogin() {
  const data = await request('/api/auth/google')
  window.location.href = data.url
}

export async function apiUpdateProfile(updates) {
  const data = await request('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  tokens.saveUser(data)
  return data
}
export function handleGoogleCallback() {
  const params = new URLSearchParams(window.location.search)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (access_token && refresh_token) {
    tokens.set(access_token, refresh_token)
    return true
  }
  return false
}