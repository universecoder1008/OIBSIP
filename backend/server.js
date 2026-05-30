const express = require("express");
const dotenv = require("dotenv");
const app = express();

const connectDB = require("./src/config/db");
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



connectDB();


app.get('/',(req,res)=>{
    res.send("api is running")
})

const authRoutes = require('./src/routes/authRoutes');
const pizzaRoutes = require('./src/routes/pizzaRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const paymentRoutes = require("./src/routes/paymentRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/pizzas',pizzaRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/payment", paymentRoutes);


const Port = 5000;
const http = require('http');

const server = http.createServer(app);

const { Server } = require('socket.io');

const io = new Server(server, {

  cors: {

    origin: 'http://localhost:5173',

    credentials: true
  }
});

global.io = io;

io.on('connection', (socket) => {

  console.log('Socket connected');

  socket.on(

    'join-user-room',

    (userId) => {

      socket.join(userId);

      console.log(
        `User joined room ${userId}`
      );
    }
  );

  socket.on(

    'join-admin-room',

    () => {

      socket.join('admins');

      console.log(
        'Admin joined room'
      );
    }
  );

  socket.on('disconnect', () => {

    console.log(
      'Socket disconnected'
    );
  });
});
server.listen(Port, () => {

  console.log(`Server running ${Port}`);
});