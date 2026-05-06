import jwt from "jsonwebtoken";
import pool from "../lib/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: "Not authorized. No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Not authorized. Invalid or expired token." });
    }

    const { rows } = await pool.query(
      `
      SELECT 
        u.id, u.name, u.email, u.avatar, u.resume_text, u.role, u.is_verified,
        g.google_access_token, g.google_refresh_token
      FROM users u
      LEFT JOIN google_tokens g ON u.id = g.user_id AND g.expires_at > NOW()
      WHERE u.id = $1
      `,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Not authorized. User not found." });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Server error during authentication." });
  }
};
