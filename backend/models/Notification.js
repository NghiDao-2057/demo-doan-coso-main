import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["class", "payment", "membership", "attendance", "system", "goal"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto delete expired

// Virtual for checking if notification is new (less than 1 hour)
notificationSchema.virtual("isNew").get(function () {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.createdAt > oneHourAgo;
});

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
  this.read = true;
  return this.save();
};

// Static method to create and send notification
notificationSchema.statics.createNotification = async function (data) {
  const notification = await this.create(data);
  // TODO: Send push notification via Firebase/OneSignal
  return notification;
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { user: userId, read: false },
    { $set: { read: true } }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ user: userId, read: false });
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
