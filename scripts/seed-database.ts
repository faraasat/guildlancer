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
    { value: "Open", weight: 20 },
    { value: "InProgress", weight: 30 },
    { value: "UnderReview", weight: 15 },
    { value: "Completed", weight: 30 },
    { value: "Disputed", weight: 5 },
  ];

  for (let i = 0; i < 100; i++) {
    const category = randomElement(BOUNTY_CATEGORIES);
    const title = generateBountyTitle(category);
    const description = generateBountyDescription(title);
    const status = weightedRandom(statuses);
    const reward = randomInt(500, 10000);

    const client = randomElement(users);
    const postedDate = randomPastDate(90);
    const daysToDeadline = randomInt(7, 60);
    const deadline = new Date(postedDate.getTime() + daysToDeadline * 24 * 60 * 60 * 1000);
    
    const bountyData: any = {
      title,
      description,
      category,
      rewardCredits: reward,
      guildStakeRequired: Math.floor(reward * 0.1), // 10% of reward
      clientStake: Math.floor(reward * 0.2), // 20% of reward
      requiredSkills: randomElements(SKILLS, randomInt(1, 3)),
      evidenceRequirements: "Please provide proof of completion with screenshots, links, or detailed documentation.",
      minHunterRank: randomElement(['Rookie', 'Veteran', 'Elite'] as const),
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
      bountyData.acceptedAt = randomPastDate(60);

      // Select hunters from guild members (combine all guild members)
      const allGuildMemberIds = [guild.masterId, ...guild.officerIds, ...guild.memberIds];
      const guildMembers = users.filter((u) =>
        allGuildMemberIds.some((id: any) => id.toString() === u._id.toString())
      );
      bountyData.assignedHunterIds = randomElements(
        guildMembers.map((u) => u._id),
        randomInt(1, Math.min(3, guildMembers.length || 1))
      );
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
 * Generate disputes (simplified for demo)
 */
async function generateDisputes(bounties: any[], users: any[]): Promise<any[]> {
  console.log("\n⚖️  Generating disputes...");
  console.log("✓ Skipping disputes for now (complex model requirements)");
  return [];
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

  for (const bounty of bounties) {
    if (bounty.status === "Completed" || Math.random() < 0.3) {
      // Bounty reward transaction
      const client = users.find(u => u._id.toString() === bounty.clientId.toString());
      await Transaction.create({
        userId: bounty.clientId,
        bountyId: bounty._id,
        type: "BountyReward",
        amount: -bounty.rewardCredits,
        balanceAfter: client ? client.credits - bounty.rewardCredits : 0,
        description: `Payment for bounty: ${bounty.title}`,
        createdAt: bounty.completedAt || randomPastDate(30),
      });
      transactionCount++;

      if (bounty.assignedHunterIds && bounty.assignedHunterIds.length > 0) {
        const rewardPerHunter = Math.floor(bounty.rewardCredits / bounty.assignedHunterIds.length);
        for (const hunterId of bounty.assignedHunterIds) {
          const hunter = users.find(u => u._id.toString() === hunterId.toString());
          await Transaction.create({
            userId: hunterId,
            bountyId: bounty._id,
            type: "BountyReward",
            amount: rewardPerHunter,
            balanceAfter: hunter ? hunter.credits + rewardPerHunter : rewardPerHunter,
            description: `Reward for completing: ${bounty.title}`,
            createdAt: bounty.completedAt || randomPastDate(30),
          });
          transactionCount++;
        }
      }
    }
  }

  // Random deposits and withdrawals
  for (let i = 0; i < 200; i++) {
    const user = randomElement(users);
    const type = randomElement(["Deposit", "Withdrawal"]);
    const amount = randomInt(100, 5000);

    const txAmount = type === "Deposit" ? amount : -amount;
    await Transaction.create({
      userId: user._id,
      type: type === "Deposit" ? "WelcomeBonus" : "BountyStake",
      amount: txAmount,
      balanceAfter: user.credits + txAmount,
      description: `${type} to wallet`,
      createdAt: randomPastDate(180),
    });
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
          description: `Posted bounty: ${bounty.title}`,
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
            description: `Bounty completed: ${bounty.title}`,
            relatedBountyId: bounty._id,
            impactOnTrust: 2,
            impactOnCredits: 0,
            createdAt: bounty.completedAt || randomPastDate(15),
          });
          activityCount++;
        }
      } else {
        // Hunter accepted bounty
        if (bounty.acceptedAt) {
          await Activity.create({
            userId: user._id,
            type: "BountyAccepted",
            description: `Accepted bounty: ${bounty.title}`,
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
            description: `Completed bounty: ${bounty.title}`,
            relatedBountyId: bounty._id,
            impactOnTrust: randomInt(3, 7),
            impactOnCredits: reward,
            createdAt: bounty.completedAt || randomPastDate(15),
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

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📝 Demo Account Credentials:");
    console.log("─".repeat(50));
    for (const account of DEMO_ACCOUNTS) {
      console.log(`${account.role.padEnd(20)} | ${account.email.padEnd(25)} | demo123`);
    }
    console.log("─".repeat(50));

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
