
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ChannelFilterProps {
  activeChannels: ('WhatsApp' | 'Instagram' | 'Facebook' | 'Email')[];
  onChannelChange: (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => void;
}

const ChannelFilter: React.FC<ChannelFilterProps> = ({ 
  activeChannels, 
  onChannelChange 
}) => {
  return (
    <div>
      <Label className="text-xs font-medium mb-2 block">Canais</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-whatsapp" 
            checked={activeChannels.includes('WhatsApp')}
            onCheckedChange={() => onChannelChange('WhatsApp')}
          />
          <label htmlFor="filter-whatsapp" className="text-sm">WhatsApp</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-instagram" 
            checked={activeChannels.includes('Instagram')}
            onCheckedChange={() => onChannelChange('Instagram')}
          />
          <label htmlFor="filter-instagram" className="text-sm">Instagram</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-facebook" 
            checked={activeChannels.includes('Facebook')}
            onCheckedChange={() => onChannelChange('Facebook')}
          />
          <label htmlFor="filter-facebook" className="text-sm">Facebook</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-email" 
            checked={activeChannels.includes('Email')}
            onCheckedChange={() => onChannelChange('Email')}
          />
          <label htmlFor="filter-email" className="text-sm">Email</label>
        </div>
      </div>
    </div>
  );
};

export default ChannelFilter;
