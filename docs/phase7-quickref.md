# Phase 7: Real-time Features - Quick Reference

## Quick Start

### 1. Setup Pusher (2 minutes)

```bash
# Get credentials from https://pusher.com
# Add to .env.local:
PUSHER_APP_ID=your-app-id
PUSHER_KEY=your-key
PUSHER_SECRET=your-secret
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=your-key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

### 2. Send Real-time Message

```typescript
import { sendMessage } from "@/lib/actions/messages";

await sendMessage("guild-123", {
  content: "Hello, world!",
});
// Automatically triggers real-time event to all subscribers
```

### 3. Subscribe to Messages

```typescript
import { useChatMessages } from "@/hooks/use-pusher";

const [messages, setMessages] = useState([]);

useChatMessages("guild-123", (newMessage) => {
  setMessages(prev => [newMessage, ...prev]);
});
```

### 4. Send Notification

```typescript
import { sendNotification } from "@/lib/actions/notifications";

await sendNotification("user123", "bounty_matched", {
  bountyTitle: "Build Landing Page",
  guildName: "Design Masters",
});
```

### 5. Use Caching

```typescript
import cache, { CacheKeys, CacheTTL } from "@/lib/cache";

// Cache expensive operation
const insights = await cache.getOrSet(
  CacheKeys.aiInsights(userId),
  async () => await generatePersonalizedRecommendations(userId),
  CacheTTL.DAY
);
```

---

## Channel Reference

```typescript
import { PusherChannels } from "@/lib/realtime/pusher-server";

// Guild chat
const channel = PusherChannels.guild("guild-id");

// Direct message (sorted user IDs)
const channel = PusherChannels.dm("user1-id", "user2-id");

// Dispute thread
const channel = PusherChannels.dispute("dispute-id");

// User notifications (private)
const channel = PusherChannels.user("user-id");

// Platform announcements (public)
const channel = PusherChannels.global();
```

---

## Event Reference

```typescript
import { PusherEvents } from "@/lib/realtime/pusher-server";

// Message events
PusherEvents.MESSAGE_NEW         // New message sent
PusherEvents.MESSAGE_EDIT        // Message edited
PusherEvents.MESSAGE_DELETE      // Message deleted
PusherEvents.TYPING_START        // User started typing
PusherEvents.TYPING_STOP         // User stopped typing

// Notification events
PusherEvents.NOTIFICATION_NEW    // New notification
PusherEvents.NOTIFICATION_READ   // Notification marked as read

// Bounty events
PusherEvents.BOUNTY_NEW          // New bounty created
PusherEvents.BOUNTY_ACCEPTED     // Bounty accepted by guild
PusherEvents.BOUNTY_SUBMITTED    // Work submitted
PusherEvents.BOUNTY_REVIEWED     // Submission reviewed

// Guild events
PusherEvents.GUILD_MEMBER_JOIN   // New member joined
PusherEvents.GUILD_UPDATED       // Guild info updated

// Dispute events
PusherEvents.DISPUTE_RAISED      // New dispute raised
PusherEvents.DISPUTE_RESOLVED    // Dispute resolved

// User events
PusherEvents.USER_RANK_CHANGED   // User rank changed
PusherEvents.USER_TRUST_CHANGED  // Trust score changed
```

---

## Notification Types

```typescript
// Bounty notifications
"bounty_matched"           // AI matched bounty with guilds
"bounty_accepted"          // Guild accepted your bounty
"bounty_submitted"         // Guild submitted work
"bounty_reviewed"          // Your submission was reviewed
"bounty_completed"         // Bounty completed, payment sent

// Guild notifications
"guild_application_accepted"  // Accepted to guild
"guild_application_rejected"  // Application rejected
"guild_invite"                // Invited to join guild
"guild_member_joined"         // New member joined
"guild_promoted"              // Promoted to new role
"guild_demoted"               // Role changed

// Dispute notifications
"dispute_raised"              // Dispute raised
"dispute_escalated"           // Escalated to higher tier
"dispute_resolved"            // Dispute resolved
"tribunal_voting_started"     // Tribunal voting began
"tribunal_vote_needed"        // Your vote needed

