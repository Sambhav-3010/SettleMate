import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { neon } from "@neondatabase/serverless";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";

import authRoutes from "../routes/authRoute.js";
import roomRoutes from "../routes/roomRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import "../utils/passport.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const pgStore = pgSession(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);

app.get("/", (_, res) => res.send("Splitwise backend running"));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    const { roomId, message } = data;
    io.to(roomId).emit("newMessage", message);
  });

  socket.on("sendInvite", (data) => {
    const { roomId, invite } = data;
    io.to(roomId).emit("newInvite", invite);
  });

  socket.on("newExpense", (data) => {
    const { roomId, expense } = data;
    io.to(roomId).emit("expenseAdded", expense);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = Number(process.env.PORT) || 5000;
const sql = neon(process.env.DATABASE_URL as string);

server.listen(PORT, async () => {
  try {
    await sql`SELECT NOW()`;
    console.log("Connected to Neon DB");
    console.log(`Server listening on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Database error:", err);
  }
});

export { io };