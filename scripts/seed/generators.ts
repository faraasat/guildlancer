// scripts/seed/generators.ts
// Utilities for generating realistic demo data

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random element from array
 */
export function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Pick multiple random elements from array
 */
export function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate weighted random selection (normal distribution)
 */
export function weightedRandom(options: { value: any; weight: number }[]): any {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) {
      return option.value;
    }
  }

  return options[options.length - 1].value;
}

/**
 * Generate random date between start and end
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

/**
 * Generate random past date (within last N days)
 */
export function randomPastDate(daysAgo: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return randomDate(past, now);
}

/**
 * User rank distribution (weighted for realism)
 */
export const RANK_WEIGHTS = [
  { value: "Rookie", weight: 35 },
  { value: "Veteran", weight: 30 },
  { value: "Elite", weight: 20 },
  { value: "Master", weight: 10 },
  { value: "Legendary", weight: 5 },
];

/**
 * Skill categories and specializations
 */
export const SKILLS = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Backend Engineering",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Blockchain",
  "Cybersecurity",
  "Game Development",
  "Cloud Architecture",
  "Technical Writing",
  "Quality Assurance",
  "Product Management",
  "Research",
  "3D Modeling",
  "Animation",
  "Video Editing",
  "Graphic Design",
  "SEO/Marketing",
];

/**
 * Bounty categories
 */
export const BOUNTY_CATEGORIES = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Backend API",
  "DevOps",
  "Data Analysis",
  "Machine Learning",
  "Smart Contract",
  "Security Audit",
  "Game Development",
  "Technical Writing",
  "QA Testing",
  "Research",
  "3D Design",
  "Video Production",
];

/**
 * Guild types/specializations
 */
export const GUILD_TYPES = [
  { name: "Tech Innovators", specialization: "Technology", focus: "Cutting-edge tech projects" },
  { name: "Design Masters", specialization: "Design", focus: "Visual excellence" },
  { name: "Code Warriors", specialization: "Engineering", focus: "Robust software" },
  { name: "Data Wizards", specialization: "Data Science", focus: "Analytics & ML" },
  { name: "Security Guardians", specialization: "Security", focus: "Cybersecurity" },
  { name: "Cloud Architects", specialization: "Infrastructure", focus: "Cloud solutions" },
  { name: "Research Collective", specialization: "Research", focus: "Innovation & discovery" },
  { name: "Creative Studios", specialization: "Mixed", focus: "Multimedia content" },
  { name: "Blockchain Alliance", specialization: "Blockchain", focus: "Web3 projects" },
  { name: "Quality Assurance Guild", specialization: "Testing", focus: "Quality standards" },
];

/**
 * Generate realistic username
 */
export function generateUsername(): string {
  const adjectives = [
    "Swift",
    "Silent",
    "Dark",
    "Bright",
    "Cyber",
    "Shadow",
    "Neo",
    "Digital",
    "Quantum",
    "Stellar",
    "Mystic",
    "Tech",
    "Lunar",
    "Solar",
    "Iron",
  ];

  const nouns = [
    "Hunter",
    "Seeker",
    "Coder",
    "Hacker",
    "Ninja",
    "Wizard",
    "Warrior",
    "Master",
    "Guardian",
    "Sentinel",
    "Phoenix",
    "Dragon",
    "Wolf",
    "Eagle",
    "Falcon",
  ];

  return `${randomElement(adjectives)}${randomElement(nouns)}${randomInt(10, 99)}`;
}

/**
 * Generate realistic bounty title
 */
export function generateBountyTitle(category: string): string {
  const templates = {
    "Web Development": [
      "Build responsive landing page for SaaS product",
      "Create e-commerce website with payment integration",
      "Develop portfolio website with CMS",
      "Build real-time dashboard with charts",
      "Create interactive web application",
    ],
    "Mobile App": [
      "Develop iOS fitness tracking app",
      "Create Android social networking app",
      "Build cross-platform note-taking app",
      "Develop mobile game with leaderboards",
      "Create meditation and wellness app",
    ],
    "UI/UX Design": [
      "Design modern mobile app interface",
      "Create brand identity and logo suite",
      "Design user-friendly dashboard UI",
      "Redesign website for better UX",
      "Create wireframes and prototypes",
    ],
    "Backend API": [
      "Build RESTful API with authentication",
      "Develop GraphQL API for mobile app",
      "Create microservices architecture",
      "Build real-time WebSocket API",
      "Develop payment processing backend",
    ],
    "Data Analysis": [
      "Analyze customer behavior patterns",
      "Create predictive analytics model",
      "Build data visualization dashboard",
      "Perform market research analysis",
      "Generate automated reports",
    ],
  };

  const titles = templates[category as keyof typeof templates] || [
    `Complete ${category} project`,
    `Develop ${category} solution`,
    `Build custom ${category} application`,
  ];

  return randomElement(titles);
}

/**
 * Generate realistic bounty description
 */
