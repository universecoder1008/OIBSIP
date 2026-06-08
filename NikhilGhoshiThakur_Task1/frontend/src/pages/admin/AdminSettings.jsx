import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button, PageHeader } from '@/components/ui'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    restaurantName: 'PizzAIa Kitchen',
    supportEmail:   'support@pizzaia.com',
    deliveryCharge: 49,
    taxRate:        5,
    razorpayKeyId:  '',
    lowStockThreshold: 20,
  })
  const set = k => e => setSettings(s => ({ ...s, [k]: e.target.value }))

  const handleSave = () => toast.success('Settings saved!')

  return (
    <div className="max-w-xl">
      <PageHeader title="Admin" highlight="Settings" />

      <div className="bg-surface border border-[#333] rounded-2xl p-6 mb-5 space-y-5">
        <h2 className="font-semibold text-sm text-[#a89f94] uppercase tracking-wider">Restaurant Info</h2>
        <div><label className="form-label">Restaurant Name</label><input value={settings.restaurantName} onChange={set('restaurantName')} /></div>
        <div><label className="form-label">Support Email</label><input type="email" value={settings.supportEmail} onChange={set('supportEmail')} /></div>
      </div>

      <div className="bg-surface border border-[#333] rounded-2xl p-6 mb-5 space-y-5">
        <h2 className="font-semibold text-sm text-[#a89f94] uppercase tracking-wider">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="form-label">Delivery Charge (₹)</label><input type="number" value={settings.deliveryCharge} onChange={set('deliveryCharge')} /></div>
          <div><label className="form-label">Tax Rate (%)</label><input type="number" value={settings.taxRate} onChange={set('taxRate')} /></div>
        </div>
      </div>

      <div className="bg-surface border border-[#333] rounded-2xl p-6 mb-5 space-y-5">
        <h2 className="font-semibold text-sm text-[#a89f94] uppercase tracking-wider">Integrations</h2>
        <div><label className="form-label">Razorpay Key ID</label><input value={settings.razorpayKeyId} onChange={set('razorpayKeyId')} placeholder="rzp_test_..." /></div>
        <div><label className="form-label">Low Stock Alert Threshold</label><input type="number" value={settings.lowStockThreshold} onChange={set('lowStockThreshold')} /></div>
      </div>

      <Button onClick={handleSave} size="lg">Save All Settings</Button>
    </div>
  )
}
