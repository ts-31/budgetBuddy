import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; 
import { Server } from "socket.io"; 

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authenticateUser from "./middlewares/authenticateUser.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ Create HTTP server wrapper
const server = http.createServer(app);

// ✅ Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "https://budget-buddy-frontend-phi.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Listen for incoming chat or custom events
  socket.on("message", (data) => {
    console.log("💬 Message from client:", data);

    // Example: broadcast message to all clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://budget-buddy-frontend-phi.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Test route
app.get("/", (req, res) => {
  res.send({ message: "hello" });
});

// ✅ Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// ✅ Start the server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server + WebSocket running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(`❌ Error in starting the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
