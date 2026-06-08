import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCart } from '@/hooks'
import { Button, EmptyState } from '@/components/ui'
import { formatCurrency, calcOrderTotals } from '@/utils/helpers'
import { VALID_COUPONS } from '@/utils/constants'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, add, remove, update, coupon, apply, removeCoupon, grand, subtotal, tax, delivery, discount } = useCart()
  const [couponInput, setCouponInput] = useState('')

  const handleApplyCoupon = () => {
    const pct = VALID_COUPONS[couponInput.toUpperCase()]
    if (pct) { apply(couponInput.toUpperCase(), pct); toast.success(`${couponInput.toUpperCase()} applied — ${pct}% off!`) }
    else toast.error('Invalid coupon code')
    setCouponInput('')
  }

  if (!items.length) return (
    <EmptyState emoji="🛒" title="Your cart is empty"
      description="Looks like you haven't added any pizzas yet"
      action={<Link to="/"><button className="btn-primary px-6 py-2.5 rounded-xl text-sm">Browse Pizzas</button></Link>}
    />
  )

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Your <span className="text-brand">Cart</span></h1>

      <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden mb-4">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-4 p-4 ${i < items.length - 1 ? 'border-b border-[#222]' : ''}`}
            >
              <span className="text-4xl flex-shrink-0">{item.emoji || '🍕'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.name}</div>
                <div className="text-xs text-[#a89f94] truncate mt-0.5">{item.description}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-surface-2 border border-[#333] rounded-lg px-2 py-1">
                  <button onClick={() => update(item.id, -1)} className="text-[#a89f94] hover:text-[#f0ebe3] w-5 h-5 flex items-center justify-center text-lg">−</button>
                  <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                  <button onClick={() => update(item.id,  1)} className="text-[#a89f94] hover:text-[#f0ebe3] w-5 h-5 flex items-center justify-center text-lg">+</button>
                </div>
                <div className="font-bold text-brand text-sm">{formatCurrency(item.price * item.qty)}</div>
                <button onClick={() => { remove(item.id); toast.success('Item removed') }} className="text-xs text-[#6b6460] hover:text-red-400 transition-colors">Remove</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Coupon */}
      {!coupon ? (
        <div className="flex gap-2 mb-4">
          <input value={couponInput} onChange={e => setCouponInput(e.target.value)}
            placeholder="Enter coupon (try PIZZA10, FEAST20, NEWUSER)"
            onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
          <Button size="sm" onClick={handleApplyCoupon}>Apply</Button>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2.5">
          <span className="text-green-400 text-sm">✅ Coupon <strong>{coupon}</strong> applied</span>
          <button onClick={() => { removeCoupon(); toast('Coupon removed') }} className="text-xs text-[#6b6460] hover:text-red-400">Remove</button>
        </div>
      )}

      {/* Totals */}
      <div className="bg-surface border border-[#333] rounded-2xl p-5 mb-5">
        {[['Subtotal', formatCurrency(subtotal)], ['Tax (5%)', formatCurrency(tax)], ['Delivery', formatCurrency(delivery)]].map(([l, v]) => (
          <div key={l} className="flex justify-between text-sm text-[#a89f94] mb-2.5">{l}<span>{v}</span></div>
        ))}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-400 mb-2.5">Discount<span>-{formatCurrency(discount)}</span></div>
        )}
        <div className="flex justify-between font-bold text-[#f0ebe3] pt-3 border-t border-[#333] text-base">
          Grand Total <span className="text-brand text-lg">{formatCurrency(grand)}</span>
        </div>
      </div>

      <Button onClick={() => navigate('/checkout')} className="w-full justify-center py-3.5 text-base">
        Proceed to Checkout →
      </Button>
      <p className="text-center text-xs text-[#6b6460] mt-2">🔒 Secure payment via Razorpay</p>
    </div>
  )
}
