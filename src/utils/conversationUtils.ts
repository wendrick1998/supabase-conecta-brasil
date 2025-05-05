
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

// Get channel icon component
export const getChannelIcon = (channel: ChannelType): JSX.Element => {
  switch (channel) {
    case 'WhatsApp':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      );
    case 'Instagram':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'Facebook':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.64c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.955.925-1.955 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.736-.9 10.124-5.864 10.124-11.853z"/>
        </svg>
      );
    case 'Email':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
        </svg>
      );
    default:
      return <></>;
  }
};

// Format channel name for display
export const formatChannelName = (channel: ChannelType): string => {
  switch (channel) {
    case 'WhatsApp':
      return 'WhatsApp';
    case 'Instagram':
      return 'Instagram DM';
    case 'Facebook':
      return 'Facebook Messenger';
    case 'Email':
      return 'Email';
    default:
      return channel;
  }
};
