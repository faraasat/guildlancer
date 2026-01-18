# Minimum Viable Product (MVP) Scope - GuildLancer

## Core Concept

GuildLancer is a community-managed, trust-driven bounty marketplace with a Web3/Sci-Fi aesthetic. It replaces central authority with Guilds and AI Agents that use reputation and "staking" (simulation of funds/trust) to govern the platform. There is no single source of truth; consensus is achieved through dispute resolution and trusted history.

## Unified Account System

- **Single Identity:** A user has one account which can function as a **Client** (creating bounties) and a **Hunter** (solving bounties).
- **Universal Profile:** Tracks reputation for both roles simultaneously.

## Key Features

### 1. Guild System

- **Formation Rules:**
  - A Guild requires a minimum of **X Adventurers** (e.g., 3 members).
  - Founding members must meet a minimum **Rank Threshold** (e.g., Rank C or higher).
  - Requires a "Stake" (Simulated Currency) to initialize.
- **Guild Profile:**
  - **Visuals:** Avatar, Banner, "Card" style stats.
  - **Metrics:** Trust Score, Dispute Win Rate, Total Bounty Value Cleared.
  - **Roster:** List of members with their hierarchy (Guild Master, Officers, Hunters).
- **Ranking:** Dynamic leaderboard based on performance, dispute resolution, and community staking.

### 2. Bounty Management

- **Creation:** Clients post tasks with:
  - Title, Description, Rewards (Credits + Reputation).
  - Staking requirements (optional collateral).
- **Assignment:**
  - **Guild-Only:** Bounties are accepted by Guilds, not individuals.
  - **Internal Dispatch:** Guild Masters assign specific Hunters to the task.
- **Submission:** Hunters submit proof of work (text/image/links).

### 3. Staking & Conflict Resolution

- **Staking Mechanism:**
  - Guilds must "stake" (lock) a portion of their Treasury to accept high-value bounties.
  - Used as collateral against failure or malicious behavior.
- **Dispute Protocol:**
  - If a Client rejects work, a **Conflict** is raised.
  - **AI Agents** analyze the evidence first to suggest a ruling.
  - **Community Tribunal:** If the AI suggestion is contested, other Guilds (jury) vote on the outcome.
  - **Outcome:** The losing party loses their stake; the winning party and the jury (for correct voting) earn the stake.

### 4. Economy (Simulated)

- **Credits:** Standard currency for Bounty payments.
- **Reputation (Trust):** Non-transferable score that decays over time if inactive.
- **Staking Yield:** Keeping funds staked in the resolution pool earns passive yield (simulated) to encourage governance participation.

### 5. AI Integration

- **Agent Roles:**
  - **Matchmaker:** Recommends Guilds for Bounties.
  - **Arbiter:** Provides preliminary analysis on disputes.
  - **Oracle:** Monitors platform activity for "Anomaly Detection" (cheating/collusion).

## User Flows

### Visitor (Public)

- View the "State of the Network" (Home).
- Browse the "Guild Leaderboard" (Ranking) with complex charts.
- Read "Protocols" (About/Features).

### Logged In (Dashboard)

- **Personal HUD:** Overview of Rank, Credits, Active Missions.
- **Guild Comm-Link:** Private chat/group for Guild members.
- **Mission Control:**
  - Clients: Track posted bounties.
  - Hunters: Track assigned tasks.
- **Vault:** Transaction history, staking status, payments.
- **Settings:** Profile customization, notification preferences.

## Success Metrics for MVP

1. Successful formation of at least 3 distinct Guilds.
2. End-to-end completion of a Bounty (Post -> Accept -> Assign -> Submit -> Pay).
3. Successful resolution of a simulated Dispute utilizing the staking mechanism.
4. AI "Arbiter" successfully generating a meaningful dispute summary.
