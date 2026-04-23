import { Router } from "express";
import {
  generateCoverLetter,
  getMatchScore,
  getInterviewPrep,
  getRedFlags,
  generateEmailReply,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/:applicationId/cover-letter", generateCoverLetter);
router.get("/:applicationId/score", getMatchScore);
router.get("/:applicationId/prep", getInterviewPrep);
router.get("/:applicationId/red-flags", getRedFlags);
router.post("/:applicationId/email-reply", generateEmailReply);

export default router;
