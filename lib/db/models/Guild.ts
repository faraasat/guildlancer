import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGuild extends Document {
  name: string;
  avatar: string;
  banner: string;
  description: string;
  foundedAt: Date;
  foundersIds: mongoose.Types.ObjectId[];
  masterId: mongoose.Types.ObjectId;
  officerIds: mongoose.Types.ObjectId[];
  memberIds: mongoose.Types.ObjectId[];
  
  // Stats
  rank: 'Legendary' | 'Elite' | 'Veteran' | 'Established' | 'Developing';
  trustScore: number;
  successRate: number;
  totalBountiesCompleted: number;
  totalValueCleared: number;
  disputeWinRate: number;
  
  // Treasury
  treasuryBalance: number;
  stakedAmount: number;
  
  // Specializations
  categories: string[];
  
  // Metadata
  updatedAt: Date;
}

const GuildSchema = new Schema<IGuild>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  avatar: {
    type: String,
    default: '🛡️',
  },
  banner: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  foundedAt: {
    type: Date,
    default: Date.now,
  },
  foundersIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  masterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  officerIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  memberIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // Stats
  rank: {
    type: String,
    enum: ['Legendary', 'Elite', 'Veteran', 'Established', 'Developing'],
    default: 'Developing',
  },
  trustScore: {
    type: Number,
    default: 500,
    min: 0,
    max: 1000,
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  totalBountiesCompleted: {
    type: Number,
    default: 0,
  },
  totalValueCleared: {
    type: Number,
    default: 0,
  },
  disputeWinRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  
  // Treasury
  treasuryBalance: {
    type: Number,
    default: 0,
  },
  stakedAmount: {
    type: Number,
    default: 0,
  },
  
  // Specializations
  categories: [{
    type: String,
  }],
  
  // Metadata
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
GuildSchema.index({ name: 1 });
GuildSchema.index({ trustScore: -1 });
GuildSchema.index({ rank: 1 });
GuildSchema.index({ masterId: 1 });

// Middleware to update updatedAt
GuildSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Guild: Model<IGuild> = mongoose.models.Guild || mongoose.model<IGuild>('Guild', GuildSchema);

export default Guild;
