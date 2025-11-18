import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ["direct", "support", "group"],
      default: "direct",
    },
    title: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });

// Method to get unread count for a user
conversationSchema.methods.getUnreadCount = function (userId) {
  return this.unreadCount.get(userId.toString()) || 0;
};

// Method to increment unread count
conversationSchema.methods.incrementUnread = async function (userId) {
  const userIdStr = userId.toString();
  const current = this.unreadCount.get(userIdStr) || 0;
  this.unreadCount.set(userIdStr, current + 1);
  return this.save();
};

// Method to reset unread count
conversationSchema.methods.resetUnread = async function (userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
