import { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { authAPI } from '@/services/api'
import { Button } from '@/components/ui'

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth)
  const [form, setForm] = useState({
    name:   user?.name   || '',
    email:  user?.email  || '',
    phone:  user?.phone  || '',
    street: user?.address?.street || '',
    city:   user?.address?.city   || '',
   pinCode: user?.address?.pinCode || '',
  })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.updateProfile({ name: form.name, phone: form.phone, address: { street: form.street, city: form.city,   pinCode: form.pinCode } })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display text-3xl mb-6">My <span className="text-brand">Profile</span></h1>

      {/* Avatar */}
      <div className="bg-surface border border-[#333] rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-semibold text-lg">{user?.name}</div>
            <div className="text-[#a89f94] text-sm">{user?.email}</div>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-500/15 text-green-400 text-xs rounded-full font-semibold">✓ Verified</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="form-label">Full Name</label><input value={form.name} onChange={set('name')} /></div>
          <div><label className="form-label">Email</label><input value={form.email} disabled className="opacity-60 cursor-not-allowed" /></div>
          <div><label className="form-label">Phone</label><input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </div>

      {/* Address */}
      <div className="bg-surface border border-[#333] rounded-2xl p-5">
        <h2 className="font-semibold text-sm text-[#a89f94] uppercase tracking-wider mb-4">Delivery Address</h2>
        <div className="space-y-4">
          <div><label className="form-label">Street / Area</label><input value={form.street} onChange={set('street')} placeholder="42 Raj Nagar" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="form-label">City</label><input value={form.city} onChange={set('city')} placeholder="Gwalior" /></div>
            <div><label className="form-label">PIN Code</label><input value={form.pinCode} onChange={set('pinCode')} placeholder="474001" /></div>
          </div>
          <Button 
  variant="outline" 
  size="sm"
  onClick={handleSave}
>
 Update Address
</Button>
        </div>
      </div>
    </div>
  )
}
