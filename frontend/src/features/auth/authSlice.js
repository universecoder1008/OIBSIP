/**
 * authSlice.js
 * ─────────────────────────────────────────────────────────────────
 * WHAT CHANGED vs localStorage version:
 *
 *  REMOVED:
 *    ✗ token field from state
 *    ✗ const token = localStorage.getItem('token')
 *    ✗ localStorage.setItem('token', ...) in loginUser/registerUser
 *    ✗ localStorage.removeItem('token') in logout
 *    ✗ isAuthenticated: !!token (derived from localStorage)
 *    ✗ Synchronous logout reducer
 *
 *  ADDED:
 *    ✓ sessionChecked: false — becomes true once restoreSession resolves
 *    ✓ restoreSession thunk — calls GET /api/auth/profile on every app load
 *    ✓ logoutUser async thunk — calls GET /api/auth/logout so backend
 *      can res.clearCookie() before we clear Redux state
 *
 *  WHY:
 *    httpOnly cookies are invisible to JavaScript. The browser manages
 *    them automatically — we cannot read, write, or delete them from JS.
 *    All session state must come from the backend via API calls.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '@/services/api'

// ─────────────────────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * restoreSession
 * ──────────────
 * Called ONCE on app mount (App.jsx useEffect).
 * Hits GET /api/auth/profile — the browser automatically sends the
 * httpOnly cookie because Axios has withCredentials: true.
 *
 * ✓ 200  → backend returns { user } → set in Redux → isAuthenticated = true
 * ✗ 401  → no valid cookie / expired → stay logged out (NOT an error to show)
 *
 * The key job of this thunk is to set sessionChecked = true when done,
 * which unblocks the route guards from making redirect decisions.
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.getProfile()
      // Backend returns: { user: { id, name, email, role, ... } }
      return data.user
    } catch {
      // 401 is the normal case when the user has no session.
      // We rejectWithValue(null) — no error message, no toast.
      return rejectWithValue(null)
    }
  }
)

/**
 * loginUser
 * ─────────
 * POST /api/auth/login
 * Backend sets httpOnly cookie via res.cookie() and returns { message, user }.
 * We extract only the user — no token handling whatsoever.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.login(credentials)
      // data = { message: '...', user: { id, name, email, role } }
      return data.user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please try again.'
      )
    }
  }
)

/**
 * registerUser
 * ────────────
 * POST /api/auth/register
 * Returns navigation signal only — email verification may be required.
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.register(payload)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      )
    }
  }
)

/**
 * verifyEmail
 * ───────────
 * POST /api/auth/verify-email
 * If your backend sets the cookie on verify, return the user.
 */
export const verifyEmail = createAsyncThunk(

  'auth/verifyEmail',

  async (token, { rejectWithValue }) => {

    try {

     

      const { data } =
        await authAPI.verifyEmail(token)

      return data

    } catch (err) {

      

      return rejectWithValue(
        err.response?.data?.message ||
        'Verification failed'
      )
    }
  }
)

