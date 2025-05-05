
import { Message } from '@/types/conversation';
import useMediaUpload from '@/hooks/useMediaUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchMessages } from './useFetchMessages';
import { useSendMessage } from './useSendMessage';
import { useSendMediaMessage } from './useSendMediaMessage';

export const useMessageActions = (
  conversationId: string | undefined, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const { uploadMedia } = useMediaUpload(conversationId);
  const { user } = useAuth();
  
  // Use our split hooks
  const { 
    isLoadingMoreMessages, 
    hasMoreMessages, 
    fetchMessages 
  } = useFetchMessages(conversationId);
  
  const { 
    sendingMessage, 
    setSendingMessage, 
    handleSendMessage 
  } = useSendMessage(conversationId, setMessages);
  
  const { handleSendMediaMessage: handleSendMedia } = useSendMediaMessage(
    conversationId, 
    setMessages, 
    uploadMedia
  );

  // Wrapper to include user from context
  const handleSendMediaMessage = async (file: File, contentText: string) => {
    return handleSendMedia(file, contentText, user);
  };

  // Wrapper to include user from context
  const sendMessage = async (newMessage: string) => {
    return handleSendMessage(newMessage, user);
  };

  return {
    sendingMessage,
    isLoadingMoreMessages,
    hasMoreMessages,
    handleSendMessage: sendMessage,
    handleSendMediaMessage,
    fetchMessages,
    setSendingMessage
  };
};
