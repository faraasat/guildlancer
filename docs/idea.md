# GuildLancer

You are building an MVP for a guild-based, trust-driven task resolution system (for now no blockchain). The goal is to demonstrate how community-governed organizations (“guilds”) can coordinate people (“bounty hunters”) to solve real-world problems with accountability, incentives, and measurable trust.

## 1. Core Idea

Build a **guild-centric marketplace** where tasks (called “bounties”) are posted by users and solved by **guilds**, not by isolated individuals.

- Individuals (“bounty hunters”) belong to guilds.
- Guilds are responsible for accepting, executing, and resolving bounties.
- Trust, reliability, and community behavior determine economic and operational power.
- The system emphasizes **coordination, governance, and reputation**, not just payments.

This MVP focuses on **system logic and incentives**, not on full-scale payments or legal enforcement.

## 2. Actors in the System

### A. Clients (Task Creators)

- Can post bounties with:
  - Title
  - Description
  - Category (lost & found, verification, information gathering, local assistance, etc.)
  - Location (optional)
  - Bounty amount (simulated currency for MVP)
  - Urgency level

- Can view which guild accepts their bounty.
- Can submit feedback or disputes after completion.

### B. Bounty Hunters (Individuals)

- Represent real people who execute tasks.
- Belong to **only one guild at a time**.
- Have:
  - Skill tags
  - Personal rank
  - Reliability score
  - Mission history

- Cannot accept bounties directly; all work flows through guilds.
- Can be recruited by other guilds via **contract transfer offers** (not “buying”).

### C. Guilds (Core Entity)

- Act as the primary operational and trust unit.
- Have:
  - Name and description
  - Members (bounty hunters)
  - Guild rank
  - Mission history
  - Trust score

- Accept or reject bounties.
- Assign hunters to missions.
- Handle disputes internally before escalation.

Guild reputation is impacted by **collective performance**, not just individual actions.

## 3. Bounty Lifecycle

1. Client creates a bounty.
2. System recommends suitable guilds using AI or rule-based matching.
3. A guild accepts the bounty.
4. The guild assigns one or more hunters.
5. Task is marked completed.
6. Client confirms or raises a dispute.
7. System updates:
   - Guild rank
   - Hunter rank
   - Trust metrics

## 4. Ranking & Trust System (Logic-Heavy)

### Guild Rank (Composite Score)

Calculated using weighted factors such as:

- Mission success rate
- Average completion time
- Dispute resolution outcomes
- Average hunter reliability
- Community contribution
- Penalties for failed or disputed missions

Guild rank directly affects:

- Visibility
- Eligibility for higher-value bounties
- Trust score shown to clients

### Hunter Rank

Based on:

- Missions completed
- Skill match accuracy
- Reliability (show-up rate, task quality)
- Dispute involvement
- Guild performance impact

Hunter rank influences:

- Assignment priority
- Recruitment offers from other guilds

## 5. Contract Transfer / Recruitment System

Instead of “buying” hunters:

- Guilds can make **contract offers** to hunters from other guilds.
- Offers include:
  - Signing bonus (simulated)
  - Contract duration
  - Guild benefits

- Hunters may accept or reject.
- When accepted:
  - Hunter moves to new guild
  - Old guild’s rank recalculates automatically

This creates realistic competition between guilds without unethical framing.

## 6. Dispute Resolution System

- Clients can raise disputes after task completion.
- Evidence (text, images, logs) can be submitted.
- Guild attempts resolution first.
- If unresolved, system escalates to community or AI-assisted review.

AI assistance may:

- Summarize dispute context
- Suggest fair outcomes
- Detect fraud or abuse patterns

Final decisions impact:

- Guild trust score
- Hunter rank
- Future eligibility

## 7. AI Responsibilities (Non-Cosmetic)

AI is used as **decision support**, not authority.

Use AI for:

- Matching bounties to guilds based on skills, location, rank, and history
- Assisting dispute analysis
- Detecting reputation manipulation or anomalous behavior
- Explaining why a guild or hunter was selected or penalized

All AI outputs should be explainable in plain language.

## 8. Scope Constraints (Important)

For this MVP:

- No blockchain
- No real money transfers (use simulated currency)
- No diagrams required
- Focus on:
  - Core logic
  - Trust computation
  - Workflow automation
  - Clear data models

The goal is to **prove the system works**, not to ship a production marketplace.

## 9. Success Criteria

The MVP is successful if:

- A bounty can be created, accepted, completed, and ranked
- Guilds visibly differ in trust and rank
- Hunter movement affects guild strength
- Disputes affect future outcomes
- The system demonstrates fairness, accountability, and scalability

## 10. Output Expectations

When implementing or generating code:

- Prioritize clarity over completeness
- Use mock data where needed
- Keep components modular
- Make ranking logic explicit and configurable
