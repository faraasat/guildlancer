import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBounty extends Document {
  clientId: mongoose.Types.ObjectId;
  
  // Content
  title: string;
  description: string;
  category: string;
  location?: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // Economics
  rewardCredits: number;
  reputationBonus: number;
  clientStake: number;
  guildStakeRequired: number;
  
  // Requirements
  minHunterRank: 'Rookie' | 'Veteran' | 'Elite' | 'Master' | 'Legendary';
  minGuildTrust: number;
  requiredSkills: string[];
  evidenceRequirements: string;
  
  // Assignment
  acceptedByGuildId?: mongoose.Types.ObjectId;
  assignedHunterIds: mongoose.Types.ObjectId[];
  guildStakeLocked: number;
  
  // Submission
  proofOfWork?: {
    text: string;
    images: string[];
    links: string[];
  };
  submittedAt?: Date;
  
  // Status
  status: 'Open' | 'Matched' | 'Accepted' | 'InProgress' | 'Submitted' | 'UnderReview' | 'Disputed' | 'Completed' | 'Failed' | 'Cancelled';
  
  // Dispute
  disputeId?: mongoose.Types.ObjectId;
  
  // Dates
  deadline: Date;
  postedAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const BountySchema = new Schema<IBounty>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Content
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    minlength: 50,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    city: String,
    country: String,
    lat: Number,
    lng: Number,
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  
  // Economics
  rewardCredits: {
    type: Number,
    required: true,
    min: 100,
  },
  reputationBonus: {
    type: Number,
    default: 0,
  },
  clientStake: {
    type: Number,
    default: 0,
  },
  guildStakeRequired: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Requirements
  minHunterRank: {
    type: String,
    enum: ['Rookie', 'Veteran', 'Elite', 'Master', 'Legendary'],
    default: 'Rookie',
  },
  minGuildTrust: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000,
  },
  requiredSkills: [{
    type: String,
  }],
  evidenceRequirements: {
    type: String,
    default: 'Proof of work completion',
  },
  
  // Assignment
  acceptedByGuildId: {
    type: Schema.Types.ObjectId,
    ref: 'Guild',
  },
  assignedHunterIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  guildStakeLocked: {
    type: Number,
    default: 0,
  },
  
  // Submission
  proofOfWork: {
    text: String,
    images: [String],
    links: [String],
  },
  submittedAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['Open', 'Matched', 'Accepted', 'InProgress', 'Submitted', 'UnderReview', 'Disputed', 'Completed', 'Failed', 'Cancelled'],
    default: 'Open',
  },
  
  // Dispute
  disputeId: {
    type: Schema.Types.ObjectId,
    ref: 'Dispute',
  },
  
  // Dates
  deadline: {
    type: Date,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
BountySchema.index({ status: 1 });
BountySchema.index({ category: 1 });
BountySchema.index({ rewardCredits: -1 });
BountySchema.index({ deadline: 1 });
BountySchema.index({ clientId: 1 });
BountySchema.index({ acceptedByGuildId: 1 });
BountySchema.index({ postedAt: -1 });

// Middleware
BountySchema.pre('save', function(this: IBounty) {
  this.updatedAt = new Date();
});

const Bounty: Model<IBounty> = mongoose.models.Bounty || mongoose.model<IBounty>('Bounty', BountySchema);

export default Bounty;
