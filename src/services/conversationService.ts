import { supabase } from "@/integrations/supabase/client";
import { Conversation, Message, InternalNote } from "@/types/conversation";

// Fetch conversations for leads
export const getConversationsForLeads = async (leadIds: string[]): Promise<Record<string, Conversation>> => {
  try {
    if (leadIds.length === 0) return {};
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .in('lead_id', leadIds)
      .order('horario', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations for leads:', error);
      return {};
    }
    
    // Create a mapping of lead_id to its latest conversation
    const conversationsMap: Record<string, Conversation> = {};
    if (data) {
      data.forEach(conversation => {
        // Only keep the most recent conversation per lead
        if (!conversationsMap[conversation.lead_id] || 
            new Date(conversation.horario) > new Date(conversationsMap[conversation.lead_id].horario)) {
          conversationsMap[conversation.lead_id] = conversation as Conversation;
        }
      });
    }
    
    return conversationsMap;
  } catch (error) {
    console.error('Error in getConversationsForLeads:', error);
    return {};
  }
};

// Get messages from a specific conversation
export const getMessagesFromConversation = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data as Message[];
  } catch (error) {
    console.error('Error in getMessagesFromConversation:', error);
    return [];
  }
};

// Get internal notes from a specific conversation
export const getInternalNotes = async (conversationId: string): Promise<InternalNote[]> => {
  try {
    const { data, error } = await supabase
      .from('internal_notes')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching internal notes:', error);
      return [];
    }
    
    return data as InternalNote[];
  } catch (error) {
    console.error('Error in getInternalNotes:', error);
    return [];
  }
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ nao_lida: false })
      .eq('id', conversationId);
    
    if (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markConversationAsRead:', error);
    return false;
  }
};

// Send a new message
export const sendMessage = async (
  conversationId: string, 
  content: string, 
  senderType: 'user' | 'lead',
  attachment?: { name: string, url: string, type: string }
): Promise<Message | null> => {
  try {
    // Create the message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        sender_type: senderType,
        attachment: attachment ? attachment : null,
      })
      .select()
      .single();
    
    if (messageError) {
      console.error('Error sending message:', messageError);
      return null;
    }
    
    // Update conversation with the new message and timestamp
    const { error: conversationError } = await supabase
      .from('conversations')
      .update({
        ultima_mensagem: content,
        horario: new Date().toISOString(),
        nao_lida: senderType === 'lead', // Mark as unread if it's from the lead
      })
      .eq('id', conversationId);
    
    if (conversationError) {
      console.error('Error updating conversation:', conversationError);
    }
    
    return messageData as Message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
};

// Add an internal note
export const addInternalNote = async (
  conversationId: string,
  content: string,
  userId: string,
  userName: string
): Promise<InternalNote | null> => {
  try {
    const { data, error } = await supabase
      .from('internal_notes')
      .insert({
        conversation_id: conversationId,
        content,
        user_id: userId,
        user_name: userName,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding internal note:', error);
      return null;
    }
    
    return data as InternalNote;
  } catch (error) {
    console.error('Error in addInternalNote:', error);
    return null;
  }
};
