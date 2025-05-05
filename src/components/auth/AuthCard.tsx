
import { Card, CardContent } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl border-vendah-purple/20 overflow-hidden backdrop-filter backdrop-blur-md bg-gradient-to-br from-[#2D2933]/90 to-[#333039]/90">
      <div className="absolute inset-0 bg-gradient-to-br from-vendah-purple/5 to-vendah-blue/5 opacity-40"></div>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-vendah-purple/50 to-vendah-neon/30"></div>
      <CardContent className="p-8 relative">
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
