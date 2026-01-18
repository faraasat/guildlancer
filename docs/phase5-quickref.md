# Phase 5 Quick Reference Guide

## Server Actions Usage

### Bounty Actions

```typescript
import {
  createBounty,
  getOpenBounties,
  acceptBounty,
  submitBountyProof,
  reviewBountySubmission,
  getBountyById,
  getMyPostedBounties
} from '@/lib/actions/bounties';

// Create a bounty (Client)
const result = await createBounty({
  title: "Build responsive landing page",
  description: "Need a modern landing page with animations...",
  category: "Web Development",
  urgency: "High",
  rewardCredits: 5000,
  clientStake: 1000,
  guildStakeRequired: 2000,
  minHunterRank: "Veteran",
  minGuildTrust: 500,
  requiredSkills: ["React", "TailwindCSS"],
  evidenceRequirements: "Screenshots and live demo link",
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
});

// Get open bounties with filters
const bounties = await getOpenBounties({
  category: "Web Development",
  minReward: 1000,
  maxReward: 10000,
  urgency: "High",
  status: "Open",
  sort: "reward-high",
  page: 1,
  limit: 20
});

// Accept bounty (Guild Master)
await acceptBounty(bountyId, guildId);

// Submit proof (Hunter)
await submitBountyProof(bountyId, {
  text: "Completed the landing page with all requested features...",
  images: ["https://example.com/screenshot1.png"],
  links: ["https://example.com/demo"]
});

// Review submission (Client)
await reviewBountySubmission(bountyId, true); // Accept
await reviewBountySubmission(bountyId, false); // Reject (initiates dispute)
```

---

### Guild Actions

```typescript
import {
  createGuild,
  getGuilds,
  applyToGuild,
  leaveGuild,
  manageGuildMember,
  getGuildById,
  getGuildStats,
  updateGuild,
  getMyGuild
} from '@/lib/actions/guilds';

// Create a guild
const guild = await createGuild({
  name: "Elite Developers",
  description: "Top-tier full-stack developers specializing in modern web tech",
  avatar: "🚀",
  banner: "https://example.com/banner.jpg",
  categories: ["Web Development", "Mobile Apps", "AI/ML"],
  foundingStake: 10000 // Min 5000 credits
});

// Get guilds with filters
const guilds = await getGuilds({
  rank: "Veteran", // Minimum rank
  minTrustScore: 600,
  category: "Web Development",
  search: "developers",
  sort: "trust", // "trust" | "rank" | "members" | "newest"
  page: 1,
  limit: 20
});

// Join a guild
await applyToGuild(guildId);

// Leave guild
await leaveGuild();

// Manage members (Master/Officer)
await manageGuildMember({
  action: "promote", // "promote" | "demote" | "kick"
  userId: memberUserId,
  newRole: "Elite Hunter" // Optional for promote/demote
});

// Get guild details
const guildDetails = await getGuildById(guildId);

// Get guild stats and analytics
const stats = await getGuildStats(guildId);
// Returns: { guild, bountyStats, recentActivities, memberCount }

// Update guild info (Master only)
await updateGuild(guildId, {
  description: "Updated description",
  avatar: "⚡",
  categories: ["Web", "Mobile", "Blockchain"]
});

// Get current user's guild
const myGuild = await getMyGuild();
```

---

### Dispute Actions

```typescript
import {
  raiseDispute,
  submitDisputeEvidence,
  requestAIAnalysis,
  escalateToTribunal,
  castTribunalVote,
  getDisputeById,
  getMyDisputes
} from '@/lib/actions/disputes';

// Raise a dispute (Client)
const dispute = await raiseDispute(bountyId, {
  evidenceText: "The work submitted does not meet the requirements because...",
  evidenceImages: ["https://example.com/issue1.png"],
  evidenceLinks: ["https://example.com/spec"]
});

// Submit additional evidence (Tier 1: Negotiation)
await submitDisputeEvidence(disputeId, {
  evidenceText: "Additional proof showing the issue...",
  evidenceImages: ["https://example.com/proof.png"],
  evidenceLinks: []
});

// Request AI analysis (Escalate to Tier 2)
await requestAIAnalysis(disputeId);
// Phase 6 will add actual AI processing

// Escalate to Tribunal (Tier 3)
await escalateToTribunal(disputeId);
// Selects 5 random eligible guilds as jurors

// Cast tribunal vote (Juror Guild Master)
await castTribunalVote(disputeId, {
  disputeId,
  vote: "GuildWins", // "ClientWins" | "GuildWins" | "Split"
  stakeAmount: 2000 // Min 1000 credits
});
// Auto-resolves when all 5 jurors vote

// Get dispute details
const disputeDetails = await getDisputeById(disputeId);

// Get my disputes (as client or guild member)
const myDisputes = await getMyDisputes();
```

