"use client";

import { NotificationBell } from "@/components/notifications/notification-bell";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

export default function Page() {
  const userId = "user123";

  const createTestNotification = async (
    type: "info" | "success" | "warning" | "error",
  ) => {
    try {
      await axios.post("/api/notifications", {
        userId: userId,
        title: `Test ${type} notification`,
        message: `This is a test ${type} notification message!`,
        type: type,
        link: type === "success" ? "/dashboard" : undefined,
      });

      toast.success("Notification created! Check the bell icon.");
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Notifications Demo</h1>
          <NotificationBell userId={userId} />
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Create Test Notifications</h2>
          <p className="text-muted-foreground">
            Click the buttons below to create notifications and see them appear
            in the bell icon.
          </p>

          <div className="grid gap-3">
            <Button
              onClick={() => createTestNotification("info")}
              variant="outline"
            >
              Create Info Notification
            </Button>
            <Button
              onClick={() => createTestNotification("success")}
              variant="outline"
            >
              Create Success Notification
            </Button>
            <Button
              onClick={() => createTestNotification("warning")}
              variant="outline"
            >
              Create Warning Notification
            </Button>
            <Button
              onClick={() => createTestNotification("error")}
              variant="outline"
            >
              Create Error Notification
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
