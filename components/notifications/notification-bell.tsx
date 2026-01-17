// src/components/notifications/notification-bell.tsx (WebSocket version)
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useNotificationStore,
  Notification,
} from "@/lib/store/notification-store";
import { NotificationDropdown } from "./notification-dropdown";
import { useSocket } from "@/components/providers/socket-provider";
import axios from "axios";
import toast from "react-hot-toast";

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { socket, isConnected } = useSocket();
  const {
    unreadCount,
    setNotifications,
    setUnreadCount,
    setLoading,
    addNotification,
  } = useNotificationStore();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/notifications?userId=${userId}&limit=20`,
      );
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join user's notification room
    socket.emit("join", userId);

    // Listen for real-time notifications
    const handleNotification = (notification: Notification) => {
      console.log("🔔 Real-time notification received:", notification);
      addNotification(notification);

      // Optional: Show toast for new notifications
      toast.success(notification.title, {
        icon: "🔔",
      });
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, isConnected, userId, addNotification]);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {isConnected && (
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <NotificationDropdown
            userId={userId}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
