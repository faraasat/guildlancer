// scripts/seed-database.ts
// Main script to generate realistic demo data

import { connectDB } from "../lib/db/mongodb";
import { User } from "../lib/db/models/User";
import Guild from "../lib/db/models/Guild";
import Bounty from "../lib/db/models/Bounty";
import Dispute from "../lib/db/models/Dispute";
import Message from "../lib/db/models/Message";
import Transaction from "../lib/db/models/Transaction";
import Activity from "../lib/db/models/Activity";
import {
  randomInt,
  randomElement,
  randomElements,
  weightedRandom,
  randomPastDate,
  RANK_WEIGHTS,
  SKILLS,
  BOUNTY_CATEGORIES,
  GUILD_TYPES,
  generateUsername,
  generateBountyTitle,
  generateBountyDescription,
  generateGuildDescription,
  generateUserBio,
  generateUserAchievements,
  generateMessage,
  generateActivity,
  hashPassword,
  DEMO_ACCOUNTS,
} from "./seed/generators";

/**
 * Clear all existing data
 */
async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");

  await User.deleteMany({});
  await Guild.deleteMany({});
  await Bounty.deleteMany({});
  await Dispute.deleteMany({});
  await Message.deleteMany({});
  await Transaction.deleteMany({});
  await Activity.deleteMany({});

  console.log("✓ Database cleared");
}

/**
 * Generate users
 */
async function generateUsers(): Promise<any[]> {
  console.log("\n👤 Generating users...");

  const users: any[] = [];

  // Create demo accounts first with realistic stats
  for (const demoAccount of DEMO_ACCOUNTS) {
    let completedQuests = 0;
    let hunterReputation = 0;
    let credits = 1000;

    // Set realistic stats based on rank
    switch (demoAccount.rank) {
      case "Rookie":
        completedQuests = randomInt(0, 3);
        hunterReputation = randomInt(0, 50);
        credits = randomInt(500, 1500);
        break;
      case "Veteran":
        completedQuests = randomInt(10, 15);
        hunterReputation = randomInt(200, 400);
        credits = randomInt(2000, 5000);
        break;
      case "Elite":
        completedQuests = randomInt(30, 40);
        hunterReputation = randomInt(1000, 1800);
        credits = randomInt(5000, 10000);
        break;
      case "Master":
        completedQuests = randomInt(75, 90);
        hunterReputation = randomInt(3500, 4500);
        credits = randomInt(15000, 25000);
        break;
    }

    const user = await User.create({
      username: demoAccount.username,
      email: demoAccount.email,
      password: await hashPassword(demoAccount.password),
      rank: demoAccount.rank,
      trustScore: demoAccount.trustScore,
      completedQuests,
      hunterReputation,
      credits,
      skills: randomElements(SKILLS, randomInt(2, 5)),
      bio: generateUserBio(demoAccount.rank, randomElements(SKILLS, 2)),
      joinedAt: randomPastDate(180),
      lastActive: randomPastDate(7),
      achievements: generateUserAchievements(demoAccount.rank, demoAccount.trustScore, completedQuests, credits),
    });
    users.push(user);
  }

  // Generate 45 more random users (total 50)
  for (let i = 0; i < 45; i++) {
    const rank = weightedRandom(RANK_WEIGHTS);
    const skills = randomElements(SKILLS, randomInt(2, 6));

    // Trust score and stats based on rank (realistic progression)
    let trustScore = 60;
    let completedQuests = 0;
    let hunterReputation = 0;
    
    switch (rank) {
      case "Rookie":
        trustScore = randomInt(50, 65);
        completedQuests = randomInt(0, 5);
        hunterReputation = randomInt(0, 100);
        break;
      case "Veteran":
        trustScore = randomInt(65, 75);
        completedQuests = randomInt(5, 20);
        hunterReputation = randomInt(100, 500);
        break;
      case "Elite":
        trustScore = randomInt(75, 85);
        completedQuests = randomInt(20, 50);
        hunterReputation = randomInt(500, 2000);
        break;
      case "Master":
        trustScore = randomInt(85, 92);
        completedQuests = randomInt(50, 100);
        hunterReputation = randomInt(2000, 5000);
        break;
      case "Legendary":
        trustScore = randomInt(92, 100);
        completedQuests = randomInt(100, 200);
        hunterReputation = randomInt(5000, 10000);
        break;
    }

    const user = await User.create({
      username: generateUsername(),
      email: `user${i}@demo.nexora.com`,
      password: await hashPassword("demo123"),
      rank,
      trustScore,
      completedQuests,
      hunterReputation,
      credits: randomInt(completedQuests * 100, completedQuests * 500),
      skills,
      bio: generateUserBio(rank, skills),
      joinedAt: randomPastDate(365),
      lastActive: randomPastDate(30),
      achievements: generateUserAchievements(rank, trustScore, completedQuests, randomInt(completedQuests * 100, completedQuests * 500)),
    });

    users.push(user);
  }

  console.log(`✓ Created ${users.length} users`);
  return users;
}

