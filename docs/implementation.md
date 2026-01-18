# Implementation Roadmap - GuildLancer

This document outlines the complete step-by-step implementation plan for building the GuildLancer MVP. The approach prioritizes **frontend-first development** to establish visual identity and user flows before implementing complex backend logic.

---

## Development Principles

1. **Frontend-First:** Build complete UI/UX before backend integration
2. **Incremental Integration:** Connect features to backend progressively
3. **Mock Data Initially:** Use realistic demo data for frontend development
4. **Component-Driven:** Reusable, modular components with consistent theming
5. **Type Safety:** Comprehensive TypeScript definitions throughout
6. **Progressive Enhancement:** Core features work, enhancements add delight
7. **Testing at Each Phase:** Verify functionality before moving forward

---

## Phase 1: Foundation & Design System (Week 1)

### 1.1 Project Scaffolding

**Setup Tasks:**

- Initialize Next.js 14+ project with App Router and TypeScript
- Configure Tailwind CSS with custom theme
- Install and configure Shadcn/ui components
- Set up project structure and folder organization
- Initialize Git repository
- Configure ESLint and Prettier
- Set up environment variable structure

**Project Structure:**

```
/app
  /(public)      # Public routes
    /page.tsx
    /guilds/...
    /hunters/...
    /about/...
    /features/...
    /contact/...
  /(auth)        # Protected routes
    /dashboard/...
    /analytics/...
    /history/...
    etc.
  /api/          # API routes and server actions
  /layout.tsx
  /globals.css
/components
  /ui/           # Shadcn components
  /layout/       # Nav, Footer, etc.
  /features/     # Feature-specific components
  /charts/       # Data visualization components
  /forms/        # Form components
/lib
  /db/           # Database utilities
  /ai/           # AI integration
  /utils/        # Helper functions
  /validations/  # Zod schemas
/types
  /index.ts      # TypeScript definitions
/public
  /images/
  /icons/
```

**Deliverables:**

- ✅ Working Next.js app
- ✅ Tailwind configured with custom sci-fi theme
- ✅ Core Shadcn components installed
- ✅ TypeScript strict mode enabled
- ✅ Git repository initialized

### 1.2 Design System & Theme Configuration

**Theme Development:**

- **Color Palette:**
  ```
  Primary: Cyan (#00D9FF)
  Secondary: Magenta (#FF00E5)
  Accent: Electric Purple (#8B00FF)
  Success: Neon Green (#00FF94)
  Warning: Amber (#FFAA00)
  Danger: Red (#FF0055)
  Background: Deep Black (#0A0A0F)
  Surface: Dark Gray (#1A1A24)
  ```
- **Typography:**
  - Headings: Orbitron or Exo 2 (Google Fonts)
  - Body: Inter or Space Grotesk
  - Monospace: JetBrains Mono
- **Animation Presets:**
  - Glitch effects
  - Glow animations
  - Slide-in transitions
  - Particle systems
  - Holographic shimmer
- **Component Variants:**
  - Glassmorphism cards
  - Neon borders
  - Gradient backgrounds
  - Animated buttons
  - HUD-style panels

**Reusable Components to Build:**

- `<GlowCard>` - Card with neon glow effect
- `<AnimatedNumber>` - Counting animation for stats
- `<RankBadge>` - Tier-based rank display
- `<TrustGauge>` - Circular progress indicator
- `<ParticleBackground>` - Animated background
- `<GlitchText>` - Text with glitch effect
- `<HolographicImage>` - Image with holographic overlay
- `<NeonButton>` - CTA button with glow

**Deliverables:**

- ✅ Complete design system documented
- ✅ Reusable component library
- ✅ Storybook/preview of all components (optional)
- ✅ Consistent theming across app

---

## Phase 2: Public Pages - Frontend Only (Week 1-2)

**Objective:** Build all non-authenticated pages with mock data, establishing the platform's visual identity and information architecture.

### 2.1 Home Page (`/`)

**Sections to Build:**

- **Hero Section:**
  - Animated headline with glitch effect
  - Subtitle explaining platform in one line
  - Particle background animation
  - CTA buttons: "Enter Network" (modal/redirect to login), "Explore Guilds"
- **Live Stats Ticker:**
  - 4-6 key metrics in HUD-style displays
  - Animated numbers (count-up effect)
  - Mock data that updates every few seconds for demo
- **Feature Highlights:**
  - 3-4 cards explaining core features
  - Icons, short descriptions, "Learn More" links
- **How It Works:**
  - 3-step process visualization
  - Animated flow diagram
- **CTA Footer:**
  - "Join the Network" with gradient button
  - Link to guilds and hunters directories

**Technical Requirements:**

- Framer Motion for animations
- Intersection Observer for scroll animations
- Responsive design (mobile-first)
- Performance optimized (lazy loading)

**Mock Data Needed:**

- Stats: total bounties, guilds, credits staked, success rate

**Deliverables:**

- ✅ Fully functional home page
- ✅ All animations working smoothly
- ✅ Mobile responsive
- ✅ Fast loading (<2s)

### 2.2 Guilds Directory (`/guilds`)

**Layout:**

- **Header:**
  - Page title with subtitle
  - Search bar (filters guilds by name)
  - Filter panel (rank, category, member count)
  - Sort dropdown (trust, success rate, value cleared)
- **Guild Grid/List:**
  - Card view: 3-4 columns on desktop, 1-2 on mobile
  - Each card shows:
    - Guild avatar with rank-colored glow
    - Name and rank badge
    - Trust score with visual indicator
    - Success rate percentage
    - Member count
    - "View Profile" button
  - Pagination or infinite scroll
- **Sidebar (Desktop):**
  - Top 10 guilds mini-leaderboard
  - Featured guild of the week
  - Quick stats about guild ecosystem

**Advanced Features:**

- **Live Ranking Animation:** Numbers update with transitions
- **Filter Combinations:** Multiple filters work together
- **Empty States:** Helpful messages when no results

**Mock Data:**

- 20-30 diverse guilds with varied stats
- Different specializations and ranks
- Realistic names and avatars

**Deliverables:**

- ✅ Functional guild directory
- ✅ Working filters and search
- ✅ Responsive cards
- ✅ Smooth animations

### 2.3 Guild Detail Page (`/guilds/[id]`)

**Layout Structure:**

- **Hero Header:**
  - Full-width banner image (parallax effect)
  - Guild avatar (large) with glowing border
  - Guild name, rank badge, trust score
  - "Apply to Join" button (for logged-in users)
  - Quick stats row: Members | Success Rate | Total Value
- **Navigation Tabs:**
  - Overview | Members | Missions | Analytics
- **Overview Tab:**
  - About section (guild description)
  - Formation date and founders
  - Specializations tags
  - Current officers
