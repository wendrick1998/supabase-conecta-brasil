
import React from 'react';
import { MessageSquare, Camera, Facebook, Mail } from 'lucide-react';
import { ChannelType } from '@/utils/conversationUtils';

interface ChannelIconProps {
  size?: number;
}

export const getChannelIcon = (channel: ChannelType, props: ChannelIconProps = {}) => {
  const size = props.size || 16;

  switch (channel) {
    case 'WhatsApp':
      return <MessageSquare size={size} className="text-[#25D366]" />;
    case 'Instagram':
      return <Camera size={size} className="text-[#C13584]" />;
    case 'Facebook':
      return <Facebook size={size} className="text-[#1877F2]" />;
    case 'Email':
      return <Mail size={size} className="text-[#4285F4]" />;
    default:
      return <Mail size={size} className="text-gray-500" />;
  }
};

export const getChannelColor = (channel: ChannelType): string => {
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

export const ChannelBadge: React.FC<{ channel: ChannelType }> = ({ channel }) => {
  const bgColor = getChannelColor(channel);
  const initial = channel === 'WhatsApp' ? 'W' : channel === 'Instagram' ? 'I' : channel === 'Facebook' ? 'F' : 'E';
  
  return (
    <div className={`${bgColor} w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold`}>
      {initial}
    </div>
  );
};
