import { useState, useMemo, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Calculator, Landmark, IndianRupee } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { SectionEyebrow, Card, Badge } from '../components/ui.jsx'
import { calculateEMI } from '../data/emiCalculator.js'
import { BANKS, formatINR } from '../data/properties.js'

export default function EmiCalculatorPage() {
  const { params } = useRouter()
  const initialPrice = Number(params.get('price')) || 5000000

  const [propertyPrice, setPropertyPrice] = useState(initialPrice)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [selectedBank, setSelectedBank] = useState(BANKS[0].id)
  const [interestRate, setInterestRate] = useState(BANKS[0].rate)
  const [tenureYears, setTenureYears] = useState(20)

  useEffect(() => {
    const bank = BANKS.find((b) => b.id === selectedBank)
    if (bank) setInterestRate(bank.rate)
  }, [selectedBank])

  // Re-sync the price slider if the user re-navigates here with a new
  // ?price= (e.g. clicking "Open Full Calculator" from a different
  // property's EMI teaser while this page is already mounted).
  useEffect(() => {
    const priceFromUrl = Number(params.get('price'))
    if (priceFromUrl && priceFromUrl !== propertyPrice) setPropertyPrice(priceFromUrl)
  }, [params])

  const downPayment = Math.round(propertyPrice * (downPaymentPct / 100))
  const loanAmount = propertyPrice - downPayment

  const result = useMemo(
    () => calculateEMI(loanAmount, interestRate, tenureYears),
    [loanAmount, interestRate, tenureYears]
  )

  const pieData = [
    { name: 'Principal', value: loanAmount, color: '#0B1F3A' },
    { name: 'Total Interest', value: result.totalInterest, color: '#D4AF37' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <SectionEyebrow>Plan before you visit</SectionEyebrow>
        <h1 className="font-display font-bold text-navy text-3xl mb-3">EMI Calculator</h1>
        <p className="text-sm text-ink/55">
          Compare monthly payments across five major banks before you commit to a unit.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8">
        {/* Inputs */}
        <Card className="p-7">
          <div className="flex items-center gap-2.5 mb-7">
            <span className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center">
              <Calculator size={16} className="text-navy" />
            </span>
            <h2 className="font-display font-semibold text-navy">Loan Details</h2>
          </div>

          <SliderField
            label="Property Price"
            value={propertyPrice}
            min={1000000}
            max={20000000}
            step={100000}
            onChange={setPropertyPrice}
            format={formatINR}
          />

          <SliderField
            label="Down Payment"
            value={downPaymentPct}
            min={5}
            max={75}
            step={1}
            onChange={setDownPaymentPct}
            format={(v) => `${v}% · ${formatINR(downPayment)}`}
          />

          <div className="mb-6">
            <span className="text-xs font-medium text-ink/60 mb-2.5 block">Bank Selection</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    selectedBank === bank.id
                      ? 'border-navy bg-navy text-white'
                      : 'border-navy-100 text-ink/70 hover:border-navy-400'
                  }`}
                >
                  <Landmark size={14} className={selectedBank === bank.id ? 'text-gold mb-1' : 'text-navy/40 mb-1'} />
                  <p className="text-xs font-semibold leading-tight">{bank.name}</p>
                  <p className={`text-[11px] mt-0.5 ${selectedBank === bank.id ? 'text-white/60' : 'text-ink/40'}`}>
                    {bank.rate}% p.a.
                  </p>
                </button>
              ))}
            </div>
          </div>

          <SliderField
            label="Interest Rate (editable)"
            value={interestRate}
            min={6}
            max={14}
            step={0.05}
            onChange={setInterestRate}
            format={(v) => `${v.toFixed(2)}% p.a.`}
          />

          <SliderField
            label="Loan Tenure"
            value={tenureYears}
            min={5}
            max={30}
            step={1}
            onChange={setTenureYears}
            format={(v) => `${v} years`}
          />
        </Card>

        {/* Output */}
        <div className="space-y-6">
          <Card className="p-7 bg-navy text-white">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Monthly EMI</p>
            <p className="font-display font-bold text-4xl flex items-baseline gap-1">
              <IndianRupee size={24} className="text-gold" />
              {result.emi.toLocaleString('en-IN')}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-[11px] text-white/45 uppercase tracking-wide">Total Interest</p>
                <p className="font-semibold mt-1">{formatINR(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-[11px] text-white/45 uppercase tracking-wide">Total Payment</p>
                <p className="font-semibold mt-1">{formatINR(result.totalPayment)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-7">
            <h3 className="font-display font-semibold text-navy text-sm mb-4">Principal vs Interest</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatINR(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-5 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-7">
            <h3 className="font-display font-semibold text-navy text-sm mb-4">Year-wise Breakdown</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.schedule} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0B1F3A10" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#1E293B80' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Bar dataKey="principal" stackId="a" fill="#0B1F3A" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="interest" stackId="a" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SliderField({ label, value, min, max, step, onChange, format }) {
  return (
    <label className="block mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-ink/60">{label}</span>
        <Badge tone="navy">{format(value)}</Badge>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-navy"
      />
    </label>
  )
}
