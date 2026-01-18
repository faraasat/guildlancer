# Implementation Roadmap

This document outlines the step-by-step implementation plan for GuildLancer.

## Phase 1: Public Frontend Foundation (The "Sci-Fi Shell")

_Goal: Establish the visual identity, routing, and public information pages._

### 1. Project Setup

- Initialize Next.js project with TypeScript and Tailwind CSS.
- Configure `shadcn/ui` and color palette (Neon/Dark Mode).
- Set up MongoDB connection helper.

### 2. Public Pages

- **Home Page (`/`)**
  - Hero section with "Web3/Sci-Fi" typography.
  - Live stats ticker (Total Bounties, Active Guilds, Total Staked).
  - Call to Action: "Initialize Link" (Login/Signup).
- **Guilds Directory (`/guilds`)**
  - **Leaderboard:** Table/List sorted by Trust Score.
  - **Detail View (`/guilds/[id]`):**
    - Visual Guild Profile (Banner, Logo).
    - **Data Visualization:** Use Recharts to show:
      - "Power Level" (Radar Chart: Speed, Quality, Reliability).
      - "History" (Line Chart: Trust Score over time).
    - Member Roster list.
- **Adventurers (`/hunters`)**
  - List of top individual hunters.
  - Public Profile view with Skill Tags and Rank badges.
- **About / Protocols (`/about`)**
  - Static page explaining the "No Single Source of Truth" philosophy.
- **Feature Overview (`/features`)**
  - Explanation of Staking, Bounties, and Guild logic.
- **Contact (`/contact`)**
  - Simple form for inquiries.

## Phase 2: Authentication & User Core

_Goal: Enable user onboarding and individual profiles._

### 1. Auth Infrastructure

- Implement NextAuth.js.
- Create Login/Register pages.
- Define User Model (Hunter/Client unified).

### 2. Protected User Pages

- **Dashboard (`/dashboard`)**
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
