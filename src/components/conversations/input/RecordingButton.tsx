
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import AudioRecordButton from '../AudioRecordButton';

interface RecordingButtonProps {
  onRecordAudio?: (file: File) => void;
  isRecording: boolean;
}

const RecordingButton = ({ onRecordAudio, isRecording }: RecordingButtonProps) => {
  const [mediaRecorderRef, setMediaRecorderRef] = useState<MediaRecorder | null>(null);
  const [audioChunksRef, setAudioChunksRef] = useState<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize recorder
      const chunks: BlobPart[] = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      setMediaRecorderRef(mediaRecorder);
      setAudioChunksRef(chunks);
      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Não foi possível acessar o microfone");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef || !onRecordAudio) return;
    
    return new Promise<File>((resolve) => {
      mediaRecorderRef.onstop = () => {
        const audioBlob = new Blob(audioChunksRef, { type: 'audio/webm' });
        const audioFile = new File(
          [audioBlob],
          `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`,
          { type: 'audio/webm' }
        );
        
        // Stop all tracks
        mediaRecorderRef
          .stream
          .getTracks()
          .forEach(track => track.stop());
        
        resolve(audioFile);
      };
      
      mediaRecorderRef.stop();
    });
  }, [mediaRecorderRef, audioChunksRef, onRecordAudio]);

  const handleStopRecording = useCallback(async () => {
    if (!onRecordAudio) return;
    
    try {
      const audioFile = await stopRecording();
      if (audioFile) {
        onRecordAudio(audioFile);
        toast.success("Áudio enviado com sucesso");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Erro ao processar o áudio");
    }
  }, [onRecordAudio, stopRecording]);

  const handleCancelRecording = useCallback(() => {
    if (!mediaRecorderRef || !isRecording) return;
    
    // Stop all tracks without saving
    mediaRecorderRef
      .stream
      .getTracks()
      .forEach(track => track.stop());
    
    toast.info("Gravação cancelada");
  }, [isRecording, mediaRecorderRef]);

  return (
    <>
      {onRecordAudio && (
        <AudioRecordButton 
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
          onCancelRecording={handleCancelRecording}
          isRecording={isRecording}
        />
      )}
    </>
  );
};

export default RecordingButton;
