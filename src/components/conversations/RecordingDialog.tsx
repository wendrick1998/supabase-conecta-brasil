
import React, { useRef, useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type MediaType = 'audio' | 'video';

interface RecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType;
  onSave: (file: File) => void;
}

const RecordingDialog = ({ open, onOpenChange, mediaType, onSave }: RecordingDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMedia, setRecordedMedia] = useState<{
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const closeDialog = () => {
    stopMediaStream();
    onOpenChange(false);
  };

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: mediaType === 'video'
      };

      // Stop any existing stream
      stopMediaStream();
      
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
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
        
        setRecordedMedia({
          url,
          blob,
          fileName
        });
        
        setIsRecording(false);
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveRecording = () => {
    if (recordedMedia && recordedMedia.blob) {
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      onSave(file);
      closeDialog();
    }
  };

  React.useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setRecordedMedia(null);
      setIsRecording(false);
    } else {
      stopMediaStream();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (isRecording) {
        // Prevent closing while recording
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        if (isRecording) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>
            {isRecording 
              ? `Gravando ${mediaType === 'audio' ? 'áudio' : 'vídeo'}...` 
              : `Gravar ${mediaType === 'audio' ? 'áudio' : 'vídeo'}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {mediaType === 'video' && streamRef.current && isRecording && (
            <video 
              autoPlay 
              muted 
              className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
            >
              <source src={streamRef.current ? '' : undefined} />
            </video>
          )}
          
          {mediaType === 'video' && recordedMedia && !isRecording && (
            <video 
              src={recordedMedia.url} 
              controls 
              className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
            />
          )}
          
          {mediaType === 'audio' && isRecording && (
            <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center mb-4">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span>Gravando áudio...</span>
            </div>
          )}
          
          {mediaType === 'audio' && recordedMedia && !isRecording && (
            <audio 
              src={recordedMedia.url} 
              controls 
              className="w-full mb-4"
            />
          )}
          
          {isRecording && (
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Gravando...</span>
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            {!isRecording && !recordedMedia && (
              <Button
                onClick={startRecording}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Gravação
              </Button>
            )}
            
            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="destructive"
              >
                Parar Gravação
              </Button>
            )}
            
            {recordedMedia && !isRecording && (
              <>
                <Button
                  onClick={startRecording}
                  variant="outline"
                >
                  Regravar
                </Button>
                
                <Button
                  onClick={saveRecording}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Salvar e Enviar
                </Button>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          {!isRecording && (
            <Button
              type="button"
              variant="secondary"
              onClick={closeDialog}
            >
              Cancelar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