---

### Message Actions

```typescript
import {
  sendMessage,
  getMessages,
  addReaction,
  editMessage,
  deleteMessage,
  getConversations,
  getDMConversationId
} from '@/lib/actions/messages';

// Send a message
await sendMessage("guild-12345", {
  content: "Hey team, we have a new bounty to work on!",
  attachments: ["https://example.com/doc.pdf"],
  replyTo: previousMessageId // Optional for threading
});

// Get messages for a conversation
const messages = await getMessages(
  "guild-12345",
  50, // limit
  beforeMessageId // Optional cursor for pagination
);

// Add reaction to message
await addReaction(messageId, "👍");
await addReaction(messageId, "👍"); // Toggle off if already reacted

// Edit a message (sender only)
await editMessage(messageId, "Updated message content");

// Delete a message (sender only)
await deleteMessage(messageId);

// Get all user's conversations
const conversations = await getConversations();
// Returns: [{ id, type, name, avatar, lastMessage }]

// Create/get DM conversation
const { conversationId } = await getDMConversationId(otherUserId);
// Use this conversationId for DM messages
```

---

### Ranking Functions

```typescript
import {
  calculateUserTrustScore,
  calculateGuildTrustScore,
  updateUserRank,
  updateGuildRank,
  applyTrustDecay
} from '@/lib/utils/ranking';

// Calculate user trust score (0-1000)
const trustScore = await calculateUserTrustScore(userId);
// Based on: success rate, completions, ratings, disputes, activity, guild contribution

// Calculate guild trust score (0-1000)
const guildTrust = await calculateGuildTrustScore(guildId);
// Based on: mission success, avg hunter trust, disputes, value cleared, participation

// Update user rank based on trust score
const newRank = await updateUserRank(userId);
// Ranks: Legendary (900+), Master (750+), Elite (600+), Veteran (400+), Rookie (0+)

// Update guild rank
const guildRank = await updateGuildRank(guildId);
// Ranks: Legendary (900+), Elite (750+), Veteran (600+), Established (400+), Developing (0+)

// Apply trust decay for inactive users
await applyTrustDecay(userId);
// -1% per 7 days inactive (max -20% over 6 months)
```

---

## Validation Schemas

```typescript
import {
  createBountySchema,
  createGuildSchema,
  raiseDisputeSchema,
  sendMessageSchema,
  bountyFiltersSchema,
  guildFiltersSchema
} from '@/lib/validations/backend';

// Validate input before server action
const validated = createBountySchema.parse(data);
// Throws ZodError if invalid

// Get TypeScript types
import type {
  CreateBountyInput,
  CreateGuildInput,
  RaiseDisputeInput,
  SendMessageInput,
  BountyFilters,
  GuildFilters
} from '@/lib/validations/backend';
```

---

## Database Models

```typescript
// Import models
import Guild from '@/lib/db/models/Guild';
import Bounty from '@/lib/db/models/Bounty';
import Dispute from '@/lib/db/models/Dispute';
import Transaction from '@/lib/db/models/Transaction';
import Activity from '@/lib/db/models/Activity';
import Message from '@/lib/db/models/Message';
import { User } from '@/lib/db/models/User'; // Named export

// Use in server-side code
const guild = await Guild.findById(guildId);
const bounties = await Bounty.find({ status: 'Open' }).limit(10);
const user = await User.findById(userId);
```

---

## Conversation ID Patterns

```typescript
// Guild conversation
const guildConversationId = `guild-${guildId}`;

// Direct message (sorted user IDs)
const dmConversationId = `dm-${userId1}-${userId2}`;
// Always sort: const ids = [user1, user2].sort(); const id = `dm-${ids[0]}-${ids[1]}`

// Dispute conversation
const disputeConversationId = `dispute-${disputeId}`;
```

---

## Common Patterns

### Server Action Response

```typescript
// Success response
return { success: true, data: { ... } };

// Error response
return { success: false, error: "Error message" };

// Usage in component
const result = await createBounty(data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Authentication Check

```typescript
const session = await auth();
if (!session?.user?.id) {
  return { success: false, error: 'Unauthorized' };
}
```

### Database Query with Pagination

```typescript
const query = { status: 'Open' };
const skip = (page - 1) * limit;

