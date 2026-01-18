# Nexora API Documentation

## Base URL

```
http://localhost:3000/api
```

All API endpoints require authentication unless otherwise specified.

---

## Bounties API

### List Bounties

**GET** `/api/bounties`

Get bounties with optional filters.

**Query Parameters:**

- `category` (string) - Filter by category
- `minReward` (number) - Minimum reward credits
- `maxReward` (number) - Maximum reward credits
- `urgency` (string) - "Low" | "Medium" | "High" | "Critical"
- `minHunterRank` (string) - "Rookie" | "Veteran" | "Elite" | "Master" | "Legendary"
- `status` (string) - Bounty status
- `search` (string) - Search in title/description
- `sort` (string) - "newest" | "reward-high" | "reward-low" | "deadline"
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)

**Response:**

```json
{
  "bounties": [...],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

### Create Bounty

**POST** `/api/bounties`

Create a new bounty (Client only).

**Request Body:**

```json
{
  "title": "Build responsive landing page",
  "description": "Need a modern landing page...",
  "category": "Web Development",
  "urgency": "High",
  "rewardCredits": 5000,
  "clientStake": 1000,
  "guildStakeRequired": 2000,
  "minHunterRank": "Veteran",
  "minGuildTrust": 500,
  "requiredSkills": ["React", "TailwindCSS"],
  "evidenceRequirements": "Screenshots and demo",
  "deadline": "2026-02-01T00:00:00Z"
}
```

**Response:** `201 Created`

```json
{
  "bountyId": "507f1f77bcf86cd799439011"
}
```

### Get Bounty

**GET** `/api/bounties/:id`

Get bounty details by ID.

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "...",
  "description": "...",
  "clientId": { "username": "...", "avatar": "..." },
  "acceptedByGuildId": { "name": "...", "avatar": "..." },
  ...
}
```

### Accept Bounty

**POST** `/api/bounties/:id/accept`

Accept a bounty (Guild Master only).

**Request Body:**

```json
{
  "guildId": "507f1f77bcf86cd799439012"
}
```

**Response:**

```json
{
  "message": "Bounty accepted successfully"
}
```

### Submit Proof

**POST** `/api/bounties/:id/submit`

Submit proof of work (Hunter only).

**Request Body:**

```json
{
  "text": "Completed the landing page with all features...",
  "images": ["https://example.com/screenshot.png"],
  "links": ["https://example.com/demo"]
}
```

**Response:**

```json
{
  "message": "Proof submitted successfully"
}
```

### Review Submission

**POST** `/api/bounties/:id/review`

Review bounty submission (Client only).

**Request Body:**

```json
{
  "accept": true
}
```

**Response:**

```json
{
  "message": "Bounty completed successfully"
}
```

### My Posted Bounties

**GET** `/api/bounties/my-posted`

Get current user's posted bounties.

**Response:**

```json
[
  {
    "_id": "...",
    "title": "...",
    "status": "Open",
    "acceptedByGuildId": { "name": "...", "avatar": "..." }
  }
]
```

---

## Guilds API

### List Guilds

**GET** `/api/guilds`

Get guilds with optional filters.

**Query Parameters:**

- `rank` (string) - "Legendary" | "Elite" | "Veteran" | "Established" | "Developing"
- `minTrustScore` (number) - Minimum trust score (0-1000)
- `category` (string) - Filter by specialization
- `search` (string) - Search in name/description
- `sort` (string) - "trust" | "rank" | "members" | "newest"
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:**

```json
{
  "guilds": [...],
  "total": 50,
  "page": 1,
  "pages": 3
}
```

### Create Guild

**POST** `/api/guilds`

Create a new guild.

**Request Body:**

```json
{
  "name": "Elite Developers",
  "description": "Top-tier full-stack developers...",
  "avatar": "🚀",
  "banner": "https://example.com/banner.jpg",
  "categories": ["Web Development", "Mobile Apps"],
  "foundingStake": 10000
}
```

**Response:** `201 Created`

```json
{
  "guildId": "507f1f77bcf86cd799439013"
}
```

### Get Guild

**GET** `/api/guilds/:id`

Get guild details with all members.

**Response:**

```json
{
  "_id": "...",
  "name": "Elite Developers",
  "masterId": { "username": "...", "avatar": "..." },
  "officerIds": [...],
  "memberIds": [...],
  "trustScore": 850,
  "rank": "Elite",
  ...
}
```

### Update Guild

**PATCH** `/api/guilds/:id`

