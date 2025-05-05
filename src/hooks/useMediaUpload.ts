
import { useState, useRef } from 'react';
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, getMediaType, validateFileSize, getBucketForFile, getFileDisplayName } from '@/utils/mediaCompression';
import { useAuth } from '@/contexts/AuthContext';

export const useMediaUpload = (conversationId: string | undefined) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadController = useRef<AbortController | null>(null);
  const { user } = useAuth();
  
  // Cache de uploads recentes
  const recentUploadsCache = useRef<Map<string, {url: string, type: string}>>(new Map());
  
  // Helper function to validate UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
  
  // Função para cancelar upload em andamento
  const cancelUpload = () => {
    if (uploadController.current) {
      uploadController.current.abort();
      uploadController.current = null;
      return true;
    }
    return false;
  };

  // Função para simular upload com progresso
  const simulateProgress = (onProgress: (progress: number) => void) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        progress = 95; // Never reach 100% until actual completion
        clearInterval(interval);
      }
      onProgress(progress);
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  const uploadMedia = async (file: File, messageText: string, retryCount = 0): Promise<boolean> => {
    if (!conversationId) {
      toast.error('ID de conversa não encontrado');
      return false;
    }
    
    if (!isValidUUID(conversationId)) {
      toast.error('ID de conversa inválido');
      return false;
    }
    
    if (!file || file.size === 0) {
      toast.error('Arquivo inválido ou vazio');
      return false;
    }
    
    // Verificar autenticação
    if (!user) {
      toast.error('Você precisa estar logado para enviar mídia');
      return false;
    }
    
    // Verificar se já estamos fazendo upload
    if (isUploading && retryCount === 0) {
      toast.warning('Upload em andamento. Aguarde a conclusão.');
      return false;
    }
    
    // Criar novo controller para este upload
    uploadController.current = new AbortController();
    setIsUploading(true);
    setUploadProgress(0);
    
    // Verificar cache para envios duplicados recentes
    const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
    const cachedUpload = recentUploadsCache.current.get(cacheKey);
    
    if (cachedUpload && retryCount === 0) {
      console.log('Arquivo similar foi enviado recentemente. Reusando dados:', cachedUpload);
      
      try {
        // Simular progresso para melhor UX
        const stopProgress = simulateProgress((progress) => {
          setUploadProgress(progress);
        });
        
        // Adicionar mensagem ao banco de dados com attachment do cache
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            content: messageText,
            sender_type: 'user',
            status: 'sent',
            attachment: {
              name: file.name,
              url: cachedUpload.url,
              type: cachedUpload.type,
              size: file.size,
              bucket: getBucketForFile(file)
            },
          })
          .select()
          .single();
        
        stopProgress();
        setUploadProgress(100);
        
        if (messageError) {
          console.error('Message error from cache:', messageError);
          throw new Error(`Erro ao salvar mensagem: ${messageError.message}`);
        }
        
        // Update conversation with latest message
        await supabase
          .from('conversations')
          .update({
            ultima_mensagem: messageText,
            horario: new Date().toISOString(),
            nao_lida: false,
          })
          .eq('id', conversationId);
        
        return true;
      } catch (error) {
        console.error('Erro ao usar cache de upload:', error);
        // Continuar com upload normal se falhar
      }
    }
    
    try {
      // Determine media type and validate
      const mediaType = getMediaType(file);
      if (!mediaType) {
        toast.error('Tipo de arquivo não suportado');
        return false;
      }
      
      // Validate file size
      if (!validateFileSize(file, mediaType)) {
        const maxSizes = {
          audio: "10MB",
          video: "20MB",
          image: "5MB",
          document: "15MB"
        };
        toast.error(`O arquivo excede o tamanho máximo permitido (${maxSizes[mediaType]})`);
        return false;
      }
      
      console.log(`Uploading ${mediaType}:`, {
        fileName: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        bucket: getBucketForFile(file)
      });
      
      // Simular início do progresso
      const stopProgress = simulateProgress((progress) => {
        setUploadProgress(progress);
      });
      
      // Compress file if it's an image
      let fileToUpload = file;
      if (mediaType === 'image') {
        try {
          fileToUpload = await compressImage(file);
          console.log('Image compressed from', file.size, 'to', fileToUpload.size, 'bytes');
        } catch (compressError) {
          console.error('Error compressing image:', compressError);
          // Continue with original file if compression fails
          toast.warning('Não foi possível otimizar a imagem. Enviando arquivo original.');
        }
      }
      
      // Generate a unique file path with proper validation
      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const bucketId = getBucketForFile(file);
      const filePath = `${conversationId}/${fileName}`;
      
      console.log(`Uploading to ${bucketId} bucket, path:`, filePath);
      
      // Upload file to the appropriate Supabase storage bucket
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(bucketId)
        .upload(filePath, fileToUpload, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });
      
      // Limpar simulação de progresso
      stopProgress();
      setUploadProgress(100);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase
        .storage
        .from(bucketId)
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      console.log('File uploaded successfully to', bucketId, 'URL:', fileUrl);
      
      // Adicionar ao cache
      recentUploadsCache.current.set(cacheKey, {
        url: fileUrl,
        type: file.type
      });
      
      // Limitar tamanho do cache
      if (recentUploadsCache.current.size > 20) {
        const oldestKey = recentUploadsCache.current.keys().next().value;
        recentUploadsCache.current.delete(oldestKey);
      }
      
      // Create message attachment object
      const attachment = {
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: fileToUpload.size,
        bucket: bucketId
      };
      
      // Add message to database with attachment
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: messageText,
          sender_type: 'user',
          status: 'sent',
          attachment,
        })
        .select()
        .single();
      
      if (messageError) {
        console.error('Message error:', messageError);
        throw new Error(`Erro ao salvar mensagem: ${messageError.message}`);
      }
      
      // Update conversation with latest message
      const { error: conversationError } = await supabase
        .from('conversations')
        .update({
          ultima_mensagem: messageText,
          horario: new Date().toISOString(),
          nao_lida: false,
        })
        .eq('id', conversationId);
      
      if (conversationError) {
        console.error('Conversation update error:', conversationError);
        // Continue even if conversation update fails - the message was already saved
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      
      // Tratamento de retry automatizado
      if (retryCount < 2 && !uploadController.current?.signal.aborted) {
        console.log(`Tentando novamente (${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadMedia(file, messageText, retryCount + 1);
      }
      
      toast.error('Não foi possível enviar a mídia.');
      return false;
    } finally {
      if (retryCount === 0 || retryCount >= 2) {
        setIsUploading(false);
        uploadController.current = null;
      }
    }
  };
  
  return {
    isUploading,
    uploadProgress,
    uploadMedia,
    cancelUpload
  };
};

export default useMediaUpload;