- **Data Visualization Dashboard:**
  - **Power Level Radar Chart:**
    - 5-6 dimensions (Speed, Quality, Reliability, Communication, Fairness)
    - Recharts RadarChart component
    - Animated on scroll-into-view
  - **Trust Score Evolution:**
    - Line chart showing 30/90/365 day trends
    - Recharts LineChart with gradient fill
    - Hover to see exact values
  - **Category Expertise:**
    - Horizontal bar chart
    - Shows guild's success rate by bounty category
  - **Activity Heatmap:**
    - Grid showing hour-by-day activity
    - Color intensity based on mission count
- **Members Tab:**
  - Table/grid of all members
  - Columns: Avatar, Name, Rank, Role, Join Date, Missions Completed
  - Sortable columns
  - Click member to view their profile
- **Missions Tab:**
  - Timeline of recent completed bounties
  - Status badges, rewards, outcomes
  - Pagination for history
- **Analytics Tab:**
  - Deep dive stats
  - Comparative analysis vs platform average
  - Performance trends

**Technical:**

- Dynamic route with `[id]` parameter
- Recharts for all visualizations
- Responsive grid layouts
- Tab state management

**Mock Data:**

- Detailed guild profiles for 5-10 guilds
- Member lists (10-50 members each)
- Mission history (20-100 missions)
- Time-series data for charts

**Deliverables:**

- ✅ Complete guild profile page
- ✅ All charts rendering with animation
- ✅ Tab navigation working
- ✅ Responsive on all devices

### 2.4 Hunters/Adventurers Directory (`/hunters`)

**Similar to Guilds Directory:**

- Search and filter by rank, skills, availability
- Grid of hunter cards
- Sort by trust score, completion count
- Click to view individual profiles

**Hunter Card:**

- Avatar with rank glow
- Username and rank badge
- Current guild affiliation
- Trust score gauge
- Top 3 skills
- "View Profile" button

**Sidebar:**

- Top 10 hunters leaderboard
- Skill popularity cloud (visual tag cloud)
- Hunter of the month spotlight

**Deliverables:**

- ✅ Hunter directory page
- ✅ Working filters
- ✅ Profile links

### 2.5 Hunter Profile Page (`/hunters/[id]`)

**Layout:**

- **Profile Header:**
  - Large avatar with animated rank border
  - Username, rank tier, current guild
  - Trust score with circular gauge
  - Skill tags below name
- **Stats Overview:**
  - Grid of key metrics (missions completed, success rate, avg rating)
  - Mini charts for trends
- **Achievement Badges:**
  - Visual collection of earned badges
  - Hover for badge descriptions
  - Locked/unlocked states
- **Activity Timeline:**
  - Vertical timeline of recent missions
  - Date, bounty title, outcome, reward
- **Endorsements Section:**
  - Testimonials from clients and guild members
  - Rating stars
- **Performance Charts:**
  - Success rate by category (bar chart)
  - Trust score trend (line chart)
  - Completion time distribution (histogram)

**Deliverables:**

- ✅ Complete hunter profile
- ✅ All visualizations working
- ✅ Responsive design

### 2.6 About Page (`/about`)

**Content Sections:**

- **Hero:** Platform mission statement
- **Philosophy:**
  - "No Single Source of Truth" explained
  - Community governance principles
  - Trust through decentralization
- **How It Works:**
  - Visual flowchart (can use Mermaid or custom SVG)
  - Step-by-step process
- **Team (Optional):** About the creators
- **Vision:** Future roadmap hints

**Deliverables:**

- ✅ Informative about page
- ✅ Visual explanations
- ✅ On-brand styling

### 2.7 Features Page (`/features`)

**Interactive Feature Showcase:**

- Grid of feature cards (6-8 features)
- Each card expandable for details
- Features to highlight:
  - Guild System
  - Staking Mechanism
  - AI-Assisted Matching
  - Community Tribunals
  - Reputation Economy
  - Real-time Chat
  - Advanced Analytics
  - Transparent Governance
- Icons, short descriptions, expandable details
- Example scenarios for each feature

**Deliverables:**

- ✅ Feature showcase page
- ✅ Interactive elements
- ✅ Clear explanations

### 2.8 Contact Page (`/contact`)

**Simple Contact Form:**

- Fields: Name, Email, Category (dropdown), Subject, Message
- Client-side validation with Zod
- Form submission (initially mock, later connect to API)
- Success/error toast notifications

**Additional Elements:**

- **FAQ Accordion:**
  - 10-15 common questions
  - Expandable answers
- **Social Links:**
  - GitHub, Twitter/X, Discord icons
- **Support Email:** Display contact email

**Deliverables:**

- ✅ Functional contact form
- ✅ FAQ section
- ✅ Validation working

---

## Phase 3: Authentication & User System (Week 2-3)

**Objective:** Implement user registration, login, and basic profile management. Enable access to protected routes.

### 3.1 NextAuth.js Setup

**Configuration:**

- Install NextAuth.js v5
- Configure providers:
  - Credentials provider (email/password)
  - Optional: Google OAuth, GitHub OAuth
- Set up session management with JWT
- Create API routes for auth
- Environment variables for secrets

**Database Integration:**

- MongoDB connection setup with Mongoose
- User model definition:
  ```typescript
  User {
    id: ObjectId
    email: string (unique)
    password: string (hashed with bcrypt)
    username: string (unique)
    avatar?: string
    bio?: string
    skills: string[]
    rank: Enum (E, D, C, B, A, S)
    trustScore: number
    credits: number
    stakedCredits: number
    guildId?: ObjectId (ref Guild)
    guildRole?: Enum (Master, Officer, Veteran, Member, Initiate)
    clientReputation: number
    hunterReputation: number
    createdAt: Date
    updatedAt: Date
    lastActive: Date
  }
  ```

**Pages to Create:**

- `/login` - Login form
- `/register` - Registration form
- `/auth/verify-email` - Email verification (optional)
- `/auth/reset-password` - Password reset flow

**Middleware:**

- Protect authenticated routes
- Redirect logic (logged-in users away from login page)

**Deliverables:**

- ✅ Working authentication
- ✅ User registration
- ✅ Session management
- ✅ Protected routes

### 3.2 User Profile Management

**Settings Page (`/settings`):**

- Tab-based interface:
  - Profile: Edit avatar, username, bio, skills
  - Account: Change email/password
  - Notifications: Email and app notification preferences
  - Display: Theme customization
  - Privacy: Visibility settings
  - Security: Active sessions, login history
- Form validation with Zod
- Image upload for avatar (Cloudinary integration)

**Profile Page (`/profile` or `/me`):**

- Shows current user's public profile
- Same layout as hunter profile page
- Edit button linking to settings

**Deliverables:**

