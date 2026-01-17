// src/lib/db/models/notification.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "error"],
    default: "info",
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
