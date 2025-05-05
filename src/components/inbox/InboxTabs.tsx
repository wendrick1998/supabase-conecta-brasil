
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Instagram, Mail, Facebook } from 'lucide-react';
import { Conversation } from '@/types/conversation';

interface InboxTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  conversations: Conversation[];
}

const InboxTabs: React.FC<InboxTabsProps> = ({
  selectedTab,
  onTabChange,
  conversations
}) => {
  return (
    <Tabs defaultValue="all" value={selectedTab} onValueChange={onTabChange}>
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="all" className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Todos
          <Badge variant="outline" className="ml-2">{conversations.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="unread" className="flex items-center">
          Não lidas
          <Badge variant="outline" className="ml-2">
            {conversations.filter(c => c.nao_lida).length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="whatsapp" className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-[#25D366]" />
          WhatsApp
          <Badge variant="outline" className="ml-2">
            {conversations.filter(c => c.canal === 'WhatsApp').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="instagram" className="flex items-center">
          <Instagram className="h-4 w-4 mr-2 text-[#C13584]" />
          Instagram
          <Badge variant="outline" className="ml-2">
            {conversations.filter(c => c.canal === 'Instagram').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="facebook" className="flex items-center">
          <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
          Facebook
          <Badge variant="outline" className="ml-2">
            {conversations.filter(c => c.canal === 'Facebook').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          Email
          <Badge variant="outline" className="ml-2">
            {conversations.filter(c => c.canal === 'Email').length}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default InboxTabs;
