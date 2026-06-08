import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/AuthCard'
import { Button } from '@/components/ui'
import { resetPassword } from '@/features/auth/authSlice'

export default function ResetPasswordPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(s => s.auth)
  const [form, setForm] = useState({ password: '', confirm: '' })
  const token = new URLSearchParams(window.location.search).get('token') || ''
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    const res = await dispatch(resetPassword({ token, password: form.password }))
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Password reset! Please login.'); navigate('/login') }
    else toast.error('Reset failed — link may be expired')
  }

  return (
    <AuthCard title="New" highlight="password" subtitle="Choose a strong password">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="form-label">New Password</label><input type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" required /></div>
        <div><label className="form-label">Confirm Password</label><input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required /></div>
        <Button type="submit" loading={loading} className="w-full justify-center py-3">Reset Password</Button>
      </form>
    </AuthCard>
  )
}
