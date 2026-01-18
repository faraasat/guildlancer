// lib/actions/notifications.ts
// Server actions for notifications

"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import {
  createNotification,
  Notification,
  NotificationType,
} from "@/lib/realtime/notifications";
import {
  triggerEvent,
  PusherChannels,
  PusherEvents,
  isPusherConfigured,
} from "@/lib/realtime/pusher-server";
import { Types } from "mongoose";

// In-memory notification store (replace with database if needed)
const notificationStore = new Map<string, Notification[]>();

/**
 * Send a notification to a user
 */
export async function sendNotification(
  userId: string,
  type: NotificationType,
  data: any
): Promise<{ success: boolean; error?: string; notification?: Notification }> {
  try {
    await connectDB();

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Create notification object
    const notificationData = createNotification(userId, type, data);
    const notification: Notification = {
      ...notificationData,
      id: new Types.ObjectId().toString(),
      createdAt: new Date(),
    };

    // Store notification
    const userNotifications = notificationStore.get(userId) || [];
    userNotifications.push(notification);
    notificationStore.set(userId, userNotifications);

    // Trigger real-time event if Pusher is configured
    if (isPusherConfigured()) {
      const channel = PusherChannels.user(userId);
      await triggerEvent(channel, PusherEvents.NOTIFICATION_NEW, notification);
    }

    return { success: true, notification };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

/**
 * Get all notifications for the current user
 */
export async function getNotifications(): Promise<{
  success: boolean;
  error?: string;
  notifications?: Notification[];
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const notifications = notificationStore.get(session.user.id) || [];

    // Filter out expired notifications
    const now = new Date();
    const validNotifications = notifications.filter(
      (n) => !n.expiresAt || n.expiresAt > now
    );

    // Update store if we filtered any
    if (validNotifications.length !== notifications.length) {
      notificationStore.set(session.user.id, validNotifications);
    }

    return { success: true, notifications: validNotifications };
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return { success: false, error: "Failed to get notifications" };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const notifications = notificationStore.get(userId) || [];
    const notification = notifications.find((n) => n.id === notificationId);

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    notification.read = true;
    notificationStore.set(userId, notifications);

    // Trigger real-time event
    if (isPusherConfigured()) {
      const channel = PusherChannels.user(userId);
      await triggerEvent(channel, PusherEvents.NOTIFICATION_READ, {
        notificationId,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const notifications = notificationStore.get(userId) || [];

    notifications.forEach((n) => {
      n.read = true;
    });

    notificationStore.set(userId, notifications);

    // Trigger real-time event
    if (isPusherConfigured()) {
      const channel = PusherChannels.user(userId);
      await triggerEvent(channel, PusherEvents.NOTIFICATION_CLEAR, {});
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return {
      success: false,
      error: "Failed to mark all notifications as read",
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const notifications = notificationStore.get(userId) || [];
    const filtered = notifications.filter((n) => n.id !== notificationId);

    notificationStore.set(userId, filtered);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<{
  success: boolean;
  error?: string;
  count?: number;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const notifications = notificationStore.get(session.user.id) || [];
    const unreadCount = notifications.filter((n) => !n.read).length;

    return { success: true, count: unreadCount };
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return { success: false, error: "Failed to get unread count" };
  }
}
