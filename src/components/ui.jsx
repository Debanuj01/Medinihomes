import { Star } from 'lucide-react'

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  as: Component = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  const variants = {
    primary:
      'bg-navy text-white hover:bg-navy-600 shadow-card hover:shadow-cardHover active:scale-[0.98]',
    gold:
      'bg-gold text-navy hover:bg-gold-400 shadow-gold hover:shadow-lg active:scale-[0.98] font-semibold',
    outline:
      'border-2 border-navy text-navy hover:bg-navy hover:text-white',
    ghost: 'text-navy hover:bg-navy-50',
    white: 'bg-white text-navy hover:bg-navy-50 shadow-card',
  }
  return (
    <Component className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  )
}

export function Badge({ children, tone = 'navy', className = '' }) {
  const tones = {
    navy: 'bg-navy-50 text-navy',
    gold: 'bg-gold-50 text-gold-700',
    success: 'bg-green-50 text-green-700',
    accent: 'bg-blue-50 text-accent',
    white: 'bg-white/90 text-navy backdrop-blur-sm',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function RatingStars({ rating, reviewCount, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-navy-100 text-navy-100'}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-ink">{rating.toFixed(1)}</span>
      {reviewCount != null && (
        <span className="text-sm text-ink/50">({reviewCount} reviews)</span>
      )}
    </div>
  )
}

export function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card ${
        hoverable ? 'hover:shadow-cardHover transition-shadow duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function SectionEyebrow({ children }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-gold-700 mb-3">
      {children}
    </span>
  )
}

export function StatusPill({ status }) {
  const isReady = status === 'ready'
  return (
    <Badge tone={isReady ? 'success' : 'accent'}>
      {isReady ? 'Ready to Move' : 'Under Construction'}
    </Badge>
  )
}
