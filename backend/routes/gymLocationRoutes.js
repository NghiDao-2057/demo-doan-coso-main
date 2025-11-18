import express from "express";
import {
  getAllGyms,
  getNearbyGyms,
  getGymById,
  getGymsByCity,
  createGym,
  updateGym,
  deleteGym,
} from "../controllers/gymLocationController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllGyms);
router.get("/nearby", getNearbyGyms);
router.get("/city/:city", getGymsByCity);
router.get("/:id", getGymById);

// Admin routes
router.post("/", verifyToken, verifyAdmin, createGym);
router.put("/:id", verifyToken, verifyAdmin, updateGym);
router.delete("/:id", verifyToken, verifyAdmin, deleteGym);

export default router;