/**
 * Generate guilds
 */
async function generateGuilds(users: any[]): Promise<any[]> {
  console.log("\n🏰 Generating guilds...");

  const guilds: any[] = [];

  for (const guildType of GUILD_TYPES) {
    // Select a high-rank user as guild master
    const potentialMasters = users.filter(
      (u) => u.rank === "Master" || u.rank === "Expert" || u.rank === "Legendary"
    );
    const guildMaster = randomElement(potentialMasters);

    // Select members (5-20 per guild)
    const memberCount = randomInt(5, 20);
    const members = randomElements(
      users.filter((u) => u._id.toString() !== guildMaster._id.toString()),
      memberCount
    ).map((user) => ({
      userId: user._id,
      role: randomElement(["Member", "Member", "Member", "Officer"]),
      joinedAt: randomPastDate(180),
    }));

    // Add guild master
    members.unshift({
      userId: guildMaster._id,
      role: "GuildMaster",
      joinedAt: randomPastDate(365),
    });

    const guild = await Guild.create({
      name: guildType.name,
      description: generateGuildDescription(guildType.name, guildType.specialization),
      categories: [guildType.specialization],
      masterId: guildMaster._id,
      foundersIds: [guildMaster._id],
      officerIds: members.filter(m => m.role === 'Officer').map(m => m.userId),
      memberIds: members.filter(m => m.role === 'Member').map(m => m.userId),
      rank: randomElement(['Developing', 'Established', 'Veteran'] as const),
      trustScore: randomInt(700, 950),
      successRate: randomInt(75, 98),
      totalBountiesCompleted: randomInt(10, 100),
      totalValueCleared: randomInt(50000, 500000),
      disputeWinRate: randomInt(60, 95),
      treasuryBalance: randomInt(10000, 100000),
      stakedAmount: randomInt(5000, 50000),
      foundedAt: randomPastDate(730),
    });

    // Update member user documents with guildId and guildRole
    for (const member of members) {
      await User.findByIdAndUpdate(member.userId, {
        guildId: guild._id,
        guildRole: member.role === 'GuildMaster' ? 'Guild Master' : 
                   member.role === 'Officer' ? 'Elite Hunter' : 'Hunter'
      });
    }

    guilds.push(guild);
  }

  console.log(`✓ Created ${guilds.length} guilds`);
  return guilds;
}

/**
 * Generate bounties
 */
