import { createSlice } from '@reduxjs/toolkit'

const saved = JSON.parse(localStorage.getItem('cart') || '[]')

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: saved,
    coupon: null,
    discount: 0,
  },
  reducers: {
    addItem(state, action) {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...action.payload, qty: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQty(state, action) {
      const { id, delta } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        item.qty = Math.max(1, item.qty + delta)
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    applyCoupon(state, action) {
      const { code, discountPct } = action.payload
      state.coupon = code
      state.discount = discountPct
    },
    removeCoupon(state) {
      state.coupon = null
      state.discount = 0
    },
    clearCart(state) {
      state.items = []
      state.coupon = null
      state.discount = 0
      localStorage.removeItem('cart')
    },
  },
})

export const { addItem, removeItem, updateQty, applyCoupon, removeCoupon, clearCart } = cartSlice.actions

// Selectors
export const selectCartItems    = s => s.cart.items
export const selectCartCount    = s => s.cart.items.reduce((a, i) => a + i.qty, 0)
export const selectCartSubtotal = s => s.cart.items.reduce((a, i) => a + i.price * i.qty, 0)
export const selectCartDiscount = s => s.cart.discount
export const selectCoupon       = s => s.cart.coupon

export default cartSlice.reducer