export function generateBountyDescription(title: string): string {
  return `We need an experienced professional to ${title.toLowerCase()}. 

Requirements:
- Strong portfolio demonstrating relevant skills
- Clear communication and regular updates
- Clean, maintainable code/design
- Adherence to best practices
- Timely delivery within agreed timeframe

Deliverables:
- Fully functional implementation
- Documentation and source files
- Testing and quality assurance
- Deployment assistance if needed

Timeline: ${randomInt(1, 4)} weeks
Budget: ${randomInt(500, 5000)} credits

Please include your portfolio and estimated timeline in your proposal.`;
}

/**
 * Generate realistic guild description
 */
export function generateGuildDescription(name: string, specialization: string): string {
  return `${name} is a premier guild specializing in ${specialization}. We bring together top-tier professionals passionate about excellence. Our members collaborate on high-value bounties, share knowledge, and maintain the highest standards of quality. Join a team that consistently delivers exceptional results.`;
}

/**
 * Generate realistic user bio
 */
export function generateUserBio(rank: string, skills: string[]): string {
  const templates = [
    `${rank} developer specializing in ${skills[0]}. Passionate about building quality software and solving complex problems.`,
    `Professional ${skills[0]} expert with focus on ${skills[1] || "innovation"}. Committed to excellence and continuous learning.`,
    `Experienced in ${skills.join(", ")}. Dedicated to delivering high-quality work and building lasting client relationships.`,
    `${rank} professional focused on ${skills[0]}. Strong track record of successful project delivery and client satisfaction.`,
  ];

  return randomElement(templates);
}

/**
 * Generate realistic message content
 */
export function generateMessage(context: "guild" | "dm" | "dispute"): string {
  const guildMessages = [
    "Hey team, I can take on that new bounty if no one else has claimed it yet.",
    "Great work on the last project everyone! Client was very happy.",
    "Anyone available for a quick code review?",
    "Just submitted the latest milestone. Feedback welcome!",
    "Meeting tomorrow at 3pm to discuss the new project strategy.",
    "Reminder: Please update your status on active bounties.",
    "Found a great new tool that might help with our workflow.",
    "Congrats on leveling up! Well deserved!",
  ];

  const dmMessages = [
    "Hey! Saw your work on that recent bounty, really impressive.",
    "Would love to collaborate on a project sometime.",
    "Quick question about your approach to the authentication.",
    "Thanks for the recommendation, it really helped!",
    "Are you available for a call to discuss the requirements?",
    "Just wanted to say thanks for your help earlier.",
  ];

  const disputeMessages = [
    "I've reviewed the evidence and believe my submission meets all requirements.",
    "The original scope didn't include this feature, as per our initial agreement.",
    "I can provide additional documentation if needed.",
    "I'm open to finding a fair resolution for both parties.",
    "The timeline was extended due to scope changes, as discussed.",
  ];

  switch (context) {
    case "guild":
      return randomElement(guildMessages);
    case "dm":
      return randomElement(dmMessages);
    case "dispute":
      return randomElement(disputeMessages);
  }
}

/**
 * Generate realistic activity type
 */
export function generateActivity(): {
  type: string;
  description: string;
  trustImpact: number;
  creditImpact: number;
} {
  const activities = [
    {
      type: "BountyCompleted",
      description: "Successfully completed a bounty",
      trustImpact: randomInt(3, 8),
      creditImpact: randomInt(500, 3000),
    },
    {
      type: "BountyAccepted",
      description: "Accepted a new bounty",
      trustImpact: 0,
      creditImpact: 0,
    },
    {
      type: "GuildJoined",
      description: "Joined a guild",
      trustImpact: randomInt(1, 3),
      creditImpact: 0,
    },
    {
      type: "DisputeResolved",
      description: "Dispute resolved favorably",
      trustImpact: randomInt(-2, 5),
      creditImpact: randomInt(-500, 1000),
    },
    {
      type: "TribunalVote",
      description: "Participated in tribunal vote",
      trustImpact: randomInt(1, 2),
      creditImpact: randomInt(100, 500),
    },
    {
      type: "RankUp",
      description: "Rank increased due to performance",
      trustImpact: randomInt(5, 10),
      creditImpact: 0,
    },
  ];

  return randomElement(activities);
}

/**
 * Generate password hash
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Generate demo account credentials
 */
export const DEMO_ACCOUNTS = [
  {
    role: "guild_master",
    username: "GuildMaster42",
    email: "master@demo.nexora.com",
    password: "demo123",
    rank: "Master",
    trustScore: 95,
  },
  {
    role: "active_hunter",
    username: "ActiveHunter",
    email: "hunter@demo.nexora.com",
    password: "demo123",
    rank: "Elite",
    trustScore: 82,
  },
  {
    role: "new_user",
    username: "NewUser",
    email: "newuser@demo.nexora.com",
    password: "demo123",
    rank: "Rookie",
    trustScore: 60,
  },
  {
    role: "client",
    username: "ClientAccount",
    email: "client@demo.nexora.com",
    password: "demo123",
    rank: "Veteran",
    trustScore: 78,
  },
  {
    role: "disputed",
    username: "DisputedUser",
    email: "disputed@demo.nexora.com",
    password: "demo123",
    rank: "Veteran",
    trustScore: 65,
  },
];