async function generateBounties(users: any[], guilds: any[]): Promise<any[]> {
  console.log("\n💰 Generating bounties...");

  const bounties: any[] = [];
  const statuses = [
    { value: "Open", weight: 15 },
    { value: "InProgress", weight: 25 },
    { value: "UnderReview", weight: 15 },
    { value: "Completed", weight: 35 },
    { value: "Disputed", weight: 10 },
  ];

  for (let i = 0; i < 100; i++) {
    const category = randomElement(BOUNTY_CATEGORIES);
    const title = generateBountyTitle(category);
    const description = generateBountyDescription(title);
    const status = weightedRandom(statuses);
    const reward = randomInt(500, 10000);

    const client = i < DEMO_ACCOUNTS.length ? users.find(u => u.email === DEMO_ACCOUNTS[i].email) : randomElement(users);
    const postedDate = randomPastDate(120);
    const daysToDeadline = randomInt(15, 60);
    const deadline = new Date(postedDate.getTime() + daysToDeadline * 24 * 60 * 60 * 1000);
    
    const bountyData: any = {
      title,
      description,
      category,
      rewardCredits: reward,
      reputationBonus: Math.floor(reward / 10),
      guildStakeRequired: Math.floor(reward * 0.1),
      clientStake: Math.floor(reward * 0.2),
      requiredSkills: randomElements(SKILLS, randomInt(1, 4)),
      evidenceRequirements: "Full source code, documentation, and a live demo link are required.",
      minHunterRank: randomElement(['Rookie', 'Veteran', 'Elite', 'Master'] as const),
      minGuildTrust: randomInt(0, 500),
      status,
      urgency: randomElement(["Low", "Medium", "High", "Critical"]),
      clientId: client._id,
      assignedHunterIds: [],
      guildStakeLocked: 0,
      postedAt: postedDate,
      deadline,
    };

    // Add guild and progress based on status
    if (status !== "Open") {
      const guild = randomElement(guilds);
      bountyData.acceptedByGuildId = guild._id;
      bountyData.acceptedAt = new Date(postedDate.getTime() + randomInt(1, 3) * 24 * 60 * 60 * 1000);

      // Select hunters from guild members
      const allGuildMemberIds = [guild.masterId, ...guild.officerIds, ...guild.memberIds];
      const guildMembers = users.filter((u) =>
        allGuildMemberIds.some((id: any) => id.toString() === u._id.toString())
      );
      
      // Sort members by rank to favor higher ranked hunters for complex bounties
      const sortedMembers = [...guildMembers].sort((a, b) => {
        const ranks = ['Rookie', 'Veteran', 'Elite', 'Master', 'Legendary'];
        return ranks.indexOf(b.rank) - ranks.indexOf(a.rank);
      });

      // If it's a high reward bounty, pick higher rank hunters
      const potentialHunters = reward > 5000 
        ? sortedMembers.slice(0, Math.ceil(sortedMembers.length / 2))
        : sortedMembers;

      // Force some involvement for demo accounts in the first few bounties
      if (i < 20) {
        const demoHunters = users.filter(u => 
          u.email === 'hunter@demo.nexora.com' || u.email === 'master@demo.nexora.com'
        ).map(u => u._id);
        
        if (demoHunters.length > 0) {
          bountyData.assignedHunterIds = [randomElement(demoHunters)];
        }
      } else {
        bountyData.assignedHunterIds = randomElements(
          potentialHunters.map((u) => u._id),
          randomInt(1, Math.min(3, potentialHunters.length || 1))
        );
      }
      bountyData.guildStakeLocked = bountyData.guildStakeRequired;
    }

    if (status === "InProgress") {
      bountyData.progress = randomInt(25, 75);
    }

    if (status === "UnderReview") {
      bountyData.submittedAt = randomPastDate(14);
      bountyData.progress = 100;
      bountyData.evidence = [
        {
          type: "link",
          url: "https://github.com/demo/project",
          description: "Project repository",
          uploadedAt: randomPastDate(7),
        },
      ];
    }

    if (status === "Completed") {
      bountyData.submittedAt = randomPastDate(30);
      bountyData.reviewedAt = randomPastDate(20);
      bountyData.completedAt = randomPastDate(15);
      bountyData.progress = 100;
    }

    const bounty = await Bounty.create(bountyData);
    bounties.push(bounty);
  }

  console.log(`✓ Created ${bounties.length} bounties`);
  return bounties;
}

