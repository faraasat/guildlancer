# Minimum Viable Product (MVP) Scope - GuildLancer

## Core Concept

GuildLancer is a **decentralized, community-managed, trust-driven bounty resolution platform** with a Web3/Sci-Fi aesthetic. The platform operates without a single source of truth - instead, governance emerges from Guilds and AI Agents that stake resources, earn reputation, and participate in collective decision-making.

**Key Paradigm Shift:** Rather than a centralized authority making final decisions, the platform uses:

- **Staking mechanisms** where guilds put "skin in the game"
- **AI Agents** as decision support (not decision makers)
- **Community tribunals** for conflict resolution
- **Reputation systems** that decay without activity
- **Economic incentives** aligned with truthful behavior

## Platform Philosophy: Community-Managed Consensus

### No Single Source of Truth

- Decisions emerge from consensus between multiple stakeholders
- Guilds stake funds to participate in dispute resolution and earn rewards
- AI Agents analyze data but humans (community) make final calls
- Reputation and staking create economic alignment with honesty
- Multiple verification layers prevent single-point manipulation

### Staking Economy

- **Guilds stake** to accept high-value bounties (collateral against failure)
- **AI Agents stake** to participate in automated decision-making
- **Tribunal members stake** to vote on disputes
- **Rewards distributed** to honest actors; slashed from bad actors
- Creates skin-in-the-game for all participants

## Unified Account System

- **Single Identity:** One account serves dual roles:
  - **Client:** Post bounties, request solutions
  - **Hunter:** Join guilds, solve bounties
- **Universal Profile:** Unified reputation tracking across both roles
- **Flexible Role Switching:** Users can be clients and hunters simultaneously
- **Separate Metrics:** Client reputation (payment reliability, fair disputes) and Hunter reputation (task completion, quality)

## Key Features

### 1. Guild System

#### Guild Formation Rules

A Guild can only be formed when ALL requirements are met:

- **Minimum Members:** 5 Adventurers (founding members)
- **Rank Requirements:**
  - At least 1 member with Rank A (Guild Master candidate)
  - At least 2 members with Rank B or higher (Officers)
  - Remaining members must be Rank C or higher
- **Initial Stake:** 10,000 Credits deposited to Guild Treasury
- **Formation Vote:** All founding members must unanimously approve
- **Naming Rules:** Unique guild name, 3-50 characters, appropriate content
- **Cooldown:** Members who leave a guild cannot join another for 7 days

#### Guild Hierarchy

- **Guild Master (1):** Full control, accepts bounties, assigns tasks, manages treasury
- **Officers (2-5):** Can assign tasks, moderate chat, recruit members
- **Veterans (unlimited):** Experienced members, priority task assignment
- **Members (unlimited):** Standard hunters
- **Initiates (unlimited):** New members, restricted bounty access

#### Guild Profile & Metrics

- **Visual Identity:**
  - Custom avatar and banner (sci-fi themed)
  - Guild "card" with holographic effect
  - Animated rank badge
  - Color-coded trust level indicator
- **Core Metrics:**
  - **Trust Score (0-1000):** Composite reputation metric
  - **Power Rating:** Visual "power level" indicator (anime-style)
  - **Success Rate (%):** Completed vs failed bounties
  - **Average Completion Time:** Performance metric
  - **Dispute Win Rate (%):** Conflict resolution success
  - **Total Value Cleared:** Sum of completed bounty rewards
  - **Active Members:** Current roster size
  - **Guild Age:** Days since formation
- **Advanced Analytics:**
  - Trust score trend (30/90 day charts)
  - Category expertise radar chart (e.g., Tech 90%, Social 60%)
  - Member contribution distribution
  - Peak performance hours heatmap
  - Stake utilization ratio

#### Guild Ranking System

**Dynamic Leaderboard** calculated every 6 hours based on weighted factors:

- Mission success rate (30%)
- Average trust score (25%)
- Dispute resolution outcomes (20%)
- Total value cleared (15%)
- Community contributions (5%)
- Activity level (5%)

**Rank Tiers:**

- **Legendary (Top 1%):** Gold aura, exclusive bounties
- **Elite (Top 5%):** Purple aura, high-value bounties
- **Veteran (Top 15%):** Blue aura, standard bounties
- **Established (Top 40%):** Green aura, basic bounties
- **Developing (All others):** White, starter bounties

