
import { InboxFiltersBase } from "@/types/inboxTypes";

// Re-export the interface with the base type to prevent circular references
export interface InboxFilters extends InboxFiltersBase {}

// Re-export from query module
export { 
  getConversations,
  getConversationStats,
  getConnectedAccounts 
} from './inbox/conversationQueries';

// Re-export from cache module
export {
  storeConversationsCache,
  loadConversationsCache,
  storeConversationStatsCache,
  loadConversationStatsCache,
  storeConnectedAccountsCache,
  loadConnectedAccountsCache
} from './inbox/conversationCache';

// Re-export from notifications module
export {
  showNewConversationNotification,
  subscribeToConversations
} from './inbox/conversationNotifications';
