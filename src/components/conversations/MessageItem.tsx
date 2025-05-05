import { Message } from '@/types/conversation';
import { formatMessageTime } from '@/utils/conversationUtils';
import { FileText, Play, Mic, Pause, FileIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getFileDisplayName } from '@/utils/mediaCompression';

interface MessageItemProps {
  message: Message;
}

// Enhanced audio player component with error handling and retry
const AudioPlayer = ({ url, name }: { url: string; name: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
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
      setLoaded(true);
      setError(null);
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
        // Reset if at the end
        if (audioRef.current.currentTime >= audioRef.current.duration) {
          audioRef.current.currentTime = 0;
        }
        
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setError('Erro ao reproduzir áudio');
        });
      }
    }
  };

  // Handle retry loading
  const handleRetry = () => {
    if (audioRef.current) {
      setError(null);
      audioRef.current.load();
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
    const handleError = () => {
      console.error('Error loading audio:', audio.error);
      setError('Erro ao carregar áudio');
      setLoaded(false);
    };
    
    // Add audio loading callback
    const handleCanPlay = () => {
      console.log('Audio can be played', url);
      setError(null);
      setLoaded(true);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [url]);

  // Calculate progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0;
  
  const displayName = getFileDisplayName(name);

  if (error) {
    return (
      <div className="mt-2 flex flex-col p-2 bg-red-50 rounded-lg border border-red-200 text-red-600 text-sm">
        <div className="flex items-center mb-1">
          <Mic className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate font-medium">{displayName}</span>
        </div>
        <div className="text-xs mb-2">{error}</div>
        <button 
          onClick={handleRetry}
          className="text-xs bg-white py-1 px-2 rounded border border-red-300 hover:bg-red-50"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col p-2 bg-white bg-opacity-80 rounded-lg border border-gray-200">
      <div className="flex items-center mb-1">
        <Mic className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
        <span className="text-sm truncate font-medium">{displayName}</span>
      </div>
      
      <div className="flex items-center space-x-2 mt-1">
        <button 
          onClick={togglePlayPause}
          disabled={!loaded}
          className={`p-1 rounded-full ${isPlaying ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-blue-200 transition-colors ${!loaded ? 'opacity-50' : ''}`}
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-blue-600" />
          ) : (
            <Play className="h-4 w-4 text-blue-600" />
          )}
        </button>
        
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          {loaded ? (
            <div 
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          ) : (
            <div className="h-full bg-gray-300 animate-pulse" style={{ width: '100%' }} />
          )}
        </div>
        
        <span className="text-xs text-gray-500 font-mono min-w-[40px] text-right">
          {loaded ? (
            `${formatTime(currentTime)} / ${formatTime(duration)}`
          ) : (
            "00:00 / 00:00"
          )}
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

// Document attachment component
const DocumentAttachment = ({ url, name, type }: { url: string; name: string; type: string }) => {
  const displayName = getFileDisplayName(name);
  
  // Determine icon based on file type
  const getFileIcon = () => {
    if (type.includes('pdf')) {
      return <FileText className="h-4 w-4 mr-2 text-red-500" />;
    } else if (type.includes('word') || type.includes('doc')) {
      return <FileText className="h-4 w-4 mr-2 text-blue-600" />;
    } else if (type.includes('excel') || type.includes('sheet')) {
      return <FileText className="h-4 w-4 mr-2 text-green-600" />;
    } else {
      return <FileIcon className="h-4 w-4 mr-2 text-gray-600" />;
    }
  };
  
  return (
    <div className="mt-2">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center p-2 bg-white bg-opacity-70 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {getFileIcon()}
        <span className="text-sm truncate">{displayName}</span>
      </a>
    </div>
  );
};

// Image with modal zoom component
const ImageAttachment = ({ url, name }: { url: string; name: string }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const displayName = getFileDisplayName(name);
  
  return (
    <div className="mt-2 flex flex-col">
      <div className="relative">
        <img 
          src={url} 
          alt={displayName} 
          onClick={() => setIsZoomed(true)}
          className="max-w-full rounded cursor-pointer hover:opacity-90 transition-opacity"
          style={{ maxHeight: '200px' }}
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
          Clique para ampliar
        </div>
      </div>
      
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <img 
            src={url} 
            alt={displayName}
            className="max-w-full max-h-full object-contain"
          />
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            onClick={() => setIsZoomed(false)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

// Video player component
const VideoAttachment = ({ url, name }: { url: string; name: string }) => {
  const displayName = getFileDisplayName(name);
  
  return (
    <div className="mt-2 flex flex-col p-2 bg-white bg-opacity-80 rounded border border-gray-200">
      <video 
        controls 
        className="max-w-full rounded"
        style={{ maxHeight: '200px' }}
        preload="metadata"
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        Your browser does not support the video element.
      </video>
      <span className="text-xs text-gray-500 mt-1">{displayName}</span>
    </div>
  );
};

const MessageItem = ({ message }: MessageItemProps) => {
  const renderAttachment = () => {
    if (!message.attachment) return null;
    
    // Use filename as fallback if name is not available
    const attachmentName = message.attachment.name || message.attachment.filename || 'file';
    
    // Audio attachment
    if (message.attachment.type.startsWith('audio/')) {
      return <AudioPlayer url={message.attachment.url} name={attachmentName} />;
    }
    
    // Video attachment
    if (message.attachment.type.startsWith('video/')) {
      return <VideoAttachment url={message.attachment.url} name={attachmentName} />;
    }
    
    // Image attachment
    if (message.attachment.type.startsWith('image/')) {
      return <ImageAttachment url={message.attachment.url} name={attachmentName} />;
    }
    
    // Document attachment
    return <DocumentAttachment url={message.attachment.url} name={attachmentName} type={message.attachment.type} />;
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
