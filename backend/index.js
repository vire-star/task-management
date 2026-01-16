import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { ENV } from "./src/config/env.js";

// Routes
import userRoute from "./src/routes/user.route.js";
import workShopRoute from "./src/routes/workshop.route.js";
import taskRoute from "./src/routes/task.route.js";
import notificationRoute from "./src/routes/notification.route.js";
import commentRoute from "./src/routes/comment.route.js";
import fileRoute from "./src/routes/file.route.js";

const app = express();

// ✅ Create HTTP server
const httpServer = createServer(app);

// ✅ Initialize Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api', userRoute);
app.use('/api/workshop', workShopRoute);
app.use('/api/task', taskRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/comment', commentRoute);
app.use('/api/file', fileRoute);

// ✅ Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join workshop room
  socket.on('joinWorkshop', (workshopId) => {
    socket.join(`workshop:${workshopId}`);
    console.log(`📌 Socket ${socket.id} joined workshop:${workshopId}`);
  });

  // Leave workshop room
  socket.on('leaveWorkshop', (workshopId) => {
    socket.leave(`workshop:${workshopId}`);
    console.log(`📌 Socket ${socket.id} left workshop:${workshopId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ✅ Start server with HTTP (not app)
httpServer.listen(ENV.PORT, () => {
  connectDB();
  console.log(`🚀 Server started on port ${ENV.PORT}`);
});
