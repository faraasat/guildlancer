import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId;
  content: string;
  attachments?: string[];
  replyTo?: mongoose.Types.ObjectId;
  reactions: Array<{
    emoji: string;
    userIds: mongoose.Types.ObjectId[];
  }>;
  sentAt: Date;
  editedAt?: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  attachments: [String],
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  reactions: [{
    emoji: String,
    userIds: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  }],
  sentAt: {
    type: Date,
    default: Date.now,
  },
  editedAt: Date,
}, {
  timestamps: false,
});

// Indexes
MessageSchema.index({ conversationId: 1, sentAt: -1 });
MessageSchema.index({ senderId: 1 });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
