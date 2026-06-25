// Standard reducing-balance EMI formula:
// EMI = P * r * (1+r)^n / ((1+r)^n - 1)
// where P = principal, r = monthly interest rate, n = tenure in months

export const calculateEMI = (principal, annualRatePct, tenureYears) => {
  if (!principal || principal <= 0 || !tenureYears || tenureYears <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] }
  }
  const r = annualRatePct / 12 / 100
  const n = tenureYears * 12

  const emi =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const totalPayment = emi * n
  const totalInterest = totalPayment - principal

  // Year-by-year breakdown for the chart: principal vs interest paid that year
  const schedule = []
  let balance = principal
  for (let year = 1; year <= tenureYears; year++) {
    let yearPrincipal = 0
    let yearInterest = 0
    for (let m = 0; m < 12; m++) {
      const interestPortion = balance * r
      const principalPortion = emi - interestPortion
      balance = Math.max(0, balance - principalPortion)
      yearPrincipal += principalPortion
      yearInterest += interestPortion
    }
    schedule.push({
      year,
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      balance: Math.round(balance),
    })
  }

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    schedule,
  }
}
