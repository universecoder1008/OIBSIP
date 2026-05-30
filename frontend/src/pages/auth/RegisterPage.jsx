import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/AuthCard'
import { Button } from '@/components/ui'
import { registerUser, clearError } from '@/features/auth/authSlice'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    const res = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Check your email.')
      navigate('/verify-email')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AuthCard title="Create" highlight="account" subtitle="Join thousands of pizza lovers today">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Full Name</label>
          <input value={form.name} onChange={set('name')} placeholder="John Doe" required />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
        </div>
        <div>
          <label className="form-label">Password</label>
          <input type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" required />
        </div>
        <div>
          <label className="form-label">Confirm Password</label>
          <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required />
        </div>
        <Button type="submit" loading={loading} className="w-full justify-center py-3 mt-2">
          Create Account
        </Button>
      </form>
      <p className="text-center text-sm text-[#a89f94] mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand hover:underline">Sign in</Link>
      </p>
    </AuthCard>
  )
}
