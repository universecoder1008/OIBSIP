/**
 * components/layout/AdminLayout.jsx
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ useNavigate() — handled inside useAuth().logout()
 *    ✗ dispatch(logout()) synchronous call
 *
 *  ADDED:
 *    ✓ handleLogout is async, awaits useAuth().logout()
 *    ✓ loggingOut state — disables button during network call
 *
 *  UNCHANGED:
 *    ✓ Sidebar nav items and active styling
 *    ✓ Low stock alert in sidebar
 *    ✓ Topbar branding
 */

import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '@/hooks'

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/orders',    label: 'Orders',    icon: '📋' },
  { to: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { to: '/admin/users',     label: 'Users',     icon: '👥' },
  { to: '/admin/settings',  label: 'Settings',  icon: '⚙️' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const inventory = useSelector((s) => s.admin.inventory)
  const lowStock  = inventory.filter((i) => i.stock <= i.threshold)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout() // GET /api/auth/logout → backend clears cookie → navigate('/login')
    setLoggingOut(false)
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-2 ${
      isActive
        ? 'border-brand text-[#f0ebe3] bg-surface-2'
        : 'border-transparent text-[#a89f94] hover:text-[#f0ebe3] hover:bg-surface-2'
    }`

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">

      {/* ── Topbar ── */}
      <div className="h-16 bg-[#111] border-b border-[#222] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="font-display text-xl text-brand">
          PizzAIa{' '}
          <span className="text-[#a89f94] text-sm font-sans font-normal">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Logged-in admin name */}
          {user?.name && (
            <span className="text-sm text-[#6b6460] hidden md:block">
              {user.name}
            </span>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-[#a89f94] hover:text-red-400 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? (
              <><span className="animate-spin">⏳</span> Signing out…</>
            ) : (
              '🚪 Logout'
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 bg-surface border-r border-[#222] flex flex-col flex-shrink-0">
          <nav className="py-4 flex-1">
            <div className="px-5 py-2 text-xs text-[#6b6460] uppercase tracking-widest font-semibold mb-1">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Low stock alert */}
          {lowStock.length > 0 && (
            <div className="mx-3 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="text-xs font-semibold text-red-400 mb-2">
                ⚠️ Low Stock ({lowStock.length})
              </div>
              {lowStock.slice(0, 3).map((i) => (
                <div key={i._id} className="text-xs text-[#a89f94] mb-0.5">
                  {i.name}: {i.stock} left
                </div>
              ))}
              {lowStock.length > 3 && (
                <div className="text-xs text-[#6b6460]">
                  +{lowStock.length - 3} more…
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ── Page content ── */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
