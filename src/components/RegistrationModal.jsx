import { useState } from 'react'
import { X, Lock, MessageCircle, Heart, BellRing, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth, EMPLOYMENT_TYPE_OPTIONS } from '../context/AuthContext.jsx'
import { Button } from './ui.jsx'
import { apiRegister, apiLogin, apiSendOTP, apiVerifyOTP, apiGoogleLogin } from '../api/auth.js'

const BENEFITS = [
  { icon: Lock, text: 'Unlock promoter contact information' },
  { icon: MessageCircle, text: 'Unlock direct chat with promoters' },
  { icon: Heart, text: 'Save properties to your dashboard' },
  { icon: BellRing, text: 'Receive alerts for new matching listings' },
]

const INCOME_BANDS = [
  'Below ₹25,000/month',
  '₹25,000 – ₹50,000/month',
  '₹50,000 – ₹1,00,000/month',
  'Above ₹1,00,000/month',
]

// Tabs: 'register' | 'login' | 'otp'
export default function RegistrationModal() {
  const { registrationModalOpen, setRegistrationModalOpen, onAuthSuccess, pendingIntent, setPendingIntent } = useAuth()
  const [tab, setTab] = useState('register')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Register form
  const [regForm, setRegForm] = useState({ fullName: '', mobile: '', email: '', password: '', city: '', employmentType: '', income: '' })
  const [regErrors, setRegErrors] = useState({})

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // OTP form
  const [otpStep, setOtpStep] = useState('phone') // 'phone' | 'code'
  const [otpPhone, setOtpPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpName, setOtpName] = useState('')

  if (!registrationModalOpen) return null

  const close = () => {
    setRegistrationModalOpen(false)
    setPendingIntent(null)
    setError(null)
    setSuccess(false)
  }

  // ── Register ──────────────────────────────────────────────────────────────

  const validateReg = () => {
    const e = {}
    if (!regForm.fullName.trim()) e.fullName = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(regForm.email.trim())) e.email = 'Enter a valid email'
    if (regForm.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!regForm.city.trim()) e.city = 'Enter your city'
    if (!regForm.employmentType) e.employmentType = 'Select employment type'
    setRegErrors(e)
    return Object.keys(e).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateReg()) return
    setLoading(true)
    setError(null)
    try {
      const user = await apiRegister({
        name: regForm.fullName,
        email: regForm.email,
        password: regForm.password,
        phone: regForm.mobile ? `+91${regForm.mobile}` : undefined,
        city: regForm.city,
        employment_type: regForm.employmentType,
        income_band: regForm.income || undefined,
      })
      setSuccess(true)
      setTimeout(() => { onAuthSuccess(user); setSuccess(false) }, 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await apiLogin({ email: loginForm.email, password: loginForm.password })
      setSuccess(true)
      setTimeout(() => { onAuthSuccess(user); setSuccess(false) }, 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── OTP ───────────────────────────────────────────────────────────────────

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(otpPhone)) { setError('Enter a valid 10-digit Indian mobile number'); return }
    setLoading(true)
    setError(null)
    try {
      await apiSendOTP(`+91${otpPhone}`)
      setOtpStep('code')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await apiVerifyOTP({ phone: `+91${otpPhone}`, otp_code: otpCode, name: otpName || undefined })
      setSuccess(true)
      setTimeout(() => { onAuthSuccess(user); setSuccess(false) }, 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl grid sm:grid-cols-5">
        <button onClick={close} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-navy-50 flex items-center justify-center text-ink/60" aria-label="Close">
          <X size={18} />
        </button>

        {/* Left panel */}
        <div className="sm:col-span-2 bg-navy text-white p-8 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-3">Free account</span>
          <h3 className="font-display text-2xl font-bold mb-2 leading-snug">
            {pendingIntent === 'chat' ? 'Sign up to message this promoter'
              : pendingIntent === 'contact' ? 'Sign up to view promoter contact details'
              : 'Create your free MediniHomes account'}
          </h3>
          <p className="text-sm text-white/65 mb-8">Takes under a minute. No payment, no spam.</p>
          <div className="space-y-4 mt-auto">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <b.icon size={15} className="text-gold" />
                </span>
                <span className="text-sm text-white/85 pt-1.5">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="sm:col-span-3 p-8">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <CheckCircle2 size={48} className="text-success mb-4" />
              <h4 className="font-display text-lg font-bold text-navy mb-1">
                {tab === 'login' ? 'Welcome back!' : 'Account created!'}
              </h4>
              <p className="text-sm text-ink/60">Unlocking promoter details now…</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-navy-50 rounded-xl p-1">
                {[['register', 'Register'], ['login', 'Login'], ['otp', 'OTP Login']].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setTab(key); setError(null) }}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${tab === key ? 'bg-white text-navy shadow-sm' : 'text-ink/50 hover:text-ink'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Google login button */}
              <button
                onClick={apiGoogleLogin}
                className="w-full mb-4 flex items-center justify-center gap-2 border border-navy-100 rounded-xl py-2.5 text-sm font-medium hover:bg-navy-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"/></svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-navy-100" />
                <span className="text-xs text-ink/40">or</span>
                <div className="flex-1 h-px bg-navy-100" />
              </div>

              {/* Register tab */}
              {tab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <Field label="Full Name" error={regErrors.fullName}>
                    <input type="text" value={regForm.fullName} onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))} placeholder="e.g. Suman Mukherjee" className={inputClass(regErrors.fullName)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Mobile (optional)" error={regErrors.mobile}>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 rounded-l-xl bg-navy-50 text-ink/60 text-sm border border-r-0 border-navy-100">+91</span>
                        <input type="tel" value={regForm.mobile} onChange={e => setRegForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="98XXXXXXXX" className={inputClass(regErrors.mobile, 'rounded-l-none')} />
                      </div>
                    </Field>
                    <Field label="City" error={regErrors.city}>
                      <input type="text" value={regForm.city} onChange={e => setRegForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Contai" className={inputClass(regErrors.city)} />
                    </Field>
                  </div>
                  <Field label="Email" error={regErrors.email}>
                    <input type="email" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className={inputClass(regErrors.email)} />
                  </Field>
                  <Field label="Password" error={regErrors.password}>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" className={inputClass(regErrors.password, 'pr-10')} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Employment Type" error={regErrors.employmentType}>
                    <select value={regForm.employmentType} onChange={e => setRegForm(f => ({ ...f, employmentType: e.target.value }))} className={inputClass(regErrors.employmentType)}>
                      <option value="">Select employment type</option>
                      {EMPLOYMENT_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </Field>
                  <Field label="Monthly Income (optional)">
                    <select value={regForm.income} onChange={e => setRegForm(f => ({ ...f, income: e.target.value }))} className={inputClass()}>
                      <option value="">Prefer not to say</option>
                      {INCOME_BANDS.map(band => <option key={band} value={band}>{band}</option>)}
                    </select>
                  </Field>
                  <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    {loading ? 'Creating account…' : 'Create Free Account'}
                  </Button>
                </form>
              )}

              {/* Login tab */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <Field label="Email">
                    <input type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className={inputClass()} />
                  </Field>
                  <Field label="Password">
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" className={inputClass(null, 'pr-10')} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    {loading ? 'Logging in…' : 'Login'}
                  </Button>
                  <p className="text-xs text-center text-ink/40">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setTab('register')} className="text-accent underline">Register free</button>
                  </p>
                </form>
              )}

              {/* OTP tab */}
              {tab === 'otp' && (
                <form onSubmit={otpStep === 'phone' ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                  {otpStep === 'phone' ? (
                    <>
                      <Field label="Your Name (optional)">
                        <input type="text" value={otpName} onChange={e => setOtpName(e.target.value)} placeholder="e.g. Suman Mukherjee" className={inputClass()} />
                      </Field>
                      <Field label="Mobile Number">
                        <div className="flex items-center">
                          <span className="px-3 py-2.5 rounded-l-xl bg-navy-50 text-ink/60 text-sm border border-r-0 border-navy-100">+91</span>
                          <input type="tel" value={otpPhone} onChange={e => setOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98XXXXXXXX" className={inputClass(null, 'rounded-l-none')} />
                        </div>
                      </Field>
                      <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                        {loading ? 'Sending OTP…' : 'Send OTP'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-ink/60">OTP sent to <strong>+91 {otpPhone}</strong></p>
                      <Field label="Enter OTP">
                        <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" className={inputClass()} maxLength={6} />
                      </Field>
                      <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                        {loading ? 'Verifying…' : 'Verify OTP'}
                      </Button>
                      <button type="button" onClick={() => { setOtpStep('phone'); setOtpCode(''); setError(null) }} className="text-xs text-accent underline w-full text-center">
                        Change number / resend
                      </button>
                    </>
                  )}
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink/60 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
    </label>
  )
}

function inputClass(error, extra = '') {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow ${error ? 'border-red-300' : 'border-navy-100'} ${extra}`
}