/**
 * Generate disputes
 */
async function generateDisputes(bounties: any[], users: any[]): Promise<any[]> {
  console.log("\n⚖️  Generating disputes...");

  const disputes: any[] = [];
  const disputedBounties = bounties.filter(b => b.status === "Disputed");

  for (const bounty of disputedBounties) {
    const client = users.find(u => u._id.toString() === bounty.clientId.toString());
    
    const dispute = await Dispute.create({
      bountyId: bounty._id,
      clientId: bounty.clientId,
      guildId: bounty.acceptedByGuildId,
      clientEvidence: {
        text: "The delivery does not meet the initial requirements. Several features are missing and the code quality is below standards.",
        images: ["https://placehold.co/600x400?text=Issue+Screenshot"],
        links: ["https://github.com/demo/project/issues/1"],
      },
      guildEvidence: {
        text: "We have fulfilled all requirements specified in the initial bounty description. The client is asking for additional features not in the original scope.",
        images: ["https://placehold.co/600x400?text=Requirement+Proof"],
        links: ["https://github.com/demo/project/pull/1"],
      },
      tier: randomElement(["Negotiation", "AIArbiter", "Tribunal"]),
      status: randomElement(["Open", "Negotiating", "AIAnalysis", "InTribunal", "Resolved"]),
      clientStakeAtRisk: Math.floor(bounty.rewardCredits * 0.2),
      guildStakeAtRisk: bounty.guildStakeLocked,
      createdAt: randomPastDate(7),
    });

    if (dispute.status === "Resolved") {
      dispute.finalRuling = randomElement(["ClientWins", "GuildWins", "Split"]);
      dispute.resolvedAt = new Date();
      await dispute.save();
      
      // Update bounty status if resolved
      await Bounty.findByIdAndUpdate(bounty._id, { 
        status: dispute.finalRuling === "GuildWins" ? "Completed" : "Failed" 
      });
    }

    // Update bounty with disputeId
    await Bounty.findByIdAndUpdate(bounty._id, { disputeId: dispute._id });
    
    disputes.push(dispute);
  }

  console.log(`✓ Created ${disputes.length} disputes`);
  return disputes;
}

/**
 * Generate messages
 */
async function generateMessages(users: any[], guilds: any[], disputes: any[]): Promise<void> {
  console.log("\n💬 Generating messages...");

  let messageCount = 0;

  // Guild messages
  for (const guild of guilds) {
    const allGuildMemberIds = [guild.masterId, ...guild.officerIds, ...guild.memberIds];
    const guildMembers = users.filter((u) =>
      allGuildMemberIds.some((id: any) => id.toString() === u._id.toString())
    );

    if (guildMembers.length === 0) continue;
    
    const numMessages = randomInt(10, 30);
    for (let i = 0; i < numMessages; i++) {
      await Message.create({
        conversationId: `guild-${guild._id}`,
        senderId: randomElement(guildMembers)._id,
        content: generateMessage("guild"),
        sentAt: randomPastDate(60),
      });
      messageCount++;
    }
  }

  // DM messages
  for (let i = 0; i < 100; i++) {
    const user1 = randomElement(users);
    const user2 = randomElement(users.filter((u) => u._id.toString() !== user1._id.toString()));

    const [id1, id2] = [user1._id.toString(), user2._id.toString()].sort();
    const conversationId = `dm-${id1}-${id2}`;

    await Message.create({
      conversationId,
      senderId: randomElement([user1, user2])._id,
      content: generateMessage("dm"),
      sentAt: randomPastDate(90),
    });
    messageCount++;
  }

  // Dispute messages
  for (const dispute of disputes) {
    const numMessages = randomInt(3, 10);
    for (let i = 0; i < numMessages; i++) {
      await Message.create({
        conversationId: `dispute-${dispute._id}`,
        senderId: randomElement(users)._id,
        content: generateMessage("dispute"),
        sentAt: randomPastDate(30),
      });
      messageCount++;
    }
  }

  console.log(`✓ Created ${messageCount} messages`);
}

