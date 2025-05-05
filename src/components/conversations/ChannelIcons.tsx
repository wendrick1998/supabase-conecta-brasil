
import React from 'react';
import { MessageSquare, Instagram, Mail } from 'lucide-react';
import { ChannelType } from '@/utils/conversationUtils';

interface ChannelIconProps {
  size?: number;
}

export const getChannelIcon = (channel: ChannelType, props: ChannelIconProps = {}) => {
  const size = props.size || 16;

  switch (channel) {
    case 'WhatsApp':
      return <MessageSquare size={size} className="text-green-500" />;
    case 'Instagram':
      return <Instagram size={size} className="text-purple-500" />;
    case 'Email':
      return <Mail size={size} className="text-blue-500" />;
    default:
      return <MessageSquare size={size} className="text-gray-500" />;
  }
};

export const getChannelColor = (channel: ChannelType): string => {
  switch (channel) {
    case 'WhatsApp':
      return 'bg-green-500';
    case 'Instagram':
      return 'bg-purple-500';
    case 'Email':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export const ChannelBadge: React.FC<{ channel: ChannelType }> = ({ channel }) => {
  const bgColor = getChannelColor(channel);
  const initial = channel === 'WhatsApp' ? 'W' : channel === 'Instagram' ? 'I' : 'E';
  
  return (
    <div className={`${bgColor} w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold`}>
      {initial}
    </div>
  );
};