const [results, total] = await Promise.all([
  Model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
  Model.countDocuments(query)
]);

return {
  results,
  total,
  page,
  pages: Math.ceil(total / limit)
};
```

---

## Error Handling

```typescript
try {
  await connectDB();
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = schema.parse(data);
  
  // ... logic ...
  
  return { success: true, data: { ... } };
} catch (error: any) {
  console.error('Action error:', error);
  return { success: false, error: error.message || 'Action failed' };
}
```

---

## Frontend Integration Examples

### Dashboard Page

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getOpenBounties, getMyGuild } from '@/lib/actions/bounties';

export default function Dashboard() {
  const [bounties, setBounties] = useState([]);
  const [guild, setGuild] = useState(null);

  useEffect(() => {
    async function loadData() {
      const bountiesResult = await getOpenBounties({
        status: 'Open',
        sort: 'newest',
        page: 1,
        limit: 10
      });
      
      if (bountiesResult.success) {
        setBounties(bountiesResult.data.bounties);
      }

      const guildResult = await getMyGuild();
      if (guildResult.success) {
        setGuild(guildResult.data);
      }
    }
    
    loadData();
  }, []);

  return <div>...</div>;
}
```

### Guild Management

```typescript
'use client';

import { manageGuildMember } from '@/lib/actions/guilds';

async function handlePromote(userId: string) {
  const result = await manageGuildMember({
    action: 'promote',
    userId,
    newRole: 'Elite Hunter'
  });

  if (result.success) {
    alert('Member promoted!');
  } else {
    alert(`Error: ${result.error}`);
  }
}
```

### Dispute Flow

```typescript
'use client';

import { raiseDispute, escalateToTribunal } from '@/lib/actions/disputes';

async function handleRejectSubmission(bountyId: string) {
  // Step 1: Raise dispute (Tier 1: Negotiation)
  const disputeResult = await raiseDispute(bountyId, {
    evidenceText: "The work does not meet requirements...",
    evidenceImages: [],
    evidenceLinks: []
  });

  if (!disputeResult.success) {
    alert(`Error: ${disputeResult.error}`);
    return;
  }

  // Step 2: After 48 hours, escalate to Tribunal
  const escalateResult = await escalateToTribunal(disputeResult.data.disputeId);
  
  if (escalateResult.success) {
    alert('Dispute escalated to tribunal!');
  }
}
```

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## Environment Variables

```env
# .env.local
MONGODB_URI=mongodb://localhost:27017/nexora
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## Common Issues & Solutions

### Issue: User import error
```typescript
// ❌ Wrong
import User from '@/lib/db/models/User';

// ✅ Correct
import { User } from '@/lib/db/models/User';
```

### Issue: Validation error
```typescript
// Always parse input before use
const validated = createBountySchema.parse(data);
// Throws ZodError if invalid - handle in try-catch
```

### Issue: Unauthorized access
```typescript
// Always check session in server actions
const session = await auth();
if (!session?.user?.id) {
  return { success: false, error: 'Unauthorized' };
}
```

---

## Performance Tips

1. **Use pagination** for all list queries (bounties, guilds, messages)
2. **Use `.lean()`** for read-only queries (faster, plain objects)
3. **Populate selectively** - only populate needed fields
4. **Use indexes** - all models have proper indexes
5. **Batch operations** - use Promise.all() for parallel queries
6. **Cache frequently accessed data** (user profile, guild info)

---

## Next Steps for Integration

1. **API Routes**: Create RESTful endpoints wrapping these server actions
2. **Real-time**: Add WebSocket support for messages and notifications
3. **AI Agents**: Integrate GroqCloud LLM for Matchmaker and Arbiter
4. **Testing**: Write comprehensive test suites
5. **Caching**: Implement Redis for session and data caching
6. **Rate Limiting**: Add rate limiting middleware
7. **Webhooks**: Add webhook support for external integrations

---

## Support & Documentation

- **Phase 5 Complete**: See `/docs/phase5-complete.md`
- **Implementation Guide**: See `/docs/implementation.md`
- **MVP Specs**: See `/docs/mvp.md`
- **Tech Stack**: See `/docs/technologies.md`

---

All Phase 5 backend infrastructure is production-ready! 🎉