- ✅ Settings page with all tabs
- ✅ Profile editing working
- ✅ Image upload functional
- ✅ Validation on all forms

---

## Phase 4: Protected Pages - Frontend Build (Week 3-4)

**Objective:** Build all authenticated user pages with mock data, establishing complete user flows before backend integration.

### 4.1 Dashboard (`/dashboard`)

**Layout Components:**

- **Top Bar:**
  - User avatar, name, rank badge
  - Quick stats: Credits, Trust, Active Tasks
  - Notification bell with count
  - Mode toggle: Hunter ↔ Client
- **Hunter Mode Widgets:**
  - Active Missions Panel (3-4 cards)
  - Guild Status Widget (guild info + chat preview)
  - Personal Stats (trust trend mini chart)
  - Available Opportunities (recommended bounties)
  - Recent Activity Feed
- **Client Mode Widgets:**
  - Posted Bounties Panel (status cards)
  - Applications from Guilds
  - Pending Reviews
  - Post New Bounty CTA
  - Client Reputation Widget
- **Shared Elements:**
  - Platform news ticker
  - Quick links grid
  - Help/tutorial widget

**Technical:**

- Dynamic widget rendering based on mode
- State management for mode toggle
- Mock data for all sections
- Responsive grid layout

**Deliverables:**

- ✅ Complete dashboard
- ✅ Mode switching functional
- ✅ All widgets rendering
- ✅ Responsive design

### 4.2 Analytics Page (`/analytics`)

**For Hunters:**

- Trust score evolution chart (line, 365 days)
- Success rate by category (grouped bar)
- Earnings breakdown (pie chart)
- Completion time comparison (box plot or bar)
- Skill usage heatmap
- Comparative stats table (you vs guild vs platform)
- AI-generated improvement suggestions panel

**For Clients:**

- Bounty analytics (completion time, cost trends)
- Guild interaction history (most used guilds)
- Satisfaction ratings given (distribution)
- Market insights (average prices by category)

**Mode Toggle:** Switch between Hunter and Client analytics

**Technical:**

- Recharts for all visualizations
- Responsive charts (adapt to screen size)
- Interactive tooltips and legends
- Data aggregation logic (mock for now)

**Deliverables:**

- ✅ Complete analytics page
- ✅ Both modes implemented
- ✅ All charts rendering
- ✅ Interactive features working

### 4.3 History Page (`/history`)

**Features:**

- **Timeline View:** Chronological activity log
- **Filters:**
  - Date range picker
  - Activity type (bounties, disputes, guild, tribunal, stake)
  - Status (success, failed, pending)
  - Sort by date/value/impact
- **Activity Cards:**
  - Icon based on type
  - Title and description
  - Date/time
  - Outcome and impact on trust/credits
  - "View Details" expandable
- **Pagination:** 20 items per page
- **Export:** Button to download as CSV (mock for now)

**Deliverables:**

- ✅ History timeline
- ✅ Filtering working
- ✅ Expandable details
- ✅ Responsive

### 4.4 Payments/Vault Page (`/payments`)

**Sections:**

- **Balance Dashboard:**
  - Large display of available credits
  - Staked/locked credits with breakdown
  - Pending earnings
  - Lifetime earnings counter
  - Quick action buttons (Stake, Withdraw)
- **Transaction Ledger:**
  - Table: Date | Type | Amount | Balance | Status
  - Filters: Type, date range
  - Search by transaction ID
  - Pagination
- **Staking Dashboard:**
  - Active stakes list (bounty collateral, tribunal participation)
  - Expected returns and risk assessment
  - Stake/Unstake interface
- **Financial Charts:**
  - Income vs expenses over time (line chart)
  - Staking performance (ROI chart)
  - Credit flow visualization (sankey diagram)

**Deliverables:**

- ✅ Complete vault page
- ✅ Transaction history
- ✅ Staking interface
- ✅ Charts rendering

### 4.5 Guild Page (`/guild`)

**Conditional Rendering:**

- If user not in guild: CTA to join or create guild
- If user in guild: Full guild management interface

**Guild Management Interface:**

- **Overview Tab:**
  - Guild profile summary
  - Quick stats (rank, trust, treasury, members)
  - Announcements panel
- **Comm-Link Tab:**
  - Real-time chat interface (Pusher or polling)
  - Channels: General, Missions, Strategy
  - Message input with @mentions
  - Emoji support
  - Online member list sidebar
- **Members Tab:**
  - Full roster table
  - Columns: Avatar, Name, Rank, Role, Contribution, Status
  - Sortable
  - Actions (for officers): Promote, Demote, Kick
- **Missions Tab:**
  - Active bounties board
  - Assignment interface (for Guild Master)
  - Progress tracking for each mission
- **Treasury Tab (Officers only):**
  - Balance and stake allocation
  - Transaction history
  - Withdrawal interface (multi-sig for GM)
- **Settings Tab (GM only):**
  - Edit guild profile
  - Recruitment settings
  - Internal policies
  - Kick members

**Deliverables:**

- ✅ Full guild management
- ✅ Chat functional (basic version)
- ✅ Role-based access control
- ✅ All tabs complete

### 4.6 Bounties Marketplace (`/bounties`)

**Hunter/Guild View:**

- **Job Board:**
  - Grid of bounty cards
  - Each card: Title, category, reward, deadline, required rank
  - "View Details" button
- **Filters Sidebar:**
  - Category checkboxes
  - Reward range slider
  - Required rank
  - Location
  - Urgency
  - Posted date
- **Sort Dropdown:** Newest, highest reward, deadline, match score
- **AI Recommendations Panel:** Top 5 recommended bounties with match scores

**Bounty Detail Modal/Page:**

- Full description (markdown rendered)
- Requirements checklist
- Reward breakdown
- Client profile link and reputation
- Deadline countdown
- "Apply as Guild" button (for Guild Masters)

**Client View (Tab or Mode):**

- **My Bounties Dashboard:**
  - Tabs: Active, Completed, Disputed
  - List of posted bounties with status
  - Applications from guilds (if any)
  - "Review Submission" button
- **Post New Bounty:**
  - Multi-step form:
    1. Basic info (title, description, category)
    2. Requirements (rank, skills, location)
    3. Rewards (credits, reputation, stake)
    4. Review and publish
  - Draft saving
  - Preview before posting
  - Validation on each step

**Deliverables:**

- ✅ Job board with filters
- ✅ Bounty detail view
- ✅ Post bounty form
- ✅ My bounties dashboard

### 4.7 Messaging/Chat Page (`/messages`)

**Features:**

- **Conversation List (Left Sidebar):**
  - Guild chats
  - Direct messages
  - Dispute threads
  - Support tickets
  - Unread badges
  - Search conversations
