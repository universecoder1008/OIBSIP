import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils/helpers'

export default function PizzaCard({ pizza, onAddToCart }) {
  const { name, description, price, rating, image, tag, isVeg } = pizza

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: '#e8521a' }}
      className="bg-surface border border-[#333] rounded-2xl overflow-hidden transition-colors cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-44 bg-surface-2 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-7xl">🍕</span>
        )}
        {tag && (
          <div className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {tag}
          </div>
        )}
        <div className={`absolute top-3 right-3 w-5 h-5 rounded-sm border-2 flex items-center justify-center text-xs ${isVeg ? 'border-green-500' : 'border-red-500'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-[#f0ebe3] mb-1 text-sm">{name}</h3>
        <p className="text-xs text-[#a89f94] leading-relaxed mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-brand font-bold text-lg">{formatCurrency(price)}</div>
            <div className="text-yellow-400 text-xs mt-0.5">
              {'★'.repeat(Math.floor(rating))}
              <span className="text-[#6b6460] ml-1">{rating}</span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={e => { e.stopPropagation(); onAddToCart(pizza) }}
          >
            + Add
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
