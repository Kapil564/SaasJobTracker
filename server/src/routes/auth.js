import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  verifyEmail,
  logout
} from "../controllers/AuthController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/verify-email", verifyEmail);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

export default router;
