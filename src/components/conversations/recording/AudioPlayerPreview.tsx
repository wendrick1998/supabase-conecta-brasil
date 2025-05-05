
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerPreviewProps {
  audioUrl: string;
}

const AudioPlayerPreview: React.FC<AudioPlayerPreviewProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format time to MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!audioUrl) {
      setError('URL de áudio inválida');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    const handleError = () => {
      console.error('Error loading audio:', audio.error);
      setError('Erro ao carregar áudio');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Reset if ended
      if (audio.currentTime >= audio.duration) {
        audio.currentTime = 0;
      }
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Erro ao reproduzir áudio');
      });
    }
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="w-full mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full mb-6 p-3 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-2">
        <button 
          onClick={togglePlayPause}
          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-blue-600" />
          ) : (
            <Play className="h-5 w-5 text-blue-600" />
          )}
        </button>
        
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="text-xs text-gray-500 font-mono min-w-[70px] text-right">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </span>
      </div>
      
      <audio ref={audioRef} className="hidden">
        <source src={audioUrl} type="audio/webm" />
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayerPreview;