// User notifications
"rank_changed"                // Rank updated
"trust_score_changed"         // Trust score changed
"message_received"            // New DM received
"mention"                     // Mentioned in message
"platform_announcement"       // Platform announcement
```

---

## React Hooks

### usePusher

```typescript
const { channel, isConnected } = usePusher("guild-123");
```

### usePusherEvent

```typescript
usePusherEvent("guild-123", "message:new", (message) => {
  console.log("New message:", message);
});
```

### useChatMessages

```typescript
const { isConnected } = useChatMessages("guild-123", (message) => {
  setMessages(prev => [message, ...prev]);
});
```

### useTypingIndicators

```typescript
const typingUsers = useTypingIndicators("guild-123");
// Returns: ["user1-id", "user2-id"]
```

### useNotifications

```typescript
const notifications = useNotifications("user-123");
// Returns: Notification[]
```

---

## Server Actions

### Trigger Event

```typescript
import { triggerEvent, PusherChannels, PusherEvents } from "@/lib/realtime/pusher-server";

await triggerEvent(
  PusherChannels.guild("123"),
  PusherEvents.MESSAGE_NEW,
  { content: "Hello!" }
);
```

### Trigger Batch Events

```typescript
import { triggerBatchEvents } from "@/lib/realtime/pusher-server";

await triggerBatchEvents(
  [PusherChannels.user("user1"), PusherChannels.user("user2")],
  PusherEvents.NOTIFICATION_NEW,
  notification
);
```

### Send Notification

```typescript
import { sendNotification } from "@/lib/actions/notifications";

const result = await sendNotification("user123", "rank_changed", {
  newRank: "Journeyman",
  increased: true,
});
```

### Get Notifications

```typescript
import { getNotifications } from "@/lib/actions/notifications";

const { notifications } = await getNotifications();
```

### Mark Notification Read

```typescript
import { markNotificationRead } from "@/lib/actions/notifications";

await markNotificationRead("notification-id");
```

---

## Caching

### Set Cache

```typescript
import cache from "@/lib/cache";

cache.set("my-key", { data: "value" }, 3600); // TTL: 1 hour
```

### Get Cache

```typescript
const value = cache.get("my-key");
if (!value) {
  // Cache miss
}
```

### Get or Set

```typescript
const data = await cache.getOrSet(
  "expensive-key",
  async () => {
    return await expensiveOperation();
  },
  3600 // TTL: 1 hour
);
```

### Cache Keys

```typescript
import { CacheKeys } from "@/lib/cache";

CacheKeys.aiInsights("user-id")
CacheKeys.trendingCategories()
CacheKeys.userProfile("user-id")
CacheKeys.guildProfile("guild-id")
CacheKeys.bountyList("filters-hash")
CacheKeys.leaderboard("trust")
```

### Cache TTLs

```typescript
import { CacheTTL } from "@/lib/cache";

CacheTTL.SHORT   // 5 minutes
CacheTTL.MEDIUM  // 30 minutes
CacheTTL.LONG    // 1 hour
CacheTTL.DAY     // 24 hours
```

---

## Background Jobs

### Run Oracle Monitor

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/oracle
```

**Response**:
```json
{
  "success": true,
  "timestamp": "2024-01-15T00:00:00.000Z",
  "anomaliesDetected": 3,
  "platformHealth": 85
}
```

### Run Trust Decay

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/trust-decay
```

**Response**:
```json
{
  "success": true,
  "timestamp": "2024-01-15T00:00:00.000Z",
  "usersProcessed": 45,
  "usersDecayed": 12
}
```

---

## UI Components

### Notification Toast

```tsx
import { NotificationToast } from "@/components/realtime/notification-toast";

