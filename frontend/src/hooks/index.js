/**
 * hooks/index.js
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  useAuth:
 *    REMOVED:
 *      ✗ token from returned values (it doesn't exist in state anymore)
 *      ✗ const handleLogout = () => dispatch(logout()) [sync reducer]
 *
 *    ADDED:
 *      ✓ sessionChecked returned — components that need to know whether
 *        the initial GET /api/auth/profile has resolved can use this
 *      ✓ logout is now async — must await dispatch(logoutUser()) so the
 *        backend call to GET /api/auth/logout completes before navigate()
 *      ✓ isAdmin derived from user.role (unchanged, but now purely from
 *        Redux user object, not decoded from a localStorage token)
 *
 *  useCart:
 *    UNCHANGED — cart is still Redux + localStorage.
 *    If you later want to sync the cart with a backend API, swap the
 *    dispatches here to async thunks using cartAPI from services/api.js.
 *
 *  useSocket:
 *    REMOVED:
 *      ✗ auth: { token: localStorage.getItem('token') } from Socket.IO
 *        handshake — no token in localStorage anymore
 *    ADDED:
 *      ✓ withCredentials: true in socket.js handles cookie sending
 */

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '@/features/auth/authSlice'
import { connectSocket, disconnectSocket } from '@/services/socket'
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCoupon,
  addItem,
  removeItem,
  updateQty,
  applyCoupon,
  removeCoupon,
  clearCart,
} from '@/features/cart/cartSlice'
import { calcOrderTotals } from '@/utils/helpers'

// ─────────────────────────────────────────────────────────────────────────────
// useAuth
// ─────────────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user            = useSelector((s) => s.auth.user)
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const sessionChecked  = useSelector((s) => s.auth.sessionChecked)
  const loading         = useSelector((s) => s.auth.loading)
  const error           = useSelector((s) => s.auth.error)
  const isAdmin         = user?.role === 'admin'

  /**
   * logout()
   * ────────
   * WHY async:
   *   With localStorage JWTs, logout was instant — just delete the key.
   *   With httpOnly cookies, the BROWSER cannot delete the cookie.
   *   Only the backend can by calling res.clearCookie().
   *   So we MUST hit GET /api/auth/logout before clearing Redux state.
   *
   * Flow:
   *   1. dispatch(logoutUser())
   *      → Axios sends GET /api/auth/logout with cookie (withCredentials)
   *      → Backend calls res.clearCookie('token')
   *      → authSlice clears user + isAuthenticated in both fulfilled + rejected
   *   2. navigate('/login') — always redirect, even on network error
   *
   * The navigate happens AFTER dispatch resolves so Redux state is
   * already cleared when the /login page renders (no stale user flash).
   */
  const logout = async () => {
    await dispatch(logoutUser())
    navigate('/login', { replace: true })
  }

  return {
    user,
    isAuthenticated,
    sessionChecked,  // ← NEW: use in components that need to wait for session check
    isAdmin,
    loading,
    error,
    logout,          // ← async function, call with await or fire-and-forget
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useSocket
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Manages the Socket.IO connection lifecycle.
 * Called once in App.jsx — connects when authenticated, disconnects on logout.
 *
 * The socket connection is gated on isAuthenticated so we don't open a
 * WebSocket before the user has a valid session.
 *
 * Socket auth: the httpOnly cookie is sent automatically in the WS upgrade
 * request because socket.js sets withCredentials: true. Your backend socket
 * middleware should read socket.handshake.headers.cookie instead of
 * socket.handshake.auth.token.
 */
export const useSocket = () => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const userId          = useSelector((s) => s.auth.user?._id)

  useEffect(() => {
    if (isAuthenticated && userId) {
      connectSocket(userId)
    }
    return () => {
      disconnectSocket()
    }
  }, [isAuthenticated, userId])
}

// ─────────────────────────────────────────────────────────────────────────────
// useCart
// ─────────────────────────────────────────────────────────────────────────────

/**
 * UNCHANGED from localStorage auth version.
 *
 * Cart state lives in Redux and is persisted to localStorage (client-side only).
 * The auth method (localStorage token vs cookie) has zero impact on cart logic
 * because cart operations don't require auth headers — they're purely client-side.
 *
 * If you later migrate to a backend cart API, replace the dispatches here
 * with async thunks that call cartAPI.addItem(), cartAPI.removeItem(), etc.
 * from services/api.js. Those calls will automatically include the session
 * cookie because api.js has withCredentials: true.
 */
export const useCart = () => {
  const dispatch    = useDispatch()
  const items       = useSelector(selectCartItems)
  const count       = useSelector(selectCartCount)
  const subtotal    = useSelector(selectCartSubtotal)
  const discountPct = useSelector(selectCartDiscount)
  const coupon      = useSelector(selectCoupon)
  const totals      = calcOrderTotals({ items, discountPct })

  return {
    items,
    count,
    coupon,
    ...totals, // { subtotal, tax, delivery, discount, grand }

    add:         (item)       => dispatch(addItem(item)),
    remove:      (id)         => dispatch(removeItem(id)),
    update:      (id, delta)  => dispatch(updateQty({ id, delta })),
    apply:       (code, pct)  => dispatch(applyCoupon({ code, discountPct: pct })),
    removeCoupon:()           => dispatch(removeCoupon()),
    clear:       ()           => dispatch(clearCart()),
  }
}
