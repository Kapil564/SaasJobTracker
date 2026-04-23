import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../lib/db.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  resume_text: user.resume_text,
  created_at: user.created_at,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const { rows: existing } = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, hashedPassword]
    );
    const user = rows[0];

    const token = generateToken(user.id);

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const user = rows[0];

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Logged in successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, access_token } = req.body;

    if (!credential && !access_token) {
      return res.status(400).json({ error: "Google credential or access token is required." });
    }

    let googleId, email, name, picture;

    if (credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (access_token) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user info with access token");
      }
      const data = await response.json();
      googleId = data.sub;
      email = data.email;
      name = data.name;
      picture = data.picture;
    }

    const { rows: existingUsers } = await pool.query(
      `SELECT * FROM users WHERE google_id = $1 OR email = $2`,
      [googleId, email]
    );
    let user = existingUsers[0];

    if (!user) {
      const { rows } = await pool.query(
        `INSERT INTO users (name, email, avatar, google_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, picture, googleId]
      );
      user = rows[0];
    } else if (!user.google_id) {
      const { rows } = await pool.query(
        `UPDATE users SET google_id = $1, avatar = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
        [googleId, picture, user.id]
      );
      user = rows[0];
    }

    const token = generateToken(user.id);

    res.json({
      message: "Google login successful.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ error: "Invalid Google token." });
  }
};

// ─── GET Current User (me) ────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// ─── UPDATE Profile (resume text, name) ───────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, resume_text } = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (resume_text !== undefined) {
      fields.push(`resume_text = $${paramIndex++}`);
      values.push(resume_text);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nothing to update." });
    }

    fields.push(`updated_at = NOW()`);
    values.push(req.user.id);

    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({ message: "Profile updated.", user: safeUser(rows[0]) });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error updating profile." });
  }
};