/**
 * forgotPassword / resetPassword
 * ───────────────────────────────
 * No auth state changes — just fire-and-forget API calls.
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgot',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.forgotPassword(email)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not send reset link.')
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/reset',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.resetPassword(payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Password reset failed.')
    }
  }
)

/**
 * logoutUser
 * ──────────
 * CRITICAL: Must be async. The browser cannot delete an httpOnly cookie —
 * only the backend can (via res.clearCookie). So we MUST hit the backend
 * before clearing Redux state.
 *
 * GET /api/auth/logout → backend calls res.clearCookie('token')
 *
 * Both fulfilled AND rejected cases clear Redux state, because:
 *   - If request succeeds → cookie cleared + Redux cleared ✓
 *   - If request fails (network down) → Redux cleared anyway.
 *     The cookie will expire naturally per its maxAge setting.
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      // Void return — we just need the side effect (backend clears cookie)
    } catch {
      // Network error — still clear client state below
      return rejectWithValue(null)
    }
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            null,   // { id, name, email, role, ... } or null
    isAuthenticated: false,  // true only after successful login OR restoreSession
    sessionChecked:  false,  // true once restoreSession resolves (success or 401)
    loading:         false,
    error:           null,
  },

  reducers: {
    /**
     * clearError
     * Call this after showing a toast.error so the error doesn't persist.
     * Pattern: useEffect watching error → toast.error(error) → dispatch(clearError())
     */
    clearError(state) {
      state.error = null
    },

    /**
     * clearAuthState
     * Synchronous fallback — use only if you need to clear state without
     * a network call (e.g. on a hard error or during testing).
     * In normal flow, always prefer dispatch(logoutUser()).
     */
    clearAuthState(state) {
      state.user            = null
      state.isAuthenticated = false
      state.error           = null
    },
  },

  extraReducers: (builder) => {
    // ── Shared helpers ────────────────────────────────────────────────────────
    const startLoading  = (state) => { state.loading = true; state.error = null }
    const stopError     = (state, action) => { state.loading = false; state.error = action.payload }
    const setAuthUser   = (state, action) => {
      state.loading        = false
      state.user           = action.payload
      state.isAuthenticated = true
      state.error          = null
    }
    const clearSession  = (state) => {
      state.user            = null
      state.isAuthenticated = false
      state.loading         = false
      state.error           = null
    }

    builder
      // ── restoreSession ──────────────────────────────────────────────────────
      // No loading spinner — this runs silently in the background.
      // Guards show <SessionLoader /> until sessionChecked is true.
      .addCase(restoreSession.pending, (state) => {
        state.sessionChecked = false
        state.loading        = false // don't show global spinner for this
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user            = action.payload
        state.isAuthenticated = true
        state.sessionChecked  = true
        state.loading         = false
      })
      .addCase(restoreSession.rejected, (state) => {
        // 401 — no valid session. Stay logged out.
        state.user            = null
        state.isAuthenticated = false
        state.sessionChecked  = true
        state.loading         = false
      })

      // ── loginUser ───────────────────────────────────────────────────────────
      .addCase(loginUser.pending,   startLoading)
      .addCase(loginUser.fulfilled, setAuthUser)
      .addCase(loginUser.rejected,  stopError)

      // ── registerUser ────────────────────────────────────────────────────────
      .addCase(registerUser.pending,   startLoading)
      .addCase(registerUser.fulfilled, (state) => { state.loading = false })
      .addCase(registerUser.rejected,  stopError)

      // ── verifyEmail ─────────────────────────────────────────────────────────
      .addCase(verifyEmail.pending,   startLoading)
     .addCase(verifyEmail.fulfilled, (state, action) => {
  state.loading = false

  if (action.payload?.user) {
    state.user = action.payload.user
    state.isAuthenticated = true
  }
})
      .addCase(verifyEmail.rejected, stopError)

      // ── forgotPassword ──────────────────────────────────────────────────────
      .addCase(forgotPassword.pending,   startLoading)
      .addCase(forgotPassword.fulfilled, (state) => { state.loading = false })
      .addCase(forgotPassword.rejected,  stopError)

      // ── resetPassword ───────────────────────────────────────────────────────
      .addCase(resetPassword.pending,   startLoading)
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false })
      .addCase(resetPassword.rejected,  stopError)

      // ── logoutUser ──────────────────────────────────────────────────────────
      // Always clear state regardless of whether backend call succeeded.
      .addCase(logoutUser.fulfilled, clearSession)
      .addCase(logoutUser.rejected,  clearSession)
  },
})

export const { clearError, clearAuthState } = authSlice.actions

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────
export const selectUser            = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectSessionChecked  = (state) => state.auth.sessionChecked
export const selectAuthLoading     = (state) => state.auth.loading
export const selectAuthError       = (state) => state.auth.error
export const selectIsAdmin         = (state) => state.auth.user?.role === 'admin'

export default authSlice.reducer
