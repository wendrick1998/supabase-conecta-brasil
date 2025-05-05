
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LeadsTableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const LeadsTableHeader: React.FC<LeadsTableHeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="w-full sm:w-auto flex items-center space-x-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-vendah-neon/70" />
          <Input
            placeholder="Buscar leads..."
            className="w-full pl-8 bg-[#202027] border-vendah-purple/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/leads/novo')} variant="accent" className="btn-press">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>
    </div>
  );
};

export default LeadsTableHeader;
