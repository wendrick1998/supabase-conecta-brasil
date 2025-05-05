
import React from 'react';
import { Form } from '@/components/ui/form';
import LeadTagSelect from '@/components/LeadTagSelect';
import { Lead } from '@/types/lead';
import { useLeadForm } from './form/useLeadForm';
import BasicInfoFields from './form/BasicInfoFields';
import CategoryFields from './form/CategoryFields';
import FormButtons from './form/FormButtons';

interface LeadFormProps {
  lead?: Lead;
  isEditing?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, isEditing = false }) => {
  const {
    form,
    canais,
    estagios,
    isSubmitting,
    selectedTags,
    setSelectedTags,
    onSubmit
  } = useLeadForm(lead, isEditing);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Fields */}
          <BasicInfoFields control={form.control} />

          {/* Category Fields */}
          <CategoryFields 
            control={form.control}
            canais={canais}
            estagios={estagios}
          />
        </div>

        {/* Tags */}
        <LeadTagSelect 
          selectedTags={selectedTags} 
          onChange={setSelectedTags} 
        />

        {/* Form Buttons */}
        <FormButtons 
          isSubmitting={isSubmitting} 
          isEditing={isEditing} 
        />
      </form>
    </Form>
  );
};

export default LeadForm;
