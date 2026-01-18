'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Search,
  Send,
  MoreVertical,
  Users,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Phone,
  Video,
  Archive,
  Bell,
} from 'lucide-react';

interface MessagesClientProps {
  user: {
    id: string;
    username: string;
  };
}

// Mock conversations
const mockConversations = [
  {
    id: 1,
    type: 'dm',
    name: 'cryptodev',
    avatar: '💻',
    lastMessage: 'Thanks for applying to the bounty!',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    unread: 2,
    online: true,
  },
  {
    id: 2,
    type: 'guild',
    name: 'Shadow Syndicate',
    avatar: '🛡️',
    lastMessage: 'New mission assigned',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unread: 0,
    online: false,
  },
  {
    id: 3,
    type: 'dispute',
    name: 'Dispute #12345',
    avatar: '⚖️',
    lastMessage: 'Tribunal has reviewed your case',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    unread: 1,
    online: false,
  },
];

// Mock messages for selected conversation
const mockMessages = [
  {
    id: 1,
    senderId: 'other',
    senderName: 'cryptodev',
    senderAvatar: '💻',
    message: 'Hey, I saw your application for the security audit bounty.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: 2,
    senderId: 'me',
    senderName: 'You',
    senderAvatar: '👤',
    message: 'Yes! I have 5 years of experience in smart contract security.',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    read: true,
  },
  {
    id: 3,
    senderId: 'other',
    senderName: 'cryptodev',
    senderAvatar: '💻',
    message: 'Great! Can you share some of your previous work?',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    read: true,
  },
  {
    id: 4,
    senderId: 'me',
    senderName: 'You',
    senderAvatar: '👤',
    message: "Sure! I'll send you my portfolio link.",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    read: true,
  },
  {
    id: 5,
    senderId: 'other',
    senderName: 'cryptodev',
    senderAvatar: '💻',
    message: 'Thanks for applying to the bounty!',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: false,
  },
];

export default function MessagesClient({ user: _user }: MessagesClientProps) {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the server
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 pt-20 pb-4">
      <div className="container mx-auto px-4 h-full">
        <div className="h-full flex gap-4">
          {/* Conversation List Sidebar */}
          <Card className="w-80 glass-strong border-2 border-primary/30 flex flex-col shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Messages
                </h2>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {mockConversations.filter((c) => c.unread > 0).length}
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-primary/5 transition-colors border-b border-primary/10 text-left ${
                    selectedConversation.id === conv.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="text-2xl">{conv.avatar}</div>
                    {conv.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{conv.name}</span>
                      {conv.unread > 0 && (
                        <Badge className="bg-primary/20 text-primary border-none ml-2 shrink-0">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(conv.timestamp)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 glass-strong border-2 border-primary/30 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="text-3xl">{selectedConversation.avatar}</div>
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedConversation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.senderId === 'me' ? 'flex-row-reverse' : ''}`}
                >
                  <div className="text-2xl shrink-0">{msg.senderAvatar}</div>
                  <div className={`flex-1 max-w-lg ${msg.senderId === 'me' ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.senderId === 'me'
                          ? 'bg-primary/20 border border-primary/30'
                          : 'glass border border-primary/20'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-primary/20">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 bg-background/50 border-primary/30"
                />
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Conversation Info Sidebar */}
          <Card className="w-64 glass-strong border-2 border-primary/30 p-4 shrink-0">
            <div className="text-center mb-6">
              <div className="text-6xl mx-auto mb-3">{selectedConversation.avatar}</div>
              <h3 className="font-bold text-lg mb-1">{selectedConversation.name}</h3>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {selectedConversation.type}
              </Badge>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-primary/30">
                <Bell className="mr-2 h-4 w-4" />
                Mute
              </Button>
              <Button variant="outline" className="w-full justify-start border-primary/30">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              {selectedConversation.type === 'guild' && (
                <Button variant="outline" className="w-full justify-start border-primary/30">
                  <Users className="mr-2 h-4 w-4" />
                  View Guild
                </Button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-primary/20">
              <h4 className="text-sm font-medium mb-3">Shared Files</h4>
              <p className="text-sm text-muted-foreground text-center py-4">No shared files</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
