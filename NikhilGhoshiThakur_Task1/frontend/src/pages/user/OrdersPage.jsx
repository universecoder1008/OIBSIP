import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchOrders } from '@/features/orders/orderSlice'
import { Badge, EmptyState, Skeleton } from '@/components/ui'
import { formatCurrency, getStatusColor } from '@/utils/helpers'

export default function OrdersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, loading } = useSelector(s => s.orders)

const { isAuthenticated, sessionChecked } =
  useSelector(s => s.auth)

  

  useEffect(() => {

  if (sessionChecked && isAuthenticated) {

    dispatch(fetchOrders())

  }

}, [dispatch, sessionChecked, isAuthenticated])

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
    </div>
  )

  if (!list.length) return (
    <EmptyState emoji="📋" title="No orders yet"
      description="Place your first order and it'll show up here"
      action={<Link to="/"><button className="btn-primary px-6 py-2.5 rounded-xl text-sm">Order Now</button></Link>}
    />
  )

  

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">My <span className="text-brand">Orders</span></h1>
      <div className="space-y-3">
        {list.map((order, i) => (
          <motion.div key={order._id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/orders/${order._id}/track`)}
            className="bg-surface border border-[#333] rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-brand/50 transition-all group"
          >
            <span className="text-4xl">🍕</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                Pizza Order
              </div>
              <div className="text-xs text-[#6b6460] mt-0.5">
                {order._id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
              <div className="font-bold text-sm">{formatCurrency(order.totalPrice)}</div>
            </div>
            <div className="text-[#6b6460] group-hover:text-brand transition-colors">→</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
