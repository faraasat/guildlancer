import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDispute extends Document {
  bountyId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  guildId: mongoose.Types.ObjectId;
  
  // Evidence
  clientEvidence: {
    text: string;
    images: string[];
    links: string[];
  };
  guildEvidence: {
    text: string;
    images: string[];
    links: string[];
  };
  
  // Resolution Tier
  tier: 'Negotiation' | 'AIArbiter' | 'Tribunal';
  status: 'Open' | 'Negotiating' | 'AIAnalysis' | 'InTribunal' | 'Resolved';
  
  // AI Analysis
  aiSuggestion?: {
    ruling: 'ClientWins' | 'GuildWins' | 'Split';
    confidenceScore: number;
    reasoning: string;
    generatedAt: Date;
    aiStake: number;
  };
  
  // Tribunal
  tribunalJurors?: mongoose.Types.ObjectId[];
  tribunalVotes?: Array<{
    guildId: mongoose.Types.ObjectId;
    vote: 'ClientWins' | 'GuildWins' | 'Split';
    stakedAmount: number;
  }>;
  
  // Outcome
  finalRuling?: 'ClientWins' | 'GuildWins' | 'Split';
  resolvedAt?: Date;
  
  // Stakes
  clientStakeAtRisk: number;
  guildStakeAtRisk: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>({
  bountyId: {
    type: Schema.Types.ObjectId,
    ref: 'Bounty',
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  guildId: {
    type: Schema.Types.ObjectId,
    ref: 'Guild',
    required: true,
  },
  
  // Evidence
  clientEvidence: {
    text: { type: String, required: true },
    images: [String],
    links: [String],
  },
  guildEvidence: {
    text: { type: String, default: '' },
    images: [String],
    links: [String],
  },
  
  // Resolution Tier
  tier: {
    type: String,
    enum: ['Negotiation', 'AIArbiter', 'Tribunal'],
    default: 'Negotiation',
  },
  status: {
    type: String,
    enum: ['Open', 'Negotiating', 'AIAnalysis', 'InTribunal', 'Resolved'],
    default: 'Open',
  },
  
  // AI Analysis
  aiSuggestion: {
    ruling: {
      type: String,
      enum: ['ClientWins', 'GuildWins', 'Split'],
    },
    confidenceScore: Number,
    reasoning: String,
    generatedAt: Date,
    aiStake: Number,
  },
  
  // Tribunal
  tribunalJurors: [{
    type: Schema.Types.ObjectId,
    ref: 'Guild',
  }],
  tribunalVotes: [{
    guildId: {
      type: Schema.Types.ObjectId,
      ref: 'Guild',
    },
    vote: {
      type: String,
      enum: ['ClientWins', 'GuildWins', 'Split'],
    },
    stakedAmount: Number,
  }],
  
  // Outcome
  finalRuling: {
    type: String,
    enum: ['ClientWins', 'GuildWins', 'Split'],
  },
  resolvedAt: Date,
  
  // Stakes
  clientStakeAtRisk: {
    type: Number,
    required: true,
  },
  guildStakeAtRisk: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
DisputeSchema.index({ bountyId: 1 });
DisputeSchema.index({ status: 1 });
DisputeSchema.index({ tier: 1 });
DisputeSchema.index({ createdAt: -1 });

const Dispute: Model<IDispute> = mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);

export default Dispute;
