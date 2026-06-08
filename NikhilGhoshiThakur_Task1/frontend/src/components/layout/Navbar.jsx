/**
 * components/layout/Navbar.jsx
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ useNavigate() — navigation after logout is now handled inside
 *      useAuth().logout() so every consumer gets it automatically
 *    ✗ Immediate synchronous logout — was dispatch(logout()) and navigate
 *
 *  ADDED:
 *    ✓ handleLogout is async — awaits useAuth().logout()
 *    ✓ loggingOut local state — disables the logout button and shows
 *      "Signing out…" text while the GET /api/auth/logout request is
 *      in flight (typically < 200ms but better UX to show feedback)
 *    ✓ setProfileOpen(false) before logout — closes dropdown immediately
 *
 *  UNCHANGED:
 *    ✓ NavLink active-state styling
 *    ✓ Cart badge
 *    ✓ Profile dropdown with AnimatePresence
 *    ✓ Guest links (Login / Sign Up)
 */

import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth, useCart } from '@/hooks'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { count } = useCart()

  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut,  setLoggingOut]  = useState(false)

  /**
   * handleLogout
   * ────────────
   * 1. Close dropdown immediately for snappy UX
   * 2. Show "Signing out…" state on the button
   * 3. await logout() → GET /api/auth/logout → backend clears cookie
   *                   → authSlice clears Redux state
   *                   → navigate('/login')
   *
   * setLoggingOut(false) at the end is a safety net — the component
   * will unmount on navigate('/login') so this usually won't run,
   * but it prevents a state update on an unmounted component warning.
   */
  const handleLogout = async () => {
    setProfileOpen(false)
    setLoggingOut(true)
    await logout()
    setLoggingOut(false)
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${
      isActive
        ? 'bg-surface-2 text-[#f0ebe3]'
        : 'text-[#a89f94] hover:text-[#f0ebe3] hover:bg-surface-2'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-[#111] border-b border-[#222]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="font-display text-xl text-brand">
          Pizz<span className="text-[#f0ebe3]">AIa</span>
        </Link>

        {/* ── Nav links (authenticated users only) ── */}
        {isAuthenticated && (
          <div className="flex items-center gap-1">
            <NavLink to="/"        className={linkClass} end>🏠 Home</NavLink>
            <NavLink to="/builder" className={linkClass}>🍕 Build</NavLink>
            <NavLink to="/orders"  className={linkClass}>📋 Orders</NavLink>
            <NavLink to="/cart"    className={linkClass}>
              🛒 Cart
              {count > 0 && (
                <span className="bg-brand text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold leading-none">
                  {count}
                </span>
              )}
            </NavLink>
          </div>
        )}

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile button */}
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-2 transition-all text-sm text-[#a89f94] hover:text-[#f0ebe3]"
              >
                {/* Avatar — first letter of name */}
                <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold select-none">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="max-w-[100px] truncate hidden sm:block">
                  {user?.name}
                </span>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{   opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-48 bg-surface border border-[#333] rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#a89f94] hover:bg-surface-2 hover:text-[#f0ebe3] transition-all"
                    >
                      👤 Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#a89f94] hover:bg-surface-2 hover:text-[#f0ebe3] transition-all"
                    >
                      📋 My Orders
                    </Link>

                    <hr className="border-[#2a2a2a]" />

                    {/* Logout button — disabled + spinner during logout */}
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-surface-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loggingOut ? (
                        <>
                          <span className="animate-spin text-base">⏳</span>
                          Signing out…
                        </>
                      ) : (
                        <>🚪 Logout</>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Guest links */
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-[#a89f94] hover:text-[#f0ebe3] transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-xl transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
