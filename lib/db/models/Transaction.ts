import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId?: mongoose.Types.ObjectId;
  guildId?: mongoose.Types.ObjectId;
  bountyId?: mongoose.Types.ObjectId;
  disputeId?: mongoose.Types.ObjectId;
  
  type: 'BountyReward' | 'BountyStake' | 'TribunalStake' | 'DisputeWin' | 'DisputeLoss' | 'GuildDeposit' | 'GuildWithdrawal' | 'PassiveYield' | 'WelcomeBonus';
  amount: number;
  balanceAfter: number;
  
  description: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  guildId: {
    type: Schema.Types.ObjectId,
    ref: 'Guild',
  },
  bountyId: {
    type: Schema.Types.ObjectId,
    ref: 'Bounty',
  },
  disputeId: {
    type: Schema.Types.ObjectId,
    ref: 'Dispute',
  },
  
  type: {
    type: String,
    enum: ['BountyReward', 'BountyStake', 'TribunalStake', 'DisputeWin', 'DisputeLoss', 'GuildDeposit', 'GuildWithdrawal', 'PassiveYield', 'WelcomeBonus'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

// Indexes
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ guildId: 1, createdAt: -1 });
TransactionSchema.index({ bountyId: 1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
