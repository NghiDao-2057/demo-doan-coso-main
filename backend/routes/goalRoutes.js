import express from "express";
import {
  createGoal,
  getUserGoals,
  getGoalById,
  updateGoalProgress,
  updateGoal,
  deleteGoal,
  getGoalStats
} from "../controllers/goalController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create goal (protected)
router.post("/", verifyToken, createGoal);

// Get user's goals
router.get("/user/:userId", verifyToken, getUserGoals);

// Get goal by ID
router.get("/:goalId", verifyToken, getGoalById);

// Update goal progress
router.patch("/:goalId/progress", verifyToken, updateGoalProgress);

// Update goal details
router.put("/:goalId", verifyToken, updateGoal);

// Delete goal
router.delete("/:goalId", verifyToken, deleteGoal);

// Get goal statistics
router.get("/user/:userId/stats", verifyToken, getGoalStats);

export default router;
