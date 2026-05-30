import { BASE_PIZZA_PRICE, TAX_RATE, DELIVERY_CHARGE } from './constants'

export const formatCurrency = (value = 0) =>
  Number(value).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

export const calcOrderTotals = ({ items = [], discountPct = 0 }) => {
  const subtotal  = items.reduce((a, i) => a + i.price * (i.qty || 1), 0)
  const tax       = Math.round(subtotal * TAX_RATE)
  const delivery  = items.length ? DELIVERY_CHARGE : 0
  const discount  = Math.round(subtotal * discountPct / 100)
  const grand     = subtotal + tax + delivery - discount
  return { subtotal, tax, delivery, discount, grand }
}

export const calcBuilderPrice = ({ base, sauce, cheese, veggies = [], meats = [] }) => {
  const extras =
    (base?.price  || 0) +
    (sauce?.price || 0) +
    (cheese?.price || 0) +
    veggies.reduce((a, v) => a + (v.price || 0), 0) +
    meats.reduce((a,   m) => a + (m.price || 0), 0)
  return BASE_PIZZA_PRICE + extras
}

export const getStatusColor = (status) => {
  const map = {
    'Delivered':       'green',
    'Out for Delivery':'orange',
    'Preparing':       'blue',
    'In Kitchen':      'blue',
    'Order Received':  'gray',
    'Cancelled':       'red',
  }
  return map[status] || 'gray'
}

export const getStatusIndex = (status) => {
  const list = ['Order Received', 'In Kitchen', 'Preparing', 'Out for Delivery', 'Delivered']
  return list.indexOf(status)
}

export const truncate = (str, n = 60) =>
  str?.length > n ? str.slice(0, n) + '…' : str

export const debounce = (fn, ms = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
