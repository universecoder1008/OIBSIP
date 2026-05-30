import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminAPI } from '@/services/api'

export const fetchAllOrders   = createAsyncThunk('admin/orders',    async (_, { rejectWithValue }) => { try { const { data } = await adminAPI.getAllOrders(); return data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchInventory   = createAsyncThunk('admin/inventory', async (_, { rejectWithValue }) => { try { const { data } = await adminAPI.getInventory(); return data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchAnalytics   = createAsyncThunk('admin/analytics', async (_, { rejectWithValue }) => { try { const { data } = await adminAPI.getAnalytics(); return data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchUsers       = createAsyncThunk('admin/users',     async (_, { rejectWithValue }) => { try { const { data } = await adminAPI.getUsers(); return data } catch (e) { return rejectWithValue(e.response?.data?.message) } })

export const updateOrderStatus = createAsyncThunk('admin/updateOrder', async ({ id, status }, { rejectWithValue }) => {
  try { const { data } = await adminAPI.updateOrderStatus(id, status); return data }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const updateInventoryItem = createAsyncThunk('admin/updateInventory', async ({ id, payload }, { rejectWithValue }) => {
  try { const { data } = await adminAPI.updateInventory(id, payload); return data }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

export const deleteInventoryItem = createAsyncThunk('admin/deleteInventory', async (id, { rejectWithValue }) => {
  try { await adminAPI.deleteInventory(id); return id }
  catch (e) { return rejectWithValue(e.response?.data?.message) }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    orders: [],
    inventory: [],
    analytics: null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    socketOrderUpdate(state, action) {
      const { orderId, status } = action.payload
      const o = state.orders.find(o => o._id === orderId)
      if (o) o.status = status
    },
  },
  extraReducers: (builder) => {

  builder

    // ─────────────────────────────
    // FETCH ALL ORDERS
    // ─────────────────────────────
    .addCase(fetchAllOrders.fulfilled, (state, a) => {

      state.orders = a.payload.orders
    })

    // ─────────────────────────────
    // FETCH INVENTORY
    // ─────────────────────────────
    .addCase(fetchInventory.fulfilled, (state, a) => {

      state.inventory = a.payload
    })

    // ─────────────────────────────
    // FETCH ANALYTICS
    // ─────────────────────────────
    .addCase(fetchAnalytics.fulfilled, (state, a) => {

      state.analytics = a.payload
    })

    // ─────────────────────────────
    // FETCH USERS
    // ─────────────────────────────
    .addCase(fetchUsers.fulfilled, (state, a) => {

      state.users = a.payload
    })

    // ─────────────────────────────
    // UPDATE ORDER STATUS
    // ─────────────────────────────
    .addCase(updateOrderStatus.fulfilled, (state, a) => {

      const updated = a.payload.order

      const order = state.orders.find(
        o => o._id === updated._id
      )

      if (order) {

        order.status = updated.status
      }
    })

    // ─────────────────────────────
    // UPDATE INVENTORY ITEM
    // ─────────────────────────────
    .addCase(updateInventoryItem.fulfilled, (state, a) => {

      const index = state.inventory.findIndex(
        x => x._id === a.payload._id
      )

      if (index !== -1) {

        state.inventory[index] = a.payload
      }
    })

    // ─────────────────────────────
    // DELETE INVENTORY ITEM
    // ─────────────────────────────
    .addCase(deleteInventoryItem.fulfilled, (state, a) => {

      state.inventory = state.inventory.filter(
        x => x._id !== a.payload
      )
    })

    // ─────────────────────────────
    // GLOBAL PENDING
    // ─────────────────────────────
    .addMatcher(

      (a) =>
        a.type.startsWith('admin/') &&
        a.type.endsWith('/pending'),

      (state) => {

        state.loading = true
        state.error = null
      }
    )

    // ─────────────────────────────
    // GLOBAL REJECTED
    // ─────────────────────────────
    .addMatcher(

      (a) =>
        a.type.startsWith('admin/') &&
        a.type.endsWith('/rejected'),

      (state, a) => {

        state.loading = false
        state.error = a.payload
      }
    )

    // ─────────────────────────────
    // GLOBAL FULFILLED
    // ─────────────────────────────
    .addMatcher(

      (a) =>
        a.type.startsWith('admin/') &&
        a.type.endsWith('/fulfilled'),

      (state) => {

        state.loading = false
      }
    )
},
})

export const { socketOrderUpdate } = adminSlice.actions
export default adminSlice.reducer
