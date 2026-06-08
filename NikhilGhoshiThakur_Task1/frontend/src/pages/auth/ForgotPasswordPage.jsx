import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/AuthCard'
import { Button } from '@/components/ui'
import { forgotPassword } from '@/features/auth/authSlice'

export default function ForgotPasswordPage() {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.auth)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(forgotPassword(email))
    if (res.meta.requestStatus === 'fulfilled') { setSent(true); toast.success('Reset link sent!') }
    else toast.error('Could not send reset link')
  }

  if (sent) return (
    <AuthCard title="Check your" highlight="inbox" subtitle="">
      <div className="text-center py-6">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-sm text-[#a89f94] mb-6">Reset link sent to <strong className="text-[#f0ebe3]">{email}</strong></p>
        <Link to="/login" className="text-brand hover:underline text-sm">Back to login</Link>
      </div>
    </AuthCard>
  )

  return (
    <AuthCard title="Reset" highlight="password" subtitle="We'll email you a reset link">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="form-label">Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <Button type="submit" loading={loading} className="w-full justify-center py-3">Send Reset Link</Button>
      </form>
      <p className="text-center text-sm text-[#a89f94] mt-6">
        <Link to="/login" className="text-brand hover:underline">Back to login</Link>
      </p>
    </AuthCard>
  )
}
