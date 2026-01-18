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

  // Create demo accounts first
  for (const demoAccount of DEMO_ACCOUNTS) {
    const user = await User.create({
      username: demoAccount.username,
      email: demoAccount.email,
      password: await hashPassword(demoAccount.password),
      rank: demoAccount.rank,
      trustScore: demoAccount.trustScore,
      credits: randomInt(500, 5000),
      skills: randomElements(SKILLS, randomInt(2, 5)),
      bio: generateUserBio(demoAccount.rank, randomElements(SKILLS, 2)),
      joinedAt: randomPastDate(180),
      lastActive: randomPastDate(7),
    });
    users.push(user);
  }

  // Generate 45 more random users (total 50)
  for (let i = 0; i < 45; i++) {
    const rank = weightedRandom(RANK_WEIGHTS);
    const skills = randomElements(SKILLS, randomInt(2, 6));

    // Trust score based on rank (0-100 scale)
    let trustScore = 60;
    switch (rank) {
      case "Rookie":
        trustScore = randomInt(50, 65);
        break;
      case "Veteran":
        trustScore = randomInt(65, 75);
        break;
      case "Elite":
        trustScore = randomInt(75, 85);
        break;
      case "Master":
        trustScore = randomInt(85, 92);
        break;
      case "Legendary":
        trustScore = randomInt(92, 100);
        break;
    }

    const user = await User.create({
      username: generateUsername(),
      email: `user${i}@demo.nexora.com`,
      password: await hashPassword("demo123"),
      rank,
      trustScore,
      credits: randomInt(100, 10000),
      skills,
      bio: generateUserBio(rank, skills),
      joinedAt: randomPastDate(365),
      lastActive: randomPastDate(30),
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
      bountyData.acceptedGuildId = guild._id;
      bountyData.acceptedAt = randomPastDate(60);

      // Select hunters from guild members (combine all guild members)
      const allGuildMemberIds = [guild.masterId, ...guild.officerIds, ...guild.memberIds];
      const guildMembers = users.filter((u) =>
        allGuildMemberIds.some((id: any) => id.toString() === u._id.toString())
      );
      bountyData.assignedHunterIds = randomElements(
        guildMembers.map((u) => u._id),
        randomInt(1, 3)
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
 * Generate activities
 */
async function generateActivities(users: any[]): Promise<void> {
  console.log("\n📊 Generating activities...");

  let activityCount = 0;

  for (const user of users) {
    const numActivities = randomInt(5, 15);

    for (let i = 0; i < numActivities; i++) {
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
    await generateActivities(users);

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
