// lib/realtime/pusher-client.ts
// Pusher client-side configuration

import Pusher from "pusher-js";

let pusherInstance: Pusher | null = null;

/**
 * Get or create Pusher client instance
 */
export function getPusherClient(): Pusher {
  if (typeof window === "undefined") {
    throw new Error("Pusher client can only be used in browser");
  }

  if (!pusherInstance) {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2";

    if (!pusherKey) {
      throw new Error(
        "NEXT_PUBLIC_PUSHER_KEY is not configured. Please add it to your environment variables."
      );
    }

    pusherInstance = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: "/api/realtime/auth",
      auth: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

    // Log connection state changes in development
    if (process.env.NODE_ENV === "development") {
      pusherInstance.connection.bind("state_change", (states: any) => {
        console.log("Pusher state:", states.current);
      });

      pusherInstance.connection.bind("error", (err: any) => {
        console.error("Pusher error:", err);
      });
    }
  }

  return pusherInstance;
}

/**
 * Check if Pusher is configured
 */
export function isPusherConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_PUSHER_KEY;
}

/**
 * Disconnect Pusher client
 */
export function disconnectPusher(): void {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}

/**
 * Channel name generators (client-side)
 */
export const PusherChannels = {
  guild: (guildId: string) => `guild-${guildId}`,
  dm: (userId1: string, userId2: string) => {
    const [id1, id2] = [userId1, userId2].sort();
    return `dm-${id1}-${id2}`;
  },
  dispute: (disputeId: string) => `dispute-${disputeId}`,
  user: (userId: string) => `private-user-${userId}`,
  global: () => `platform-global`,
} as const;

/**
 * Event name constants (same as server)
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
