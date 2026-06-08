import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/AuthCard'
import { Button } from '@/components/ui'
import { loginUser } from '@/features/auth/authSlice'
import { logoutUser } from "@/features/auth/authSlice"

export default function AdminLoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(loginUser(form))
    console.log(res)
    if (res.meta.requestStatus === 'fulfilled') {
      if (res.payload.isAdmin) { toast.success('Welcome, Admin!'); navigate('/admin') }
      else { toast.error('Not an admin account'); await dispatch(logoutUser()) }
    } else toast.error('Invalid credentials')
  }

  return (
    <AuthCard title="Admin" highlight="Access" subtitle="Restricted — administrators only">
      <div className="text-center text-4xl mb-6">🔐</div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="form-label">Admin Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="admin@pizza.com" required /></div>
        <div><label className="form-label">Password</label><input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required /></div>
        <Button type="submit" loading={loading} className="w-full justify-center py-3">Access Dashboard</Button>
      </form>
    </AuthCard>
  )
}