/**
 * Generate transactions
 */
async function generateTransactions(users: any[], bounties: any[]): Promise<void> {
  console.log("\n💳 Generating transactions...");

  let transactionCount = 0;
  const userBalances = new Map<string, number>();

  // Initialize balances with a base amount
  for (const user of users) {
    const isDemoClient = user.email === 'client@demo.nexora.com' || user.email === 'master@demo.nexora.com';
    const initialBalance = isDemoClient ? 100000 : 10000;
    
    userBalances.set(user._id.toString(), initialBalance);
    
    await Transaction.create({
      userId: user._id,
      type: "WelcomeBonus",
      amount: initialBalance,
      balanceAfter: initialBalance,
      description: "Initial Nexora credits",
      createdAt: user.joinedAt || randomPastDate(365),
    });
    transactionCount++;
  }

  // Sort bounties by completion date to process transactions in order
  const completedBounties = bounties
    .filter(b => b.status === "Completed" && b.completedAt)
    .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());

  for (const bounty of completedBounties) {
    const clientId = bounty.clientId.toString();
    const currentClientBalance = userBalances.get(clientId) || 0;
    const newClientBalance = currentClientBalance - bounty.rewardCredits;
    
    // Client pays for bounty
    await Transaction.create({
      userId: bounty.clientId,
      bountyId: bounty._id,
      type: "BountyReward",
      amount: -bounty.rewardCredits,
      balanceAfter: newClientBalance,
      description: `Payment for bounty: ${bounty.title}`,
      createdAt: bounty.completedAt,
    });
    userBalances.set(clientId, newClientBalance);
    transactionCount++;

    // Hunters get paid
    if (bounty.assignedHunterIds && bounty.assignedHunterIds.length > 0) {
      const rewardPerHunter = Math.floor(bounty.rewardCredits / bounty.assignedHunterIds.length);
      for (const hunterId of bounty.assignedHunterIds) {
        const hId = hunterId.toString();
        const currentHunterBalance = userBalances.get(hId) || 0;
        const newHunterBalance = currentHunterBalance + rewardPerHunter;

        await Transaction.create({
          userId: hunterId,
          bountyId: bounty._id,
          type: "BountyReward",
          amount: rewardPerHunter,
          balanceAfter: newHunterBalance,
          description: `Reward for completing: ${bounty.title}`,
          createdAt: bounty.completedAt,
        });
        userBalances.set(hId, newHunterBalance);
        transactionCount++;
      }
    }
  }

  // Some random transactions for flavor
  for (let i = 0; i < 50; i++) {
    const user = randomElement(users);
    const type = randomElement(["Deposit", "Withdrawal"]);
    const amount = randomInt(500, 2000);
    const uId = user._id.toString();
    const currentBalance = userBalances.get(uId) || 0;
    
    if (type === "Withdrawal" && currentBalance < amount) continue;

    const txAmount = type === "Deposit" ? amount : -amount;
    const newBalance = currentBalance + txAmount;

    await Transaction.create({
      userId: user._id,
      type: type === "Deposit" ? "WelcomeBonus" : "BountyStake", // Reusing types or adding new ones
      amount: txAmount,
      balanceAfter: newBalance,
      description: `${type} of funds`,
      createdAt: randomPastDate(30),
    });
    userBalances.set(uId, newBalance);
    transactionCount++;
  }

  console.log(`✓ Created ${transactionCount} transactions`);
}

/**
 * Generate activities with realistic data based on user's role and bounties
 */
