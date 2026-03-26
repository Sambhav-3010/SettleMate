import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "../routes/authRoute.js";
import roomRoutes from "../routes/roomRoutes.js";
import userRoutes from "../routes/userRoutes.js";

import "../utils/passport.js";

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URLS = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([FRONTEND_URL, ...FRONTEND_URLS].filter(Boolean))) as string[];

if (allowedOrigins.length === 0) {
  throw new Error("FRONTEND_URL or FRONTEND_URLS is required");
}

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is required");
}

if (!process.env.JWT_SECRET && !process.env.SESSION_SECRET) {
  throw new Error("JWT_SECRET or SESSION_SECRET is required");
}

app.set("trust proxy", 1);

const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);

app.get("/", (_, res) => res.send("SettleMate backend running"));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId: string) => socket.join(roomId));

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("newMessage", message);
  });

  socket.on("sendInvite", ({ roomId, invite }) => {
    io.to(roomId).emit("newInvite", invite);
  });

  socket.on("newExpense", ({ roomId, expense }) => {
    io.to(roomId).emit("expenseAdded", expense);
  });
});

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`Server running at ${BACKEND_URL}`);
});

export { io };
