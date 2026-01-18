// lib/realtime/notifications.ts
// Notification system types and utilities

export type NotificationType =
  | "bounty_matched"
  | "bounty_accepted"
  | "bounty_submitted"
  | "bounty_reviewed"
  | "bounty_completed"
  | "guild_application_accepted"
  | "guild_application_rejected"
  | "guild_invite"
  | "guild_member_joined"
  | "guild_promoted"
  | "guild_demoted"
  | "dispute_raised"
  | "dispute_escalated"
  | "dispute_resolved"
  | "tribunal_voting_started"
  | "tribunal_vote_needed"
  | "rank_changed"
  | "trust_score_changed"
  | "message_received"
  | "mention"
  | "platform_announcement";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationTemplate {
  title: string;
  message: string;
  icon?: string;
}

/**
 * Notification templates
 */
export const NotificationTemplates: Record<
  NotificationType,
  (data: any) => NotificationTemplate
> = {
  bounty_matched: (data) => ({
    title: "Bounty Matched!",
    message: `Your bounty "${data.bountyTitle}" has been matched with ${data.guildName}`,
    icon: "🎯",
  }),
  bounty_accepted: (data) => ({
    title: "Bounty Accepted",
    message: `${data.guildName} has accepted your bounty "${data.bountyTitle}"`,
    icon: "✅",
  }),
  bounty_submitted: (data) => ({
    title: "Bounty Submitted",
    message: `${data.guildName} has submitted work for "${data.bountyTitle}"`,
    icon: "📝",
  }),
  bounty_reviewed: (data) => ({
    title: "Bounty Reviewed",
    message: `Your submission for "${data.bountyTitle}" has been ${data.accepted ? "accepted" : "rejected"}`,
    icon: data.accepted ? "🎉" : "❌",
  }),
  bounty_completed: (data) => ({
    title: "Bounty Completed!",
    message: `"${data.bountyTitle}" has been completed. ${data.reward} credits earned!`,
    icon: "💰",
  }),
  guild_application_accepted: (data) => ({
    title: "Guild Application Accepted",
    message: `Welcome to ${data.guildName}!`,
    icon: "🎊",
  }),
  guild_application_rejected: (data) => ({
    title: "Guild Application Update",
    message: `Your application to ${data.guildName} was not accepted at this time`,
    icon: "📋",
  }),
  guild_invite: (data) => ({
    title: "Guild Invitation",
    message: `You've been invited to join ${data.guildName}`,
    icon: "✉️",
  }),
  guild_member_joined: (data) => ({
    title: "New Guild Member",
    message: `${data.username} has joined your guild`,
    icon: "👋",
  }),
  guild_promoted: (data) => ({
    title: "Promoted!",
    message: `You've been promoted to ${data.newRole} in ${data.guildName}`,
    icon: "⭐",
  }),
  guild_demoted: (data) => ({
    title: "Role Changed",
    message: `Your role in ${data.guildName} has been updated`,
    icon: "📊",
  }),
  dispute_raised: (data) => ({
    title: "Dispute Raised",
    message: `A dispute has been raised for "${data.bountyTitle}"`,
    icon: "⚠️",
  }),
  dispute_escalated: (data) => ({
    title: "Dispute Escalated",
    message: `Dispute for "${data.bountyTitle}" escalated to ${data.tier}`,
    icon: "🔺",
  }),
  dispute_resolved: (data) => ({
    title: "Dispute Resolved",
    message: `Dispute for "${data.bountyTitle}" has been resolved`,
    icon: "⚖️",
  }),
  tribunal_voting_started: (data) => ({
    title: "Tribunal Voting Started",
    message: `Tribunal voting has begun for "${data.bountyTitle}"`,
    icon: "🗳️",
  }),
  tribunal_vote_needed: (data) => ({
    title: "Your Vote Needed",
    message: `Cast your tribunal vote for "${data.bountyTitle}"`,
    icon: "⚖️",
  }),
  rank_changed: (data) => ({
    title: "Rank Updated!",
    message: `You've ${data.increased ? "advanced to" : "changed to"} ${data.newRank} rank`,
    icon: data.increased ? "🎖️" : "📊",
  }),
  trust_score_changed: (data) => ({
    title: "Trust Score Updated",
    message: `Your trust score ${data.increased ? "increased" : "decreased"} to ${data.newScore}`,
    icon: data.increased ? "📈" : "📉",
  }),
  message_received: (data) => ({
    title: "New Message",
    message: `${data.senderName}: ${data.preview}`,
    icon: "💬",
  }),
  mention: (data) => ({
    title: "You were mentioned",
    message: `${data.mentioner} mentioned you in ${data.context}`,
    icon: "@",
  }),
  platform_announcement: (data) => ({
    title: data.title || "Platform Announcement",
    message: data.message,
    icon: "📢",
  }),
};

/**
 * Create notification from type and data
 */
export function createNotification(
  userId: string,
  type: NotificationType,
  data: any
): Omit<Notification, "id" | "createdAt"> {
  const template = NotificationTemplates[type](data);

  return {
    userId,
    type,
    title: template.title,
    message: template.message,
    data: {
      ...data,
      icon: template.icon,
    },
    read: false,
    expiresAt: data.expiresAt,
  };
}

/**
 * Filter expired notifications
 */
export function filterExpiredNotifications(
  notifications: Notification[]
): Notification[] {
  const now = new Date();
  return notifications.filter((n) => !n.expiresAt || n.expiresAt > now);
}
