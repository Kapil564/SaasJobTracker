import { Router } from "express";
import {
  getStats,
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getSavedCoverLetter,
  saveCoverLetter,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/stats", getStats);
router.get("/", getApplications);
router.get("/:id", getApplication);
router.post("/", createApplication);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);
router.get("/:id/cover-letter", getSavedCoverLetter);
router.put("/:id/cover-letter", saveCoverLetter);

export default router;
