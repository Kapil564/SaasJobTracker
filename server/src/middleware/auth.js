import jwt from "jsonwebtoken";
import pool from "../lib/db.js";

// ─── Protect Middleware ───────────────────────────────────────────────────────
// Verifies JWT from Authorization header, attaches user to req.user
export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Not authorized. Invalid or expired token." });
    }

    // 3. Find user in DB
    const { rows } = await pool.query(
      `SELECT id, name, email, avatar, resume_text FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Not authorized. User not found." });
    }

    // 4. Attach user to request
    req.user = rows[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Server error during authentication." });
  }
};
