import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchAnalytics } from '@/features/admin/adminSlice'
import { StatCard, ProgressBar, PageHeader } from '@/components/ui'
import { formatCurrency } from '@/utils/helpers'
import { useSelector } from 'react-redux'


const catData = [
  { name:'Veg', value:62 },{ name:'Non-Veg', value:38 },
]
const COLORS = ['#e8521a','#ff9800']

export default function AdminAnalytics() {
  const dispatch = useDispatch()
  const { analytics } =
  useSelector(s => s.admin)

  const maxOrders = Math.max(
  ...(analytics?.topSellingPizzas?.map(
    p => p.orders
  ) || [1])
)
  useEffect(() => { dispatch(fetchAnalytics()) }, [])

  return (
    <div>
      <PageHeader title="Analytics" highlight="Dashboard" subtitle="Business insights at a glance" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon="💰" label="Total Revenue"    value={formatCurrency(
  analytics?.totalRevenue || 0
)} color="#4caf50" bg="rgba(76,175,80,0.1)" />
        <StatCard icon="📋" label="Total Orders"     value={analytics?.totalOrders || 0}    color="#e8521a" bg="rgba(232,82,26,0.1)" />
        <StatCard icon="🍕" label="Avg Order Value"  value={formatCurrency(
  analytics?.avgOrderValue || 0
)}     color="#2196f3" bg="rgba(33,150,243,0.1)" />
        <StatCard icon="🔄" label="Repeat Rate"      value="72%"        color="#ff9800" bg="rgba(255,152,0,0.1)" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-surface border border-[#333] rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
  data={analytics?.monthlyRevenue || []}
>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#a89f94', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#a89f94', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v=>[formatCurrency(v),'Revenue']} contentStyle={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:10, fontSize:12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#e8521a" strokeWidth={2.5} dot={{ fill:'#e8521a', r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface border border-[#333] rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm">Category Split</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v=>[`${v}%`]} contentStyle={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:10, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          {catData.map((c, i) => (
            <div key={c.name} className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-sm text-[#a89f94]">{c.name}</span>
              </div>
              <span className="font-semibold text-sm">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-[#333] rounded-2xl p-5">
        <h2 className="font-semibold mb-4 text-sm">Top Selling Pizzas</h2>
       {analytics?.topSellingPizzas?.map(p => (
  <div key={p.name} className="mb-4 last:mb-0">
    <div className="flex justify-between text-sm mb-1.5">
      <span>{p.name}</span>
      <span className="text-[#a89f94]">
        {p.orders} orders
      </span>
    </div>

    <ProgressBar
      value={(p.orders / maxOrders) * 100}
    />
  </div>
))}
      </div>
    </div>
  )
}
