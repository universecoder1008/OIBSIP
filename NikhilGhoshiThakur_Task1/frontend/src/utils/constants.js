export const PIZZA_CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Specials']

export const BASES = [
  { name: 'Thin Crust',    emoji: '🟡', price: 0,  desc: 'Light & crispy' },
  { name: 'Cheese Burst',  emoji: '🧀', price: 50, desc: 'Oozing with cheese' },
  { name: 'Pan Base',      emoji: '🟤', price: 30, desc: 'Thick & fluffy' },
  { name: 'Wheat Base',    emoji: '🌾', price: 20, desc: 'Healthy whole-wheat' },
  { name: 'Stuffed Crust', emoji: '🔴', price: 70, desc: 'Cheese-stuffed edge' },
]

export const SAUCES = [
  { name: 'Tomato Sauce', emoji: '🍅', price: 0  },
  { name: 'BBQ Sauce',    emoji: '🍖', price: 20 },
  { name: 'Garlic Sauce', emoji: '🧄', price: 15 },
  { name: 'Peri Peri',    emoji: '🌶️', price: 25 },
  { name: 'White Sauce',  emoji: '🤍', price: 20 },
]

export const CHEESES = [
  { name: 'Mozzarella',   emoji: '🧀', price: 0  },
  { name: 'Cheddar',      emoji: '🟡', price: 30 },
  { name: 'Parmesan',     emoji: '🫕', price: 40 },
  { name: 'Vegan Cheese', emoji: '🌿', price: 50 },
  { name: 'Cheese Mix',   emoji: '✨', price: 60 },
]

export const VEGGIES = [
  { name: 'Onion',    emoji: '🧅', price: 0 },
  { name: 'Capsicum', emoji: '🫑', price: 0 },
  { name: 'Mushroom', emoji: '🍄', price: 15 },
  { name: 'Corn',     emoji: '🌽', price: 10 },
  { name: 'Olive',    emoji: '🫒', price: 20 },
  { name: 'Jalapeño', emoji: '🌶️', price: 15 },
  { name: 'Tomato',   emoji: '🍅', price: 0  },
  { name: 'Paneer',   emoji: '🟨', price: 40 },
  { name: 'Spinach',  emoji: '🥬', price: 10 },
]

export const MEATS = [
  { name: 'Chicken',   emoji: '🍗', price: 80  },
  { name: 'Pepperoni', emoji: '🔴', price: 90  },
  { name: 'Sausage',   emoji: '🌭', price: 85  },
  { name: 'Bacon',     emoji: '🥓', price: 100 },
]

export const ORDER_STATUSES = [
  'Order Received',
  'In Kitchen',
  'Preparing',
  'Out for Delivery',
  'Delivered',
]

export const BASE_PIZZA_PRICE = 299
export const DELIVERY_CHARGE  = 49
export const TAX_RATE         = 0.05

export const VALID_COUPONS = {
  PIZZA10: 10,
  FEAST20: 20,
  NEWUSER: 15,
}