- **Chat Interface (Main Area):**
  - Message thread (scrollable, reverse chronological)
  - Message input with formatting toolbar
  - Emoji picker
  - File/image upload
  - Message reactions
  - Typing indicators
- **Conversation Info (Right Sidebar):**
  - Participant list
  - Shared files
  - Settings (mute, archive)

**Technical:**

- Real-time updates (Pusher or polling)
- Optimistic UI updates
- Message pagination (load more)

**Deliverables:**

- ✅ Messaging interface
- ✅ Real-time chat (basic)
- ✅ File uploads
- ✅ Responsive

---

## Phase 5: Database Models & Backend Logic (Week 4-5)

**Objective:** Define all MongoDB schemas and implement core business logic for guilds, bounties, and rankings.

### 5.1 Database Schema Design

**Models to Define:**

**1. User Model** (already defined in Phase 3.1, expand if needed)

**2. Guild Model:**

```typescript
Guild {
  id: ObjectId
  name: string (unique)
  avatar: string (URL)
  banner: string (URL)
  description: string
  foundedAt: Date
  foundersIds: ObjectId[] (refs User)
  masterId: ObjectId (ref User)
  officerIds: ObjectId[] (refs User)
  memberIds: ObjectId[] (refs User)

  // Stats
  rank: Enum (Legendary, Elite, Veteran, Established, Developing)
  trustScore: number (0-1000)
  successRate: number (0-100)
  totalBountiesCompleted: number
  totalValueCleared: number
  disputeWinRate: number

  // Treasury
  treasuryBalance: number
  stakedAmount: number

  // Specializations
  categories: string[] (expertise areas)

  // Metadata
  updatedAt: Date
}
```

**3. Bounty Model:**

```typescript
Bounty {
  id: ObjectId
  clientId: ObjectId (ref User)

  // Content
  title: string
  description: string (markdown)
  category: string
  location?: { city: string, country: string, lat: number, lng: number }
  urgency: Enum (Low, Medium, High, Critical)

  // Economics
  rewardCredits: number
  reputationBonus: number
  clientStake: number (optional collateral)
  guildStakeRequired: number

  // Requirements
  minHunterRank: Enum
  minGuildTrust: number
  requiredSkills: string[]
  evidenceRequirements: string

  // Assignment
  acceptedByGuildId?: ObjectId (ref Guild)
  assignedHunterIds: ObjectId[] (refs User)
  guildStakeLocked: number

  // Submission
  proofOfWork?: { text: string, images: string[], links: string[] }
  submittedAt?: Date

  // Status
  status: Enum (Open, Matched, Accepted, InProgress, Submitted, UnderReview, Disputed, Completed, Failed, Cancelled)

  // Dispute
  disputeId?: ObjectId (ref Dispute)

  // Dates
  deadline: Date
  postedAt: Date
  completedAt?: Date
  updatedAt: Date
}
```

**4. Dispute Model:**

```typescript
Dispute {
  id: ObjectId
  bountyId: ObjectId (ref Bounty)
  clientId: ObjectId (ref User)
  guildId: ObjectId (ref Guild)

  // Evidence
  clientEvidence: { text: string, images: string[], links: string[] }
  guildEvidence: { text: string, images: string[], links: string[] }

  // Resolution Tier
  tier: Enum (Negotiation, AIArbiter, Tribunal)
  status: Enum (Open, Negotiating, AIAnalysis, InTribunal, Resolved)

  // AI Analysis
  aiSuggestion?: {
    ruling: Enum (ClientWins, GuildWins, Split)
    confidenceScore: number
    reasoning: string
    generatedAt: Date
    aiStake: number
  }

  // Tribunal
  tribunalJurors?: ObjectId[] (refs Guild)
  tribunalVotes?: { guildId: ObjectId, vote: Enum(ClientWins, GuildWins, Split), stakedAmount: number }[]

  // Outcome
  finalRuling?: Enum (ClientWins, GuildWins, Split)
  resolvedAt?: Date

  // Stakes
  clientStakeAtRisk: number
  guildStakeAtRisk: number

  createdAt: Date
  updatedAt: Date
}
```

**5. Message Model:**

```typescript
Message {
  id: ObjectId
  conversationId: string (composite: "guild-{guildId}" or "dm-{userId1}-{userId2}" or "dispute-{disputeId}")
  senderId: ObjectId (ref User)
  content: string
  attachments?: string[] (URLs)
  replyTo?: ObjectId (ref Message)
  reactions: { emoji: string, userIds: ObjectId[] }[]
  sentAt: Date
  editedAt?: Date
}
```

**6. Transaction Model:**

```typescript
Transaction {
  id: ObjectId
  userId?: ObjectId (ref User)
  guildId?: ObjectId (ref Guild)
  bountyId?: ObjectId (ref Bounty)
  disputeId?: ObjectId (ref Dispute)

  type: Enum (BountyReward, BountyStake, TribunalStake, DisputeWin, DisputeLoss, GuildDeposit, GuildWithdrawal, PassiveYield)
  amount: number (positive or negative)
  balanceAfter: number

  description: string
  createdAt: Date
}
```

**7. Activity Model (for history):**

```typescript
Activity {
  id: ObjectId
  userId: ObjectId (ref User)
  type: Enum (BountyPosted, BountyAccepted, BountyCompleted, DisputeRaised, DisputeResolved, GuildJoined, GuildLeft, TribunalVote, RankUp, RankDown)
  relatedBountyId?: ObjectId
  relatedGuildId?: ObjectId
  relatedDisputeId?: ObjectId
  description: string
  impactOnTrust: number
  impactOnCredits: number
  createdAt: Date
}
```

**Deliverables:**

- ✅ All Mongoose schemas defined
- ✅ TypeScript types generated
- ✅ Validation rules in place
- ✅ Indexes for query optimization

### 5.2 Core Backend Logic - Server Actions

**Implement Server Actions for:**

**User Operations:**

- `createUser(data)` - Registration
- `updateUserProfile(userId, data)` - Edit profile
- `updateUserSettings(userId, settings)` - Settings
- `getUserProfile(userId)` - Fetch profile
- `getUserStats(userId)` - Analytics data

**Guild Operations:**

- `createGuild(foundingMembers, name, stake)` - Form guild (validate requirements)
- `applyToGuild(userId, guildId)` - Application
- `acceptGuildApplication(guildId, userId)` - Approve member
- `leaveGuild(userId, guildId)` - Leave guild
- `promoteGuildMember(guildId, userId, newRole)` - Role change
- `kickGuildMember(guildId, userId)` - Remove member
- `getGuildProfile(guildId)` - Fetch guild data
- `getGuildMembers(guildId)` - Roster
- `getGuildStats(guildId)` - Analytics

**Bounty Operations:**

