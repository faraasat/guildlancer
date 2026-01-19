'use client';

import { useState, useEffect, useRef } from 'react';
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
  Clock,
} from 'lucide-react';

interface MessagesClientProps {
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export default function MessagesClient({ user }: MessagesClientProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper function to format timestamp
  const formatTimestamp = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/messages');
        if (!res.ok) throw new Error('Failed to fetch conversations');
        const data = await res.json();
        setConversations(data || []);
        if (data && data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?.id) return;

      try {
        setMessagesLoading(true);
        const res = await fetch(`/api/messages/${selectedConversation.id}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        // Messages are usually returned newer first, reverse for chronological view
        setMessages(Array.isArray(data) ? [...data].reverse() : []);
      } catch (err) {
        console.error(err);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedConversation?.id) {
      const content = messageInput;
      setMessageInput('');
      
      try {
        const res = await fetch(`/api/messages/${selectedConversation.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });

        if (res.ok) {
          const newMessage = await res.json();
          setMessages(prev => [...prev, newMessage]);
          
          // Update last message in conversation list
          setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, lastMessage: { content, sentAt: new Date().toISOString() } }
              : conv
          ));
        }
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                {conversations.some(c => c.unread > 0) && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    New
                  </Badge>
                )}
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

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground animate-pulse">Syncing frequencies...</div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-primary/5 transition-colors border-b border-primary/10 text-left ${
                      selectedConversation?.id === conv.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="text-2xl w-10 h-10 rounded-full glass border border-primary/20 flex items-center justify-center">
                        {conv.avatar || (conv.name ? conv.name[0].toUpperCase() : '?')}
                      </div>
                      {conv.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{conv.name || 'Unknown'}</span>
                        {conv.unread > 0 && (
                          <Badge className="bg-primary/20 text-primary border-none ml-2 shrink-0">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage?.content || 'No transmissions'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(conv.lastMessage?.sentAt || conv.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground italic">No frequencies detected.</div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 glass-strong border-2 border-primary/30 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-3xl w-12 h-12 rounded-full glass border border-primary/20 flex items-center justify-center">
                        {selectedConversation.avatar || selectedConversation.name[0].toUpperCase()}
                      </div>
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

                {/* Messages Body */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderId === user.id;
                      return (
                        <div
                          key={msg._id || idx}
                          className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                          <div className="text-xl shrink-0 w-8 h-8 rounded-full glass border border-primary/20 flex items-center justify-center bg-primary/5">
                            {isMe ? '👤' : (selectedConversation.avatar || selectedConversation.name[0])}
                          </div>
                          <div className={`flex-1 max-w-lg ${isMe ? 'items-end' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">{isMe ? 'You' : selectedConversation.name}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {formatTimestamp(msg.sentAt)}
                              </span>
                            </div>
                            <div
                              className={`p-3 rounded-lg ${
                                isMe
                                  ? 'bg-primary/20 border border-primary/30 rounded-tr-none'
                                  : 'glass border border-primary/20 rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-50">
                      <MessageSquare className="h-16 w-16" />
                      <p className="font-bold tracking-widest text-xs uppercase text-primary/60">Secure channel initialized</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-primary/20">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
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
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="glow-primary shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 border-2 border-dashed border-primary/20 animate-pulse">
                  <MessageSquare className="h-12 w-12 text-primary/40" />
                </div>
                <h3 className="text-2xl font-black font-heading mb-2 text-foreground/80">COMM-LINK OFFLINE</h3>
                <p className="max-w-md text-center text-sm opacity-60">
                  Select a frequency to begin secure communication with other network operatives.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
