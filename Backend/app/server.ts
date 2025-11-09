import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { neon } from "@neondatabase/serverless";
import authRoutes from "./../routes/authRoute.js";
import passport from "passport";
import session from "express-session";
import "../utils/passport.js";

dotenv.config();
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const PORT: number = Number(process.env.PORT) || 5000;
const sql = neon(process.env.DATABASE_URL as string);

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Welcome to Splitwise backend!");
});

app.use("/auth", authRoutes);

app.listen(PORT, async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connected to neon database");
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