- `createBounty(clientId, bountyData)` - Post bounty
- `getOpenBounties(filters, sort)` - Job board
- `acceptBounty(guildId, bountyId)` - Guild accepts (stake logic)
- `assignHunters(bountyId, hunterIds)` - GM assigns
- `submitBountyProof(bountyId, hunterId, proof)` - Submit work
- `reviewBountySubmission(bountyId, clientId, accept: boolean)` - Client review
- `completeBounty(bountyId)` - Finalize success (distribute rewards, update ranks)

**Dispute Operations:**

- `raiseDispute(bountyId, clientId, evidence)` - Create dispute
- `submitDisputeEvidence(disputeId, party, evidence)` - Add evidence
- `requestAIAnalysis(disputeId)` - Trigger AI arbiter
- `acceptAIRuling(disputeId, party)` - Accept AI suggestion
- `escalateToTribunal(disputeId)` - Move to Tier 3
- `castTribunalVote(disputeId, jurorGuildId, vote, stake)` - Juror votes
- `resolveDispute(disputeId)` - Finalize outcome (distribute stakes, update ranks)

**Ranking & Trust Calculations:**

- `calculateUserTrustScore(userId)` - Recalc hunter trust
- `calculateGuildTrustScore(guildId)` - Recalc guild trust
- `updateGuildRank(guildId)` - Reassess guild tier
- `updateUserRank(userId)` - Reassess hunter rank
- `applyTrustDecay()` - Cron job to decay inactive accounts

**Messaging:**

- `sendMessage(conversationId, senderId, content)` - Post message
- `getMessages(conversationId, limit, offset)` - Fetch chat history
- `markMessagesRead(conversationId, userId)` - Update read status

**Deliverables:**

- ✅ All server actions implemented
- ✅ Validation with Zod on inputs
- ✅ Error handling and try-catch
- ✅ Transaction handling for critical operations
- ✅ MongoDB operations tested

### 5.3 Ranking Algorithm Implementation

**Trust Score Calculation (0-1000):**

**For Hunters:**

```
TrustScore =
  (SuccessRate * 300) +
  (CompletionCount / 100 * 200) +
  (AvgClientRating * 100) +
  (DisputeWinRate * 200) +
  (ActivityBonus * 100) +
  (GuildContribution * 100)
  - (DisputeLossPenalty)
```

**For Guilds:**

```
GuildTrustScore =
  (MissionSuccessRate * 300) +
  (AvgHunterTrust * 0.3 * 250) +
  (DisputeWinRate * 200) +
  (TotalValueCleared / 10000 * 150) +
  (CommunityParticipation * 100)
  - (FailurePenalty)
```

**Rank Tier Assignment:**

- Based on trust score thresholds
- Recalculated every 6 hours (cron job)
- Tracks rank changes for notifications

**Decay Logic:**

- Every 7 days of inactivity: -1% trust score
- Maximum decay: -20% over 6 months
- Activity resets decay counter

**Deliverables:**

- ✅ Trust score calculation functions
- ✅ Rank assignment logic
- ✅ Decay system implemented
- ✅ Scheduled jobs configured (cron or Vercel Cron)

---

## Phase 6: AI Integration (Week 5-6)

**Objective:** Integrate GroqCloud API for AI agents (Matchmaker, Arbiter, Oracle, Analytics).

### 6.1 GroqCloud Setup

**Configuration:**

- Sign up for GroqCloud free tier
- Get API key
- Store in environment variables
- Create utility functions for API calls
- Implement retry logic and error handling
- Rate limiting awareness

**API Wrapper:**

```typescript
// lib/ai/groq.ts
async function callGroq(
  prompt: string,
  model: string = "mixtral-8x7b-32768",
  options?: { temperature?: number; maxTokens?: number },
): Promise<string>;
```

### 6.2 Matchmaker Agent

**Function:** `matchBountyToGuilds(bountyId: string)`

**Process:**

1. Fetch bounty details (requirements, category, location)
2. Fetch all eligible guilds (meeting min requirements)
3. Construct prompt for LLM:
   - Bounty description
   - Guild profiles (trust, specializations, success rates)
   - Historical performance in similar bounties
4. Ask AI to rank top 5 guilds with reasoning
5. Parse AI response
6. Store match scores and reasoning
7. Return ranked list

**Prompt Template:**

```
You are a bounty-guild matching expert. Analyze the following bounty and rank the top 5 guilds most suitable to complete it.

Bounty:
- Title: {title}
- Category: {category}
- Requirements: {requirements}
- Reward: {reward}

Guilds:
{guildList with stats}

Provide a ranking with match scores (0-100) and brief reasoning for each.
```

**Deliverables:**

- ✅ Matchmaker function
- ✅ Prompt engineering optimized
- ✅ Response parsing
- ✅ Integration with bounty posting flow

### 6.3 Arbiter Agent

**Function:** `analyzeDispute(disputeId: string)`

**Process:**

1. Fetch dispute details (bounty requirements, submissions, evidence from both sides)
2. Construct comprehensive prompt:
   - Original bounty expectations
   - Hunter's submission and claims
   - Client's rejection reasoning
   - Evidence from both parties
   - Historical behavior patterns
3. Ask AI to:
   - Summarize the dispute
   - Identify key points of contention
   - Evaluate evidence quality
   - Suggest a fair ruling
   - Provide confidence score
4. Parse AI response
5. Store AI suggestion with reasoning
6. Simulate AI "staking" on its decision (credibility tracking)

**Prompt Template:**

```
You are an impartial dispute arbiter. Analyze this conflict and provide a fair ruling suggestion.

Bounty Details:
- Title: {title}
- Requirements: {requirements}
- Reward: {reward}

Guild Submission:
{proof of work}

Client's Dispute:
{client reasoning and evidence}

Guild's Defense:
{guild evidence}

Provide:
1. Summary of dispute
2. Key contention points
3. Evaluation of evidence
4. Suggested ruling: ClientWins | GuildWins | Split(X%)
5. Confidence score (0-100)
6. Reasoning (2-3 sentences)
```

**Deliverables:**

- ✅ Arbiter function
- ✅ Prompt template
- ✅ Response parsing with confidence score
- ✅ Integration with dispute flow

### 6.4 Oracle Agent (Monitoring)

**Function:** `detectAnomalies()`

**Process:**

1. Run periodically (daily cron job)
2. Analyze platform activity:
   - Unusual voting patterns in tribunals
   - Rapid trust score spikes (potential gaming)
   - Collusion indicators (same users/guilds always interacting)
   - Review bombing patterns
3. Construct prompt with suspicious activity data
4. AI identifies anomalies and assigns risk scores
5. Generate report for admin review
6. Flag accounts if high confidence

**Prompt Template:**

```
You are a platform integrity monitor. Analyze the following user/guild behaviors and identify potential fraud or gaming.

Activity Patterns:
{data on voting, transactions, interactions}

Identify:
1. Suspicious patterns
2. Risk scores for each entity
3. Recommended actions
```

