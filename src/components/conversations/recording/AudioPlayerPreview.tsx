
import React from 'react';

interface AudioPlayerPreviewProps {
  audioUrl: string;
}

const AudioPlayerPreview: React.FC<AudioPlayerPreviewProps> = ({ audioUrl }) => {
  if (!audioUrl) return null;
  
  return (
    <div className="w-full mb-6">
      <audio 
        src={audioUrl} 
        controls 
        className="w-full"
        autoPlay={false}
      />
    </div>
  );
};

export default AudioPlayerPreview;
