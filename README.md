# 🍕 PizzAIa — Full Stack Pizza Ordering Platform

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge" />
</p>

A modern full-stack pizza ordering platform built with the MERN stack. Users can browse pizzas, build custom pizzas, place orders using Razorpay, and track deliveries in real time. Administrators can manage inventory, orders, users, and business analytics through a dedicated admin dashboard.

---

# ✨ Features

## 👤 User Features

- Secure Registration & Login
- Email Verification
- JWT Authentication
- Pizza Catalog
- Search & Filter Pizzas
- Custom Pizza Builder
- Shopping Cart
- Coupon System
- Razorpay Payment Integration
- Order History
- Real-Time Order Tracking
- User Profile Management

## 👨‍💼 Admin Features

- Admin Dashboard
- Order Management
- Live Status Updates
- Inventory Management
- Low Stock Alerts via Email
- User Management
- Revenue Analytics
- Top Selling Pizza Insights

---

# 🛠️ Tech Stack

### Frontend

- React.js
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Recharts
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Nodemailer

### Payment Gateway

- Razorpay

---

# 📸 Screenshots

## 📷 Home Page

<img src="./screenshots/home.png" alt="Home Page" width="100%" />

---

## 📷 Custom Pizza Builder

<img src="./screenshots/coustom.png" alt="Custom Pizza Builder" width="100%" />

---

## 📷 Shopping Cart

<img src="./screenshots/cart.png" alt="Shopping Cart" width="100%" />

---

## 📷 Checkout Page

<img src="./screenshots/checkout.png" alt="Checkout Page" width="100%" />

---

## 📷 My Orders

<img src="./screenshots/userOrder.png" alt="My Orders" width="100%" />

---

## 📷 Real-Time Order Tracking

<img src="./screenshots/liveTrackin.png" alt="Order Tracking" width="100%" />

---

## 📷 Admin Order Management

<img src="./screenshots/adminOrders.png" alt="Admin Orders" width="100%" />

---

## 📷 Inventory Management Dashboard

<img src="./screenshots/inventory.png" alt="Inventory Dashboard" width="100%" />

---

## 📷 Analytics Dashboard

<img src="./screenshots/analytics.png" alt="Analytics Dashboard" width="100%" />

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/universecoder1008/OIBSIP.git
cd OIBSIP
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

---

# 📁 Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── server.js

frontend/
│
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── store.js
```

---

# 🌟 Key Highlights

✅ Real-Time Order Tracking using Socket.IO

✅ Razorpay Payment Integration

✅ Custom Pizza Builder

✅ Inventory Management System

✅ Automated Low Stock Email Alerts

✅ Analytics Dashboard

✅ Responsive Modern UI

---

# 🔮 Future Enhancements

- Delivery Partner Dashboard
- Push Notifications
- Ratings & Reviews
- Google Maps Integration
- AI Pizza Recommendations
- Advanced Sales Analytics

---

# 👨‍💻 Author

**Nikhil Thakur**

B.Tech Electronics & Communication Engineering  
MITS Gwalior

GitHub: https://github.com/universecoder1008

---

<p align="center">
⭐ If you like this project, consider giving it a Star on GitHub!
</p>
