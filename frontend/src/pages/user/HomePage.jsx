import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth, useCart } from '@/hooks'
import PizzaCard from '@/components/pizza/PizzaCard'
import { SkeletonCard, SearchInput } from '@/components/ui'

// Mock data (replace with API call)
const MOCK_PIZZAS = [
{
  _id:'1',
  name:'Margherita Classic',
  description:'Fresh mozzarella, tomato sauce, fresh basil leaves',
  price:299,
  rating:4.5,
  tag:'Bestseller',
  isVeg:true,
  cat:'Veg',

  base:"Thin Crust",
  sauce:"Tomato Sauce",
  cheese:"Mozzarella",
  veggies:["Basil"],
  meats:[]
},

{
  _id:'2',
  name:'Pepperoni Feast',
  description:'Double pepperoni, mozzarella, dried oregano',
  price:399,
  rating:4.8,
  tag:'Hot',
  isVeg:false,
  cat:'Non-Veg',

  base:"Thin Crust",
  sauce:"Tomato Sauce",
  cheese:"Mozzarella",
  veggies:[],
  meats:["Pepperoni"]
},

{
  _id:'3',
  name:'BBQ Chicken',
  description:'Grilled chicken tikka, BBQ sauce, red onions',
  price:449,
  rating:4.6,
  tag:'Popular',
  isVeg:false,
  cat:'Non-Veg',

  base:"Cheese Burst",
  sauce:"BBQ Sauce",
  cheese:"Mozzarella",
  veggies:["Onion"],
  meats:["Chicken"]
}
]

const CATS = ['All', 'Veg', 'Non-Veg']

export default function HomePage() {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const { add }     = useCart()
  const [cat, setCat]     = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [pizzas, setPizzas]   = useState([])

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => { setPizzas(MOCK_PIZZAS); setLoading(false) }, 800)
  }, [])

  const filtered = pizzas.filter(p => {
    const matchCat    = cat === 'All' || p.cat === cat
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

 const handleAddToCart = (pizza) => {

  add(pizza)

  toast.success(
    `${pizza.name} added to cart! 🍕`
  )
}

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y:  0 }}
        className="relative bg-surface border border-[#333] rounded-2xl p-8 mb-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[180px] opacity-5 select-none">🍕</div>
        <div className="relative z-10 max-w-xl">
          <span className="inline-block bg-brand/15 text-brand text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🔥 Fresh & Hot — Order in 30 minutes
          </span>
          <h1 className="font-display text-4xl leading-tight mb-3">
            Craft Your Perfect <span className="text-brand">Slice</span>
          </h1>
          <p className="text-[#a89f94] text-sm mb-6 leading-relaxed">
            Premium ingredients, artisan crusts, and real-time delivery tracking — all in one bite.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate('/builder')} className="btn-primary text-sm px-5 py-2.5 rounded-xl">
              🍕 Build Your Pizza
            </button>
            <button onClick={() => navigate('/orders')} className="btn-ghost text-sm px-5 py-2.5 rounded-xl">
              📋 Track Order
            </button>
          </div>
        </div>
      </motion.div>

      {/* Offers strip */}
      <div className="flex gap-3 mb-7 overflow-x-auto pb-1">
        {[
          { label: 'PIZZA10', desc: '10% off your first order', color: 'text-brand' },
          { label: 'FEAST20', desc: '20% off orders above ₹999', color: 'text-green-400' },
          { label: 'NEWUSER', desc: '15% off for new users', color: 'text-blue-400' },
        ].map(o => (
          <div key={o.label} className="flex-shrink-0 bg-surface border border-[#333] rounded-xl px-4 py-2.5 flex items-center gap-3">
            <span className={`font-mono font-bold text-sm ${o.color}`}>{o.label}</span>
            <span className="text-xs text-[#a89f94]">{o.desc}</span>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex gap-2">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${cat === c ? 'bg-brand border-brand text-white' : 'border-[#333] text-[#a89f94] hover:text-[#f0ebe3]'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="w-56">
          <SearchInput value={search} onChange={setSearch} placeholder="Search pizzas..." />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length
            ? filtered.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <PizzaCard pizza={p} onAddToCart={handleAddToCart} />
                </motion.div>
              ))
            : (
              <div className="col-span-3 text-center py-16 text-[#a89f94]">
                <div className="text-4xl mb-3">🔍</div>
                <p>No pizzas found for "{search}"</p>
              </div>
            )
        }
      </div>
    </div>
  )
}
