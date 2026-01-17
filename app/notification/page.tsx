// In your layout or page component
import { NotificationBell } from "@/components/notifications/notification-bell";

export default function page() {
  const userId = "user123"; // Get from your auth system

  return (
    <header>
      <NotificationBell userId={userId} pollInterval={30000} />
    </header>
  );
}
