import { motion } from 'framer-motion'

export default function AuthCard({ title, highlight, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md bg-surface border border-[#333] rounded-2xl p-8"
    >
      <h1 className="font-display text-3xl mb-1">
        {title} {highlight && <span className="text-brand">{highlight}</span>}
      </h1>
      {subtitle && <p className="text-[#a89f94] text-sm mb-7">{subtitle}</p>}
      {children}
    </motion.div>
  )
}
