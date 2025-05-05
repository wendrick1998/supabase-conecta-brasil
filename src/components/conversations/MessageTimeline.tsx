
import { Message, InternalNote } from '@/types/conversation';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageItem from './MessageItem';
import InternalNoteItem from './InternalNoteItem';
import { useEffect, useRef } from 'react';

interface MessageTimelineProps {
  messages: Message[];
  notes: InternalNote[];
}

const MessageTimeline = ({ messages, notes }: MessageTimelineProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 dark-scrollbar">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        
        {notes.length > 0 && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-[#121212] text-sm text-gray-400">
                Notas internas
              </span>
            </div>
          </div>
        )}
        
        {notes.map((note) => (
          <InternalNoteItem key={note.id} note={note} />
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageTimeline;
