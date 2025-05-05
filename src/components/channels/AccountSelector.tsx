
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { getChannelBgColor } from '@/utils/conversationUtils';

export interface ConnectedAccount {
  id: string;
  name: string;
  channelType: string;
  status: boolean;
}

interface AccountSelectorProps {
  accounts: ConnectedAccount[];
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string) => void;
  channelType: string;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ 
  accounts, 
  selectedAccountId, 
  onAccountSelect,
  channelType,
}) => {
  const selectedAccount = accounts.find(account => account.id === selectedAccountId);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedAccount ? (
            <span className="flex items-center">
              <span 
                className={`w-2 h-2 rounded-full mr-2 ${selectedAccount.status ? 'bg-green-500' : 'bg-gray-400'}`} 
              />
              {selectedAccount.name}
            </span>
          ) : (
            "Selecionar conta"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar conta..." />
          <CommandList>
            <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>
            <CommandGroup heading={`Contas ${channelType}`}>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.id}
                  onSelect={() => onAccountSelect(account.id)}
                >
                  <div className="flex items-center">
                    <span 
                      className={`w-2 h-2 rounded-full mr-2 ${account.status ? 'bg-green-500' : 'bg-gray-400'}`} 
                    />
                    <span>{account.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAccountId === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AccountSelector;
