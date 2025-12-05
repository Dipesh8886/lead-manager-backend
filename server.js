import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js"; 
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
await connectDB();

const app = express();

const allowedOrigins = [
  "https://lead-manager-frontend.onrender.com",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());


app.use("/auth", authRoutes);
app.use("/leads", leadRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("🚀 API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
