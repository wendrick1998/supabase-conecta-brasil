
import React from 'react';
import { MessageSquare, Instagram, Mail } from 'lucide-react';
import { Conversation } from '@/types/conversation';

// Get channel icon component
export const getChannelIcon = (channel: Conversation['canal']) => {
  switch (channel) {
    case 'WhatsApp':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'Instagram':
      return <Instagram className="h-4 w-4 text-purple-500" />;
    case 'Email':
      return <Mail className="h-4 w-4 text-blue-500" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};
