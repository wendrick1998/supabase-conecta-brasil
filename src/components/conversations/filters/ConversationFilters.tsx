
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ConversationFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  setCanalFilter: (canal: string | null) => void;
  setStatusFilter: (status: string | null) => void;
}

const ConversationFilters = ({
  search,
  setSearch,
  setCanalFilter,
  setStatusFilter
}: ConversationFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <Select onValueChange={(value) => setCanalFilter(value === 'all' ? null : value)}>
        <SelectTrigger className="w-full bg-[#222] border-gray-800 text-white">
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent className="bg-[#222] border-gray-800 text-white">
          <SelectItem value="all" className="text-white hover:bg-[#333]">Todos</SelectItem>
          <SelectItem value="WhatsApp" className="text-white hover:bg-[#333]">WhatsApp</SelectItem>
          <SelectItem value="Instagram" className="text-white hover:bg-[#333]">Instagram</SelectItem>
          <SelectItem value="Email" className="text-white hover:bg-[#333]">Email</SelectItem>
        </SelectContent>
      </Select>
      
      <Select onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
        <SelectTrigger className="w-full bg-[#222] border-gray-800 text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#222] border-gray-800 text-white">
          <SelectItem value="all" className="text-white hover:bg-[#333]">Todos</SelectItem>
          <SelectItem value="Aberta" className="text-white hover:bg-[#333]">Aberta</SelectItem>
          <SelectItem value="Fechada" className="text-white hover:bg-[#333]">Fechada</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          type="search" 
          placeholder="Buscar por nome ou mensagem..." 
          className="pl-10 w-full bg-[#222] border-gray-800 text-white placeholder:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ConversationFilters;
