"use client";

import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  useNotificationStore,
  Notification,
} from "@/lib/store/notification-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const { markAsRead, removeNotification } = useNotificationStore();
  const Icon = typeIcons[notification.type];

  const handleMarkAsRead = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (notification.read) return;

    try {
      await axios.patch("/api/notifications/mark-read", {
        notificationId: notification._id,
      });
      markAsRead(notification._id);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/notifications/${notification._id}`);
      removeNotification(notification._id);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      handleMarkAsRead();
    }
    if (notification.link && onClose) {
      onClose();
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    return Math.floor(seconds) + "s ago";
  };

  const content = (
    <div
      className={cn(
        "group flex items-start gap-3 px-4 py-3 transition-colors",
        !notification.read && "bg-accent ring-1 ring-primary/40 font-medium",
        notification.link && "cursor-pointer hover:bg-accent",
      )}
      onClick={handleClick}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 flex-shrink-0",
          typeColors[notification.type],
        )}
      />

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-none">
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {timeAgo(notification.createdAt)}
          </p>
          {notification.link && (
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleDelete}
        aria-label="Delete notification"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
