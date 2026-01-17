// src/components/notifications/notification-bell.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotificationStore } from "@/lib/store/notification-store";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import axios from "axios";

interface NotificationBellProps {
  userId: string;
  pollInterval?: number; // in milliseconds, default 30000 (30s)
}

export function NotificationBell({
  userId,
  pollInterval = 30000,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { unreadCount, setNotifications, setUnreadCount, setLoading } =
    useNotificationStore();

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
    fetchNotifications();

    // Poll for new notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [userId, pollInterval]);

  return (
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
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationDropdown userId={userId} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
