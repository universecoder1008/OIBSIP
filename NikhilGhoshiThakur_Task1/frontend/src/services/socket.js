/**
 * services/socket.js
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ auth: { token: localStorage.getItem('token') } from the io() options
 *      There is no token in localStorage. Passing undefined/null would
 *      cause the backend socket middleware to reject the connection.
 *
 *  ADDED:
 *    ✓ withCredentials: true in io() options
 *      The Socket.IO connection starts as an HTTP upgrade request.
 *      withCredentials: true tells the browser to include the httpOnly
 *      cookie in that upgrade request, exactly like regular Axios calls.
 *
 *  BACKEND CHANGE REQUIRED:
 *    Your socket middleware must now read the cookie instead of
 *    socket.handshake.auth.token. See the comment in connectSocket below.
 *
 *  UNCHANGED:
 *    ✓ Room joining logic (join-user-room, join-admin-room)
 *    ✓ order-status-update event wiring to Redux dispatch
 *    ✓ connect/disconnect/error logging
 */

import { io } from 'socket.io-client'
import { store } from '@/store'
import { updateOrderStatus } from '@/features/orders/orderSlice'
import { socketOrderUpdate }  from '@/features/admin/adminSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

/**
 * connectSocket(userId)
 * ─────────────────────
 * Opens (or reuses) a Socket.IO connection.
 * Called from useSocket() hook when isAuthenticated becomes true.
 *
 * Backend socket middleware — update from token to cookie:
 * ─────────────────────────────────────────────────────────
 * // BEFORE (token-based):
 * io.use((socket, next) => {
 *   const token = socket.handshake.auth.token
 *   const user  = jwt.verify(token, JWT_SECRET)
 *   socket.user = user
 *   next()
 * })
 *
 * // AFTER (cookie-based):
 * const cookie = require('cookie')
 * io.use((socket, next) => {
 *   const cookieHeader = socket.handshake.headers.cookie || ''
 *   const parsed = cookie.parse(cookieHeader)
 *   const token  = parsed.token  // name must match res.cookie('token', ...)
 *   if (!token) return next(new Error('Unauthorized'))
 *   try {
 *     const user  = jwt.verify(token, process.env.JWT_SECRET)
 *     socket.user = user
 *     next()
 *   } catch {
 *     next(new Error('Invalid token'))
 *   }
 * })
 */
export const connectSocket = (userId) => {
  // Don't open a second connection if one already exists
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    withCredentials: true,      // ← browser sends httpOnly cookie in WS upgrade request
    transports: ['websocket'],  // skip long-polling, go straight to WS
  })

  socket.on('connect', () => {
    
    // Join personal room for order status updates
    if (userId) socket.emit('join-user-room', userId)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason)
  })

  /**
   * order-status-update
   * ────────────────────
   * Emitted by backend when an admin changes an order's status.
   * We dispatch to both slices:
   *   - orderSlice  → updates the user's order list + active tracking page
   *   - adminSlice  → updates the admin orders table in real time
   */
  socket.on('order-status-update', ({ orderId, status }) => {
    store.dispatch(updateOrderStatus({ orderId, status }))
    store.dispatch(socketOrderUpdate({ orderId, status }))
  })

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message)
  })

  return socket
}

/**
 * joinAdminRoom()
 * ───────────────
 * Call this from the AdminLayout or AdminDashboard to receive new-order events.
 */
export const joinAdminRoom = () => {
  socket?.emit('join-admin-room')
}

/**
 * disconnectSocket()
 * ──────────────────
 * Called by useSocket() cleanup on logout or unmount.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
