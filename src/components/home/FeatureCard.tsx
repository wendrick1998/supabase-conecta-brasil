
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description
}) => {
  return (
    <Card className="vendah-card group h-full transition-all duration-300 hover:shadow-purple hover:-translate-y-1">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4 
                      group-hover:shadow-neon transition-all duration-500">
          <Icon className="h-8 w-8 text-vendah-neon" />
        </div>
        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-vendah-neon transition-colors">
          {title}
        </h3>
        <p className="text-text-muted leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
