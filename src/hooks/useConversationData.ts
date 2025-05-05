
import { useMessageActions } from './conversation/useMessageActions';
import { useNoteActions } from './conversation/useNoteActions';
import { useFetchConversation } from './conversation/useFetchConversation';

export const useConversationData = (id: string | undefined) => {
  // Use the extracted hooks
  const { 
    conversation, 
    messages, 
    notes, 
    loading, 
    error,
    setMessages,
    setNotes
  } = useFetchConversation(id);

  const {
    sendingMessage,
    handleSendMessage,
    handleSendMediaMessage,
    setSendingMessage
  } = useMessageActions(conversation?.id, setMessages);

  const { handleSaveNote } = useNoteActions(conversation?.id, setNotes);

  return {
    conversation,
    messages,
    notes,
    loading,
    error,
    sendingMessage,
    handleSendMessage,
    handleSaveNote,
    handleSendMediaMessage,
    setSendingMessage,
    setMessages,
  };
};
