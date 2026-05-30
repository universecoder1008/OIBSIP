/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ No token read from localStorage on boot
 *    ✗ Guards checking token existence from localStorage
 *
 *  ADDED:
 *    ✓ useEffect → dispatch(restoreSession()) on every app mount
 *    ✓ All 3 guards (PrivateRoute, AdminRoute, GuestRoute) now wait
 *      for sessionChecked before making any redirect decision
 *    ✓ <SessionLoader /> — dark-themed spinner shown while
 *      restoreSession is in flight (~100-300ms on first load)
 *
 *  WHY sessionChecked matters:
 *    On a hard page refresh:
 *      1. Redux resets to initialState → isAuthenticated = false
 *      2. Route guard renders → sees isAuthenticated = false
 *      3. Without sessionChecked guard → immediately redirects to /login
 *      4. restoreSession completes 200ms later → user IS logged in
 *      5. User gets kicked to /login even though their cookie is valid ✗
 *
 *    With sessionChecked:
 *      1. Redux resets → isAuthenticated = false, sessionChecked = false
 *      2. Guard renders → sees sessionChecked = false → shows <SessionLoader>
 *      3. restoreSession resolves → sessionChecked = true
 *      4. Guard re-renders → isAuthenticated = true → renders protected page ✓
 */

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { restoreSession } from '@/features/auth/authSlice'
import { useSocket } from '@/hooks'

// Layouts
import UserLayout  from '@/components/layout/UserLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import AuthLayout  from '@/components/layout/AuthLayout'

// Auth pages
import LoginPage          from '@/pages/auth/LoginPage'
import RegisterPage       from '@/pages/auth/RegisterPage'
import VerifyEmailPage    from '@/pages/auth/VerifyEmailPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from '@/pages/auth/ResetPasswordPage'
import AdminLoginPage     from '@/pages/auth/AdminLoginPage'

// User pages
import HomePage     from '@/pages/user/HomePage'
import BuilderPage  from '@/pages/user/BuilderPage'
import CartPage     from '@/pages/user/CartPage'
import CheckoutPage from '@/pages/user/CheckoutPage'
import OrdersPage   from '@/pages/user/OrdersPage'
import TrackingPage from '@/pages/user/TrackingPage'
import ProfilePage  from '@/pages/user/ProfilePage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminOrders    from '@/pages/admin/AdminOrders'
import AdminInventory from '@/pages/admin/AdminInventory'
import AdminAnalytics from '@/pages/admin/AdminAnalytics'
import AdminUsers     from '@/pages/admin/AdminUsers'
import AdminSettings  from '@/pages/admin/AdminSettings'

// ─────────────────────────────────────────────────────────────────────────────
// Session Loader
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Shown by all route guards while restoreSession is in flight.
 * Dark background prevents any white flash. Keeps the same color
 * palette as the rest of the app.
 */
const SessionLoader = () => (
  <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="text-5xl animate-bounce select-none">🍕</div>
      <div className="text-[#a89f94] text-sm tracking-wide">
        Restoring your session…
      </div>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// Route Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PrivateRoute
 * ────────────
 * Protects all user-facing pages (/dashboard, /cart, /orders, etc.)
 *
 * Flow:
 *   sessionChecked = false → <SessionLoader /> (restoreSession still running)
 *   sessionChecked = true, isAuthenticated = true  → render children
 *   sessionChecked = true, isAuthenticated = false → <Navigate to="/login" />
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const sessionChecked  = useSelector((s) => s.auth.sessionChecked)

  if (!sessionChecked) return <SessionLoader />

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * AdminRoute
 * ──────────
 * Protects all /admin/* pages.
 * Requires both isAuthenticated AND user.role === 'admin'.
 *
 * Flow:
 *   sessionChecked = false → <SessionLoader />
 *   authenticated + isAdmin → render children
 *   authenticated + not admin → redirect to /  (wrong role)
 *   not authenticated → redirect to /admin/login
 */
const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const sessionChecked  = useSelector((s) => s.auth.sessionChecked)
  const isAdmin =
  useSelector((s) =>
    s.auth.user?.isAdmin
  )

  if (!sessionChecked) return <SessionLoader />

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (!isAdmin)         return <Navigate to="/" replace />

  return children
}

/**
 * GuestRoute
 * ──────────
 * Redirects already-authenticated users away from auth pages.
 * Also waits for sessionChecked — without this, a user with a valid
 * cookie landing on /login would briefly see the login form before
 * being redirected home once restoreSession completes.
 *
 * Flow:
 *   sessionChecked = false → <SessionLoader />
 *   isAuthenticated = true  → <Navigate to="/" /> (already logged in)
 *   isAuthenticated = false → render children (login/register page)
 */
const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const sessionChecked  = useSelector((s) => s.auth.sessionChecked)

  if (!sessionChecked) return <SessionLoader />

  return isAuthenticated ? <Navigate to="/" replace /> : children
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const dispatch = useDispatch()

  /**
   * Session Restore — fires ONCE on every app mount / page load.
   *
   * This is the replacement for reading a JWT from localStorage.
   * Instead of: const token = localStorage.getItem('token')
   * We now:     dispatch(restoreSession()) → GET /api/auth/profile
   *
   * The browser automatically sends the httpOnly cookie with the request
   * because Axios has withCredentials: true. The backend validates it
   * and returns the user object (or 401 if expired/missing).
   *
   * This works correctly on:
   *   ✓ First visit — cookie absent → 401 → stay logged out
   *   ✓ Page refresh — cookie present → 200 → restore Redux auth state
   *   ✓ New tab — same domain → cookie present → session restored
   *   ✓ After logout — cookie cleared by backend → 401 → stay logged out
   */
  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  // Connect Socket.IO once isAuthenticated becomes true
  useSocket()

  return (
    <Routes>
      {/* ── Auth pages (public, but redirect authenticated users away) ── */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<GuestRoute><LoginPage /></GuestRoute>}
        />
        <Route
          path="/register"
          element={<GuestRoute><RegisterPage /></GuestRoute>}
        />
        {/* Verify/forgot/reset don't redirect — user may arrive from email link */}
        <Route
  path="/verify-email/:token"
  element={<VerifyEmailPage />}
/>
        <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="/reset-password"   element={<ResetPasswordPage />} />
        <Route
          path="/admin/login"
          element={<GuestRoute><AdminLoginPage /></GuestRoute>}
        />
      </Route>

      {/* ── Protected user pages ── */}
      <Route
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index                    element={<HomePage />} />
        <Route path="/builder"          element={<BuilderPage />} />
        <Route path="/cart"             element={<CartPage />} />
        <Route path="/checkout"         element={<CheckoutPage />} />
        <Route path="/orders"           element={<OrdersPage />} />
        <Route path="/orders/:id/track" element={<TrackingPage />} />
        <Route path="/profile"          element={<ProfilePage />} />
      </Route>

      {/* ── Protected admin pages ── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index              element={<AdminDashboard />} />
        <Route path="orders"      element={<AdminOrders />} />
        <Route path="inventory"   element={<AdminInventory />} />
        <Route path="analytics"   element={<AdminAnalytics />} />
        <Route path="users"       element={<AdminUsers />} />
        <Route path="settings"    element={<AdminSettings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
