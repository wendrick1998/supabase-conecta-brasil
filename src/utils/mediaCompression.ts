
import imageCompression from 'browser-image-compression';

// Maximum sizes in bytes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 15 * 1024 * 1024; // 15MB

// Configuration for image compression
const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1280,
  useWebWorker: true,
  quality: 0.75
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

// Determine media type from MIME type
export const getMediaType = (file: File): 'audio' | 'video' | 'image' | 'document' | null => {
  const mimeType = file.type.toLowerCase();
  
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  
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
  
  if (documentTypes.includes(mimeType)) return 'document';
  
  return null;
};

// Compress image file
export const compressImage = async (file: File): Promise<File> => {
  try {
    console.log('Compressing image:', file.name, file.size);
    
    // Skip compression for small images
    if (file.size < 500 * 1024) { // Less than 500KB
      console.log('Image already small, skipping compression');
      return file;
    }
    
    const compressedBlob = await imageCompression(file, imageCompressionOptions);
    console.log('Compression complete:', compressedBlob.size, 'bytes');
    
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
