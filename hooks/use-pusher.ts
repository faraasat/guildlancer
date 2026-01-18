// hooks/use-pusher.ts
// React hook for Pusher real-time subscriptions

"use client";

import { useEffect, useRef, useState } from "react";
import { Channel } from "pusher-js";
import {
  getPusherClient,
  isPusherConfigured,
  disconnectPusher,
  PusherEvents,
} from "@/lib/realtime/pusher-client";

export function usePusher(channelName: string, enabled: boolean = true) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (!enabled || !isPusherConfigured()) {
      return;
    }

    try {
      const pusher = getPusherClient();

      // Subscribe to channel
      const newChannel = pusher.subscribe(channelName);
      channelRef.current = newChannel;
      setChannel(newChannel);

      // Handle connection state
      newChannel.bind("pusher:subscription_succeeded", () => {
        setIsConnected(true);
      });

      newChannel.bind("pusher:subscription_error", (error: any) => {
        console.error("Subscription error:", error);
        setIsConnected(false);
      });

      // Cleanup
      return () => {
        if (channelRef.current) {
          channelRef.current.unbind_all();
          pusher.unsubscribe(channelName);
          channelRef.current = null;
        }
      };
    } catch (error) {
      console.error("Pusher hook error:", error);
    }
  }, [channelName, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, []);

  return { channel, isConnected };
}

/**
 * Hook for subscribing to specific events
 */
export function usePusherEvent<T = any>(
  channelName: string,
  eventName: string,
  callback: (data: T) => void,
  enabled: boolean = true
) {
  const { channel, isConnected } = usePusher(channelName, enabled);
  const callbackRef = useRef(callback);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Bind to event
  useEffect(() => {
    if (!channel) return;

    const handler = (data: T) => {
      callbackRef.current(data);
    };

    channel.bind(eventName, handler);

    return () => {
      channel.unbind(eventName, handler);
    };
  }, [channel, eventName]);

  return { isConnected };
}

/**
 * Hook for chat messages
 */
export function useChatMessages(
  channelName: string,
  onMessage: (message: any) => void,
  enabled: boolean = true
) {
  return usePusherEvent(channelName, PusherEvents.MESSAGE_NEW, onMessage, enabled);
}

/**
 * Hook for typing indicators
 */
export function useTypingIndicators(
  channelName: string,
  enabled: boolean = true
) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  usePusherEvent(
    channelName,
    PusherEvents.TYPING_START,
    (data: { userId: string; username: string }) => {
      setTypingUsers((prev) =>
        prev.includes(data.userId) ? prev : [...prev, data.userId]
      );
    },
    enabled
  );

  usePusherEvent(
    channelName,
    PusherEvents.TYPING_STOP,
    (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
    },
    enabled
  );

  return typingUsers;
}

/**
 * Hook for notifications
 */
export function useNotifications(userId: string, enabled: boolean = true) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const channelName = `private-user-${userId}`;

  usePusherEvent(
    channelName,
    PusherEvents.NOTIFICATION_NEW,
    (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
    },
    enabled
  );

  usePusherEvent(
    channelName,
    PusherEvents.NOTIFICATION_READ,
    (data: { notificationId: string }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === data.notificationId ? { ...n, read: true } : n
        )
      );
    },
    enabled
  );

  usePusherEvent(
    channelName,
    PusherEvents.NOTIFICATION_CLEAR,
    () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    },
    enabled
  );

  return notifications;
}