### 2. Hunter (Adventurer) System

#### Individual Hunter Ranks

Based on personal performance, independent of guild:

- **S-Rank:** Elite (1000+ trust, <2% failure)
- **A-Rank:** Expert (800+ trust, <5% failure)
- **B-Rank:** Professional (600+ trust, <10% failure)
- **C-Rank:** Competent (400+ trust, <20% failure)
- **D-Rank:** Novice (200+ trust)
- **E-Rank:** Beginner (0+ trust)

#### Hunter Profile Features

- **Public Stats:**
  - Individual rank and trust score
  - Skills tags (AI, Research, Verification, etc.)
  - Completion count and success rate
  - Current guild affiliation
  - Specialization categories
- **Achievement Badges:** Visual indicators for milestones
- **Activity Timeline:** Recent mission history
- **Endorsements:** Peer recommendations from clients/guilds

### 3. Bounty Management System

#### Bounty Creation (Client Side)

Clients can post tasks with:

- **Basic Info:**
  - Title (10-100 characters)
  - Detailed description (markdown support)
  - Category selection (Lost & Found, Verification, Research, Local Tasks, Tech Support, etc.)
  - Location (optional, with privacy levels)
  - Urgency level (Low, Medium, High, Critical)
- **Economic Terms:**
  - Reward amount (Credits)
  - Reputation bonus points
  - Client stake requirement (optional collateral)
  - Deadline for completion
- **Requirements:**
  - Minimum hunter rank
  - Minimum guild trust score
  - Required skills/specializations
  - Geographic constraints (if applicable)
- **Evidence Requirements:** What proof of completion is needed

#### Bounty Lifecycle States

1. **Open:** Posted, awaiting guild acceptance
2. **Matched:** AI suggested guilds, pending review
3. **Accepted:** Guild committed, stake locked
4. **In Progress:** Hunter(s) assigned and working
5. **Submitted:** Proof of work provided
6. **Under Review:** Client evaluating submission
7. **Disputed:** Conflict raised, resolution in progress
8. **Completed:** Success, rewards distributed
9. **Failed:** Not completed, stake slashed
10. **Cancelled:** Withdrawn before acceptance

#### Assignment & Execution

- **Guild-Only Access:** Only guilds can accept bounties
- **Internal Assignment:** Guild Master assigns specific hunter(s)
- **Multi-Hunter Tasks:** Support for team assignments
- **Progress Updates:** Hunters can post status updates
- **Submission Interface:** Upload proof (text, images, links, files)

### 4. Staking & Economic Model

#### Staking Mechanisms

- **Guild Bounty Stakes:**
  - Guilds stake % of bounty value when accepting (e.g., 20%)
  - Stake locked until completion or dispute resolution
  - Returned on success, slashed on failure/fraud
- **Tribunal Stakes:**
  - Guilds stake to participate as jurors in disputes
  - Earn rewards for correct voting
  - Lose stake for voting with minority (anti-gaming)
- **AI Agent Stakes:**
  - AI decision support system stakes on its suggestions
  - Earns trust points when suggestions accepted
  - Loses credibility when overruled

#### Credit Economy (Simulated)

- **Credits:** Standard platform currency
  - Earned by completing bounties
  - Earned by correct tribunal voting
  - Earned by staking in resolution pool (passive yield)
- **Reputation (Trust Points):** Non-transferable
  - Earned through successful completions
  - Earned through dispute resolution victories
  - **Decay System:** Loses 1% per week if inactive
  - Cannot be bought or sold
- **Treasury Management:**
  - Guild treasury holds collective funds
  - Multi-sig withdrawals (requires Officer approval)
  - Stake allocation tracking

### 5. Conflict Resolution System

#### Three-Tier Dispute Resolution

**Tier 1: Direct Negotiation (48 hours)**

- Client and Guild chat to resolve
- Evidence can be submitted by both parties
- Platform facilitates but doesn't intervene
- Resolution rate: ~60%

**Tier 2: AI Arbiter Analysis (24 hours)**

- **AI Agent analyzes:**
  - Bounty requirements vs submission quality
  - Historical behavior of both parties
  - Evidence provided by each side
  - Similar past disputes and outcomes
- **AI provides:**
  - Detailed analysis summary
  - Suggested ruling with confidence score
  - Reasoning breakdown
  - Risk assessment
