import express from "express";
import cors from "cors";
import { initDB, default as pool } from "./db.js";
import { authMiddleware, type AuthRequest } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import homeServiceRoutes from "./routes/home-services.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/home-services", homeServiceRoutes);

app.get("/api/doctors", authMiddleware, async (_req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email FROM users WHERE role = 'doctor' ORDER BY full_name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get doctors error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`MediCerca backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
