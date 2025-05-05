
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, getMediaType, validateFileSize, getBucketForFile, getFileDisplayName } from '@/utils/mediaCompression';

export const useMediaUpload = (conversationId: string | undefined) => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Helper function to validate UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
  
  const uploadMedia = async (file: File, messageText: string): Promise<boolean> => {
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
    
    setIsUploading(true);
    
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
      
      // Compress file if it's an image
      let fileToUpload = file;
      if (mediaType === 'image') {
        fileToUpload = await compressImage(file);
        console.log('Image compressed from', file.size, 'to', fileToUpload.size, 'bytes');
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
          cacheControl: '3600'
        });
      
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
      
      if (messageError) throw messageError;
      
      // Update conversation with latest message
      await supabase
        .from('conversations')
        .update({
          ultima_mensagem: messageText,
          horario: new Date().toISOString(),
          nao_lida: false,
        })
        .eq('id', conversationId);
      
      toast.success(`${messageText}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      toast.error('Não foi possível enviar a mídia');
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    isUploading,
    uploadMedia
  };
};

export default useMediaUpload;
