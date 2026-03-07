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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
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
    origin: process.env.FRONTEND_URL,
    credentials: true,
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
  console.log(
    `Server running at ${process.env.NODE_ENV === "production"
      ? `https://settlemate.sambhav-mani-tripathi.dev`
      : `http://localhost:${PORT}`
    }`
  );
});

export { io };