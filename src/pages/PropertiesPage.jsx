import { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, X, Eye } from 'lucide-react'
import { useRouter } from '../context/RouterContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Button, Badge } from '../components/ui.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import QuickViewModal from '../components/QuickViewModal.jsx'
import { PROPERTIES } from '../data/properties.js'
import { TOWNS } from '../data/towns.js'

const BUDGET_OPTIONS = [
  { value: '', label: 'Any budget' },
  { value: '0-3000000', label: 'Under ₹30 L' },
  { value: '3000000-6000000', label: '₹30 L – ₹60 L' },
  { value: '6000000-10000000', label: '₹60 L – ₹1 Cr' },
  { value: '10000000-99999999', label: 'Above ₹1 Cr' },
]
const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK']
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function PropertiesPage() {
  const { params, navigate } = useRouter()
  const { addRecentSearch } = useAuth()
  const [filters, setFilters] = useState({
    town: params.get('town') || '',
    budget: params.get('budget') || '',
    bhk: params.get('bhk') || '',
  })
  const [sort, setSort] = useState('relevance')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickViewProperty, setQuickViewProperty] = useState(null)

  useEffect(() => {
    setFilters({
      town: params.get('town') || '',
      budget: params.get('budget') || '',
      bhk: params.get('bhk') || '',
    })
  }, [params])

  const filtered = useMemo(() => {
    let list = PROPERTIES.filter((p) => {
      if (filters.town && p.townId !== filters.town) return false
      if (filters.bhk && !p.bhkTypes.includes(filters.bhk)) return false
      if (filters.budget) {
        const [min, max] = filters.budget.split('-').map(Number)
        if (p.priceMax < min || p.priceMin > max) return false
      }
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceMin - b.priceMin)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.priceMax - a.priceMax)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [filters, sort])

  const applyFilter = (key, value) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const town = TOWNS.find((t) => t.id === next.town)
    addRecentSearch({
      label: [town?.name, next.bhk, next.budget && 'budget filter'].filter(Boolean).join(' · ') || 'All properties',
      filters: next,
    })
  }

  const clearFilters = () => {
    setFilters({ town: '', budget: '', bhk: '' })
    navigate('properties')
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-navy text-3xl mb-2">
          {filters.town ? `Properties in ${TOWNS.find((t) => t.id === filters.town)?.name}` : 'All Properties'}
        </h1>
        <p className="text-sm text-ink/55">{filtered.length} verified listings match your filters</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters sidebar - desktop */}
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} applyFilter={applyFilter} clearFilters={clearFilters} />
        </aside>

        <div>
          {/* Mobile filter trigger + sort */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy-100 text-sm font-medium text-navy"
            >
              <SlidersHorizontal size={15} />
              Filters {activeFilterCount > 0 && <Badge tone="gold">{activeFilterCount}</Badge>}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-ink/45 hidden sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm font-medium text-ink border border-navy-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-navy-50/40 rounded-2xl">
              <p className="font-display font-semibold text-navy mb-2">No properties match these filters</p>
              <p className="text-sm text-ink/55 mb-5">Try widening your budget range or choosing a different town.</p>
              <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Quick view trigger row, shown below grid for discoverability */}
          {filtered.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {filtered.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setQuickViewProperty(p)}
                  className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-navy px-3 py-1.5 rounded-full border border-navy-100"
                >
                  <Eye size={12} /> Quick view: {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-navy">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <FilterPanel filters={filters} applyFilter={applyFilter} clearFilters={clearFilters} />
            <Button className="w-full mt-6" onClick={() => setMobileFiltersOpen(false)}>
              Show {filtered.length} properties
            </Button>
          </div>
        </div>
      )}

      {quickViewProperty && (
        <QuickViewModal property={quickViewProperty} onClose={() => setQuickViewProperty(null)} />
      )}
    </div>
  )
}

function FilterPanel({ filters, applyFilter, clearFilters }) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-navy text-sm">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-accent font-medium">
          Clear all
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Town</p>
        <div className="space-y-1.5">
          <FilterRadio
            checked={!filters.town}
            label="All towns"
            onClick={() => applyFilter('town', '')}
          />
          {TOWNS.map((town) => (
            <FilterRadio
              key={town.id}
              checked={filters.town === town.id}
              label={town.name}
              onClick={() => applyFilter('town', town.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Budget</p>
        <div className="space-y-1.5">
          {BUDGET_OPTIONS.map((opt) => (
            <FilterRadio
              key={opt.value}
              checked={filters.budget === opt.value}
              label={opt.label}
              onClick={() => applyFilter('budget', opt.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">BHK Type</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyFilter('bhk', '')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              !filters.bhk ? 'bg-navy text-white border-navy' : 'border-navy-100 text-ink/60'
            }`}
          >
            Any
          </button>
          {BHK_OPTIONS.map((bhk) => (
            <button
              key={bhk}
              onClick={() => applyFilter('bhk', bhk)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                filters.bhk === bhk ? 'bg-navy text-white border-navy' : 'border-navy-100 text-ink/60'
              }`}
            >
              {bhk}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterRadio({ checked, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 w-full text-left py-1 group">
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          checked ? 'border-navy' : 'border-navy-100'
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-navy" />}
      </span>
      <span className={`text-sm ${checked ? 'text-navy font-medium' : 'text-ink/60'}`}>{label}</span>
    </button>
  )
}
