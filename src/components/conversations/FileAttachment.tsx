
import React from 'react';
import { Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileAttachmentProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ 
  selectedFile, 
  onFileChange, 
  onRemoveAttachment 
}) => {
  return (
    <div className="flex items-center">
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <Paperclip className="h-5 w-5" />
          <span className="text-sm">Anexar arquivo</span>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={onFileChange}
        />
      </label>
      
      {selectedFile && (
        <div className="ml-4 text-sm text-gray-600 flex items-center">
          <span className="mr-2">{selectedFile.name}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRemoveAttachment}
            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-transparent"
            aria-label="Remover anexo"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