- **Parties can:**
  - Accept AI suggestion (auto-resolve)
  - Reject and escalate to Tier 3
- **AI Stakes:** System stakes on its suggestion accuracy

**Tier 3: Community Tribunal (72 hours)**

- **Jury Selection:**
  - 7 guilds randomly selected from high-trust pool
  - Cannot be involved party
  - Must stake 500 Credits to participate
- **Voting Process:**
  - Each juror reviews full case file
  - Votes: Client wins / Guild wins / Split resolution
  - Anonymous voting to prevent coordination
  - Weighted by juror guild trust score
- **Resolution:**
  - Majority vote determines outcome
  - Winning side receives opponent's stake
  - Correct-voting jurors split reward pool
  - Minority voters lose their stake (prevents collusion)
- **Appeals:** Not allowed (finality)

#### Dispute Outcomes

- **Stake Distribution:**
  - Winner receives opponent's stake + original reward
  - Tribunal jurors split 20% of total disputed amount
  - Platform takes 5% for treasury (future community projects)
- **Reputation Impact:**
  - Loser: -50 to -200 trust points
  - Winner: +20 to +50 trust points
  - Jurors: +10 for correct vote, -30 for wrong vote
- **Future Consequences:**
  - Multiple lost disputes = reduced bounty access
  - Pattern of bad disputes = account review
  - Excellent dispute record = priority matching

### 6. AI Integration & Decision Support

#### AI Agent Roles

**1. Matchmaker Agent**

- Analyzes new bounties against guild capabilities
- Considers: skills, location, workload, success history, trust level
- Ranks top 5 suitable guilds with match scores
- Provides reasoning for each match

**2. Arbiter Agent**

- Dispute analysis and preliminary ruling
- Evidence evaluation and contradiction detection
- Sentiment analysis of communication
- Risk scoring for fraudulent behavior
- Generates detailed ruling suggestions with confidence scores

**3. Oracle Agent (Monitoring)**

- Continuous platform activity analysis
- Anomaly detection (reputation gaming, collusion patterns)
- Identifies suspicious voting patterns in tribunals
- Flags accounts for review
- Generates weekly platform health reports

**4. Analytics Agent**

- Personalized recommendations for users
- Trust score prediction and improvement suggestions
- Market trends analysis (popular bounty types)
- Guild performance forecasting

#### AI Transparency Principles

- All AI decisions are explainable in plain language
- Confidence scores shown for every suggestion
- Users can view reasoning behind matches/rulings
- AI never has final authority - humans decide
- Open about limitations and uncertainty

## User Flows & Interface Requirements

### Public Pages (No Authentication Required)

#### 1. Home Page (`/`)

- **Hero Section:**
  - Animated sci-fi typography with glitch effects
  - Tagline: "Guildified Trust. Community Governance. Boundless Opportunities."
  - Particle background animation
- **Live Network Stats Ticker:**
  - Total active bounties (real-time counter)
  - Active guilds count
  - Total credits staked
  - Successful resolutions today
  - Platform trust health meter
- **Feature Highlights:** 3-4 key value props with animated cards
- **CTA Buttons:** "Enter Network" (Login/Signup), "Explore Guilds"

#### 2. Guilds Directory (`/guilds`)

- **Leaderboard View:**
  - Sortable table/grid: Trust Score, Success Rate, Total Value, Members
  - Filter by: Rank tier, specialization, location, stake size
  - Search by guild name
  - Pagination with infinite scroll option
- **Guild Cards:** Holographic card design with:
  - Guild avatar with animated border (rank-based color)
  - Name, rank tier badge
  - Quick stats: Trust score, success rate, members
  - "View Profile" CTA
- **Advanced Metrics Panel:**
  - Top guilds by category (radar chart)
  - Guild growth trends (line chart)
  - Geographic distribution map
  - Most active guilds this week

#### 3. Guild Detail Page (`/guilds/[id]`)

- **Header Section:**
  - Large banner image with glassmorphism overlay
  - Guild avatar, name, rank badge
  - Key stats in HUD-style displays
  - "Apply to Join" button (if logged in)
- **Performance Dashboard:**
  - **Power Level Chart:** Radar chart showing:
    - Speed (completion time)
    - Quality (client satisfaction)
    - Reliability (success rate)
    - Communication
    - Dispute handling
  - **Trust Evolution:** Line chart of trust score over time (30/90/365 days)
  - **Category Expertise:** Bar chart of specializations
  - **Activity Heatmap:** When guild is most active
