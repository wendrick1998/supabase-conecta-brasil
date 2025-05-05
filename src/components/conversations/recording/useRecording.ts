
import { useState, useRef, useEffect } from 'react';

export type MediaType = 'audio' | 'video' | 'photo';

interface RecordingState {
  isRecording: boolean;
  recordedMedia: {
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null;
}

interface UseRecordingProps {
  mediaType: MediaType;
  onStop?: () => void;
}

export const useRecording = ({ mediaType, onStop }: UseRecordingProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordedMedia: null
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isPausedRef = useRef<boolean>(false);
  
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    // Clean up function to stop media stream when component unmounts
    return () => {
      stopMediaStream();
    };
  }, []);

  const startRecording = async () => {
    try {
      let constraints;
      
      if (mediaType === 'photo') {
        constraints = {
          video: true
        };
      } else {
        constraints = {
          audio: true,
          video: mediaType === 'video'
        };
      }

      // Stop any existing stream
      stopMediaStream();
      
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (mediaType === 'photo') {
        // For photos, we just need to access the camera stream without recording
        setRecordingState(prev => ({ 
          ...prev, 
          isRecording: true 
        }));
        return;
      }
      
      // Reset chunks
      mediaChunksRef.current = [];
      
      // Create media recorder
      const mimeType = mediaType === 'audio' ? 'audio/webm' : 'video/webm';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      // Add data handler
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(mediaChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const fileName = `${mediaType}-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        
        setRecordingState({
          isRecording: false,
          recordedMedia: {
            url,
            blob,
            fileName
          }
        });
        
        isPausedRef.current = false;
        
        if (onStop) onStop();
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setRecordingState(prev => ({ ...prev, isRecording: true }));
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setRecordingState(prev => ({ ...prev, isRecording: false }));
    }
  };

  const stopRecording = () => {
    if (mediaType === 'photo' && streamRef.current) {
      // For photos, we would capture the image here, but for now just stop the stream
      stopMediaStream();
      setRecordingState({ isRecording: false, recordedMedia: null });
      return;
    }
    
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      isPausedRef.current = true;
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      isPausedRef.current = false;
    }
  };

  const resetRecording = () => {
    setRecordingState({
      isRecording: false,
      recordedMedia: null
    });
    
    if (recordingState.recordedMedia?.url) {
      URL.revokeObjectURL(recordingState.recordedMedia.url);
    }
    
    isPausedRef.current = false;
  };

  return {
    ...recordingState,
    stream: streamRef.current,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    stopMediaStream
  };
};
