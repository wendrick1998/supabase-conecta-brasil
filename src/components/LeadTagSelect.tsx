
import React, { useState, useEffect } from 'react';
import { Tag } from '@/types/lead';
import { getTags } from '@/services/leadService';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import LeadTag from './LeadTag';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeadTagSelectProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

const LeadTagSelect: React.FC<LeadTagSelectProps> = ({ selectedTags, onChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      const tagsData = await getTags();
      setTags(tagsData);
      setIsLoading(false);
    };

    fetchTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    const updatedSelection = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onChange(updatedSelection);
  };

  if (isLoading) {
    return <div>Carregando tags...</div>;
  }

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <ScrollArea className="h-32 border rounded-md p-2">
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => handleTagToggle(tag.id)}
              />
              <Label htmlFor={`tag-${tag.id}`} className="flex items-center cursor-pointer">
                <LeadTag tag={tag} />
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedTags.length > 0 && (
          <div className="text-sm text-muted-foreground mb-1 w-full">Tags selecionadas:</div>
        )}
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (tag) {
            return <LeadTag key={tag.id} tag={tag} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default LeadTagSelect;
