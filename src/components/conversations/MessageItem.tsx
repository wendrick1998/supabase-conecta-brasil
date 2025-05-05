
import { Message } from '@/types/conversation';
import { formatMessageTime } from '@/utils/conversationUtils';
import { FileText, Play, Mic } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const AudioPlayer = ({ url, name }: { url: string; name: string }) => {
  return (
    <div className="mt-2 flex flex-col p-2 bg-white bg-opacity-80 rounded border border-gray-200">
      <div className="flex items-center mb-1">
        <Mic className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
        <span className="text-sm truncate font-medium">{name}</span>
      </div>
      <audio controls className="w-full max-w-[250px] h-8 mt-1">
        <source src={url} type="audio/webm" />
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

const MessageItem = ({ message }: MessageItemProps) => {
  const renderAttachment = () => {
    if (!message.attachment) return null;
    
    // Audio attachment
    if (message.attachment.type.startsWith('audio/')) {
      return <AudioPlayer url={message.attachment.url} name={message.attachment.name} />;
    }
    
    // Video attachment
    if (message.attachment.type.startsWith('video/')) {
      return (
        <div className="mt-2 flex flex-col p-2 bg-white bg-opacity-80 rounded border border-gray-200">
          <video 
            controls 
            className="max-w-full rounded"
            style={{ maxHeight: '200px' }}
          >
            <source src={message.attachment.url} type={message.attachment.type} />
            Your browser does not support the video element.
          </video>
          <span className="text-xs text-gray-500 mt-1">{message.attachment.name}</span>
        </div>
      );
    }
    
    // Image attachment
    if (message.attachment.type.startsWith('image/')) {
      return (
        <div className="mt-2 flex flex-col">
          <img 
            src={message.attachment.url} 
            alt={message.attachment.name} 
            className="max-w-full rounded"
            style={{ maxHeight: '200px' }}
          />
          <span className="text-xs text-gray-500 mt-1">{message.attachment.name}</span>
        </div>
      );
    }
    
    // Default file attachment
    return (
      <div className="mt-2 flex items-center p-2 bg-white bg-opacity-50 rounded border border-gray-200">
        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="text-sm truncate">{message.attachment.name}</span>
      </div>
    );
  };

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
        
        {message.attachment && renderAttachment()}
        
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
