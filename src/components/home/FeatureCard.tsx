
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <Card className="vendah-card group">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4 
                      group-hover:shadow-neon transition-all duration-500">
          <Icon className="h-8 w-8 text-vendah-neon" />
        </div>
        <h3 className="font-bold text-xl mb-2 text-white group-hover:text-vendah-neon transition-colors">
          {title}
        </h3>
        <p className="text-text-muted">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
