import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import authRoutes from "../routes/authRoute.js";
import roomRoutes from "../routes/roomRoutes.js";
import userRoutes from "../routes/userRoutes.js";

import "../utils/passport.js";

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL is required");
}

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is required");
}

app.set("trust proxy", 1);

const server = http.createServer(app);
const pgStore = pgSession(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

app.use(express.json());
app.use(cookieParser());

// CORS configuration for cross-domain cookies
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

// Session configuration for cross-domain cookies
app.use(
  session({
    store: new pgStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Trust the proxy
    cookie: {
      secure: true, // Always true for cross-domain (requires HTTPS)
      httpOnly: true,
      sameSite: "none", // Required for cross-domain cookies
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      // DO NOT set domain for cross-origin cookies
    }

  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);

app.get("/", (_, res) => res.send("SettleMate backend running"));

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
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