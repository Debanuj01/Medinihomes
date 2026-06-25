import { useState } from 'react'
import { X, Lock, MessageCircle, Heart, BellRing, CheckCircle2 } from 'lucide-react'
import { useAuth, EMPLOYMENT_TYPE_OPTIONS } from '../context/AuthContext.jsx'
import { Button } from './ui.jsx'

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

export default function RegistrationModal() {
  const { registrationModalOpen, setRegistrationModalOpen, register, pendingIntent, setPendingIntent } =
    useAuth()
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    city: '',
    employmentType: '',
    income: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (!registrationModalOpen) return null

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: null }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Enter your full name'
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
      next.mobile = 'Enter a valid 10-digit Indian mobile number'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address'
    if (!form.city.trim()) next.city = 'Enter your city'
    if (!form.employmentType) next.employmentType = 'Select your employment type'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    setTimeout(() => {
      register(form)
      setSubmitted(false)
      setForm({ fullName: '', mobile: '', email: '', city: '', employmentType: '', income: '' })
    }, 700)
  }

  const close = () => {
    setRegistrationModalOpen(false)
    setPendingIntent(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl grid sm:grid-cols-5">
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-navy-50 flex items-center justify-center text-ink/60"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="sm:col-span-2 bg-navy text-white p-8 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-3">
            Free account
          </span>
          <h3 className="font-display text-2xl font-bold mb-2 leading-snug">
            {pendingIntent === 'chat'
              ? 'Sign up to message this promoter'
              : pendingIntent === 'contact'
              ? 'Sign up to view promoter contact details'
              : 'Create your free MediniHomes account'}
          </h3>
          <p className="text-sm text-white/65 mb-8">
            Takes under a minute. No payment, no spam — just access to verified promoters.
          </p>
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

        <div className="sm:col-span-3 p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <CheckCircle2 size={48} className="text-success mb-4" />
              <h4 className="font-display text-lg font-bold text-navy mb-1">Account created</h4>
              <p className="text-sm text-ink/60">Unlocking promoter details now…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-display font-semibold text-navy mb-1">Your details</h4>

              <Field label="Full Name" error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="e.g. Suman Mukherjee"
                  className={inputClass(errors.fullName)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Mobile Number" error={errors.mobile}>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 rounded-l-xl bg-navy-50 text-ink/60 text-sm border border-r-0 border-navy-100">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98XXXXXXXX"
                      className={inputClass(errors.mobile, 'rounded-l-none')}
                    />
                  </div>
                </Field>
                <Field label="City" error={errors.city}>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="e.g. Contai"
                    className={inputClass(errors.city)}
                  />
                </Field>
              </div>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field label="Employment Type" error={errors.employmentType}>
                <select
                  value={form.employmentType}
                  onChange={(e) => update('employmentType', e.target.value)}
                  className={inputClass(errors.employmentType)}
                >
                  <option value="">Select employment type</option>
                  {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Monthly Income (optional)">
                <select
                  value={form.income}
                  onChange={(e) => update('income', e.target.value)}
                  className={inputClass()}
                >
                  <option value="">Prefer not to say</option>
                  {INCOME_BANDS.map((band) => (
                    <option key={band} value={band}>
                      {band}
                    </option>
                  ))}
                </select>
              </Field>

              <Button type="submit" className="w-full mt-2" size="lg">
                Create Free Account
              </Button>
              <p className="text-xs text-center text-ink/40">
                By signing up, you agree this is a demo prototype — no real account is created.
              </p>
            </form>
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
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow ${
    error ? 'border-red-300' : 'border-navy-100'
  } ${extra}`
}
