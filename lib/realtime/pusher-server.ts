// lib/realtime/pusher-server.ts
// Pusher server-side configuration and utilities

import Pusher from "pusher";

// Initialize Pusher server instance
let pusherInstance: Pusher | null = null;

export function getPusherServer(): Pusher {
  if (!pusherInstance) {
    if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) {
      throw new Error("Pusher credentials are not configured. Please set PUSHER_APP_ID, PUSHER_KEY, and PUSHER_SECRET environment variables.");
    }

    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER || "us2",
      useTLS: true,
    });
  }

  return pusherInstance;
}

/**
 * Check if Pusher is configured
 */
export function isPusherConfigured(): boolean {
  return !!(
    process.env.PUSHER_APP_ID &&
    process.env.PUSHER_KEY &&
    process.env.PUSHER_SECRET
  );
}

/**
 * Channel name generators
 */
export const PusherChannels = {
  guild: (guildId: string) => `guild-${guildId}`,
  dm: (userId1: string, userId2: string) => {
    const [id1, id2] = [userId1, userId2].sort();
    return `dm-${id1}-${id2}`;
  },
  dispute: (disputeId: string) => `dispute-${disputeId}`,
  user: (userId: string) => `user-${userId}`,
  global: () => `platform-global`,
} as const;

/**
 * Event name constants
 */
export const PusherEvents = {
  // Message events
  MESSAGE_NEW: "message:new",
  MESSAGE_EDIT: "message:edit",
  MESSAGE_DELETE: "message:delete",
  MESSAGE_REACTION: "message:reaction",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  // Notification events
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_CLEAR: "notification:clear",

  // Bounty events
  BOUNTY_NEW: "bounty:new",
  BOUNTY_ACCEPTED: "bounty:accepted",
  BOUNTY_SUBMITTED: "bounty:submitted",
  BOUNTY_REVIEWED: "bounty:reviewed",
  BOUNTY_COMPLETED: "bounty:completed",

  // Guild events
  GUILD_MEMBER_JOIN: "guild:member-join",
  GUILD_MEMBER_LEAVE: "guild:member-leave",
  GUILD_MEMBER_PROMOTE: "guild:member-promote",
  GUILD_UPDATED: "guild:updated",

  // Dispute events
  DISPUTE_RAISED: "dispute:raised",
  DISPUTE_ESCALATED: "dispute:escalated",
  DISPUTE_RESOLVED: "dispute:resolved",
  DISPUTE_VOTE_CAST: "dispute:vote-cast",

  // User events
  USER_RANK_CHANGED: "user:rank-changed",
  USER_TRUST_CHANGED: "user:trust-changed",

  // Platform events
  PLATFORM_ANNOUNCEMENT: "platform:announcement",
} as const;

/**
 * Trigger an event on a channel
 */
export async function triggerEvent(
  channel: string,
  event: string,
  data: any
): Promise<void> {
  if (!isPusherConfigured()) {
    console.warn("Pusher not configured - event not sent:", { channel, event });
    return;
  }

  try {
    const pusher = getPusherServer();
    await pusher.trigger(channel, event, data);
  } catch (error) {
    console.error("Failed to trigger Pusher event:", error);
    throw error;
  }
}

/**
 * Trigger an event on multiple channels
 */
export async function triggerBatchEvents(
  channels: string[],
  event: string,
  data: any
): Promise<void> {
  if (!isPusherConfigured()) {
    console.warn("Pusher not configured - batch events not sent");
    return;
  }

  try {
    const pusher = getPusherServer();
    await pusher.triggerBatch(
      channels.map((channel) => ({ channel, name: event, data }))
    );
  } catch (error) {
    console.error("Failed to trigger batch Pusher events:", error);
    throw error;
  }
}

/**
 * Authenticate private channel subscription
 */
export function authenticateChannel(
  socketId: string,
  channel: string,
  userId: string
): { auth: string } {
  if (!isPusherConfigured()) {
    throw new Error("Pusher not configured");
  }

  const pusher = getPusherServer();

  // For private channels (user-specific, dm, dispute)
  if (channel.startsWith("private-")) {
    return pusher.authorizeChannel(socketId, channel);
  }

  // For presence channels (guild with online members)
  if (channel.startsWith("presence-")) {
    return pusher.authorizeChannel(socketId, channel, {
      user_id: userId,
    });
  }

  throw new Error("Invalid channel type for authentication");
}
