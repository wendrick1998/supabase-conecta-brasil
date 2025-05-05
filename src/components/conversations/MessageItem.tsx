
import { Message } from '@/types/conversation';
import { formatMessageTime } from '@/utils/conversationUtils';
import { FileText, Play, Mic, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MessageItemProps {
  message: Message;
}

const AudioPlayer = ({ url, name }: { url: string; name: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Format time to mm:ss
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle audio metadata loaded - get duration
  const handleMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Update playing state based on audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Calculate progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-2 flex flex-col p-2 bg-white bg-opacity-80 rounded-lg border border-gray-200">
      <div className="flex items-center mb-1">
        <Mic className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
        <span className="text-sm truncate font-medium">{name}</span>
      </div>
      
      <div className="flex items-center space-x-2 mt-1">
        <button 
          onClick={togglePlayPause}
          className={`p-1 rounded-full ${isPlaying ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-blue-200 transition-colors`}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-blue-600" />
          ) : (
            <Play className="h-4 w-4 text-blue-600" />
          )}
        </button>
        
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="text-xs text-gray-500 font-mono min-w-[40px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden">
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
