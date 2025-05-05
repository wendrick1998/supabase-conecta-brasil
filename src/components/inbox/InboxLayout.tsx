
import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { Conversation } from '@/types/conversation';

const InboxLayout: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] bg-[#121212] overflow-hidden">
      {/* Left sidebar with conversation list */}
      <div className="w-full md:w-1/3 xl:w-1/4 border-r border-vendah-purple/20 bg-surface/30">
        <ConversationList 
          selectedConversationId={selectedConversation?.id} 
          onSelectConversation={setSelectedConversation} 
        />
      </div>

      {/* Main chat window */}
      <div className="hidden md:flex flex-col flex-grow">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">Selecione uma conversa</h2>
            <p className="text-text-muted max-w-md">
              Escolha uma conversa da lista para visualizar as mensagens e interagir com o lead
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxLayout;
