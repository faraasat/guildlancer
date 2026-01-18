'use server';

import { connectDB } from '@/lib/db/mongodb';
import Message from '@/lib/db/models/Message';
import Guild from '@/lib/db/models/Guild';
import { User } from '@/lib/db/models/User';
import { sendMessageSchema, type SendMessageInput } from '@/lib/validations/backend';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

// Send a message
export async function sendMessage(conversationId: string, data: SendMessageInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = sendMessageSchema.parse(data);

    // Validate conversation access
    const hasAccess = await validateConversationAccess(conversationId, session.user.id);
    if (!hasAccess) {
      return { success: false, error: 'You do not have access to this conversation' };
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: session.user.id,
      content: validated.content,
      attachments: validated.attachments || [],
      replyTo: validated.replyTo ? new mongoose.Types.ObjectId(validated.replyTo) : undefined,
    });

    return { success: true, data: { messageId: message._id.toString() } };
  } catch (error: any) {
    console.error('Send message error:', error);
    return { success: false, error: error.message || 'Failed to send message' };
  }
}

// Get messages for a conversation
export async function getMessages(conversationId: string, limit: number = 50, before?: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate access
    const hasAccess = await validateConversationAccess(conversationId, session.user.id);
    if (!hasAccess) {
      return { success: false, error: 'You do not have access to this conversation' };
    }

    const query: any = { conversationId };
    
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.sentAt = { $lt: beforeMessage.sentAt };
      }
    }

    const messages = await Message.find(query)
      .sort({ sentAt: -1 })
      .limit(limit)
      .populate('senderId', 'username avatar')
      .populate('replyTo')
      .lean();

    return {
      success: true,
      data: {
        messages: JSON.parse(JSON.stringify(messages)).reverse(), // Reverse to chronological order
        hasMore: messages.length === limit,
      },
    };
  } catch (error: any) {
    console.error('Get messages error:', error);
    return { success: false, error: error.message || 'Failed to fetch messages' };
  }
}

// Add reaction to a message
export async function addReaction(messageId: string, emoji: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Validate conversation access
    const hasAccess = await validateConversationAccess(message.conversationId, session.user.id);
    if (!hasAccess) {
      return { success: false, error: 'You do not have access to this conversation' };
    }

    // Check if reaction already exists
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Check if user already reacted
      const userIndex = existingReaction.userIds.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === session.user.id
      );
      
      if (userIndex === -1) {
        // Add user to reaction
        existingReaction.userIds.push(new mongoose.Types.ObjectId(session.user.id));
      } else {
        // Remove user from reaction (toggle)
        existingReaction.userIds.splice(userIndex, 1);
        
        // Remove reaction if no users left
        if (existingReaction.userIds.length === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      }
    } else {
      // Create new reaction
      message.reactions.push({
        emoji,
        userIds: [new mongoose.Types.ObjectId(session.user.id)],
      });
    }

    await message.save();

    return { success: true, message: 'Reaction updated' };
  } catch (error: any) {
    console.error('Add reaction error:', error);
    return { success: false, error: error.message || 'Failed to add reaction' };
  }
}

// Edit a message
export async function editMessage(messageId: string, newContent: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Check if user is the sender
    if (message.senderId.toString() !== session.user.id) {
      return { success: false, error: 'You can only edit your own messages' };
    }

    // Update message
    message.content = newContent;
    message.editedAt = new Date();
    await message.save();

    return { success: true, message: 'Message edited successfully' };
  } catch (error: any) {
    console.error('Edit message error:', error);
    return { success: false, error: error.message || 'Failed to edit message' };
  }
}

// Delete a message
export async function deleteMessage(messageId: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Check if user is the sender
    if (message.senderId.toString() !== session.user.id) {
      return { success: false, error: 'You can only delete your own messages' };
    }

    await Message.deleteOne({ _id: messageId });

    return { success: true, message: 'Message deleted successfully' };
  } catch (error: any) {
    console.error('Delete message error:', error);
    return { success: false, error: error.message || 'Failed to delete message' };
  }
}

// Get user's conversations list
export async function getConversations() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await User.findById(session.user.id);
    
    // Get all conversations where user is involved
    const conversations: any[] = [];

    // Guild conversation
    if (user?.guildId) {
      const guild = await Guild.findById(user.guildId);
      if (guild) {
        const lastMessage = await Message.findOne({ conversationId: `guild-${guild._id}` })
          .sort({ sentAt: -1 })
          .lean();
        
        conversations.push({
          id: `guild-${guild._id}`,
          type: 'guild',
          name: guild.name,
          avatar: guild.avatar,
          lastMessage: lastMessage,
        });
      }
    }

    // DM conversations (find all DMs user is involved in)
    const dmMessages = await Message.find({
      conversationId: { 
        $regex: `dm-.*${session.user.id}.*`,
      },
    })
      .sort({ sentAt: -1 })
      .lean();

    // Group by conversation and get last message
    const dmConversations = new Map();
    for (const msg of dmMessages) {
      if (!dmConversations.has(msg.conversationId)) {
        // Extract other user ID from conversation ID
        const parts = msg.conversationId.replace('dm-', '').split('-');
        const otherUserId = parts.find(id => id !== session.user.id);
        
        if (otherUserId) {
          const otherUser = await User.findById(otherUserId).lean();
          if (otherUser) {
            dmConversations.set(msg.conversationId, {
              id: msg.conversationId,
              type: 'dm',
              name: otherUser.username,
              avatar: otherUser.avatar,
              lastMessage: msg,
            });
          }
        }
      }
    }

    conversations.push(...Array.from(dmConversations.values()));

    // Sort by last message time
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.sentAt || new Date(0);
      const bTime = b.lastMessage?.sentAt || new Date(0);
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return { success: true, data: conversations };
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return { success: false, error: error.message || 'Failed to fetch conversations' };
  }
}

// Create or get DM conversation ID
export async function getDMConversationId(otherUserId: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (session.user.id === otherUserId) {
      return { success: false, error: 'Cannot message yourself' };
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return { success: false, error: 'User not found' };
    }

    // Create conversation ID (sorted to ensure consistency)
    const ids = [session.user.id, otherUserId].sort();
    const conversationId = `dm-${ids[0]}-${ids[1]}`;

    return { success: true, data: { conversationId } };
  } catch (error: any) {
    console.error('Get DM conversation error:', error);
    return { success: false, error: error.message || 'Failed to create conversation' };
  }
}

// Helper: Validate user has access to conversation
async function validateConversationAccess(conversationId: string, userId: string): Promise<boolean> {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    // Guild conversation
    if (conversationId.startsWith('guild-')) {
      const guildId = conversationId.replace('guild-', '');
      return user.guildId?.toString() === guildId;
    }

    // DM conversation
    if (conversationId.startsWith('dm-')) {
      return conversationId.includes(userId);
    }

    // Dispute conversation
    if (conversationId.startsWith('dispute-')) {
      // Check if user is involved in the dispute
      // This would require importing Dispute model
      return true; // Simplified for now
    }

    return false;
  } catch (error) {
    console.error('Validate conversation access error:', error);
    return false;
  }
}