async function generateActivities(users: any[], bounties: any[], guilds: any[]): Promise<void> {
  console.log("\n📊 Generating activities...");

  let activityCount = 0;

  for (const user of users) {
    // Base number of activities depends on rank
    let baseActivities = 5;
    switch (user.rank) {
      case "Rookie": baseActivities = randomInt(3, 8); break;
      case "Veteran": baseActivities = randomInt(8, 15); break;
      case "Elite": baseActivities = randomInt(15, 25); break;
      case "Master": baseActivities = randomInt(25, 40); break;
      case "Legendary": baseActivities = randomInt(40, 60); break;
    }

    // Check if user is a guild master
    const isGuildMaster = guilds.some(g => g.masterId.toString() === user._id.toString());
    
    // Find bounties this user is involved in
    const userBounties = bounties.filter((b: any) => 
      b.assignedHunterIds?.some((id: any) => id.toString() === user._id.toString()) ||
      b.clientId?.toString() === user._id.toString()
    );

    const userGuild = guilds.find((g: any) => 
      g.masterId.toString() === user._id.toString() ||
      g.officerIds.some((id: any) => id.toString() === user._id.toString()) ||
      g.memberIds.some((id: any) => id.toString() === user._id.toString())
    );

    // Create bounty-related activities
    for (const bounty of userBounties) {
      const isClient = bounty.clientId?.toString() === user._id.toString();
      const baseDate = new Date(bounty.postedAt);

      if (isClient) {
        // Client posted bounty
        await Activity.create({
          userId: user._id,
          type: "BountyPosted",
          description: `You published a new bounty: "${bounty.title}" in ${bounty.category}`,
          relatedBountyId: bounty._id,
          impactOnTrust: 1,
          impactOnCredits: -bounty.rewardCredits,
          createdAt: baseDate,
        });
        activityCount++;

        if (bounty.status === "Completed") {
          await Activity.create({
            userId: user._id,
            type: "BountyCompleted",
            description: `Bounty completed and reward released: "${bounty.title}"`,
            relatedBountyId: bounty._id,
            impactOnTrust: 2,
            impactOnCredits: 0,
            createdAt: bounty.completedAt || randomPastDate(15),
          });
          activityCount++;
        }
      } else {
        // Hunter activities
        if (bounty.acceptedAt) {
          await Activity.create({
            userId: user._id,
            type: "BountyAccepted",
            description: `Joined the hunt for: "${bounty.title}"`,
            relatedBountyId: bounty._id,
            impactOnTrust: 0,
            impactOnCredits: 0,
            createdAt: bounty.acceptedAt,
          });
          activityCount++;
        }

        if (bounty.status === "Completed") {
          const reward = Math.floor(bounty.rewardCredits / (bounty.assignedHunterIds?.length || 1));
          await Activity.create({
            userId: user._id,
            type: "BountyCompleted",
            description: `Successfully completed mission: "${bounty.title}". Earned ${reward} credits.`,
            relatedBountyId: bounty._id,
            impactOnTrust: randomInt(5, 12),
            impactOnCredits: reward,
            createdAt: bounty.completedAt || randomPastDate(15),
          });
          activityCount++;
        }
        
        if (bounty.status === "Disputed") {
          await Activity.create({
            userId: user._id,
            type: "DisputeRaised",
            description: `Dispute raised for: "${bounty.title}"`,
            relatedBountyId: bounty._id,
            impactOnTrust: -5,
            impactOnCredits: 0,
            createdAt: randomPastDate(3),
          });
          activityCount++;
        }
      }
    }

    // Guild master specific activities
    if (isGuildMaster) {
      const guild = guilds.find(g => g.masterId.toString() === user._id.toString());
      if (guild) {
        // Guild joined (as master when founded)
        await Activity.create({
          userId: user._id,
          type: "GuildJoined",
          description: `Founded and joined guild: ${guild.name}`,
          relatedGuildId: guild._id,
          impactOnTrust: 10,
          impactOnCredits: 0,
          createdAt: guild.foundedAt,
        });
        activityCount++;

        // Create multiple bounty completion activities for guild success
        const guildBountyCount = Math.min(guild.totalBountiesCompleted, 15);
        for (let i = 0; i < guildBountyCount; i++) {
          await Activity.create({
            userId: user._id,
            type: "BountyCompleted",
            description: `Led guild to complete bounty #${i + 1}`,
            relatedGuildId: guild._id,
            impactOnTrust: randomInt(1, 3),
            impactOnCredits: randomInt(500, 2000),
            createdAt: randomPastDate(randomInt(30, 365)),
          });
          activityCount++;
        }

        // Rank up activity if high rank
        if (user.rank === "Master" || user.rank === "Legendary") {
          await Activity.create({
            userId: user._id,
            type: "RankUp",
            description: `Achieved ${user.rank} rank through guild leadership`,
            relatedGuildId: guild._id,
            impactOnTrust: 10,
            impactOnCredits: 0,
            createdAt: randomPastDate(randomInt(60, 200)),
          });
          activityCount++;
        }
      }
    }

    // Guild member activities
    if (userGuild && !isGuildMaster) {
      await Activity.create({
        userId: user._id,
        type: "GuildJoined",
        description: `Joined guild: ${userGuild.name}`,
        relatedGuildId: userGuild._id,
        impactOnTrust: 2,
        impactOnCredits: 0,
        createdAt: randomPastDate(randomInt(60, 300)),
      });
      activityCount++;
    }

    // Random general activities
    const remainingActivities = Math.max(0, baseActivities - activityCount);
    for (let i = 0; i < remainingActivities; i++) {
      const activity = generateActivity();

      await Activity.create({
        userId: user._id,
        type: activity.type,
        description: activity.description,
        impactOnTrust: activity.trustImpact,
        impactOnCredits: activity.creditImpact,
        createdAt: randomPastDate(180),
      });
      activityCount++;
    }

    // Achievement activities
    if (user.achievements && user.achievements.length > 0) {
      for (const achievement of user.achievements) {
        await Activity.create({
          userId: user._id,
          type: "AchievementUnlocked",
          description: `Unlocked achievement: ${achievement.name}`,
          impactOnTrust: 5,
          impactOnCredits: 100,
          createdAt: achievement.earnedAt,
        });
        activityCount++;
      }
    }
  }

  console.log(`✓ Created ${activityCount} activities`);
}