**Deliverables:**

- ✅ Monitoring function
- ✅ Scheduled execution
- ✅ Alert system for admin
- ✅ Flagging logic

### 6.5 Analytics Agent

**Function:** `generatePersonalizedRecommendations(userId: string)`

**Process:**

1. Fetch user's history, current stats, preferences
2. Analyze performance patterns
3. Ask AI for:
   - Skills to develop
   - Bounty types to focus on
   - Improvement suggestions
   - Rank progression predictions
4. Return personalized insights

**Deliverables:**

- ✅ Recommendation function
- ✅ Integration with analytics page
- ✅ Caching for performance

---

## Phase 7: Real-time Features & Chat (Week 6)

**Objective:** Implement real-time chat and live updates using Pusher or Ably.

### 7.1 Pusher/Ably Setup

**Configuration:**

- Sign up for Pusher or Ably free tier
- Get API credentials
- Install client and server SDKs
- Configure channels and events

**Channels:**

- `guild-{guildId}` - Guild chat
- `dm-{userId1}-{userId2}` - Direct messages
- `dispute-{disputeId}` - Dispute threads
- `user-{userId}` - Personal notifications
- `platform-global` - Platform-wide announcements

### 7.2 Chat Implementation

**Backend:**

- `sendMessage` server action publishes to Pusher
- Message stored in database
- Pusher event sent to relevant channel

**Frontend:**

- Subscribe to channels on mount
- Listen for `new-message` events
- Update UI optimistically
- Handle typing indicators
- Scroll to bottom on new message

**Features:**

- Real-time message delivery
- Typing indicators
- Read receipts
- Message reactions
- File uploads

**Deliverables:**

- ✅ Real-time chat working
- ✅ All channels functional
- ✅ Performance optimized (disconnect when not in use)

### 7.3 Live Notifications

**Notification Types:**

- New bounty matched for guild
- Guild application accepted/rejected
- Bounty submission reviewed
- Dispute raised
- Tribunal voting started
- Rank changed
- Guild invite received

**Implementation:**

- Server actions emit events to user channels
- Frontend toast notifications
- Notification bell with count
- Notification center page (optional)

**Deliverables:**

- ✅ Notification system working
- ✅ Toast notifications
- ✅ Unread count tracking

---

## Phase 8: Demo Data Generation (Week 6-7)

**Objective:** Create realistic, diverse mock data for comprehensive testing and demonstration.

### 8.1 Data Generation Script

**Create Script:** `scripts/seed-database.ts`

**Data to Generate:**

**50 Users:**

- Diverse usernames and bios
- Varied ranks (E to S, normal distribution)
- Different skill sets
- Realistic trust scores
- Varied join dates (simulate history)
- Mix of active and inactive users

**10 Guilds:**

- Unique names (creative, sci-fi themed)
- Different specializations (Tech, Research, Local, Verification, Mixed)
- Varied sizes (5-50 members each)
- Different rank tiers (1-2 Legendary, 2-3 Elite, etc.)
- Diverse trust scores and success rates
- Realistic founding dates
- Custom avatars and banners

**100 Bounties:**

- Diverse categories and descriptions
- Mix of statuses (open, in progress, completed, disputed)
- Varied rewards (100 to 10,000 credits)
- Different urgency levels
- Some with evidence/submissions
- Realistic completion times

**20 Disputes:**

- Various stages (negotiation, AI analysis, tribunal, resolved)
- Different outcomes
- Evidence from both sides
- AI suggestions with reasoning
- Tribunal votes for resolved ones

**500 Messages:**

- Conversations across guild chats
- Direct messages between users
- Dispute thread messages
- Realistic timestamps and content

**1000 Transactions:**

- Bounty rewards, stakes, withdrawals
- Tribunal stakes and payouts
- Guild deposits
- Realistic amounts and dates

**500 Activities:**

- User and guild activity history
- Varied types
- Trust and credit impacts

**Deliverables:**

- ✅ Seed script creates all data
- ✅ Data is diverse and realistic
- ✅ Relationships consistent (foreign keys valid)
- ✅ Can be run repeatedly (clears old data first)

### 8.2 Demo Scenarios

**Create Predefined User Accounts for Demo:**

1. **Guild Master Account** - Leading guild, high rank
2. **Active Hunter** - Mid-rank, many completed missions
3. **New User** - Just joined, low rank, no guild
4. **Client Account** - Posted several bounties, good reputation
5. **Disputed User** - Involved in conflict, mixed history

**Demo Flow Documentation:**

- Step-by-step guide for demoing full lifecycle
- Screenshots of key pages
- Talking points for each feature

**Deliverables:**

- ✅ Demo accounts created
- ✅ Demo flow guide written

---

## Phase 9: Integration & Polish (Week 7)

**Objective:** Connect frontend to backend, fix bugs, optimize performance, polish UI.

### 9.1 Backend-Frontend Integration

**Replace Mock Data:**

- Dashboard: Fetch real user stats
- Guilds directory: Query from database
- Bounties marketplace: Real bounties
- Analytics: Calculate from actual data
- History: Fetch from activities table
- Payments: Real transactions

**API Routes:**

- Create API endpoints for all server actions
- Ensure proper error handling
- Add loading states to frontend

**Testing Each Feature:**

- User registration and login
- Guild creation and management
- Bounty posting and acceptance
- Hunter assignment and submission
- Dispute raising and resolution
- Chat and notifications
- Trust score calculations
- Ranking updates

**Deliverables:**

- ✅ All features connected to backend
- ✅ No more mock data (except for demo purposes)
- ✅ Error handling working
- ✅ Loading states everywhere

### 9.2 UI/UX Polish

**Consistency Check:**

- Uniform spacing and typography
- Consistent button styles
- Standardized color usage
- Icons aligned and sized consistently

**Animations:**

- Smooth transitions between pages
- Micro-interactions on hover/click
- Loading skeletons for async data
- Toast notifications styled properly

**Responsiveness:**

- Test on mobile, tablet, desktop
- Fix layout issues
- Ensure touch targets are adequate
- Mobile navigation optimized

**Accessibility:**

- Keyboard navigation working
- Focus indicators visible
- Alt text for images
- ARIA labels where needed
- Color contrast meets WCAG AA

**Performance:**

- Optimize images (next/image)
- Lazy load components
- Code splitting
- Minimize bundle size
- Lighthouse score > 90

**Deliverables:**

- ✅ Consistent design system applied
- ✅ All animations smooth
- ✅ Fully responsive
- ✅ Accessibility compliance
- ✅ Performance optimized

### 9.3 Error Handling & Edge Cases

**Comprehensive Testing:**

