
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface InboxSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InboxSearchBar: React.FC<InboxSearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar conversas..."
        value={searchTerm}
        onChange={onSearchChange}
        className="pl-10"
      />
    </div>
  );
};

export default InboxSearchBar;
