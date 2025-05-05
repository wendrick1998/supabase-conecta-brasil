
import { Conversation } from "@/types/conversation";
import { InboxFilters } from "@/types/inboxTypes";

// Store conversations in localStorage for offline usage
export const storeConversationsCache = (data: Conversation[]): void => {
  try {
    if (data && data.length > 0) {
      localStorage.setItem('conversations-cache', JSON.stringify(data));
      localStorage.setItem('conversations-cache-timestamp', Date.now().toString());
    }
  } catch (e) {
    console.warn('Failed to cache conversations in localStorage:', e);
  }
};

// Load conversations from cache
export const loadConversationsCache = (): Conversation[] => {
  try {
    const cachedData = localStorage.getItem('conversations-cache');
    if (cachedData) {
      return JSON.parse(cachedData) as Conversation[];
    }
  } catch (e) {
    console.warn('Failed to load cached conversations:', e);
  }
  return [];
};

// Store conversation stats in localStorage for offline usage
export const storeConversationStatsCache = (stats: {
  total: number;
  unread: number;
  byChannel: Record<string, number>;
}): void => {
  try {
    localStorage.setItem('conversation-stats-cache', JSON.stringify(stats));
    localStorage.setItem('conversation-stats-timestamp', Date.now().toString());
  } catch (e) {
    console.warn('Failed to cache conversation stats:', e);
  }
};

// Load conversation stats from cache
export const loadConversationStatsCache = (): {
  total: number;
  unread: number;
  byChannel: Record<string, number>;
} | null => {
  try {
    const cachedStats = localStorage.getItem('conversation-stats-cache');
    if (cachedStats) {
      return JSON.parse(cachedStats);
    }
  } catch (e) {
    console.warn('Failed to load cached conversation stats:', e);
  }
  return null;
};

// Store connected accounts in localStorage for offline usage
export const storeConnectedAccountsCache = (accounts: Array<{id: string, nome: string, canal: string}>): void => {
  try {
    localStorage.setItem('connected-accounts-cache', JSON.stringify(accounts));
    localStorage.setItem('connected-accounts-timestamp', Date.now().toString());
  } catch (e) {
    console.warn('Failed to cache connected accounts:', e);
  }
};

// Load connected accounts from cache
export const loadConnectedAccountsCache = (): Array<{id: string, nome: string, canal: string}> => {
  try {
    const cachedAccounts = localStorage.getItem('connected-accounts-cache');
    if (cachedAccounts) {
      return JSON.parse(cachedAccounts);
    }
  } catch (e) {
    console.warn('Failed to load cached connected accounts:', e);
  }
  return [];
};
