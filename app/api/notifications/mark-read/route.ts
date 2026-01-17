// src/app/api/notifications/mark-read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notifications/notification-service";
import dbConnect from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { notificationId, userId, markAll } = body;

    if (markAll && userId) {
      await NotificationService.markAllAsRead(userId);
      return NextResponse.json({ success: true, markedAll: true });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "notificationId is required" },
        { status: 400 },
      );
    }

    const notification = await NotificationService.markAsRead(notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 },
    );
  }
}
