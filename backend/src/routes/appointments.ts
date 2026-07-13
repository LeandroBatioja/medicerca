import { Router } from "express";
import pool from "../db.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.post("/", async (req: AuthRequest, res) => {
  const { type, slotId, doctor, clinic } = req.body;

  if (!type || !slotId || !doctor || !clinic) {
    res.status(400).json({ error: "Faltan campos: type, slotId, doctor, clinic" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO appointments (user_id, type, slot_id, doctor, clinic) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [req.userId, type, slotId, doctor, clinic]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, slot_id, doctor, clinic, confirmed_at FROM appointments WHERE user_id = $1 ORDER BY confirmed_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM appointments WHERE id = $1 AND user_id = $2",
      [req.params.id, req.userId]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Cita no encontrada" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete appointment error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