- What if guild has no members?
- What if bounty has no applicants?
- What if user has no history?
- What if AI API fails?
- What if database query errors?
- What if user tries invalid actions (e.g., accept own bounty)?

**Graceful Degradation:**

- Show empty states with helpful messages
- Fallback UI if charts fail to render
- Retry logic for failed requests
- Offline indicators

**Deliverables:**

- ✅ Edge cases handled
- ✅ Helpful error messages
- ✅ No console errors

---

## Phase 10: End-to-End System Testing (Week 8)

**Objective:** Comprehensive testing of all features and flows to ensure MVP success criteria are met.

### 10.1 Automated Testing (Optional but Recommended)

**Unit Tests:**

- Trust score calculation functions
- Ranking algorithms
- Validation schemas (Zod)
- Utility functions

**Integration Tests:**

- API routes and server actions
- Database operations
- AI integration functions

**E2E Tests (Playwright):**

- User registration and login
- Guild creation flow
- Bounty posting and acceptance
- Dispute resolution
- Chat functionality

**Deliverables:**

- ✅ Test coverage for critical paths
- ✅ CI/CD pipeline (GitHub Actions) optional

### 10.2 Manual Testing Scenarios

**Scenario 1: New User to Completed Mission**

1. Register new account
2. Browse guilds
3. Apply to join guild (or create own)
4. Get accepted
5. Browse bounties
6. Guild Master accepts bounty
7. Get assigned to bounty
8. Submit proof of work
9. Client reviews and confirms
10. Verify rewards distributed
11. Check trust score updated

**Scenario 2: Dispute Resolution - Full Flow**

1. Client posts bounty
2. Guild accepts and hunter completes
3. Client raises dispute
4. Both parties submit evidence
5. Tier 1: Negotiation (simulate failure)
6. Tier 2: AI arbiter analyzes and suggests
7. Party rejects AI suggestion
8. Tier 3: Tribunal voting
9. Jurors selected and vote
10. Dispute resolved
11. Verify stakes distributed correctly
12. Check trust scores updated

**Scenario 3: Guild Management**

1. Create new guild (validate requirements)
2. Invite members
3. Accept bounty as Guild Master
4. Assign hunters
5. Use guild chat
6. Promote member to officer
7. Manage treasury
8. View guild analytics

**Scenario 4: Client Journey**

1. Post bounty with detailed requirements
2. View AI-recommended guilds
3. Wait for guild to accept
4. Track progress
5. Review submission
6. Confirm completion
7. Rate guild/hunter
8. View payment history

**Scenario 5: Cross-Feature Integration**

1. User switches between hunter and client modes
2. Participates in tribunal while being in guild
3. Receives notifications across all activities
4. Views analytics showing combined reputation
5. Uses chat for both guild and disputes
6. Manages stakes across multiple activities

**Testing Checklist:**

- [ ] All public pages load correctly
- [ ] Authentication works (register, login, logout)
- [ ] Protected routes require auth
- [ ] Dashboard shows correct data for user
- [ ] Guild directory filters work
- [ ] Guild detail page charts render
- [ ] Hunter profiles display correctly
- [ ] Bounty posting form validates properly
- [ ] Guild can accept bounties and stake is locked
- [ ] Hunter assignment works
- [ ] Proof submission uploads correctly
- [ ] Client can review and confirm/dispute
- [ ] Dispute flow progresses through tiers
- [ ] AI arbiter generates analysis
- [ ] Tribunal voting distributes stakes correctly
- [ ] Trust scores recalculate after actions
- [ ] Rankings update on schedule
- [ ] Chat messages send and receive in real-time
- [ ] Notifications appear correctly
- [ ] Transaction history is accurate
- [ ] Settings page saves changes
- [ ] Mobile view works on all pages
- [ ] Performance is acceptable (<3s loads)
- [ ] No console errors
- [ ] Lighthouse score > 85

**Deliverables:**

- ✅ All scenarios tested and passing
- ✅ Bugs identified and fixed
- ✅ Test documentation completed

### 10.3 Performance & Security Audit

**Performance:**

- Run Lighthouse audits
- Check Core Web Vitals
- Optimize slow queries (add indexes)
- Implement caching where appropriate
- Minimize API calls

**Security:**

- Verify all API routes are protected
- Check for SQL/NoSQL injection vulnerabilities
- Ensure secrets not exposed
- CSRF protection enabled
- Rate limiting on auth endpoints
- Input sanitization everywhere

**Deliverables:**

- ✅ Performance optimizations applied
- ✅ Security audit passed
- ✅ No critical vulnerabilities

---

## Phase 11: Documentation & Deployment (Week 8)

### 11.1 Documentation

**Create:**

- **README.md:**
  - Project overview
  - Tech stack
  - Setup instructions (local development)
  - Environment variables list
  - Scripts and commands
  - Contribution guidelines (if open source)
- **API Documentation:**
  - List all server actions with parameters
  - Expected responses
  - Error codes
- **User Guide:**
  - How to use the platform
  - FAQ
  - Troubleshooting
- **Developer Guide:**
  - Code architecture
  - Database schema
  - AI integration details
  - Deployment process

**Deliverables:**

- ✅ Comprehensive documentation

### 11.2 Deployment to Production

**Pre-Deployment Checklist:**

- [ ] Environment variables configured on Vercel
- [ ] MongoDB Atlas cluster created and connected
- [ ] GroqCloud API key added
- [ ] Pusher/Ably credentials set
- [ ] NextAuth secret generated
- [ ] Domain configured (if using custom domain)
- [ ] CORS settings configured
- [ ] Analytics setup (Vercel Analytics)

**Deployment Steps:**

1. Push code to GitHub main branch
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy to production
5. Run database seed script on production DB
6. Test production deployment
7. Monitor logs for errors

**Post-Deployment:**

- Verify all features work on live site
- Check SSL certificate
- Test from different devices
- Share with stakeholders

**Deliverables:**

- ✅ Production site live and functional
- ✅ Custom domain (optional)
- ✅ Monitoring configured

---

## Phase 12: Final Demo & Handoff (Week 8)

### 12.1 Demo Preparation

**Create Demo Presentation:**

- Slide deck explaining GuildLancer concept
- Walkthrough of key features
- Live demo flow
- Metrics and success criteria review
- Future roadmap preview

**Demo Accounts:**

- Credentials for different user types
- Pre-populated data for impressive demo

**Deliverables:**

- ✅ Demo presentation ready
- ✅ Practice run completed

### 12.2 Stakeholder Demo

**Demo Flow:**

1. Platform overview (home page)
2. Guild leaderboard with charts
3. Guild detail page with analytics
4. User journey: Register → Join guild → Accept bounty
5. Dispute resolution demonstration
6. AI arbiter in action
7. Admin view of platform health
8. Mobile responsiveness showcase