- **Member Roster:**
  - Searchable/sortable list
  - Shows rank, role, join date, contribution score
  - Click to view member profile
- **Recent Missions:** Last 10 completed bounties with outcomes
- **Guild Stats Table:** Detailed metrics breakdown

#### 4. Hunters/Adventurers Directory (`/hunters`)

- **Top Hunters Leaderboard:**
  - Ranked by trust score
  - Filter by: Rank tier, skills, availability, guild affiliation
  - Hunter cards with avatars, rank badges, key stats
- **Skill Cloud:** Visual representation of most common skills on platform
- **Click to Profile:** View individual hunter details

#### 5. Hunter Profile Page (`/hunters/[id]`)

- **Profile Header:**
  - Avatar with rank-tier glow effect
  - Username, rank badge, current guild
  - Trust score with visual gauge
  - Skill tags
- **Performance Metrics:**
  - Success rate gauge
  - Completion count milestone progress
  - Average rating from clients
  - Dispute record
- **Activity Timeline:** Recent missions with outcomes
- **Achievement Badges:** Visual collection of earned badges
- **Endorsements:** Comments from clients and guild members

#### 6. About Page (`/about`)

- **Platform Philosophy:** "No Single Source of Truth" explanation
- **How It Works:** Visual step-by-step flow
- **Community Governance:** Explanation of staking and tribunals
- **AI Transparency:** How AI assists (but doesn't control)
- **Mission Statement:** Building trust through decentralization

#### 7. Features Page (`/features`)

- **Interactive Feature Cards:**
  - Guild System
  - Staking Mechanism
  - AI-Assisted Matching
  - Community Tribunals
  - Reputation Economy
  - Real-time Analytics
- Each with detailed explanation, benefits, and visual demos

#### 8. Contact Page (`/contact`)

- **Contact Form:**
  - Name, Email, Subject, Message
  - Category selection (Support, Partnership, Feedback, Press)
- **Social Links:** GitHub, Twitter/X, Discord
- **FAQ Section:** Common questions with expandable answers

---

### Authenticated Pages (Login Required)

#### 1. Dashboard (`/dashboard`)

**Personal Command Center** - User's main HUD after login

**Layout Sections:**

- **Top Bar:**
  - User avatar and name
  - Current rank badge
  - Quick stats: Credits, Trust Score, Active Tasks
  - Notification bell
- **Role Toggle:** Switch view between Hunter and Client modes

**Hunter Mode View:**

- **Active Missions Panel:**
  - Cards for each assigned bounty
  - Progress status, deadline countdown
  - Quick action buttons (Update, Submit)
- **Guild Status Widget:**
  - Current guild name and rank
  - Guild chat preview (last 3 messages)
  - "Open Comm-Link" button
- **Personal Stats Overview:**
  - Trust score trend (mini line chart)
  - Completion rate
  - Earnings this month
  - Rank progress bar
- **Available Opportunities:**
  - New bounties matching skills
  - Guild recruitment offers
  - Recommended missions

**Client Mode View:**

- **Posted Bounties Panel:**
  - List of own bounties with status
  - Applications from guilds
  - Review pending submissions
- **Quick Actions:**
  - "Post New Bounty" prominent button
  - Draft bounties
- **Client Reputation Widget:**
  - Payment reliability score
  - Average rating from guilds
  - Dispute record

**Shared Widgets:**

- **Recent Activity Feed:** Combined timeline of all actions
- **Platform News:** Announcements, system updates
- **Quick Links:** Jump to frequently used pages

#### 2. Analytics Page (`/analytics`)

**Deep Performance Insights**

**For Hunters:**

- **Performance Metrics:**
  - Trust score evolution (interactive line chart)
  - Success rate by category (bar chart)
  - Earnings breakdown (pie chart by bounty type)
  - Completion time averages (comparison to guild/platform avg)
- **Skill Analysis:**
  - Most used skills
  - Skill demand vs your expertise (gap analysis)
  - Recommended skill development
- **Comparative Stats:**
  - Your rank vs guild average
  - Position in global leaderboard
  - Percentile rankings
- **Predictions:**
  - AI-generated improvement suggestions
  - Estimated time to next rank
  - Earning potential forecast

**For Clients:**

- **Bounty Analytics:**
  - Average completion time by category
  - Cost analysis and spending trends
  - Success rate of posted bounties
- **Guild Interaction History:**
  - Most used guilds
  - Satisfaction ratings given
  - Dispute patterns
- **Market Insights:**
  - Average bounty prices by category
  - Response time trends
  - Best times to post bounties

#### 3. History Page (`/history`)

**Complete Activity Log**

- **Filterable Timeline:**
  - All bounties (posted/accepted/completed)
  - Disputes participated in
  - Guild changes
  - Tribunal votes
  - Stake transactions
- **Filter Options:**
  - Date range
  - Activity type
  - Status (success/failed/disputed)
  - Sort by date/value/impact
- **Detailed View:** Click any item for full details
- **Export Options:** Download history as CSV/PDF

#### 4. Payments/Vault Page (`/payments` or `/vault`)

**Financial Management Hub**

- **Balance Overview:**
  - Available Credits (large display)
  - Staked/Locked Credits
  - Pending earnings
  - Total lifetime earnings
- **Transaction History:**
  - Detailed ledger with filters
  - Type: Earned, Spent, Staked, Slashed, Withdrawn
  - Status and timestamps
- **Staking Dashboard:**
  - Active stakes (bounty collateral, tribunal participation)
  - Expected returns
  - Risk assessment
  - Stake/Unstake actions
- **Withdrawal System:**
  - (For MVP: simulated, shows history)
  - Withdrawal history and status
- **Financial Analytics:**
  - Income vs expenses chart
  - Staking performance
  - ROI calculations

#### 5. Guild Management (`/guild`)

**Guild-Specific Hub** (only if user is in a guild)

**For All Members:**

- **Guild Overview:**
  - Guild profile summary
  - Current rank and trust score
  - Treasury balance
  - Member count
- **Comm-Link (Chat):**
  - Real-time guild chat
  - Channels: General, Missions, Strategy
  - @mentions and notifications
  - File/image sharing
  - Pinned messages
- **Member Directory:**
  - Full roster with roles
  - Member stats and contributions
  - Activity status (online/offline/on mission)
- **Active Missions Board:**
  - All guild's current bounties
  - Assignment status
  - Progress updates from hunters

**For Guild Master/Officers:**

- **Management Panel:**
  - Accept/reject bounty applications
  - Assign hunters to missions
  - Promote/demote members
  - Kick members (with confirmation)
- **Treasury Management:**
  - View all transactions
  - Stake allocation
  - Withdrawal requests (multi-sig)
- **Recruitment:**
  - Pending applications
  - Make offers to hunters from other guilds
  - Set recruitment criteria
- **Guild Settings:**
  - Edit profile (banner, description)
  - Set internal policies
  - Configure notification preferences

#### 6. Bounties Page (`/bounties`)

**Marketplace for Missions**

**For Hunters/Guilds:**

- **Job Board:**
  - Grid/list view of open bounties
  - Advanced filters:
    - Category
    - Reward range
    - Required rank
    - Location
    - Urgency
    - Posted date
  - Sort by: Newest, Highest reward, Deadline, Match score
- **AI Recommendations:**
  - "Recommended for You" section
  - Match score with explanation
  - Success probability estimate
- **Bounty Detail View:**
  - Full description
  - Requirements and constraints
  - Reward breakdown
  - Client reputation
  - Time remaining
  - "Apply as Guild" button (Guild Master only)

**For Clients:**

- **Post New Bounty:**
  - Multi-step form with validation
  - Draft saving
  - Preview before posting
- **My Bounties Dashboard:**
  - Active, completed, disputed tabs
  - Applications from guilds
  - Review submissions
  - Raise disputes

#### 7. Chat/Messaging Page (`/messages`)

**Communication Hub**

- **Conversation List:**
  - Guild chats
  - Direct messages with other users
  - Dispute chat threads
  - Support tickets
  - Unread count badges
- **Chat Interface:**
  - Real-time messaging
  - Rich text formatting
  - Image/file uploads
  - Emoji reactions
  - Message search
- **Notification Settings:** Customize alerts per conversation

#### 8. Settings Page (`/settings`)

**User Configuration**

**Tabs/Sections:**

- **Profile:**
  - Edit avatar (upload or choose default)
  - Username, bio, location
  - Skill tags management
  - Social links
  - Privacy settings (profile visibility)
- **Account:**
  - Email and password change
  - Two-factor authentication (optional)
  - Account deletion (with warnings)
- **Notifications:**
  - Email preferences
  - In-app notification toggles
  - Sound/desktop notifications
- **Display:**
  - Theme customization (color accents)
  - Animation toggle (accessibility)
  - Data density (compact/comfortable)
- **Privacy:**
  - Location sharing settings
  - Activity visibility
  - Who can contact you
- **Security:**
  - Active sessions
  - Login history
  - Trusted devices

#### 9. Profile Page (`/profile` or `/me`)

**Personal Public Profile**

- Shows how your profile appears to others
- Same structure as hunter profile page
- Edit button to jump to settings
- Share profile link

---

### Additional Page Requirements

#### Admin/Moderation Pages (Future)

- Platform-wide analytics dashboard
- Flagged content review
- User account management
- System health monitoring

#### Help/Support Pages

- Knowledge base / FAQ
- Tutorial videos or walkthroughs
- Community guidelines
- Terms of service & privacy policy

## Success Metrics for MVP

### Technical Success Criteria

1. ✅ **Platform Deployment:** Live on Vercel with custom domain
2. ✅ **User Registration:** 50+ test accounts created successfully
3. ✅ **Guild Formation:** At least 5 distinct guilds formed meeting all requirements
4. ✅ **Complete Bounty Lifecycle:** End-to-end flow working:
   - Client posts bounty
   - AI matches guilds
   - Guild accepts and stakes
   - Hunter assigned and completes
   - Client confirms
   - Rewards distributed
   - Trust scores updated
5. ✅ **Dispute Resolution:** At least 2 disputes resolved through full 3-tier system
6. ✅ **AI Integration:** All 4 AI agents functioning (Matchmaker, Arbiter, Oracle, Analytics)
7. ✅ **Real-time Features:** Chat working with live updates
8. ✅ **Data Visualization:** All charts rendering with real data
9. ✅ **Mobile Responsive:** Full functionality on mobile devices
10. ✅ **Performance:** Page load times < 3 seconds, animations smooth

### Functional Success Criteria

1. ✅ **Trust System:** Scores accurately calculate based on actions
2. ✅ **Staking Logic:** Funds correctly locked/released/slashed
3. ✅ **Ranking Algorithm:** Guild and hunter ranks update properly
4. ✅ **Role Duality:** Single account can post and solve bounties
5. ✅ **Hunter Movement:** Guild transfers affect both guilds' metrics
6. ✅ **Decay System:** Trust scores decrease for inactive accounts
7. ✅ **Tribunal Voting:** Community resolution works with proper incentives
8. ✅ **AI Transparency:** All AI decisions explainable and visible

### Business/Product Success Criteria

1. ✅ **User Engagement:** Average session duration > 10 minutes
2. ✅ **Retention:** 60%+ of users return within 7 days
3. ✅ **Guild Activity:** Average 3+ bounties per guild per week
4. ✅ **Dispute Rate:** < 10% of bounties result in disputes
5. ✅ **Resolution Success:** 80%+ disputes resolved without tribunal
6. ✅ **System Trust:** Platform-wide average trust score > 600
7. ✅ **Market Balance:** Supply/demand ratio of guilds to bounties between 0.5-2.0

### Quality Criteria

1. ✅ **Code Quality:** TypeScript with minimal 'any' types, comprehensive comments
2. ✅ **UI/UX:** Consistent sci-fi theme across all pages, intuitive navigation
3. ✅ **Accessibility:** WCAG 2.1 AA compliance for core features
4. ✅ **Documentation:** All API routes and components documented
5. ✅ **Error Handling:** Graceful degradation, clear error messages
6. ✅ **Security:** No exposed secrets, input validation everywhere

### Demo Requirements

For stakeholder presentation, must demonstrate:

1. New user signup → join/create guild → accept bounty → complete mission
2. Dispute raising → AI analysis → tribunal voting → resolution
3. Guild leaderboard with live ranking changes
4. Hunter profile with animated statistics
5. Admin view of platform health metrics
6. AI agent explaining a decision in plain language

### Out of Scope (Post-MVP)

- Real blockchain integration
- Actual cryptocurrency payments
- Mobile native apps
- Video/audio content for bounties
- Advanced analytics ML models
- Multi-language support
- API for third-party integrations
- NFT badges for achievements
