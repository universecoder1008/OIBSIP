import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BASES, SAUCES, CHEESES, VEGGIES, MEATS, VALID_COUPONS } from '@/utils/constants'
import { calcBuilderPrice, formatCurrency } from '@/utils/helpers'
import { useCart } from '@/hooks'
import { Button } from '@/components/ui'

const STEPS = ['Base', 'Sauce', 'Cheese', 'Veggies', 'Meat', 'Summary']

function OptionCard({ item, selected, onClick, multi }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative bg-surface-2 border-2 rounded-xl p-3 text-center cursor-pointer transition-all ${
        selected ? 'border-brand bg-brand/8' : 'border-[#333] hover:border-[#555]'
      }`}
    >
      {selected && multi && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-brand rounded-full flex items-center justify-center text-white text-xs">✓</div>
      )}
      <div className="text-3xl mb-1.5">{item.emoji}</div>
      <div className="text-xs font-medium text-[#f0ebe3]">{item.name}</div>
      {item.price !== undefined && (
        <div className="text-xs text-[#a89f94] mt-0.5">{item.price === 0 ? 'Free' : `+₹${item.price}`}</div>
      )}
    </motion.div>
  )
}

export default function PizzaBuilderWizard() {
  const navigate = useNavigate()
  const { add } = useCart()

  const [step, setStep]         = useState(0)
  const [base, setBase]         = useState(null)
  const [sauce, setSauce]       = useState(null)
  const [cheese, setCheese]     = useState(null)
  const [veggies, setVeggies]   = useState([])
  const [includeMeat, setIncludeMeat] = useState(false)
  const [meats, setMeats]       = useState([])
  const [coupon, setCoupon]     = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const basePrice  = calcBuilderPrice({ base, sauce, cheese, veggies, meats })
  const taxAmt     = Math.round(basePrice * 0.05)
  const delivery   = 49
  const discountAmt= Math.round(basePrice * discount / 100)
  const grand      = basePrice + taxAmt + delivery - discountAmt

  const toggleVeg  = (v) => setVeggies(prev => prev.find(x => x.name === v.name) ? prev.filter(x => x.name !== v.name) : [...prev, v])
  const toggleMeat = (m) => setMeats(prev => prev.find(x => x.name === m.name) ? prev.filter(x => x.name !== m.name) : [...prev, m])

  const canNext = [!!base, !!sauce, !!cheese, true, true, true]

  const applyCoupon = () => {
    const pct = VALID_COUPONS[coupon.toUpperCase()]
    if (pct) { setDiscount(pct); setAppliedCoupon(coupon.toUpperCase()); toast.success(`${coupon.toUpperCase()} applied — ${pct}% off!`) }
    else toast.error('Invalid coupon code')
  }

  const addToCart = () => {

  const desc = [
    base,
    sauce,
    cheese,
    ...veggies.map(v => v.name)
  ]
    .filter(Boolean)
    .join(', ');

  add({

    id: `custom-${Date.now()}`,

    name: 'Custom Pizza',

    description: desc,

    price: grand,

    emoji: '🍕',

    isCustom: true,

    base: base?.name,

sauce: sauce?.name,

cheese: cheese?.name,

    veggies: veggies.map(v => v.name)

  });

  toast.success('Custom pizza added to cart! 🍕');

  navigate('/cart');
};

  const slide = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } }

  return (
    <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-surface-2 px-6 py-5 border-b border-[#333]">
        <div className="flex gap-1 mb-3">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < step ? 'bg-brand' : i === step ? 'bg-brand-light' : 'bg-surface-3'}`} />
          ))}
        </div>
        <div className="text-sm text-[#a89f94]">
          Step {step + 1} of {STEPS.length} — <span className="text-[#f0ebe3] font-medium">{STEPS[step]}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 min-h-[380px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="base" {...slide}>
              <p className="text-sm text-[#a89f94] mb-4">Choose your crust style</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {BASES.map(b => <OptionCard key={b.name} item={b} selected={base?.name === b.name} onClick={() => setBase(b)} />)}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="sauce" {...slide}>
              <p className="text-sm text-[#a89f94] mb-4">Pick your sauce</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {SAUCES.map(s => <OptionCard key={s.name} item={s} selected={sauce?.name === s.name} onClick={() => setSauce(s)} />)}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="cheese" {...slide}>
              <p className="text-sm text-[#a89f94] mb-4">Select your cheese</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CHEESES.map(c => <OptionCard key={c.name} item={c} selected={cheese?.name === c.name} onClick={() => setCheese(c)} />)}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="veggies" {...slide}>
              <p className="text-sm text-[#a89f94] mb-4">Choose your veggies (multi-select)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {VEGGIES.map(v => <OptionCard key={v.name} item={v} selected={!!veggies.find(x => x.name === v.name)} onClick={() => toggleVeg(v)} multi />)}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="meat" {...slide}>
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => setIncludeMeat(!includeMeat)}
                  className={`w-11 h-6 rounded-full transition-all relative border ${includeMeat ? 'bg-brand border-brand' : 'bg-surface-3 border-[#444]'}`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${includeMeat ? 'left-5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-[#f0ebe3]">Add meat toppings (optional)</span>
              </div>
              {includeMeat ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MEATS.map(m => <OptionCard key={m.name} item={m} selected={!!meats.find(x => x.name === m.name)} onClick={() => toggleMeat(m)} multi />)}
                </div>
              ) : (
                <p className="text-[#a89f94] text-sm">Toggle the switch above to add meat toppings.</p>
              )}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="summary" {...slide}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Selection summary */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#f0ebe3]">Your Selections</h3>
                  {[
                    ['🍕 Base',   base?.name    || '—'],
                    ['🍅 Sauce',  sauce?.name   || '—'],
                    ['🧀 Cheese', cheese?.name  || '—'],
                    ['🥬 Veggies',veggies.length ? veggies.map(v => v.name).join(', ') : 'None'],
                    ['🍗 Meat',   meats.length  ? meats.map(m => m.name).join(', ')   : 'None'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2.5 border-b border-[#2a2a2a] text-sm">
                      <span className="text-[#a89f94]">{k}</span>
                      <span className="text-[#f0ebe3] text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#f0ebe3]">Price Breakdown</h3>
                  <div className="bg-surface-2 rounded-xl p-4 space-y-2.5">
                    {[['Base price', `₹299`],['Extras', `₹${basePrice - 299}`],['Tax (5%)', `₹${taxAmt}`],['Delivery', `₹${delivery}`]].map(([l, v]) => (
                      <div key={l} className="flex justify-between text-sm text-[#a89f94]"><span>{l}</span><span>{v}</span></div>
                    ))}
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-400"><span>Discount ({discount}%)</span><span>-₹{discountAmt}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-[#f0ebe3] pt-2 border-t border-[#333]">
                      <span>Grand Total</span><span className="text-brand text-lg">{formatCurrency(grand)}</span>
                    </div>
                  </div>

                  {/* Coupon */}
                  {!appliedCoupon && (
                    <div className="flex gap-2 mt-3">
                      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code (PIZZA10)" className="flex-1 text-sm" />
                      <Button size="sm" onClick={applyCoupon}>Apply</Button>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="mt-3 text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2">
                      ✅ {appliedCoupon} applied — {discount}% off!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-surface-2 px-6 py-4 border-t border-[#333] flex justify-between items-center">
        <Button variant="ghost" onClick={() => step > 0 && setStep(step - 1)} className={step === 0 ? 'opacity-30 pointer-events-none' : ''}>
          ← Back
        </Button>
        {step < 5 ? (
          <Button onClick={() => canNext[step] ? setStep(step + 1) : toast.error('Please make a selection')} className={!canNext[step] ? 'opacity-50' : ''}>
            Next →
          </Button>
        ) : (
          <Button onClick={addToCart}>
            🛒 Add to Cart — {formatCurrency(grand)}
          </Button>
        )}
      </div>
    </div>
  )
}