Update guild info (Master only).

**Request Body:**

```json
{
  "description": "Updated description",
  "avatar": "⚡",
  "categories": ["Web", "Mobile", "AI"]
}
```

### Guild Members

**POST** `/api/guilds/:id/members`

Join, leave, or manage guild members.

**Join Guild:**

```json
{
  "action": "join"
}
```

**Leave Guild:**

```json
{
  "action": "leave"
}
```

**Promote Member:**

```json
{
  "action": "promote",
  "userId": "507f1f77bcf86cd799439014",
  "newRole": "Elite Hunter"
}
```

**Demote Officer:**

```json
{
  "action": "demote",
  "userId": "507f1f77bcf86cd799439014"
}
```

**Kick Member:**

```json
{
  "action": "kick",
  "userId": "507f1f77bcf86cd799439014"
}
```

### Guild Stats

**GET** `/api/guilds/:id/stats`

Get guild statistics and analytics.

**Response:**

```json
{
  "guild": { ... },
  "bountyStats": [
    { "_id": "Completed", "count": 25, "totalRewards": 125000 },
    { "_id": "InProgress", "count": 5, "totalRewards": 30000 }
  ],
  "recentActivities": [...],
  "memberCount": 15
}
```

### My Guild

**GET** `/api/guilds/my-guild`

Get current user's guild.

**Response:**

```json
{
  "_id": "...",
  "name": "...",
  ...
}
```

---

## Disputes API

### List My Disputes

**GET** `/api/disputes`

Get disputes where user is involved (as client or guild member).

**Response:**

```json
[
  {
    "_id": "...",
    "bountyId": { "title": "..." },
    "tier": "Negotiation",
    "status": "Open",
    "clientId": { "username": "...", "avatar": "..." },
    "guildId": { "name": "...", "avatar": "..." }
  }
]
```

### Raise Dispute

**POST** `/api/disputes`

Raise a new dispute (Client only).

**Request Body:**

```json
{
  "bountyId": "507f1f77bcf86cd799439015",
  "evidenceText": "The work does not meet requirements...",
  "evidenceImages": ["https://example.com/issue.png"],
  "evidenceLinks": ["https://example.com/spec"]
}
```

**Response:** `201 Created`

```json
{
  "disputeId": "507f1f77bcf86cd799439016"
}
```

### Get Dispute

**GET** `/api/disputes/:id`

Get dispute details.

**Response:**

```json
{
  "_id": "...",
  "bountyId": { ... },
  "tier": "AIArbiter",
  "status": "AIAnalysis",
  "clientEvidence": { "text": "...", "images": [...] },
  "guildEvidence": { "text": "...", "images": [...] },
  "aiSuggestion": { "ruling": "Split", "confidenceScore": 0.75 },
  ...
}
```

### Submit Evidence

**POST** `/api/disputes/:id/evidence`

Submit additional evidence.

**Request Body:**

```json
{
  "evidenceText": "Additional proof...",
  "evidenceImages": ["https://example.com/proof.png"],
  "evidenceLinks": []
}
```

### Escalate Dispute

**POST** `/api/disputes/:id/escalate`

Escalate dispute to next tier.

**Request Body:**

```json
{
  "tier": "ai"
}
```

or

```json
{
  "tier": "tribunal"
}
```

**Response:**

```json
{
  "message": "Dispute escalated to tribunal"
}
```

### Cast Tribunal Vote

**POST** `/api/disputes/:id/vote`

Cast tribunal vote (Guild Master of juror guild only).

**Request Body:**

```json
{
  "disputeId": "507f1f77bcf86cd799439016",
  "vote": "GuildWins",
  "stakeAmount": 2000
}
```

**Response:**

```json
{
  "message": "Vote cast successfully"
}
```

---

## Messages API

### List Conversations

**GET** `/api/messages`

Get user's conversations.

**Response:**

```json
[
  {
    "id": "guild-507f1f77bcf86cd799439013",
    "type": "guild",
    "name": "Elite Developers",
    "avatar": "🚀",
    "lastMessage": {
      "content": "Hey team...",
      "sentAt": "2026-01-18T10:30:00Z"
    }
  },
  {
    "id": "dm-507f1f77bcf86cd799439014-507f1f77bcf86cd799439017",
    "type": "dm",
    "name": "JohnDoe",
    "avatar": "👤",
    "lastMessage": { ... }
  }
]
```

### Get Messages

**GET** `/api/messages/:conversationId`

Get messages for a conversation.

**Query Parameters:**