/**
 * Synchronize user and guild statistics based on actual records
 */
async function syncStats() {
  console.log("\n🔄 Synchronizing statistics...");

  const users = await User.find({});
  for (const user of users) {
    const userId = user._id;

    // Calculate credits from transactions
    const transactions = await Transaction.find({ userId });
    const credits = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate completed quests from bounties
    const completedQuests = await Bounty.countDocuments({
      assignedHunterIds: userId,
      status: "Completed",
    });

    const totalBountiesHunter = await Bounty.countDocuments({
      assignedHunterIds: userId,
      status: { $in: ["Completed", "Failed"] },
    });

    // Success rate (0-100)
    const successRate = totalBountiesHunter > 0 ? (completedQuests / totalBountiesHunter) * 100 : 70;

    // Dispute stats
    const disputesInvolved = await Dispute.countDocuments({
      $or: [{ clientId: userId }, { guildId: user.guildId }],
    });
    const disputesWon = await Dispute.countDocuments({
      $or: [
        { clientId: userId, finalRuling: "ClientWins" },
        { guildId: user.guildId, finalRuling: "GuildWins" },
      ],
    });
    const disputeWinRate = disputesInvolved > 0 ? disputesWon / disputesInvolved : 0.5;

    // Activity bonus
    const activityCount = await Activity.countDocuments({ userId });
    const activityBonus = Math.min(activityCount / 20, 1) * 100;

    // Calculate Trust Score (0-100)
    // Simplified version of the ranking utility
    let trustScore = Math.round(
      (successRate * 0.4) + 
      (Math.min(completedQuests / 10, 1) * 20) + 
      (disputeWinRate * 20) + 
      (activityBonus * 0.2)
    );

    // Reputation is derived from trust and volume
    const hunterReputation = completedQuests * 500 + trustScore * 15;
    const clientReputation = await Bounty.countDocuments({ clientId: userId }) * 200;

    // Determine Rank
    let rank: 'Rookie' | 'Veteran' | 'Elite' | 'Master' | 'Legendary' = 'Rookie';
    if (hunterReputation > 7000) rank = 'Legendary';
    else if (hunterReputation > 4000) rank = 'Master';
    else if (hunterReputation > 1500) rank = 'Elite';
    else if (hunterReputation > 500) rank = 'Veteran';

    // Calculate Active Quests
    const activeQuests = await Bounty.countDocuments({
      assignedHunterIds: userId,
      status: { $in: ["InProgress", "UnderReview"] },
    });

    await User.findByIdAndUpdate(userId, {
      credits,
      completedQuests,
      activeQuests,
      trustScore: Math.min(trustScore, 100),
      hunterReputation,
      clientReputation,
      rank,
      lastActive: new Date(),
    });
  }

  const guilds = await Guild.find({});
  for (const guild of guilds) {
    const guildId = guild._id;

    const completedBounties = await Bounty.countDocuments({
      acceptedByGuildId: guildId,
      status: "Completed",
    });

    const totalBounties = await Bounty.countDocuments({
      acceptedByGuildId: guildId,
      status: { $in: ["Completed", "Failed", "Disputed"] },
    });

    const successRate = totalBounties > 0 ? (completedBounties / totalBounties) * 100 : 80;

    // Total value cleared
    const bounties = await Bounty.find({ acceptedByGuildId: guildId, status: "Completed" });
    const totalValueCleared = bounties.reduce((sum, b) => sum + b.rewardCredits, 0);

    await Guild.findByIdAndUpdate(guildId, {
      totalBountiesCompleted: completedBounties,
      successRate,
      totalValueCleared,
      trustScore: 70 + Math.min(completedBounties, 30),
    });
  }

  console.log("✓ Statistics synchronized");
}

