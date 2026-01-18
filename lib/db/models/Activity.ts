import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'BountyPosted' | 'BountyAccepted' | 'BountyCompleted' | 'DisputeRaised' | 'DisputeResolved' | 'GuildJoined' | 'GuildLeft' | 'TribunalVote' | 'RankUp' | 'RankDown' | 'AccountCreated';
  relatedBountyId?: mongoose.Types.ObjectId;
  relatedGuildId?: mongoose.Types.ObjectId;
  relatedDisputeId?: mongoose.Types.ObjectId;
  description: string;
  impactOnTrust: number;
  impactOnCredits: number;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['BountyPosted', 'BountyAccepted', 'BountyCompleted', 'DisputeRaised', 'DisputeResolved', 'GuildJoined', 'GuildLeft', 'TribunalVote', 'RankUp', 'RankDown', 'AccountCreated'],
    required: true,
  },
  relatedBountyId: {
    type: Schema.Types.ObjectId,
    ref: 'Bounty',
  },
  relatedGuildId: {
    type: Schema.Types.ObjectId,
    ref: 'Guild',
  },
  relatedDisputeId: {
    type: Schema.Types.ObjectId,
    ref: 'Dispute',
  },
  description: {
    type: String,
    required: true,
  },
  impactOnTrust: {
    type: Number,
    default: 0,
  },
  impactOnCredits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

// Indexes
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1 });
ActivitySchema.index({ createdAt: -1 });

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
