# 🍕 PizzAIa — Full-Stack Pizza Ordering Frontend

Premium pizza ordering app built with React 18, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Razorpay, and Socket.IO.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM v6 |
| State | Redux Toolkit |
| HTTP | Axios (with JWT interceptors) |
| Animations | Framer Motion |
| Toasts | React Hot Toast |
| Charts | Recharts |
| Real-time | Socket.IO Client |
| Payments | Razorpay JS SDK |

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # AuthCard wrapper
│   ├── layout/        # Navbar, UserLayout, AdminLayout, AuthLayout
│   ├── pizza/         # PizzaCard, PizzaBuilderWizard, OrderTracker
│   └── ui/            # Button, Card, Badge, Skeleton, StatCard, etc.
├── features/
│   ├── auth/          # authSlice (login, register, verify, forgot, reset)
│   ├── cart/          # cartSlice (persistent via localStorage)
│   ├── orders/        # orderSlice (place, fetch, socket updates)
│   └── admin/         # adminSlice (orders, inventory, analytics, users)
├── pages/
│   ├── auth/          # Login, Register, VerifyEmail, ForgotPassword, ResetPassword, AdminLogin
│   ├── user/          # Home, Builder, Cart, Checkout, Orders, Tracking, Profile
│   └── admin/         # Dashboard, Orders, Inventory, Analytics, Users, Settings
├── routes/            # App.jsx with all routes + guards
├── services/
│   ├── api.js         # Axios instance + all API calls
│   ├── socket.js      # Socket.IO connect/disconnect + Redux dispatch
│   └── razorpay.js    # Razorpay popup integration
├── hooks/             # useAuth, useCart, useSocket
├── utils/
│   ├── constants.js   # BASES, SAUCES, CHEESES, VEGGIES, MEATS, coupons
│   └── helpers.js     # formatCurrency, calcOrderTotals, getStatusColor, etc.
└── store.js           # Redux store
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your backend URL and Razorpay key

# 3. Start dev server
npm run dev
```

---

## Features

### User
- 🔐 JWT auth: login, register, email verify, forgot/reset password
- 🏠 Home: pizza grid with category filters + search
- 🍕 Pizza Builder: 6-step wizard (Base → Sauce → Cheese → Veggies → Meat → Summary)
- 🛒 Cart: qty controls, coupon codes (PIZZA10, FEAST20, NEWUSER), persistent
- 💳 Checkout: delivery address + Razorpay payment
- 📋 Orders: history with status badges
- 📡 Live Tracking: animated progress via Socket.IO
- 👤 Profile: update name, phone, delivery address

### Admin
- 📊 Dashboard: stat cards + bar/line charts via Recharts
- 📋 Orders: filter, search, update status (reflected live via socket)
- 📦 Inventory: low stock alerts, edit modal, delete
- 📈 Analytics: revenue trends, category pie chart, top pizzas
- 👥 Users: searchable user table
- ⚙️ Settings: restaurant config, Razorpay key, thresholds

---

## Backend Requirements

Your Express.js backend should expose:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Returns `{ token, user }` |
| POST | `/api/auth/register` | Create user |
| POST | `/api/auth/verify-email` | Verify OTP → return token |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |
| GET  | `/api/pizzas` | List pizzas |
| POST | `/api/orders` | Create order |
| GET  | `/api/orders` | User's orders |
| GET  | `/api/orders/:id` | Single order |
| POST | `/api/payment/create-order` | Razorpay order |
| POST | `/api/payment/verify` | Verify signature |
| GET  | `/api/admin/orders` | All orders (admin) |
| PATCH| `/api/admin/orders/:id` | Update status |
| GET  | `/api/admin/inventory` | Inventory list |
| POST | `/api/coupons/validate` | Validate coupon |

Socket.IO events:
- Server emits `order-status-update` → `{ orderId, status }`
- Client emits `join-user-room` with userId
- Client emits `join-admin-room`

---

## Coupon Codes (Frontend Demo)

| Code | Discount |
|------|----------|
| PIZZA10 | 10% |
| FEAST20 | 20% |
| NEWUSER | 15% |

---

## Build for Production

```bash
npm run build
npm run preview
```
