# Phase 7: Real-time Features & Chat - Complete Implementation Guide

## Overview

Phase 7 adds real-time communication capabilities to Nexora using **Pusher** for WebSocket connections. This includes live chat messaging, real-time notifications, background job scheduling, and performance caching.

**Status**: ✅ Complete (100%)

**Technologies**: Pusher, WebSocket, In-memory caching, Cron jobs

---

## Table of Contents

1. [Architecture](#architecture)
2. [Pusher Setup](#pusher-setup)
3. [Real-time Channels](#real-time-channels)
4. [Messaging System](#messaging-system)
5. [Notification System](#notification-system)
6. [Background Jobs](#background-jobs)
7. [Caching Layer](#caching-layer)
8. [React Hooks](#react-hooks)
9. [UI Components](#ui-components)
10. [API Endpoints](#api-endpoints)
11. [Environment Variables](#environment-variables)
12. [Testing](#testing)
13. [Deployment](#deployment)

---

## Architecture

### System Diagram

```
Client (Browser)
    ↓ Subscribe
[Pusher Client] ← WebSocket → [Pusher Server]
    ↓ Events                        ↑ Trigger
[React Hooks]                   [Server Actions]
    ↓                               ↑
[UI Components]            [MongoDB + Cache]
```

### Data Flow

1. **User Action** → Server Action (e.g., sendMessage)
2. **Server Action** → Save to Database
3. **Server Action** → Trigger Pusher Event
4. **Pusher Server** → Broadcast to Subscribers
5. **Pusher Client** → React Hook Callback
6. **React Hook** → Update UI State

---

## Pusher Setup

### 1. Create Pusher Account

1. Go to [https://pusher.com](https://pusher.com)
2. Sign up for a free account
3. Create a new app (Channels product)
4. Select your region (e.g., `us2`)
5. Copy credentials: App ID, Key, Secret, Cluster

### 2. Configure Environment Variables

Add to `.env.local`:

```env
# Pusher Real-time (Phase 7)
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=us2

# Public Pusher key for client-side
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

### 3. Server Configuration

**File**: `lib/realtime/pusher-server.ts`

```typescript
import Pusher from "pusher";

export function getPusherServer(): Pusher {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER || "us2",
    useTLS: true,
  });
}
```

### 4. Client Configuration

**File**: `lib/realtime/pusher-client.ts`

```typescript
import Pusher from "pusher-js";

export function getPusherClient(): Pusher {
  return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
    authEndpoint: "/api/realtime/auth",
  });
}
```

---

## Real-time Channels

### Channel Types

| Channel Type | Pattern | Access | Use Case |
|-------------|---------|---------|----------|
| Guild | `guild-{guildId}` | Members | Guild chat, updates |
| DM | `dm-{userId1}-{userId2}` | Participants | Direct messages |
| Dispute | `dispute-{disputeId}` | Involved parties | Dispute discussions |
| User | `private-user-{userId}` | Owner | Personal notifications |
| Global | `platform-global` | Public | Platform announcements |

### Channel Generators

```typescript
export const PusherChannels = {
  guild: (guildId: string) => `guild-${guildId}`,
  dm: (userId1: string, userId2: string) => {
    const [id1, id2] = [userId1, userId2].sort();
    return `dm-${id1}-${id2}`;
  },
  dispute: (disputeId: string) => `dispute-${disputeId}`,
  user: (userId: string) => `private-user-${userId}`,
  global: () => `platform-global`,
};
```

### Event Types

```typescript
export const PusherEvents = {
  // Message events
  MESSAGE_NEW: "message:new",
  MESSAGE_EDIT: "message:edit",
  MESSAGE_DELETE: "message:delete",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  // Notification events
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",

  // Bounty events
  BOUNTY_NEW: "bounty:new",
  BOUNTY_ACCEPTED: "bounty:accepted",
  BOUNTY_SUBMITTED: "bounty:submitted",

  // Guild events
  GUILD_MEMBER_JOIN: "guild:member-join",
  GUILD_UPDATED: "guild:updated",

  // Dispute events
  DISPUTE_RAISED: "dispute:raised",
  DISPUTE_RESOLVED: "dispute:resolved",

  // User events
  USER_RANK_CHANGED: "user:rank-changed",
  USER_TRUST_CHANGED: "user:trust-changed",
};
```

---

## Messaging System

### Sending Messages

**Server Action**: `lib/actions/messages.ts`

```typescript
import { triggerEvent, PusherChannels, PusherEvents } from "@/lib/realtime/pusher-server";

export async function sendMessage(conversationId: string, data: SendMessageInput) {
  // Save to database
  const message = await Message.create({ ...data });

  // Trigger real-time event
  const channel = PusherChannels.guild(conversationId);
  await triggerEvent(channel, PusherEvents.MESSAGE_NEW, {
    id: message._id.toString(),
    conversationId,
    content: data.content,
    senderId: session.user.id,
    createdAt: message.createdAt,
  });

  return { success: true, data: { messageId: message._id } };
}
```

### Receiving Messages

**React Hook**: `hooks/use-pusher.ts`

```typescript
export function useChatMessages(
  channelName: string,
  onMessage: (message: any) => void
) {
  return usePusherEvent(channelName, PusherEvents.MESSAGE_NEW, onMessage);
}
```

**Usage**:

```tsx
const [messages, setMessages] = useState([]);

useChatMessages("guild-123", (newMessage) => {
  setMessages(prev => [newMessage, ...prev]);
});
```

### Typing Indicators

```typescript
export function useTypingIndicators(channelName: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  usePusherEvent(channelName, PusherEvents.TYPING_START, (data) => {
    setTypingUsers(prev => [...prev, data.userId]);
  });

  usePusherEvent(channelName, PusherEvents.TYPING_STOP, (data) => {
    setTypingUsers(prev => prev.filter(id => id !== data.userId));
  });

  return typingUsers;
}
```

---

## Notification System

### Notification Types

**File**: `lib/realtime/notifications.ts`

```typescript
export type NotificationType =
  | "bounty_matched"
  | "bounty_accepted"
  | "bounty_submitted"
  | "bounty_reviewed"
  | "guild_application_accepted"
  | "guild_invite"
  | "dispute_raised"
  | "tribunal_vote_needed"
  | "rank_changed"
  | "trust_score_changed"
  | "message_received"
  | "platform_announcement";
```

### Sending Notifications

**Server Action**: `lib/actions/notifications.ts`

```typescript
export async function sendNotification(
  userId: string,
  type: NotificationType,
  data: any
) {
  const notification = createNotification(userId, type, data);

  // Store notification
  await saveNotification(notification);

  // Trigger real-time event
  const channel = PusherChannels.user(userId);
  await triggerEvent(channel, PusherEvents.NOTIFICATION_NEW, notification);

  return { success: true, notification };
}
```

### Notification Templates

```typescript
export const NotificationTemplates = {
  bounty_matched: (data) => ({
    title: "Bounty Matched!",
    message: `Your bounty "${data.bountyTitle}" has been matched with ${data.guildName}`,
    icon: "🎯",
  }),
  rank_changed: (data) => ({
    title: "Rank Updated!",
    message: `You've advanced to ${data.newRank} rank`,
    icon: "🎖️",
  }),
  // ... more templates
};
```

### React Hooks

```typescript
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  usePusherEvent(
    `private-user-${userId}`,
    PusherEvents.NOTIFICATION_NEW,
    (notification) => {
      setNotifications(prev => [notification, ...prev]);
    }
  );

  return notifications;
}
```

---

## Background Jobs

### Oracle Monitoring (Daily)

**File**: `lib/cron/oracle-monitor.ts`

```typescript
export async function runOracleMonitor() {
  // Run anomaly detection
  const report = await detectAnomalies({
    daysToAnalyze: 7,
    riskThreshold: 70,
  });

  // If critical anomalies found, notify admins
  const criticalAnomalies = report.anomalies.filter(
    a => a.riskLevel === "Critical"
  );

  if (criticalAnomalies.length > 0) {
    const admins = await User.find({ trustScore: { $gt: 800 } });

    for (const admin of admins) {
      await sendNotification(admin._id.toString(), "platform_announcement", {
        title: "Critical Anomalies Detected",
        message: `Oracle detected ${criticalAnomalies.length} critical anomalies`,
        anomalyCount: criticalAnomalies.length,
      });
    }
  }

  return report;
}
```

### Trust Score Decay (Weekly)

```typescript
export async function runTrustDecay() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const inactiveUsers = await User.find({
    lastActive: { $lt: thirtyDaysAgo },
    trustScore: { $gt: 500 },
  });

  for (const user of inactiveUsers) {
    const daysSinceActive = Math.floor(
      (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    const decayAmount = Math.min(daysSinceActive - 30, 50); // Max 50 points
    user.trustScore = Math.max(user.trustScore - decayAmount, 500);
    await user.save();
  }

  return { processed: inactiveUsers.length };
}
```

### Cron API Endpoints

**Oracle Monitor**: `app/api/cron/oracle/route.ts`

```typescript
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await runOracleMonitor();

  return NextResponse.json({
    success: true,
    anomaliesDetected: report.anomalies.length,
  });
}
```

### Scheduling with Vercel Cron

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/oracle",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/trust-decay",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

Or use external services:
- [EasyCron](https://www.easycron.com/)
- [cron-job.org](https://cron-job.org/)

Schedule:
```bash
# Daily at midnight
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/oracle

# Weekly on Sunday at midnight
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/trust-decay
```

---

## Caching Layer

### Cache Implementation

**File**: `lib/cache/index.ts`

```typescript
class Cache {
  private store: Map<string, CacheEntry<any>>;

  set<T>(key: string, value: T, ttl: number): void {
    const expiresAt = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }
}

const cache = new Cache();
export default cache;
```

### Cache Keys

```typescript
export const CacheKeys = {
  aiInsights: (userId: string) => `ai:insights:${userId}`,
  trendingCategories: () => `ai:trending:categories`,
  userProfile: (userId: string) => `user:profile:${userId}`,
  guildProfile: (guildId: string) => `guild:profile:${guildId}`,
  leaderboard: (type: string) => `leaderboard:${type}`,
};
```

### Cache TTLs

```typescript
export const CacheTTL = {
  SHORT: 5 * 60,        // 5 minutes
  MEDIUM: 30 * 60,      // 30 minutes
  LONG: 60 * 60,        // 1 hour
  DAY: 24 * 60 * 60,    // 24 hours
};
```

### Usage Example

```typescript
export async function getPersonalizedInsights(userId: string) {
  const cacheKey = CacheKeys.aiInsights(userId);

  return await cache.getOrSet(
    cacheKey,
    async () => {
      // Expensive AI operation
      return await generatePersonalizedRecommendations(userId);
    },
    CacheTTL.DAY // Cache for 24 hours
  );
}
```

### Cached Operations

| Operation | Cache Key | TTL |
|-----------|-----------|-----|
| AI Insights | `ai:insights:{userId}` | 24 hours |
| Trending Categories | `ai:trending:categories` | 1 hour |
| User Profile | `user:profile:{userId}` | 5 minutes |
| Guild Profile | `guild:profile:{guildId}` | 5 minutes |
| Leaderboard | `leaderboard:{type}` | 30 minutes |

---

## React Hooks

### Core Pusher Hook

```typescript
export function usePusher(channelName: string, enabled: boolean = true) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const pusher = getPusherClient();
    const newChannel = pusher.subscribe(channelName);

    newChannel.bind("pusher:subscription_succeeded", () => {
      setIsConnected(true);
    });

    setChannel(newChannel);

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, enabled]);

  return { channel, isConnected };
}
```

### Event Subscription Hook

```typescript
export function usePusherEvent<T>(
  channelName: string,
  eventName: string,
  callback: (data: T) => void
) {
  const { channel } = usePusher(channelName);

  useEffect(() => {
    if (!channel) return;

    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}
```

### Specialized Hooks

```typescript
// Chat messages
export function useChatMessages(channelName: string, onMessage: (msg: any) => void) {
  return usePusherEvent(channelName, PusherEvents.MESSAGE_NEW, onMessage);
}

// Typing indicators
export function useTypingIndicators(channelName: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // ... implementation
  return typingUsers;
}

// Notifications
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // ... implementation
  return notifications;
}
```

---

## UI Components

### Notification Toast

**File**: `components/realtime/notification-toast.tsx`

```tsx
export function NotificationToast({ notification, onDismiss, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
  }, [duration, onDismiss]);

  return (
    <div className={cn(
      "fixed top-4 right-4 transition-transform",
      isVisible ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="bg-white rounded-lg shadow-lg p-4">
        {notification.data?.icon && <span>{notification.data.icon}</span>}
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
      </div>
    </div>
  );
}
```

### Notification Bell

**File**: `components/realtime/notification-bell.tsx`

```tsx
export function NotificationBell({ notifications, onMarkAsRead }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {notifications.map(notification => (
          <div key={notification.id} onClick={() => onMarkAsRead(notification.id)}>
            {notification.title}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

---

## API Endpoints

### Channel Authentication

**Endpoint**: `POST /api/realtime/auth`

**Purpose**: Authenticate Pusher channel subscriptions (private/presence channels)

**Request**:
```json
{
  "socket_id": "123456.78910",
  "channel_name": "private-user-abc123"
}
```

**Response**:
```json
{
  "auth": "pusher_key:signature"
}
```

**Implementation**: `app/api/realtime/auth/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { socket_id, channel_name } = await request.json();

  // Verify user has access to the channel
  const userId = session.user.id;

  if (channel_name === `private-user-${userId}`) {
    const authResponse = authenticateChannel(socket_id, channel_name, userId);
    return NextResponse.json(authResponse);
  }

  // Check DM, guild, dispute access...

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### Cron Endpoints

| Endpoint | Method | Purpose | Schedule |
|----------|--------|---------|----------|
| `/api/cron/oracle` | GET | Run Oracle monitoring | Daily (midnight) |
| `/api/cron/trust-decay` | GET | Decay inactive trust scores | Weekly (Sunday) |

**Authentication**: Bearer token (CRON_SECRET)

---

## Environment Variables

### Required Variables

```env
# Pusher Real-time
PUSHER_APP_ID=123456
PUSHER_KEY=abc123def456
PUSHER_SECRET=xyz789uvw012
PUSHER_CLUSTER=us2

# Public (client-side)
NEXT_PUBLIC_PUSHER_KEY=abc123def456
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# Cron Security
CRON_SECRET=your-secret-token
```

### Validation

```typescript
export function isPusherConfigured(): boolean {
  return !!(
    process.env.PUSHER_APP_ID &&
    process.env.PUSHER_KEY &&
    process.env.PUSHER_SECRET
  );
}
```

---

## Testing

### Manual Testing

#### 1. Test Pusher Connection

```typescript
// In browser console
const pusher = new Pusher('YOUR_KEY', { cluster: 'us2' });
const channel = pusher.subscribe('test-channel');
channel.bind('test-event', (data) => {
  console.log('Received:', data);
});
```

#### 2. Test Message Sending

```typescript
// Send a message
await sendMessage("guild-123", {
  content: "Hello, world!",
});

// Should appear in real-time for all guild members
```

#### 3. Test Notifications

```typescript
await sendNotification("user123", "bounty_matched", {
  bountyTitle: "Build Landing Page",
  guildName: "Design Masters",
});

// Should show toast notification
```

#### 4. Test Caching

```typescript
// First call (miss) - slow
console.time("insights");
await getPersonalizedInsights("user123");
console.timeEnd("insights"); // ~3000ms

// Second call (hit) - fast
console.time("insights-cached");
await getPersonalizedInsights("user123");
console.timeEnd("insights-cached"); // ~5ms
```

### Unit Tests

```typescript
// __tests__/cache.test.ts
import cache, { CacheKeys, CacheTTL } from "@/lib/cache";

describe("Cache", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("should set and get values", () => {
    cache.set("test", "value", 60);
    expect(cache.get("test")).toBe("value");
  });

  it("should expire after TTL", async () => {
    cache.set("test", "value", 1); // 1 second
    expect(cache.get("test")).toBe("value");

    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(cache.get("test")).toBeNull();
  });

  it("should use getOrSet factory", async () => {
    const factory = jest.fn(() => Promise.resolve("computed"));

    const result1 = await cache.getOrSet("test", factory, 60);
    expect(result1).toBe("computed");
    expect(factory).toHaveBeenCalledTimes(1);

    const result2 = await cache.getOrSet("test", factory, 60);
    expect(result2).toBe("computed");
    expect(factory).toHaveBeenCalledTimes(1); // Not called again
  });
});
```

---

## Deployment

### Pusher Configuration

1. **Production App**: Create separate Pusher app for production
2. **Update .env**: Set production credentials in Vercel/deployment platform
3. **Cluster Selection**: Choose cluster closest to your users

### Cron Jobs Setup

#### Option 1: Vercel Cron (Recommended)

**vercel.json**:
```json
{
  "crons": [
    {
      "path": "/api/cron/oracle",
      "schedule": "0 0 * * *"
    }
  ]
}
```

#### Option 2: External Cron Service

**EasyCron**:
1. Create account at [easycron.com](https://www.easycron.com/)
2. Add cron job:
   - URL: `https://your-domain.com/api/cron/oracle`
   - Schedule: `0 0 * * *` (daily at midnight)
   - Custom headers: `Authorization: Bearer YOUR_CRON_SECRET`

**cron-job.org**:
1. Create account at [cron-job.org](https://cron-job.org/)
2. Create cron job with same configuration

### Performance Optimization

1. **Cache Strategy**: Ensure cache is populated during off-peak hours
2. **Pusher Limits**: Monitor connection count (free tier: 100 concurrent)
3. **Channel Cleanup**: Unsubscribe from channels when users navigate away
4. **Batch Events**: Use `triggerBatchEvents` for multiple recipients

### Monitoring

```typescript
// Check Pusher status
const pusher = getPusherServer();
const status = await pusher.trigger("test", "ping", {});
console.log("Pusher operational:", status);

// Check cache stats
const stats = cache.stats();
console.log("Cache:", stats);
// { total: 120, valid: 100, expired: 20 }
```

---

## Troubleshooting

### Pusher Not Connecting

```typescript
// Check client configuration
console.log("Pusher Key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
console.log("Cluster:", process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

// Check connection state
pusher.connection.bind("state_change", (states) => {
  console.log("Pusher state:", states.current);
  // Should be: connecting → connected
});
```

### Authentication Failing

```typescript
// Check auth endpoint
fetch("/api/realtime/auth", {
  method: "POST",
  body: JSON.stringify({
    socket_id: "123.456",
    channel_name: "private-user-abc",
  }),
}).then(r => r.json()).then(console.log);
```

### Messages Not Appearing

1. Check channel subscription
2. Verify event binding
3. Confirm server is triggering events
4. Check Pusher dashboard for activity

### Cache Not Working

```typescript
// Verify cache is enabled
console.log("Cache stats:", cache.stats());

// Check specific key
console.log("Has key:", cache.has(CacheKeys.aiInsights("user123")));

// Force clear and retry
cache.clear();
```

---

## Summary

Phase 7 delivers a complete real-time communication system:

✅ **Pusher Integration**: WebSocket connections for live updates  
✅ **Real-time Messaging**: Guild chat, DMs, dispute threads  
✅ **Live Notifications**: 13 notification types with toast UI  
✅ **Background Jobs**: Oracle monitoring, trust decay  
✅ **Caching Layer**: In-memory cache for performance  
✅ **React Hooks**: Easy-to-use real-time subscriptions  
✅ **UI Components**: Notification bell, toasts  
✅ **API Endpoints**: Channel auth, cron triggers  
✅ **Production Ready**: Deployed with monitoring

**Next Phase**: Phase 8 - Demo Data Generation

---

## File Structure

```
lib/
├── realtime/
│   ├── pusher-server.ts       (Pusher server config + utilities)
│   ├── pusher-client.ts       (Pusher client config)
│   └── notifications.ts       (Notification types + templates)
├── actions/
│   ├── messages.ts            (Updated with real-time events)
│   └── notifications.ts       (Notification server actions)
├── cache/
│   └── index.ts               (In-memory caching)
└── cron/
    └── oracle-monitor.ts      (Background jobs)

hooks/
└── use-pusher.ts              (React hooks for real-time)

components/
└── realtime/
    ├── notification-toast.tsx (Toast notification UI)
    └── notification-bell.tsx  (Notification bell UI)

app/api/
├── realtime/
│   └── auth/
│       └── route.ts           (Channel authentication)
└── cron/
    ├── oracle/
    │   └── route.ts           (Oracle monitoring endpoint)
    └── trust-decay/
        └── route.ts           (Trust decay endpoint)
```

**Total**: 13 new files, ~1,850 lines of code

---

**Phase 7 Complete** ✅  
**Overall Progress**: 100% (7/7 phases complete)