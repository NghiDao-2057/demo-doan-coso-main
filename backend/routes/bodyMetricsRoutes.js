import express from "express";
import {
  createBodyMetrics,
  getUserBodyMetrics,
  getBodyMetricsById,
  updateBodyMetrics,
  deleteBodyMetrics,
  getLatestMetrics,
  getProgress,
} from "../controllers/bodyMetricsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create new body metrics entry
router.post("/", createBodyMetrics);

// Get all body metrics for user
router.get("/user/:userId", getUserBodyMetrics);

// Get latest metrics (with and without userId)
router.get("/latest/:userId", getLatestMetrics);
router.get("/latest", getLatestMetrics);

// Get progress comparison (with and without userId)
router.get("/progress/:userId", getProgress);
router.get("/progress", getProgress);

// Get, update, delete specific entry
router.get("/:id", getBodyMetricsById);
router.put("/:id", updateBodyMetrics);
router.delete("/:id", deleteBodyMetrics);

export default router;
