import express from "express";
import {
  createReview,
  getClassReviews,
  getServiceReviews,
  updateReview,
  deleteReview,
  getUserReviews
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create review (protected)
router.post("/", verifyToken, createReview);

// Get reviews for class
router.get("/class/:classId", getClassReviews);

// Get reviews for service
router.get("/service/:serviceId", getServiceReviews);

// Get user's reviews
router.get("/user/:userId", verifyToken, getUserReviews);

// Update review (protected)
router.put("/:reviewId", verifyToken, updateReview);

// Delete review (protected)
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
