import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../lib/db.js";
import crypto from "crypto";
import { encrypt } from "../utils/crypto.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

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
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, is_verified) VALUES ($1, $2, $3, FALSE) RETURNING *`,
      [name, email, hashedPassword]
    );
    const user = rows[0];

    await pool.query(
      `INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, verificationToken, expires]
    );

    // Fix 3: Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Fix 3: Do NOT issue a JWT yet.
    res.status(201).json({
      message: "Account created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "No token provided." });

    const { rows } = await pool.query(
      `SELECT user_id FROM verification_tokens WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired link." });
    }

    const userId = rows[0].user_id;

    await pool.query(
      `UPDATE users SET is_verified = TRUE WHERE id = $1`,
      [userId]
    );

    await pool.query(
      `DELETE FROM verification_tokens WHERE user_id = $1`,
      [userId]
    );

    res.json({ message: "Email successfully verified. You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Server error during verification." });
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

    // Fix 3: Prevent login if email is not verified
    if (user.is_verified === false) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken(user.id);

    // Fix 4: Move JWT from localStorage to HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({
      message: "Logged in successfully.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, access_token, code } = req.body;

    if (!credential && !access_token && !code) {
      return res.status(400).json({ error: "Google credential, access token, or code is required." });
    }

    let googleId, email, name, picture, googleAccessToken = null, googleRefreshToken = null;

    if (code) {
      const { tokens } = await googleClient.getToken({ code, redirect_uri: 'postmessage' });
      googleAccessToken = encrypt(tokens.access_token || null);
      googleRefreshToken = encrypt(tokens.refresh_token || null);

      const payload = jwt.decode(tokens.id_token);
      if (!payload) throw new Error("Invalid id_token payload");
      
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (credential) {
      const payload = jwt.decode(credential);
      if (!payload) throw new Error("Invalid credential payload");

      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (access_token) {
      // Fix 2: Validate OAuth Access Token Audience (Confused Deputy)
      const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${access_token}`);
      if (!tokenInfoResponse.ok) {
        return res.status(401).json({ error: "Invalid Google access token." });
      }
      const tokenInfo = await tokenInfoResponse.json();
      if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(401).json({ error: "Token audience mismatch — unauthorized client" });
      }

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

    // Clean up expired tokens
    await pool.query(`DELETE FROM google_tokens WHERE expires_at < NOW()`);

    const { rows: tokenRows } = await pool.query(
      `SELECT user_id FROM google_tokens WHERE google_id = $1`,
      [googleId]
    );

    let user = null;

    if (tokenRows.length > 0) {
      const { rows: userRows } = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [tokenRows[0].user_id]
      );
      user = userRows[0];
    }

    if (!user) {
      const { rows: existingUsers } = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      user = existingUsers[0];
    }

    if (!user) {
      const { rows } = await pool.query(
        `INSERT INTO users (name, email, avatar, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING *`,
        [name, email, picture]
      );
      user = rows[0];
    } else {
      if (user.email === email && user.is_verified === false) {
        return res.status(403).json({ error: "An unverified account exists with this email. Please verify it first to link your Google account." });
      }

      const { rows } = await pool.query(
        `UPDATE users SET avatar = COALESCE($1, avatar), updated_at = NOW() WHERE id = $2 RETURNING *`,
        [picture, user.id]
      );
      user = rows[0];
    }

    await pool.query(
      `INSERT INTO google_tokens (user_id, google_id, google_access_token, google_refresh_token, expires_at) 
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 hour')
       ON CONFLICT (google_id) 
       DO UPDATE SET google_access_token = EXCLUDED.google_access_token, google_refresh_token = EXCLUDED.google_refresh_token, expires_at = EXCLUDED.expires_at`,
      [user.id, googleId, googleAccessToken, googleRefreshToken]
    );

    const token = generateToken(user.id);

    // Fix 4: Set HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({
      message: "Google login successful.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Google auth error:", error.response?.data || error.message || error);
    res.status(401).json({ error: error.message || "Invalid Google token." });
  }
};

export const logout = async (req, res) => {
  // Fix 4: Clear HttpOnly Cookie
  res.clearCookie('token', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict' 
  });
  res.json({ message: 'Logged out' });
};

// ─── GET Current User (me) ────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({ user: safeUser(req.user) });
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