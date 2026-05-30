import { motion } from 'framer-motion'

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-xl transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brand hover:bg-brand-dark text-white',
    outline: 'bg-transparent border border-brand text-brand hover:bg-brand hover:text-white',
    ghost:   'bg-surface-2 hover:bg-surface-3 border border-[#333] text-[#f0ebe3]',
    danger:  'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400',
  }
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading ? <span className="animate-spin">⏳</span> : children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, borderColor: '#e8521a' } : undefined}
      className={`bg-surface border border-[#333] rounded-2xl transition-colors ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeColors = {
  green:  'bg-green-500/15 text-green-400',
  orange: 'bg-orange-500/15 text-orange-400',
  red:    'bg-red-500/15 text-red-400',
  blue:   'bg-blue-500/15 text-blue-400',
  gray:   'bg-surface-3 text-[#a89f94]',
  brand:  'bg-brand/15 text-brand',
}
export function Badge({ children, color = 'gray' }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColors[color] || badgeColors.gray}`}>
      {children}
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`bg-surface-3 animate-pulse rounded-xl ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden">
      <Skeleton className="h-44 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ emoji = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-[#a89f94] text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = '#e8521a' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, color = '#e8521a', bg = 'rgba(232,82,26,0.1)' }) {
  return (
    <Card className="p-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: bg, color }}>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-[#a89f94]">{label}</div>
    </Card>
  )
}

// ─── SearchInput ──────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6460]">🔍</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2.5 text-sm bg-surface-2 border border-[#333] rounded-xl text-[#f0ebe3] placeholder-[#6b6460] outline-none focus:border-brand transition-colors w-full"
      />
    </div>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, highlight, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display text-3xl text-[#f0ebe3]">
          {title} {highlight && <span className="text-brand">{highlight}</span>}
        </h1>
        {subtitle && <p className="text-[#a89f94] text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
