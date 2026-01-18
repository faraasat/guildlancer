// components/realtime/notification-toast.tsx
// Toast notification component for real-time alerts

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Notification } from "@/lib/realtime/notifications";
import { cn } from "@/lib/utils";

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  duration?: number;
}

export function NotificationToast({
  notification,
  onDismiss,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-all duration-300 transform",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div className="p-4 flex items-start gap-3">
        {notification.data?.icon && (
          <div className="text-2xl">{notification.data.icon}</div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface NotificationToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  maxToasts?: number;
}

export function NotificationToastContainer({
  notifications,
  onDismiss,
  maxToasts = 3,
}: NotificationToastContainerProps) {
  const visibleNotifications = notifications.slice(0, maxToasts);

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col gap-2 p-4 pointer-events-auto">
        {visibleNotifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ transform: `translateY(${index * 8}px)` }}
          >
            <NotificationToast
              notification={notification}
              onDismiss={() => onDismiss(notification.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
