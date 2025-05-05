
import { Card, CardContent } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl border-vendah-purple/20 overflow-hidden backdrop-filter backdrop-blur-md bg-gradient-to-br from-[#1A1720]/90 to-[#221F26]/90">
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
