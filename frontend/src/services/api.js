/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ api.interceptors.request.use(...)  — the entire request interceptor
 *      that read localStorage.getItem('token') and attached the
 *      Authorization: Bearer <token> header. Gone completely.
 *    ✗ localStorage.removeItem('token') in the 401 response handler
 *
 *  ADDED:
 *    ✓ withCredentials: true on the Axios instance
 *    ✓ authAPI.logout() — GET /api/auth/logout
 *    ✓ authAPI.getProfile() — GET /api/auth/profile
 *    ✓ 401 handler now checks whether we're already on a public page
 *      to avoid redirect loops (restoreSession fires on /login → 401
 *      → redirect to /login → restoreSession → 401 → infinite loop)
 *
 *  WHY withCredentials: true:
 *    By default, browsers do NOT send cookies on cross-origin requests
 *    (e.g. Vite on :5173 calling Express on :5000). withCredentials: true
 *    tells the browser "include cookies AND other credentials on this
 *    request even though it's cross-origin."
 *
 *    Your Express CORS config must mirror this:
 *      cors({ origin: 'http://localhost:5173', credentials: true })
 *    Note: credentials: true requires an explicit origin — NOT '*'.
 */

import axios from 'axios'

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true, // ← tells browser to send httpOnly cookie on every request
})

// ─────────────────────────────────────────────────────────────────────────────
// Response Interceptor — 401 handling
// ─────────────────────────────────────────────────────────────────────────────
/**
 * On a 401 response we want to redirect the user to /login —
 * BUT we must NOT redirect if we're already on a public auth page,
 * because restoreSession is called on every page load including /login,
 * and a 401 there is completely normal (user isn't logged in yet).
 *
 * Without this guard:
 *   User visits /login → App.jsx calls restoreSession → 401 → redirect
 *   to /login → restoreSession fires again → 401 → infinite loop.
 */
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/admin/login',
]

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isOnPublicPage = PUBLIC_PATHS.some((p) =>
        currentPath.startsWith(p)
      )
      if (!isOnPublicPage) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────────────────────────────────────
// Routes match your backend exactly.
//
// getProfile → GET /api/auth/profile
//   Used by restoreSession thunk on every app load.
//   Browser sends cookie automatically — no manual token needed.
//
// logout → GET /api/auth/logout
//   Backend calls res.clearCookie('token') to invalidate the session.
//   We use GET to match your backend route definition.
export const authAPI = {
  login:         (creds)   => api.post('/auth/login', creds),
  register:      (payload) => api.post('/auth/register', payload),
  logout:        ()        => api.get('/auth/logout'),
  getProfile:    ()        => api.get('/auth/profile'),
  updateProfile: (payload) => api.put('/auth/profile/update', payload),
  verifyEmail: (token) =>
  api.get(`/auth/verify-email/${token}`),
  forgotPassword:(email)   => api.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
}

// ─────────────────────────────────────────────────────────────────────────────
// Pizza API
// ─────────────────────────────────────────────────────────────────────────────
export const pizzaAPI = {
  getAll:     (params) => api.get('/pizzas', { params }),
  getById:    (id)     => api.get(`/pizzas/${id}`),
  getOptions: ()       => api.get('/pizzas/options'),
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart API — backend-synced (cookie auth means cart API is protected too)
// ─────────────────────────────────────────────────────────────────────────────
// withCredentials: true means the user's session cookie is sent automatically
// on all cart API calls, so the backend knows whose cart to update.
export const cartAPI = {
  get:         ()           => api.get('/cart'),
  addItem:     (payload)    => api.post('/cart', payload),
  updateItem:  (id, qty)    => api.put(`/cart/${id}`, { qty }),
  removeItem:  (id)         => api.delete(`/cart/${id}`),
  clear:       ()           => api.delete('/cart'),
  applyCoupon: (code)       => api.post('/cart/coupon', { code }),
  removeCoupon:()           => api.delete('/cart/coupon'),
}

// ─────────────────────────────────────────────────────────────────────────────
// Coupon API
// ─────────────────────────────────────────────────────────────────────────────
export const couponAPI = {
  validate: (code) => api.post('/coupons/validate', { code }),
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment API (Razorpay)
// ─────────────────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (amount)  => api.post('/payment/create-order', { amount }),
  verify:      (payload) => api.post('/payment/verify', payload),
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders API
// ─────────────────────────────────────────────────────────────────────────────
export const ordersAPI = {
  create: async (payload) => {

 

  return await api.post('/orders', payload);

},
  getAll:  ()        => api.get('/orders'),
  getById: (id)      => api.get(`/orders/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin API
// ─────────────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getAllOrders:       ()           => api.get('/admin/orders'),
  updateOrderStatus: (id, status) =>

  api.put(

    `/admin/orders/${id}`,

    { status }
  ),
  getInventory:      ()           => api.get('/admin/inventory'),
  addInventory:      (payload)    => api.post('/admin/inventory', payload),
  updateInventory:   (id, p)      => api.put(`/admin/inventory/${id}`, p),
  deleteInventory:   (id)         => api.delete(`/admin/inventory/${id}`),
  getAnalytics:      ()           => api.get('/admin/analytics'),
  getUsers:          ()           => api.get('/admin/users'),
  uploadImage:       (form)       => api.post('/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export default api