**Feedback Collection:**

- Gather stakeholder feedback
- Note feature requests
- Identify improvements

**Deliverables:**

- ✅ Successful stakeholder demo
- ✅ Feedback documented

### 12.3 Handoff & Next Steps

**Deliverables:**

- ✅ Codebase on GitHub
- ✅ Documentation complete
- ✅ Production site live
- ✅ Admin access shared
- ✅ Maintenance plan outlined

**Future Enhancements (Post-MVP):**

- Blockchain integration
- Real cryptocurrency support
- Mobile native apps
- Advanced ML for fraud detection
- Multi-language support
- Video/audio evidence for bounties
- NFT achievement badges
- Third-party API integrations
- Advanced analytics dashboards
- Community voting on platform features

---

## Summary Timeline

| Week | Phase                             | Key Deliverables                                                     |
| ---- | --------------------------------- | -------------------------------------------------------------------- |
| 1    | Foundation & Public Pages         | Project setup, design system, home, guilds, about, features, contact |
| 2    | Auth & Protected Pages (Frontend) | Authentication, dashboard, analytics, history                        |
| 3    | Protected Pages (Frontend cont.)  | Payments, guild, bounties, messaging, settings                       |
| 4    | Database & Backend                | All schemas, server actions, ranking logic                           |
| 5    | AI Integration                    | Matchmaker, Arbiter, Oracle, Analytics agents                        |
| 6    | Real-time & Demo Data             | Chat, notifications, seed database                                   |
| 7    | Integration & Polish              | Connect frontend to backend, UI polish, accessibility                |
| 8    | Testing & Deployment              | End-to-end testing, production deployment, demo                      |

**Total Estimated Timeline: 8 weeks** (adjustable based on team size and pace)

---

## Technologies Checklist

- [x] Next.js 14+ with App Router
- [x] TypeScript
- [x] Tailwind CSS
- [x] Shadcn/ui
- [x] Framer Motion
- [x] Recharts
- [x] MongoDB Atlas
- [x] Mongoose
- [x] NextAuth.js
- [x] Zod
- [x] GroqCloud (Llama 3 / Mixtral)
- [x] Pusher or Ably
- [x] Cloudinary (optional)
- [x] Vercel (deployment)

---

## Success Criteria Recap

✅ **Platform deployed** and accessible
✅ **User registration** working seamlessly
✅ **5+ guilds formed** with proper requirements
✅ **End-to-end bounty lifecycle** functional
✅ **Dispute resolution** through all 3 tiers working
✅ **AI agents** all operational and accurate
✅ **Real-time chat** with live updates
✅ **Data visualizations** rendering beautifully
✅ **Mobile responsive** on all devices
✅ **Performance** optimized (<3s page loads)
✅ **Security** audit passed
✅ **Documentation** comprehensive

---

## Risk Mitigation

**Potential Risks & Solutions:**

1. **Risk:** AI API rate limits or downtime
   - **Mitigation:** Implement fallback logic, cache results, use rule-based matching as backup

2. **Risk:** Real-time chat performance issues
   - **Mitigation:** Implement pagination, message limits, polling fallback

3. **Risk:** Complex ranking algorithm bugs
   - **Mitigation:** Extensive unit tests, manual verification with demo data, adjustable weights

4. **Risk:** MongoDB free tier limits exceeded
   - **Mitigation:** Monitor usage, implement data cleanup scripts, optimize queries

5. **Risk:** Scope creep
   - **Mitigation:** Stick to MVP features, document future enhancements separately, regular reviews

6. **Risk:** Authentication vulnerabilities
   - **Mitigation:** Use battle-tested NextAuth.js, follow security best practices, regular audits

---

## Final Notes

- **Prioritize user experience:** Smooth animations, clear messaging, intuitive flows
- **Test frequently:** Don't wait until the end to test features
- **Document as you go:** Update docs when you implement features
- **Seek feedback early:** Show prototypes to users/stakeholders
- **Stay focused on MVP:** Resist adding non-essential features
- **Celebrate milestones:** Acknowledge progress at each phase completion

**The goal is to prove the system works**, demonstrate the trust-driven governance model, and showcase the potential of community-managed bounty platforms. ✨- **Dashboard (`/dashboard`)**

- User's personal "Cockpit".
- Summary widgets: Current Rank, Wallet Balance, Pending Tasks.
- **Profile Settings (`/settings`)**
  - Edit bio, avatar, skills.
- **Anaylytics**
- **History (`/history`)**
  - Log of all past interactions (Bounties posted/completed).
- **Wallet / Vault / Payments (`/finance`)**
  - View simulated "Credits".
  - View "Staked" assets.

## Phase 3: Guild Mechanics

_Goal: Allow users to organize into functional units._

### 1. Guild Logic

- **Create Guild Flow:**
  - Check requirements (Min X Adventurers, Min Rank).
  - Form used to Invite members during creation.
  - Staking deposit interface.
- **Guild Management (Private):**
  - **Comm-Link:** Integrated chat for members (Basic text feed stored in DB).
  - **Roster Management:** Promote/Kick members.

## Phase 4: The Bounty Engine

_Goal: The core loop of work._

### 1. Bounty Creation

- Form for Clients to post tasks.
- Requirements input (Rank required, Reward amount).
- Optional: Add Staking requirement for the Guild.

### 2. Marketplace & Assignment

- **Job Board:** Filterable list of open bounties.
- **Acceptance Logic:** Guild Master accepts bounty -> Bounty moves to "Active".
- **Internal Assignment:** Guild Master selects specific member(s) for the job.

### 3. Submission & Completion

- Hunter submits "Proof of Work" (Text field + URL).
- Client reviews and clicks "Confirm" (Funds release) or "Dispute".

## Phase 5: Governance & AI

_Goal: Implement the "Community Managed" aspects._

### 1. Dispute System

- **Dispute UI:** Chat-like interface between Client and Guild.
- **AI Arbiter:**
  - Integrate GroqCloud API.
  - System reads dispute context and posts a "Suggested Ruling" comment automatically.
- **Tribunal (Voting):**
  - If unresolved, other high-ranking Guilds can vote on the outcome.
  - **Staking Logic:** Code to slash stake from loser and distribute to winner/voters.

## Phase 6: Demo data

Add demo data for using which we can test and demonstrate full flow and data must be different and diverse for guilds and hunters.

## Phase 6: System Testing

_Goal: Verify end-to-end functionality._

### 1. Simulation

- Create multiple dummy accounts.
- Form 2-3 Guilds.
- Run a full cycle:
  1. User A posts Bounty.
  2. Guild B accepts.
  3. Hunter C (in Guild B) submits work.
  4. User A disputes.
  5. AI analyzes.
  6. Resolution enforced + Credits transferred.
