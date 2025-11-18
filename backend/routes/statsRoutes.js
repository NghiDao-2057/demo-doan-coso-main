import express from "express";
import { getDashboardStats, getDetailedStats, getUserStats } from "../controllers/statsController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.get("/detailed", verifyToken, verifyAdmin, getDetailedStats);
router.get("/user/:userId", verifyToken, getUserStats);

export default router;