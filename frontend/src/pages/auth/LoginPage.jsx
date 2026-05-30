/**
 * pages/auth/LoginPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ localStorage.setItem('token', data.token) — there is no token
 *      to store. The backend sets the httpOnly cookie in Set-Cookie header.
 *    ✗ localStorage.setItem('user', JSON.stringify(data.user))
 *    ✗ Reading token from payload to determine admin role
 *
 *  ADDED / CHANGED:
 *    ✓ Navigation after login uses res.payload?.role from the user object
 *      returned by the backend. The role was previously decoded from the
 *      JWT payload stored in localStorage — now it comes straight from
 *      the API response { message, user: { id, name, email, role } }
 *
 *  UNCHANGED:
 *    ✓ Form fields, validation, error handling, toast pattern
 *    ✓ Forgot password link, register link
 *    ✓ Loading state on submit button
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/AuthCard'
import { Button } from '@/components/ui'
import { loginUser, clearError } from '@/features/auth/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // Show Redux error as toast, then clear it from state
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      return toast.error('Please fill in all fields')
    }

    const result = await dispatch(loginUser(form))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back! 🍕')

      /**
       * result.payload is the user object returned by the backend.
       * Backend response: { message: '...', user: { id, name, email, role } }
       * authSlice.loginUser returns data.user → result.payload = user object.
       *
       * Previously we decoded the role from a localStorage JWT.
       * Now we read it directly from the API response. Simpler and more reliable.
       */
      const role = result.payload?.role
      navigate(role === 'admin' ? '/admin' : '/', { replace: true })
    }
    // If rejected → error is set in Redux → useEffect above shows toast
  }

  return (
    <AuthCard
      title="Welcome"
      highlight="back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="form-label">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="text-right -mt-2">
          <Link
            to="/forgot-password"
            className="text-xs text-brand hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full justify-center py-3"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-[#a89f94] mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  )
}
