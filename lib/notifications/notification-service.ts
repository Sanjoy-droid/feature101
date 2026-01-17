import Notification, { INotification } from "@/models/notification";

export class NotificationService {
  static async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
    link?: string;
  }): Promise<INotification> {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  }

  static async getUserNotifications(
    userId: string,
    limit: number = 10,
  ): Promise<INotification[]> {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async markAsRead(
    notificationId: string,
  ): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    );
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, read: false }, { read: true });
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await Notification.findByIdAndDelete(notificationId);
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, read: false });
  }
}
