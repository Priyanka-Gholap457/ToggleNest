import express from "express";
import { generateTasks, suggestPriority, generateDescription } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-tasks", generateTasks);
router.post("/suggest-priority", suggestPriority);
router.post("/generate-description", generateDescription);

export default router;