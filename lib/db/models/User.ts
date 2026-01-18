import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  rank: 'Rookie' | 'Veteran' | 'Elite' | 'Master' | 'Legendary';
  trustScore: number;
  credits: number;
  stakedCredits: number;
  guildId?: mongoose.Types.ObjectId;
  guildRole?: 'Guild Master' | 'Elite Hunter' | 'Senior Hunter' | 'Hunter' | 'Initiate';
  clientReputation: number;
  hunterReputation: number;
  clientRating: number; // Average client rating (0-1)
  completedQuests: number;
  activeQuests: number;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    avatar: {
      type: String,
      default: '👤',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    rank: {
      type: String,
      enum: ['Rookie', 'Veteran', 'Elite', 'Master', 'Legendary'],
      default: 'Rookie',
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    credits: {
      type: Number,
      default: 0,
      min: 0,
    },
    stakedCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    guildId: {
      type: Schema.Types.ObjectId,
      ref: 'Guild',
    },
    guildRole: {
      type: String,
      enum: ['Guild Master', 'Elite Hunter', 'Senior Hunter', 'Hunter', 'Initiate'],
    },
    clientReputation: {
      type: Number,
      default: 0,
      min: 0,
    },
    hunterReputation: {
      type: Number,
      default: 0,
      min: 0,
    },
    clientRating: {
      type: Number,
      default: 0.7, // Default 70% rating
      min: 0,
      max: 1,
    },
    completedQuests: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeQuests: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ trustScore: -1 });
UserSchema.index({ guildId: 1 });

export const User = models.User || model<IUser>('User', UserSchema);
