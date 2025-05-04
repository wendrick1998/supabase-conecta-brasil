
import { Message } from '@/types/conversation';
import { formatMessageTime } from '@/utils/conversationUtils';
import { FileText } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div
      className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm 
          ${message.sender_type === 'user' 
            ? 'bg-pink-100 text-gray-800' 
            : 'bg-blue-100 text-gray-800'}`}
      >
        <div className="mb-1">{message.content}</div>
        
        {message.attachment && (
          <div className="mt-2 flex items-center p-2 bg-white bg-opacity-50 rounded border border-gray-200">
            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{message.attachment.name}</span>
          </div>
        )}
        
        <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
          <span>{formatMessageTime(message.timestamp)}</span>
          {message.sender_type === 'user' && (
            <span className="ml-1">• {message.status}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
