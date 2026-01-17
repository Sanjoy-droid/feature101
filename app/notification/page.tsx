"use client";

import { NotificationBell } from "@/components/notifications/notification-bell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";
import toast from "react-hot-toast";
import axios from "axios";
import { Wifi, WifiOff } from "lucide-react";

export default function Page() {
  const userId = "user123";
  const { isConnected } = useSocket();

  const createTestNotification = async (
    type: "info" | "success" | "warning" | "error",
  ) => {
    try {
      await axios.post("/api/notifications", {
        userId: userId,
        title: `${type.charAt(0).toUpperCase()}${type.slice(1)} notification!`,
        message: `This is a test ${type} notification message!`,
        type: type,
        link: undefined,
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
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Notifications Demo</h1>
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="gap-1"
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>
          <NotificationBell userId={userId} />
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-md space-y-6">
          {/* Connection Status Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
                <span className="text-2xl font-bold">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                WebSocket connection {isConnected ? "established" : "lost"}
              </p>
            </CardContent>
          </Card>

          {/* Test Buttons */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Create Test Notifications</h2>
            <p className="text-muted-foreground">
              Click the buttons below to create notifications and see them
              appear in the bell icon.
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
        </div>
      </main>
    </div>
  );
}
