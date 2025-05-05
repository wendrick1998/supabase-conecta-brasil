
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

// Channel identifier type - updated to include Facebook
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
