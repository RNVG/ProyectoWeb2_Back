import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null
    },

    type: {
      type: String,
      enum: [
        "registration",
        "event-update",
        "event-cancelled",
        "event-reminder",
        "system"
      ],
      default: "system"
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const Notification = mongoose.model(
  "Notification",
  notificationSchema
)

export default Notification