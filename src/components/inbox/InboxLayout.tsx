
import React, { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { Conversation } from '@/types/conversation';
import { ArrowLeft } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

interface InboxLayoutProps {
  conversations?: Conversation[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const InboxLayout: React.FC<InboxLayoutProps> = ({ 
  conversations = [],
  isLoading = false,
  emptyMessage = "Nenhuma conversa disponível"
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  // Reset mobile chat view when switching to larger screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileChat(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update mobile chat visibility when conversation is selected
  useEffect(() => {
    if (selectedConversation && window.innerWidth < 768) {
      setShowMobileChat(true);
    }
  }, [selectedConversation]);
  
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (window.innerWidth < 768) {
      setShowMobileChat(true);
    }
  };
  
  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex flex-1 h-full min-h-0 overflow-hidden">
      {/* Left sidebar with conversation list - hide on mobile when chat is visible */}
      <div className={`w-full md:w-1/3 xl:w-1/4 border-r border-vendah-purple/20 bg-surface/30 ${showMobileChat ? 'hidden md:block' : 'block'}`}>
        <ConversationList 
          conversations={conversations}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          selectedConversationId={selectedConversation?.id} 
          onSelectConversation={handleSelectConversation} 
        />
      </div>

      {/* Main chat window - visible on mobile only when a chat is selected */}
      <div className={`${showMobileChat ? 'block' : 'hidden'} md:flex flex-col flex-grow`}>
        {selectedConversation ? (
          <>
            {/* Mobile-only back button */}
            <div className="md:hidden p-2 bg-surface/60 border-b border-vendah-purple/20">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-text-muted hover:text-white"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Voltar à lista</span>
              </Button>
            </div>
            
            <ChatWindow conversation={selectedConversation} />
          </>
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
