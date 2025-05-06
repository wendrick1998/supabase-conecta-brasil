
import { ChangeEvent } from 'react';

// Adapter for channel filter to handle array to single channel conversion
export function createChannelAdapter(handler: (channels: string[]) => void) {
  return (channel: string) => {
    handler([channel]);
  };
}

// Adapter for status filter to handle array to single status conversion
export function createStatusAdapter(handler: (statuses: string[]) => void) {
  return (status: string) => {
    handler([status]);
  };
}

// Adapter for search term to handle event to string conversion
export function createSearchAdapter(handler: (term: string) => void) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    handler(e.target.value);
  };
}
