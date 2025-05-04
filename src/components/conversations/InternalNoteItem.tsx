
import { InternalNote } from '@/types/conversation';
import { formatMessageTime } from '@/utils/conversationUtils';
import { FileText } from 'lucide-react';

interface InternalNoteItemProps {
  note: InternalNote;
}

const InternalNoteItem = ({ note }: InternalNoteItemProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div className="flex items-center text-sm font-medium text-gray-600 mb-1">
        <FileText className="h-4 w-4 text-yellow-600 mr-2" />
        <span>{note.user_name}</span>
        <span className="ml-auto text-xs text-gray-500">
          {formatMessageTime(note.timestamp)}
        </span>
      </div>
      <p className="text-sm text-gray-700">{note.content}</p>
    </div>
  );
};

export default InternalNoteItem;