<NotificationToast
  notification={notification}
  onDismiss={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
  duration={5000}
/>
```

### Notification Toast Container

```tsx
import { NotificationToastContainer } from "@/components/realtime/notification-toast";

<NotificationToastContainer
  notifications={notifications}
  onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
  maxToasts={3}
/>
```

### Notification Bell

```tsx
import { NotificationBell } from "@/components/realtime/notification-bell";

<NotificationBell
  notifications={notifications}
  onMarkAsRead={(id) => markNotificationRead(id)}
  onMarkAllAsRead={() => markAllNotificationsRead()}
/>
```

---

## Complete Example: Guild Chat

```tsx
"use client";

import { useState, useEffect } from "react";
import { useChatMessages, useTypingIndicators } from "@/hooks/use-pusher";
import { sendMessage } from "@/lib/actions/messages";
import { PusherChannels } from "@/lib/realtime/pusher-client";

export function GuildChat({ guildId }: { guildId: string }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const channelName = PusherChannels.guild(guildId);

  // Subscribe to new messages
  useChatMessages(channelName, (newMessage) => {
    setMessages(prev => [newMessage, ...prev]);
  });

  // Show typing indicators
  const typingUsers = useTypingIndicators(channelName);

  const handleSend = async () => {
    if (!input.trim()) return;

    await sendMessage(`guild-${guildId}`, {
      content: input,
    });

    setInput("");
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>

      {typingUsers.length > 0 && (
        <div className="typing">
          {typingUsers.length} user(s) typing...
        </div>
      )}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

## Complete Example: Notification System

```tsx
"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/use-pusher";
import { NotificationBell } from "@/components/realtime/notification-bell";
import { NotificationToastContainer } from "@/components/realtime/notification-toast";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";

export function NotificationSystem({ userId }: { userId: string }) {
  const [showToasts, setShowToasts] = useState<Notification[]>([]);
  const realtimeNotifications = useNotifications(userId);

  // Show toast for new notifications
  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      const latest = realtimeNotifications[0];
      if (!latest.read) {
        setShowToasts(prev => [latest, ...prev]);
      }
    }
  }, [realtimeNotifications]);

  return (
    <>
      <NotificationBell
        notifications={realtimeNotifications}
        onMarkAsRead={(id) => markNotificationRead(id)}
        onMarkAllAsRead={() => markAllNotificationsRead()}
      />

      <NotificationToastContainer
        notifications={showToasts}
        onDismiss={(id) => setShowToasts(prev => prev.filter(n => n.id !== id))}
        maxToasts={3}
      />
    </>
  );
}
```

---

## Troubleshooting

### Issue: Pusher not connecting

```typescript
// Check environment variables
console.log("Key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
console.log("Cluster:", process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

// Check connection state
const pusher = getPusherClient();
pusher.connection.bind("state_change", (states) => {
  console.log("State:", states.current);
});
```

### Issue: Events not received

```typescript
// Verify subscription
const channel = pusher.subscribe("guild-123");
channel.bind("pusher:subscription_succeeded", () => {
  console.log("Subscribed successfully");
});

// Check event binding
channel.bind("message:new", (data) => {
  console.log("Message received:", data);
});
```

### Issue: Cache not working

```typescript
// Check cache stats
console.log(cache.stats());

// Clear and retry
cache.clear();
```

---

## Performance Tips

1. **Unsubscribe**: Always unsubscribe from channels when component unmounts
2. **Batch Events**: Use `triggerBatchEvents` for multiple recipients
3. **Cache TTL**: Set appropriate TTLs (short for dynamic, long for static)
4. **Lazy Loading**: Only subscribe to channels when needed
5. **Debounce**: Debounce typing indicators (500ms)

---

## Deployment Checklist

- [ ] Set production Pusher credentials
- [ ] Generate CRON_SECRET: `openssl rand -base64 32`
- [ ] Configure cron jobs (Vercel Cron or external service)
- [ ] Test real-time connections in production
- [ ] Monitor Pusher dashboard for connection count
- [ ] Set up cache expiration monitoring
- [ ] Configure Pusher webhooks (optional)
- [ ] Test notification delivery
- [ ] Verify cron jobs are running

---

## Files Created (13 files)

```
lib/realtime/
  pusher-server.ts       (200 lines) - Server config
  pusher-client.ts       (120 lines) - Client config
  notifications.ts       (180 lines) - Types & templates

lib/actions/
  notifications.ts       (200 lines) - Notification actions
  messages.ts            (Updated)   - Real-time events

lib/cache/
  index.ts              (150 lines) - Caching layer

lib/cron/
  oracle-monitor.ts     (120 lines) - Background jobs

hooks/
  use-pusher.ts         (180 lines) - React hooks

components/realtime/
  notification-toast.tsx (100 lines) - Toast UI
  notification-bell.tsx  (130 lines) - Bell UI

app/api/realtime/
  auth/route.ts         (80 lines)  - Channel auth

app/api/cron/
  oracle/route.ts       (40 lines)  - Oracle cron
  trust-decay/route.ts  (40 lines)  - Trust decay cron
```

**Total**: ~1,850 lines of code

---

**Phase 7 Complete** ✅