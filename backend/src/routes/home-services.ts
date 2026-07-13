import { Router } from "express";
import pool from "../db.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.post("/", async (req: AuthRequest, res) => {
  const { serviceType, address } = req.body;

  if (!serviceType || !address) {
    res.status(400).json({ error: "Faltan campos: serviceType, address" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO home_services (user_id, service_type, address) VALUES ($1, $2, $3) RETURNING id",
      [req.userId, serviceType, address]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Create home service error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, service_type, address, status, created_at FROM home_services WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get home services error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
