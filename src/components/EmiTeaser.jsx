import { useState, useMemo } from 'react'
import { Calculator, ArrowRight } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { Button } from './ui.jsx'
import { calculateEMI } from '../data/emiCalculator.js'
import { formatINR } from '../data/properties.js'

export default function EmiTeaser({ defaultPrice }) {
  const { navigate } = useRouter()
  const [price, setPrice] = useState(defaultPrice)
  const downPaymentPct = 20
  const loanAmount = Math.round(price * (1 - downPaymentPct / 100))

  const result = useMemo(() => calculateEMI(loanAmount, 8.5, 20), [loanAmount])

  return (
    <div className="bg-navy rounded-2xl p-6 sm:p-7">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
          <Calculator size={16} className="text-gold" />
        </span>
        <h3 className="font-display font-semibold text-white text-sm">Estimate your EMI</h3>
      </div>

      <label className="block mb-5">
        <span className="text-xs text-white/50 mb-1.5 block">Property Price</span>
        <input
          type="range"
          min={Math.round(defaultPrice * 0.5)}
          max={Math.round(defaultPrice * 1.5)}
          step={50000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-gold"
        />
        <span className="font-display font-bold text-white text-lg mt-1 block">{formatINR(price)}</span>
      </label>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-[10px] text-white/45 uppercase tracking-wide">Down Payment (20%)</p>
          <p className="text-sm font-semibold text-white mt-1">{formatINR(price - loanAmount)}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-[10px] text-white/45 uppercase tracking-wide">Loan Amount</p>
          <p className="text-sm font-semibold text-white mt-1">{formatINR(loanAmount)}</p>
        </div>
      </div>

      <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-5">
        <p className="text-[10px] text-gold uppercase tracking-wide font-semibold">Estimated Monthly EMI</p>
        <p className="font-display font-bold text-white text-2xl mt-1">
          {formatINR(result.emi)}<span className="text-sm font-normal text-white/50">/month</span>
        </p>
        <p className="text-[11px] text-white/40 mt-1">At 8.5% for 20 years · indicative only</p>
      </div>

      <Button
        variant="gold"
        className="w-full"
        onClick={() => navigate('emi-calculator', { price })}
      >
        Open Full Calculator <ArrowRight size={15} />
      </Button>
    </div>
  )
}