/**
 * Main seed function
 */
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    await connectDB();
    await clearDatabase();

    const users = await generateUsers();
    const guilds = await generateGuilds(users);
    const bounties = await generateBounties(users, guilds);
    const disputes = await generateDisputes(bounties, users);

    await generateMessages(users, guilds, disputes);
    await generateTransactions(users, bounties);
    await generateActivities(users, bounties, guilds);

    await syncStats();

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📝 Demo Account Credentials & Stats:");
    console.log("─".repeat(80));
    console.log(`${'Role'.padEnd(15)} | ${'Email'.padEnd(25)} | ${'Rank'.padEnd(10)} | ${'Rep'.padEnd(6)} | ${'Creds'.padEnd(6)} | ${'Quests'}`);
    console.log("─".repeat(80));
    
    const finalUsers = await User.find({ email: { $in: DEMO_ACCOUNTS.map(a => a.email) } });
    for (const account of DEMO_ACCOUNTS) {
      const u = finalUsers.find(user => user.email === account.email);
      if (u) {
        console.log(`${account.role.padEnd(15)} | ${account.email.padEnd(25)} | ${u.rank.padEnd(10)} | ${String(u.hunterReputation).padEnd(6)} | ${String(u.credits).padEnd(6)} | ${u.completedQuests}`);
      }
    }
    console.log("─".repeat(80));

    console.log("\n📊 Summary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Guilds: ${guilds.length}`);
    console.log(`   Bounties: ${bounties.length}`);
    console.log(`   Disputes: ${disputes.length}`);
    console.log(`   Messages: ~${guilds.length * 20 + 100 + disputes.length * 6}`);
    console.log(`   Transactions: ~${bounties.length * 2 + 200}`);
    console.log(`   Activities: ~${users.length * 10}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
