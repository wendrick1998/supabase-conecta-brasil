
// Helper types for inbox service to avoid deep type recursion
export type ChannelType = string;
export type StatusType = string;
export type PriorityType = string;
export type SearchPattern = string;

// Simple object type for filter channels
export type FilterChannels = ChannelType[];

// Simple object type for filter status
export type FilterStatus = StatusType[];

// Simple date range type
export interface DateRangeType {
  from: Date;
  to: Date;
}

// Base filters interface without deep recursion
export interface InboxFiltersBase {
  search?: string;
  canais?: FilterChannels;
  status?: FilterStatus;
  dateRange?: DateRangeType;
  priority?: PriorityType;
  accountId?: string;
  channel?: string;
}
