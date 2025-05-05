
import { Conversation } from "@/types/conversation";

// Helper to format date
export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (60 * 1000));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m atrás`;
  } else if (diffMinutes < 24 * 60) {
    return `${Math.floor(diffMinutes / 60)}h atrás`;
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  }
};

// Channel identifier type
export type ChannelType = 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email';

// Get initials for avatar fallback
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Get channel color
export const getChannelColor = (channel: ChannelType): string => {
  switch (channel) {
    case 'WhatsApp':
      return '#25D366'; // WhatsApp green
    case 'Instagram':
      return '#C13584'; // Instagram purple/pink
    case 'Facebook':
      return '#1877F2'; // Facebook blue
    case 'Email':
      return '#4285F4'; // Email blue (Gmail-inspired)
    default:
      return '#6E6E6E'; // Default gray
  }
};

// Get channel background color for UI elements
export const getChannelBgColor = (channel: ChannelType): string => {
  switch (channel) {
    case 'WhatsApp':
      return 'bg-[#25D366]';
    case 'Instagram':
      return 'bg-[#C13584]';
    case 'Facebook':
      return 'bg-[#1877F2]';
    case 'Email':
      return 'bg-[#4285F4]';
    default:
      return 'bg-gray-500';
  }
};

// Get channel indicator letter
export const getChannelIndicator = (channel: ChannelType): string => {
  switch (channel) {
    case 'WhatsApp':
      return 'W';
    case 'Instagram':
      return 'I';
    case 'Facebook':
      return 'F';
    case 'Email':
      return 'E';
    default:
      return '';
  }
};

// Get message bubble color based on sender type and channel
export const getMessageBubbleColor = (senderType: 'user' | 'lead', channel: ChannelType): string => {
  if (senderType === 'user') {
    return 'bg-vendah-purple/30 text-white'; // Always use app color for user messages
  }
  
  // For lead messages, use a lighter version of the channel color
  switch (channel) {
    case 'WhatsApp':
      return 'bg-[#dcf8c6] text-[#303030]'; // WhatsApp light green bubble
    case 'Instagram':
      return 'bg-[#f3f3f3] text-[#303030]'; // Instagram light gray
    case 'Facebook':
      return 'bg-[#e4f0f5] text-[#303030]'; // Facebook light blue
    case 'Email':
      return 'bg-[#f5f5f5] text-[#303030]'; // Email light gray
    default:
      return 'bg-surface/40 text-white';
  }
};

// Format a text preview (truncate with ellipsis)
export const formatPreview = (text: string, maxLength: number = 40): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
