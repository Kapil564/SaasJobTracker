import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { uploadToDrive, getDriveFiles } from "../controllers/documentController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("file"), uploadToDrive);
router.get("/", protect, getDriveFiles);

export default router;
