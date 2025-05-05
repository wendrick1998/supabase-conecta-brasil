
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ChannelFilterProps {
  activeChannels: string[];
  onChannelChange: (channel: string) => void;
}

const ChannelFilter: React.FC<ChannelFilterProps> = ({
  activeChannels,
  onChannelChange
}) => {
  // Define available channels
  const channels = [
    { id: 'WhatsApp', label: 'WhatsApp' },
    { id: 'Instagram', label: 'Instagram' },
    { id: 'Facebook', label: 'Facebook' },
    { id: 'Email', label: 'Email' }
  ];
  
  return (
    <div>
      <Label className="text-xs font-medium mb-2 block">Canais</Label>
      <div className="flex flex-col space-y-2">
        {channels.map(channel => (
          <div key={channel.id} className="flex items-center space-x-2">
            <Checkbox
              id={`channel-${channel.id}`}
              checked={activeChannels.includes(channel.id)}
              onCheckedChange={() => onChannelChange(channel.id)}
            />
            <label
              htmlFor={`channel-${channel.id}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {channel.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelFilter;
