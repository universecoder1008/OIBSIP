import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersAPI } from '@/services/api'

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await ordersAPI.getAll()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders')
  }
})

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (payload, { rejectWithValue }) => {

    

    try {

      const { data } = await ordersAPI.create(payload);

      

      return data;

    } catch (err) {

      console.log("ORDER ERROR", err.response);

      return rejectWithValue(
        err.response?.data?.message || 'Failed to place order'
      );
    }
  }
)

export const fetchOrderById = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await ordersAPI.getById(id)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order')
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    activeOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Called by Socket.IO event handler
    updateOrderStatus(state, action) {
      const { orderId, status } = action.payload
      const order = state.list.find(o => o._id === orderId)
      if (order) order.status = status
      if (state.activeOrder?._id === orderId) state.activeOrder.status = status
    },
    setActiveOrder(state, action) {
      state.activeOrder = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending,   (state) => { state.loading = true })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(placeOrder.pending,    (state) => { state.loading = true })
      .addCase(placeOrder.fulfilled,  (state, action) => {
        state.loading = false
        state.activeOrder = action.payload
        state.list.unshift(action.payload)
      })
      .addCase(placeOrder.rejected,   (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchOrderById.fulfilled, (state, action) => { state.activeOrder = action.payload })
  },
})

export const { updateOrderStatus, setActiveOrder } = orderSlice.actions
export default orderSlice.reducer
