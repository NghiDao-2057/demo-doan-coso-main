import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter, limit = 50, skip = 0 } = req.query;

    const query = { user: userId };

    // Apply filter
    if (filter === "unread") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông báo",
      error: error.message,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    await notification.markAsRead();

    res.json({
      message: "Đã đánh dấu đã đọc",
      notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      message: "Lỗi khi đánh dấu đã đọc",
      error: error.message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const result = await Notification.markAllAsRead(userId);

    res.json({
      message: "Đã đánh dấu tất cả đã đọc",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      message: "Lỗi khi đánh dấu tất cả đã đọc",
      error: error.message,
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    // Check authorization
    if (
      notification.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({ message: "Đã xóa thông báo" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      message: "Lỗi khi xóa thông báo",
      error: error.message,
    });
  }
};

// Delete all read notifications for a user
export const deleteAllRead = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const result = await Notification.deleteMany({
      user: userId,
      read: true,
    });

    res.json({
      message: "Đã xóa tất cả thông báo đã đọc",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete all read error:", error);
    res.status(500).json({
      message: "Lỗi khi xóa thông báo",
      error: error.message,
    });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.getUnreadCount(userId);

    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy số thông báo chưa đọc",
      error: error.message,
    });
  }
};

// Create notification (admin only or system)
export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, data, priority } = req.body;

    // Validate
    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        message: "Thiếu thông tin: userId, type, title, message",
      });
    }

    const notification = await Notification.createNotification({
      user: userId,
      type,
      title,
      message,
      data,
      priority: priority || "medium",
    });

    res.status(201).json({
      message: "Tạo thông báo thành công",
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({
      message: "Lỗi khi tạo thông báo",
      error: error.message,
    });
  }
};

// Utility function to send notifications (used by other controllers)
export const sendNotification = async (userId, type, title, message, data = {}) => {
  try {
    await Notification.createNotification({
      user: userId,
      type,
      title,
      message,
      data,
    });
  } catch (error) {
    console.error("Send notification error:", error);
  }
};
