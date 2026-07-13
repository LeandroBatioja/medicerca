import { Router } from "express";
import pool from "../db.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, medication, frequency, refills, date FROM prescriptions WHERE user_id = $1 ORDER BY date DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get prescriptions error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  const { medication, frequency, refills, date } = req.body;

  if (!medication || !frequency) {
    res.status(400).json({ error: "Faltan campos: medication, frequency" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO prescriptions (user_id, medication, frequency, refills, date) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [req.userId, medication, frequency, refills || 0, date || new Date().toISOString().slice(0, 10)]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Create prescription error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
