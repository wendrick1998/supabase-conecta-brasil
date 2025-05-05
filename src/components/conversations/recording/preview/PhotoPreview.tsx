
import React from 'react';

interface PhotoPreviewProps {
  stream: MediaStream | null;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ stream }) => {
  if (!stream) return null;
  
  return (
    <div className="relative w-full">
      <video 
        autoPlay 
        muted 
        className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
        ref={(videoElement) => {
          if (videoElement && stream) {
            videoElement.srcObject = stream;
          }
        }}
      />
    </div>
  );
};

export default PhotoPreview;
