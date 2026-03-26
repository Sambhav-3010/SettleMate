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

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

app.set("trust proxy", 1);

const server = http.createServer(app);
const PgStore = pgSession(session);

const shouldUsePgSession = () => {
  const storeMode = (process.env.SESSION_STORE_MODE || "auto").toLowerCase();
  if (storeMode === "memory") return false;
  if (storeMode === "postgres") return true;
  return Boolean(process.env.DATABASE_URL);
};

const createMemoryStore = () => {
  console.warn("[session] Using MemoryStore. Sessions will reset on server restart.");
  return new session.MemoryStore();
};

const buildPool = () => {
  const connectionTimeoutMillis = Number(process.env.PG_CONNECTION_TIMEOUT_MS || 5000);
  const max = Number(process.env.PG_POOL_MAX || 10);
  const isProd = process.env.NODE_ENV === "production";
  const useSsl = (process.env.PG_SSL || (isProd ? "true" : "false")).toLowerCase() === "true";

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis,
    max,
  });
};

const createSessionStore = async (): Promise<session.Store> => {
  if (!shouldUsePgSession()) {
    return createMemoryStore();
  }

  const pool = buildPool();

  pool.on("error", (err) => {
    console.error("[session] Unexpected error on PG idle client:", err);
  });

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();

    console.log("[session] Using PostgreSQL session store");
    return new PgStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
      errorLog: (err: Error) => {
        console.error("[session] PG store error:", err.message);
      },
    });
  } catch (err) {
    console.error("[session] PostgreSQL unreachable. Falling back to MemoryStore.", err);
    await pool.end().catch(() => undefined);
    return createMemoryStore();
  }
};

const bootstrap = async () => {
  const sessionStore = await createSessionStore();

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

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
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

  return io;
};

export const io = await bootstrap();
