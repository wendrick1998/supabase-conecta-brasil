
import { useState, useEffect, useCallback } from 'react';
import { Block, BlockType } from '@/types/automation';

export const useResponsiveAutomationEditor = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [wizardStep, setWizardStep] = useState<'trigger' | 'condition' | 'action' | 'connection'>('trigger');
  const [hasTrigger, setHasTrigger] = useState(false);
  const [hasCondition, setHasCondition] = useState(false);
  const [hasAction, setHasAction] = useState(false);

  // Update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to check block status and update wizard step
  const updateWizardSteps = useCallback((blocks: Block[]) => {
    const triggerBlock = blocks.find(block => ['new_lead', 'lead_moved', 'message_received'].includes(block.type));
    const conditionBlock = blocks.find(block => ['lead_status', 'lead_source', 'value_greater'].includes(block.type));
    const actionBlock = blocks.find(block => ['send_message', 'create_task', 'move_pipeline'].includes(block.type));

    setHasTrigger(!!triggerBlock);
    setHasCondition(!!conditionBlock);
    setHasAction(!!actionBlock);

    // Auto-advance to next step if current step is complete
    if (!triggerBlock) {
      setWizardStep('trigger');
    } else if (!conditionBlock && wizardStep === 'trigger') {
      setWizardStep('condition');
    } else if (!actionBlock && wizardStep === 'condition') {
      setWizardStep('action');
    } else if (triggerBlock && (conditionBlock || actionBlock) && wizardStep === 'action') {
      setWizardStep('connection');
    }
  }, [wizardStep]);

  const getRecommendedBlockTypes = useCallback((currentStep: 'trigger' | 'condition' | 'action'): BlockType[] => {
    switch (currentStep) {
      case 'trigger':
        return ['new_lead', 'lead_moved', 'message_received'];
      case 'condition':
        return ['lead_status', 'lead_source', 'value_greater']; 
      case 'action':
        return ['send_message', 'create_task', 'move_pipeline'];
      default:
        return [];
    }
  }, []);

  const nextStep = useCallback(() => {
    if (wizardStep === 'trigger' && hasTrigger) {
      setWizardStep('condition');
    } else if (wizardStep === 'condition') {
      setWizardStep('action');
    } else if (wizardStep === 'action' && hasAction) {
      setWizardStep('connection');
    }
  }, [wizardStep, hasTrigger, hasAction]);

  const prevStep = useCallback(() => {
    if (wizardStep === 'connection') {
      setWizardStep('action');
    } else if (wizardStep === 'action') {
      setWizardStep('condition');
    } else if (wizardStep === 'condition') {
      setWizardStep('trigger');
    }
  }, [wizardStep]);

  return {
    isMobile,
    wizardStep,
    setWizardStep,
    hasTrigger,
    hasCondition,
    hasAction,
    updateWizardSteps,
    getRecommendedBlockTypes,
    nextStep,
    prevStep
  };
};
