
import { Card, CardContent } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-purple/20 rounded-xl border-vendah-purple/20 overflow-hidden glass-panel">
      <div className="absolute inset-0 bg-gradient-to-br from-vendah-purple/5 to-vendah-blue/5 opacity-40"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vendah-purple/50 to-vendah-neon/30"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-vendah-neon/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 opacity-30"></div>
      <div className="absolute top-1/3 right-0 w-32 h-32 bg-vendah-purple/5 rounded-full blur-2xl translate-x-1/2 opacity-30"></div>
      <CardContent className="p-8 relative">
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
