import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '@/features/orders/orderSlice'
import OrderTracker from '@/components/pizza/OrderTracker'
import { Badge, Skeleton } from '@/components/ui'
import { getStatusColor, formatCurrency } from '@/utils/helpers'

export default function TrackingPage() {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const { activeOrder, loading } = useSelector(s => s.orders)

  useEffect(() => { if (id) dispatch(fetchOrderById(id)) }, [id])

  if (loading || !activeOrder) return (
    <div className="max-w-lg mx-auto space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full" />
    </div>
  )

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display text-3xl mb-2">Live <span className="text-brand">Tracking</span></h1>
      <p className="text-[#a89f94] text-sm mb-6">Real-time updates via Socket.IO</p>

      {/* Order info */}
      <div className="bg-surface border border-[#333] rounded-2xl p-5 mb-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-[#6b6460] mb-0.5">Order ID</div>
            <div className="font-mono font-bold text-brand">{activeOrder._id}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#6b6460] mb-0.5">Estimated Delivery</div>
            <div className="font-semibold text-[#f0ebe3]">~30 minutes</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Badge color={getStatusColor(activeOrder.status)}>{activeOrder.status}</Badge>
          <span className="text-brand font-bold">{formatCurrency(activeOrder.totalPrice)}</span>
        </div>
      </div>

      {/* Tracker */}
      <div className="bg-surface border border-[#333] rounded-2xl p-6">
        <OrderTracker status={activeOrder.status} />
      </div>

      {/* Delivery address */}
      {activeOrder.address && (
        <div className="bg-surface border border-[#333] rounded-2xl p-4 mt-4">
          <div className="text-xs text-[#6b6460] mb-1">Delivering to</div>
          <div className="text-sm text-[#f0ebe3]">
            📍  {activeOrder.address}
          </div>
        </div>
      )}
    </div>
  )
}
