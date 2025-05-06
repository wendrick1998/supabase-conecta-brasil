
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Conversation, Message } from '@/types/conversation';
import { getConversationById, getConversations, markConversationAsRead, markConversationAsClosed } from '../conversationService';

// Query keys
export const QUERY_KEYS = {
  conversations: 'conversations',
  conversation: (id: string) => ['conversation', id],
  messages: (conversationId: string) => ['messages', conversationId],
};

// Types for custom queries
interface ConversationListQueryOptions {
  enabled?: boolean;
  onSuccess?: (data: Conversation[]) => void;
  onError?: (error: Error) => void;
}

interface SingleConversationQueryOptions {
  enabled?: boolean;
  onSuccess?: (data: Conversation) => void;
  onError?: (error: Error) => void;
}

// Function to fetch all conversations with optional query params
export function useConversationsQuery(options: ConversationListQueryOptions = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.conversations],
    queryFn: () => getConversations(),
    ...options
  });
}

// Function to fetch a single conversation by ID
export function useConversationByIdQuery(
  conversationId: string,
  options: SingleConversationQueryOptions = {}
) {
  return useQuery({
    queryKey: QUERY_KEYS.conversation(conversationId),
    queryFn: () => getConversationById(conversationId),
    enabled: !!conversationId && (options.enabled !== false),
    ...options
  });
}

// Mutation to mark a conversation as read
export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      // Update the conversation in the cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversation(conversationId) });
      
      // Update the conversation list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversations] });
    }
  });
}

// Mutation to mark a conversation as closed/resolved
export function useMarkAsClosedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationAsClosed(conversationId),
    onSuccess: (_, conversationId) => {
      // Update the conversation in the cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversation(conversationId) });
      
      // Update the conversation list to reflect status change
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversations] });
    }
  });
}

// Optimistic update for adding a message to a conversation
export function updateMessagesCache(
  queryClient: any,
  conversationId: string,
  newMessage: Message
) {
  // Update the messages cache
  queryClient.setQueryData(
    QUERY_KEYS.messages(conversationId),
    (oldData: Message[] | undefined) => {
      if (!oldData) return [newMessage];
      return [...oldData, newMessage];
    }
  );

  // Update the unread status in the conversations list and the single conversation
  queryClient.setQueryData(
    [QUERY_KEYS.conversations],
    (oldData: Conversation[] | undefined) => {
      if (!oldData) return undefined;
      
      return oldData.map(conversation => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            last_message: newMessage.content,
            last_message_time: newMessage.timestamp,
            unread_count: conversation.unread_count + (newMessage.is_from_me ? 0 : 1)
          };
        }
        return conversation;
      });
    }
  );

  // Update the single conversation
  queryClient.setQueryData(
    QUERY_KEYS.conversation(conversationId),
    (oldData: Conversation | undefined) => {
      if (!oldData) return undefined;
      
      return {
        ...oldData,
        last_message: newMessage.content,
        last_message_time: newMessage.timestamp,
        unread_count: oldData.unread_count + (newMessage.is_from_me ? 0 : 1)
      };
    }
  );
}
