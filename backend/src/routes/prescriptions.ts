import { Router } from "express";
import pool from "../db.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, medication, frequency, refills, date, doctor_id FROM prescriptions WHERE user_id = $1 ORDER BY date DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get prescriptions error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/created", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.medication, p.frequency, p.refills, p.date, p.user_id, u.full_name as patient_name
       FROM prescriptions p
       JOIN users u ON u.id = p.user_id
       WHERE p.doctor_id = $1
       ORDER BY p.date DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get created prescriptions error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/patients", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email FROM users WHERE role = 'patient' ORDER BY full_name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get patients error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  const { userId: callerId } = req;

  const caller = await pool.query("SELECT role FROM users WHERE id = $1", [callerId]);
  if (caller.rows.length === 0 || caller.rows[0].role !== "doctor") {
    res.status(403).json({ error: "Solo los doctores pueden crear recetas" });
    return;
  }

  const { medication, frequency, refills, date, patientId } = req.body;

  if (!medication || !frequency || !patientId) {
    res.status(400).json({ error: "Faltan campos: medication, frequency, patientId" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO prescriptions (user_id, doctor_id, medication, frequency, refills, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [patientId, callerId, medication, frequency, refills || 0, date || new Date().toISOString().slice(0, 10)]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Create prescription error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
