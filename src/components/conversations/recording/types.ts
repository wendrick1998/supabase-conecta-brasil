
export type MediaType = 'audio' | 'video' | 'photo';

export interface RecordedMedia {
  url: string;
  blob: Blob | null;
  fileName: string;
}
