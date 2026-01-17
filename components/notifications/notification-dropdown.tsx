"use client";

import { useNotificationStore } from "@/lib/store/notification-store";
import { NotificationItem } from "./notification-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

interface NotificationDropdownProps {
  userId: string;
  onClose?: () => void;
}

export function NotificationDropdown({
  userId,
  onClose,
}: NotificationDropdownProps) {
  const { notifications, unreadCount, markAllAsRead, isLoading } =
    useNotificationStore();

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/mark-read", {
        userId,
        markAll: true,
      });
      markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
      <Separator />
      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground">
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
