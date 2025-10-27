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
import { handleNaturalQuery } from "./utils/nlQueryHandler.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ Create HTTP server wrapper
const server = http.createServer(app);

// ✅ Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "https://budgetbuddy-wokh.onrender.com",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("message", async (data) => {
    console.log("📩 Received:", data);

    const text = typeof data === "string" ? data : data.text || "";
    const userId = data?.userId || socket.userId;

    if (!userId) {
      socket.emit("message", {
        from: "assistant",
        text: "User not authenticated. Please log in again.",
      });
      return;
    }

    const raw = String(text);
    const lower = raw.toLowerCase().trim();

    const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
    if (greetings.includes(lower)) {
      socket.emit("message", {
        from: "assistant",
        text: "Hello! I’m your Budget Assistant 💬. Ask me about incomes or expenses.",
      });
      return;
    }

    const isDataQuery = /spent|expense|income|total|average|list|earn/i.test(
      raw
    );
    console.log("isDataQuery:", isDataQuery);

    const isOnlySymbols = /^[^a-zA-Z0-9]+$/.test(raw);
    const isNumericOnly = /^\d+$/.test(raw);
    const isVeryShort = raw.length <= 2;
    const alphaMatches = raw.match(/[a-z]/gi) || [];
    const alphaCount = alphaMatches.length;
    const looksLikeWord =
      alphaCount >= 3 || (alphaCount >= 2 && /\d/.test(raw));

    if (isDataQuery) {
      socket.emit("typing", { status: true });
      try {
        const reply = await handleNaturalQuery(userId, raw);
        socket.emit("message", {
          from: "assistant",
          text: reply.answer ?? String(reply),
        });
      } catch (err) {
        console.error("❌ handleNaturalQuery error:", err);
        socket.emit("message", {
          from: "assistant",
          text: "Sorry, something went wrong while processing your request.",
        });
      } finally {
        socket.emit("typing", { status: false });
      }
      return;
    }

    if (isOnlySymbols || isNumericOnly || isVeryShort) {
      return;
    }

    if (looksLikeWord) {
      socket.emit("typing", { status: true });
      setTimeout(() => {
        socket.emit("message", {
          from: "assistant",
          text: "Hmm, I didn’t understand that. Try asking about your incomes or expenses.",
        });
        socket.emit("typing", { status: false });
      }, 600);
      return;
    }
  });
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://budgetbuddy-wokh.onrender.com",
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
