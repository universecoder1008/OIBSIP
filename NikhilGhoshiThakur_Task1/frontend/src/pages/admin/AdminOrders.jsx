import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { fetchAllOrders, updateOrderStatus } from '@/features/admin/adminSlice'
import { Badge, SearchInput, PageHeader } from '@/components/ui'
import { getStatusColor, formatCurrency } from '@/utils/helpers'
import { ORDER_STATUSES } from '@/utils/constants'

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => { dispatch(fetchAllOrders()) }, [])

  const filtered = orders.filter(o => {
    const matchSearch = o._id?.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || o.status === filter
    return matchSearch && matchFilter
  })

  const handleStatusChange = async (id, status) => {
    const res = await dispatch(updateOrderStatus({ id, status }))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Status updated!')
    else toast.error('Update failed')
  }

  return (
    <div>
      <PageHeader title="Order" highlight="Management" subtitle={`${orders.length} total orders`} />

      <div className="flex gap-3 mb-5 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['All', ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filter === s ? 'bg-brand border-brand text-white' : 'border-[#333] text-[#a89f94] hover:text-[#f0ebe3]'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="w-56">
          <SearchInput value={search} onChange={setSearch} placeholder="Search orders..." />
        </div>
      </div>

      <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2">
              {['Order ID','Customer','Items','Amount','Status','Time','Update'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#6b6460] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o._id} className="border-t border-[#1a1a1a] hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3.5 font-mono text-brand text-xs">{o._id?.slice(-8)}</td>
                <td className="px-4 py-3.5 text-sm">{o.user?.name || '—'}</td>
                <td className="px-4 py-3.5 text-xs text-[#a89f94] max-w-[140px] truncate">{o.items?.map(i => i.pizza).join(', ')}</td>
                <td className="px-4 py-3.5 text-sm font-semibold">{formatCurrency(o.totalPrice)}</td>
                <td className="px-4 py-3.5"><Badge color={getStatusColor(o.status)}>{o.status}</Badge></td>
                <td className="px-4 py-3.5 text-xs text-[#6b6460] whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={o.status}
                    onChange={e => handleStatusChange(o._id, e.target.value)}
                    className="text-xs py-1.5 px-2 rounded-lg w-auto"
                  >
                    {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[#6b6460] text-sm">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
