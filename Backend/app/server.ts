import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { neon } from "@neondatabase/serverless";
import authRoutes from "./../routes/authRoute.js";

dotenv.config();

const app = express();
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

app.get("/", (req, res) => {
  res.send("Welcome to Splitwise backend!");
});

// Routes
app.use("/users", authRoutes);

app.listen(PORT, async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connected to neon database");
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});