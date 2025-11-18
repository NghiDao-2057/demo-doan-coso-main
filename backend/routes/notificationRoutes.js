import express from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getUnreadCount,
  createNotification,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications for a user
router.get("/user/:userId", verifyToken, getUserNotifications);

// Get unread count
router.get("/user/:userId/unread-count", verifyToken, getUnreadCount);

// Mark notification as read
router.patch("/:notificationId/read", verifyToken, markAsRead);

// Mark all as read
router.patch("/user/:userId/read-all", verifyToken, markAllAsRead);

// Delete a notification
router.delete("/:notificationId", verifyToken, deleteNotification);

// Delete all read notifications
router.delete("/user/:userId/read", verifyToken, deleteAllRead);

// Create notification (admin only)
router.post("/", verifyToken, createNotification);

export default router;
