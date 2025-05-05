
import React, { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { Conversation } from '@/types/conversation';
import { ArrowLeft, UserRound, X } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import LeadInfoSidebar from './LeadInfoSidebar';

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
  const [showLeadInfo, setShowLeadInfo] = useState(false);
  
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

  const toggleLeadInfo = () => {
    setShowLeadInfo(prev => !prev);
  };

  return (
    <div className="flex flex-1 h-full min-h-0 overflow-hidden">
      {/* Left sidebar with conversation list - hide on mobile when chat is visible */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-vendah-purple/20 bg-surface/30 ${showMobileChat ? 'hidden md:block' : 'block'}`}>
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
            <div className="md:hidden p-2 bg-surface/60 border-b border-vendah-purple/20 flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-text-muted hover:text-white"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Voltar à lista</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center text-text-muted hover:text-white"
                onClick={toggleLeadInfo}
              >
                <UserRound className="h-4 w-4 mr-1" />
                <span>Info do Lead</span>
              </Button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-grow">
                <ChatWindow conversation={selectedConversation} />
              </div>
              
              {/* Lead info sidebar - hidden on mobile unless toggled */}
              <div className={`border-l border-vendah-purple/20 bg-surface/20 w-80 lg:w-96 ${
                showLeadInfo ? 'fixed inset-y-0 right-0 z-40 block md:relative' : 'hidden lg:block'
              }`}>
                {showLeadInfo && (
                  <div className="flex justify-between items-center p-2 md:hidden">
                    <span className="font-medium">Informações do Lead</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={toggleLeadInfo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <LeadInfoSidebar conversation={selectedConversation} />
              </div>
            </div>
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
      
      {/* Desktop-only lead info toggle */}
      {selectedConversation && (
        <div className="hidden md:block lg:hidden absolute bottom-4 right-4">
          <Button 
            className="rounded-full h-12 w-12 shadow-lg"
            variant="default"
            size="icon"
            onClick={toggleLeadInfo}
          >
            <UserRound className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default InboxLayout;
