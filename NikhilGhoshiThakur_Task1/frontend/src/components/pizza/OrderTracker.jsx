import { motion } from 'framer-motion'
import { ORDER_STATUSES } from '@/utils/constants'
import { getStatusIndex } from '@/utils/helpers'

const ICONS = ['📋', '👨‍🍳', '🍕', '🛵', '🏠']

export default function OrderTracker({ status }) {
  const activeIdx = getStatusIndex(status)

  return (
    <div className="relative py-2">
      {ORDER_STATUSES.map((s, i) => {
        const isDone   = i < activeIdx
        const isActive = i === activeIdx

        return (
          <div key={s} className="flex gap-4 mb-7 last:mb-0 relative">
            {/* Connector line */}
            {i < ORDER_STATUSES.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-full -translate-x-1/2">
                <div className={`h-full transition-all duration-500 ${isDone ? 'bg-brand' : 'bg-[#333]'}`} />
              </div>
            )}

            {/* Dot */}
            <div className="relative z-10 flex-shrink-0">
              {isDone ? (
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold">✓</div>
              ) : isActive ? (
                <motion.div
                  animate={{ boxShadow: ['0 0 0 0 rgba(232,82,26,0.4)', '0 0 0 10px rgba(232,82,26,0)', '0 0 0 0 rgba(232,82,26,0)'] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-8 h-8 rounded-full border-2 border-brand bg-surface flex items-center justify-center text-sm"
                >
                  {ICONS[i]}
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-[#333] bg-surface flex items-center justify-center text-sm opacity-40">
                  {ICONS[i]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pt-1">
              <div className={`text-sm font-medium ${isDone || isActive ? 'text-[#f0ebe3]' : 'text-[#6b6460]'}`}>{s}</div>
              {isActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-brand mt-0.5">
                  In progress...
                </motion.div>
              )}
              {isDone && <div className="text-xs text-[#6b6460] mt-0.5">Completed</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
