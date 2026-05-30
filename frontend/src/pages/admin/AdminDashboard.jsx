import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { fetchAllOrders, fetchAnalytics } from '@/features/admin/adminSlice'
import { StatCard, Badge } from '@/components/ui'
import { useAuth } from '@/hooks'
import { getStatusColor, formatCurrency } from '@/utils/helpers'

const weekData = [
  { day: 'Mon', orders: 45, revenue: 13455 },
  { day: 'Tue', orders: 62, revenue: 18786 },
  { day: 'Wed', orders: 38, revenue: 11438 },
  { day: 'Thu', orders: 74, revenue: 22126 },
  { day: 'Fri', orders: 55, revenue: 16445 },
  { day: 'Sat', orders: 88, revenue: 26312 },
  { day: 'Sun', orders: 71, revenue: 21229 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-2 border border-[#333] rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.name === 'revenue' ? formatCurrency(p.value) : p.value}</p>)}
    </div>
  )
  return null
}

export default function AdminDashboard() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const {
  orders,
  analytics
} = useSelector(s => s.admin)

  useEffect(() => { dispatch(fetchAllOrders()); dispatch(fetchAnalytics()) }, [])

  const recentOrders = orders.slice(0, 5)

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold mb-1">Good day, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
        <p className="text-[#a89f94] text-sm mb-6">Here's what's happening at PizzAIa today.</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
  icon="📋"
  label="Total Orders"
  value={analytics?.totalOrders || 0}
  color="#e8521a"
  bg="rgba(232,82,26,0.1)"
/>

<StatCard
  icon="💰"
  label="Revenue"
  value={formatCurrency(
    analytics?.totalRevenue || 0
  )}
  color="#4caf50"
  bg="rgba(76,175,80,0.1)"
/>

<StatCard
  icon="👥"
  label="Total Users"
  value={analytics?.totalUsers || 0}
  color="#2196f3"
  bg="rgba(33,150,243,0.1)"
/>

<StatCard
  icon="⏳"
  label="Pending Orders"
  value={analytics?.pendingOrders || 0}
  color="#ff9800"
  bg="rgba(255,152,0,0.1)"
/>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-surface border border-[#333] rounded-2xl p-5">
            <h2 className="font-semibold mb-4 text-sm">Orders This Week</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
  data={analytics?.weeklyData || []}
  barSize={28}
>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#a89f94', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a89f94', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#e8521a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface border border-[#333] rounded-2xl p-5">
            <h2 className="font-semibold mb-4 text-sm">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
  data={analytics?.weeklyData || []}
>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#a89f94', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a89f94', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#e8521a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <button onClick={() => navigate('/admin/orders')} className="text-xs text-brand hover:underline">View all →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-surface-2">
                {['Order ID','Customer','Amount','Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-[#6b6460] font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? recentOrders.map(o => (
                <tr key={o._id} className="border-t border-[#1a1a1a] hover:bg-surface-2 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-brand text-xs">{o._id?.slice(-8)}</td>
                  <td className="px-5 py-3.5 text-sm">{o.user?.name || 'Customer'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold">{formatCurrency(o.totalPrice)}</td>
                  <td className="px-5 py-3.5"><Badge color={getStatusColor(o.status)}>{o.status}</Badge></td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-[#6b6460] text-sm">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