- `limit` (number) - Messages to fetch (default: 50)
- `before` (string) - Message ID for pagination

**Response:**

```json
{
  "messages": [
    {
      "_id": "...",
      "senderId": { "username": "...", "avatar": "..." },
      "content": "Hello team!",
      "sentAt": "2026-01-18T10:30:00Z",
      "reactions": [
        { "emoji": "👍", "userIds": [...] }
      ]
    }
  ],
  "hasMore": true
}
```

### Send Message

**POST** `/api/messages/:conversationId`

Send a message to a conversation.

**Request Body:**

```json
{
  "conversationId": "guild-507f1f77bcf86cd799439013",
  "content": "Hey team, new bounty available!",
  "attachments": ["https://example.com/doc.pdf"],
  "replyTo": "507f1f77bcf86cd799439018"
}
```

**Response:** `201 Created`

```json
{
  "messageId": "507f1f77bcf86cd799439019"
}
```

### Edit Message

**PATCH** `/api/messages/message/:id`

Edit a message (sender only).

**Request Body:**

```json
{
  "content": "Updated message content"
}
```

### Delete Message

**DELETE** `/api/messages/message/:id`

Delete a message (sender only).

**Response:**

```json
{
  "message": "Message deleted successfully"
}
```

### Add Reaction

**POST** `/api/messages/message/:id/react`

Add or remove reaction (toggle).

**Request Body:**

```json
{
  "emoji": "👍"
}
```

### Create DM Conversation

**POST** `/api/messages/dm`

Get or create DM conversation ID.

**Request Body:**

```json
{
  "otherUserId": "507f1f77bcf86cd799439020"
}
```

**Response:**

```json
{
  "conversationId": "dm-507f1f77bcf86cd799439014-507f1f77bcf86cd799439020"
}
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request**

```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized**

```json
{
  "error": "Unauthorized"
}
```

**404 Not Found**

```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. This should be added in production using middleware.

---

## Authentication

All API routes use NextAuth session authentication. Include the session cookie in requests.

For direct API calls (not from browser):

```bash
curl -X POST http://localhost:3000/api/bounties \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"title":"Test Bounty",...}'
```

---

## Example Usage

### Create and Accept Bounty Flow

1. **Client creates bounty:**

```bash
POST /api/bounties
{
  "title": "Build landing page",
  "description": "Need modern responsive landing page",
  "category": "Web Development",
  "rewardCredits": 5000,
  "deadline": "2026-02-01T00:00:00Z"
}
# Response: { "bountyId": "507f1f77bcf86cd799439011" }
```

2. **Guild Master accepts:**

```bash
POST /api/bounties/507f1f77bcf86cd799439011/accept
{
  "guildId": "507f1f77bcf86cd799439013"
}
# Response: { "message": "Bounty accepted successfully" }
```

3. **Hunter submits proof:**

```bash
POST /api/bounties/507f1f77bcf86cd799439011/submit
{
  "text": "Completed landing page with all features",
  "images": ["https://example.com/screenshot.png"],
  "links": ["https://example.com/demo"]
}
# Response: { "message": "Proof submitted successfully" }
```

4. **Client reviews:**

```bash
POST /api/bounties/507f1f77bcf86cd799439011/review
{
  "accept": true
}
# Response: { "message": "Bounty completed successfully" }
```

### Dispute Flow

1. **Client rejects and raises dispute:**

```bash
POST /api/bounties/507f1f77bcf86cd799439011/review
{ "accept": false }

POST /api/disputes
{
  "bountyId": "507f1f77bcf86cd799439011",
  "evidenceText": "Work does not meet requirements..."
}
# Response: { "disputeId": "507f1f77bcf86cd799439016" }
```

2. **Guild submits counter-evidence:**

```bash
POST /api/disputes/507f1f77bcf86cd799439016/evidence
{
  "evidenceText": "All requirements were met as specified..."
}
```

3. **Escalate to Tribunal:**

```bash
POST /api/disputes/507f1f77bcf86cd799439016/escalate
{ "tier": "tribunal" }
```

4. **Jurors vote:**

```bash
POST /api/disputes/507f1f77bcf86cd799439016/vote
{
  "vote": "GuildWins",
  "stakeAmount": 2000
}
```

---

## Summary

**Total API Routes**: 21

- Bounties: 6 routes
- Guilds: 5 routes
- Disputes: 5 routes
- Messages: 5 routes

All routes are fully functional and integrated with the backend server actions created in Phase 5.
