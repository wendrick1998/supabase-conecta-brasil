
import imageCompression from 'browser-image-compression';

// Maximum sizes in bytes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 15 * 1024 * 1024; // 15MB

// Tamanhos alvo para melhor performance
const TARGET_IMAGE_SIZE_MB = 0.8; // 800KB
const MAX_WIDTH_LARGE = 1920; 
const MAX_WIDTH_MEDIUM = 1280;
const MAX_WIDTH_SMALL = 800;

// Cache para URLs de arquivos já processados
const processedFilesCache = new Map<string, string>();

// Configurações para compressão de imagem com diferentes níveis
const compressionOptions = {
  high: {
    maxSizeMB: TARGET_IMAGE_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_LARGE,
    useWebWorker: true,
    quality: 0.85
  },
  medium: {
    maxSizeMB: TARGET_IMAGE_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_MEDIUM,
    useWebWorker: true,
    quality: 0.75
  },
  low: {
    maxSizeMB: TARGET_IMAGE_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_SMALL,
    useWebWorker: true,
    quality: 0.65
  }
};

// Check if file exceeds max size
export const validateFileSize = (file: File, type: 'audio' | 'video' | 'image' | 'document'): boolean => {
  const maxSizes = {
    audio: MAX_AUDIO_SIZE,
    video: MAX_VIDEO_SIZE,
    image: MAX_IMAGE_SIZE,
    document: MAX_DOCUMENT_SIZE
  };
  
  return file.size <= maxSizes[type];
};

// Determine media type from MIME type with memoization
const mimeTypeCache = new Map<string, 'audio' | 'video' | 'image' | 'document' | null>();

export const getMediaType = (file: File): 'audio' | 'video' | 'image' | 'document' | null => {
  // Verificar no cache primeiro
  if (mimeTypeCache.has(file.type)) {
    return mimeTypeCache.get(file.type) as 'audio' | 'video' | 'image' | 'document' | null;
  }
  
  const mimeType = file.type.toLowerCase();
  let result: 'audio' | 'video' | 'image' | 'document' | null = null;
  
  if (mimeType.startsWith('audio/')) result = 'audio';
  else if (mimeType.startsWith('video/')) result = 'video';
  else if (mimeType.startsWith('image/')) result = 'image';
  else {
    // Common document MIME types
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'text/plain',
      'application/rtf'
    ];
    
    if (documentTypes.includes(mimeType)) result = 'document';
  }
  
  // Armazenar no cache para futuras consultas
  mimeTypeCache.set(file.type, result);
  return result;
};

// Compress image file with adaptive compression
export const compressImage = async (file: File): Promise<File> => {
  try {
    console.log('Compressing image:', file.name, file.size);
    
    // Skip compression for small images
    if (file.size < 500 * 1024) { // Less than 500KB
      console.log('Image already small, skipping compression');
      return file;
    }
    
    // Chave de cache baseada no nome e tamanho do arquivo
    const cacheKey = `${file.name}-${file.size}`;
    
    // Check if we've already compressed this file
    if (processedFilesCache.has(cacheKey)) {
      console.log('Using cached compressed version');
      const cachedUrl = processedFilesCache.get(cacheKey);
      const response = await fetch(cachedUrl as string);
      const blob = await response.blob();
      return new File([blob], file.name, { type: file.type });
    }
    
    // Escolher nível de compressão com base no tamanho do arquivo
    let options;
    if (file.size > 5 * 1024 * 1024) { // > 5MB
      options = compressionOptions.low;
    } else if (file.size > 2 * 1024 * 1024) { // > 2MB
      options = compressionOptions.medium;
    } else {
      options = compressionOptions.high;
    }
    
    // Changed from const to let to allow reassignment
    let compressedBlob = await imageCompression(file, options);
    console.log('Compression complete:', compressedBlob.size, 'bytes');
    
    // Se a compressão não reduziu o tamanho significativamente, tente um nível mais agressivo
    if (compressedBlob.size > file.size * 0.8 && file.size > 1 * 1024 * 1024) {
      console.log('First compression not effective, trying more aggressive settings');
      const moreCompressedBlob = await imageCompression(file, compressionOptions.low);
      
      // Compare results and use the smaller one
      if (moreCompressedBlob.size < compressedBlob.size) {
        console.log('Using more aggressive compression:', moreCompressedBlob.size, 'bytes');
        compressedBlob = moreCompressedBlob;
      }
    }
    
    // Cache the compressed result
    const objectUrl = URL.createObjectURL(compressedBlob);
    processedFilesCache.set(cacheKey, objectUrl);
    
    // Create new file with original filename but compressed content
    return new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: file.lastModified
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return file;
  }
};

// Get the appropriate Supabase storage bucket based on file type
export const getBucketForFile = (file: File): string => {
  const mediaType = getMediaType(file);
  
  switch (mediaType) {
    case 'audio':
      return 'audios';
    case 'video':
      return 'videos';
    case 'image':
      return 'images';
    case 'document':
      return 'documents';
    default:
      return 'documents'; // Default fallback
  }
};

// Generate a user-friendly display name for the file
export const getFileDisplayName = (fileName: string): string => {
  // Trim date/timestamp prefix if present (e.g., "1715529934839-xyz.jpg" -> "xyz.jpg")
  const nameWithoutPrefix = fileName.replace(/^\d+-/, '');
  
  // Handle very long filenames
  if (nameWithoutPrefix.length > 25) {
    const extension = nameWithoutPrefix.split('.').pop() || '';
    const baseName = nameWithoutPrefix.substring(0, 20);
    return `${baseName}...${extension ? '.' + extension : ''}`;
  }
  
  return nameWithoutPrefix;
};

// Limpar o cache de URLs quando não forem mais necessárias
export const clearMediaCache = () => {
  processedFilesCache.forEach(url => {
    URL.revokeObjectURL(url);
  });
  processedFilesCache.clear();
};
