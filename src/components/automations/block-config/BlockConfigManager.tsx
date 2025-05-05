
import React, { useState, useEffect } from 'react';
import { BlockType, BlockCategory } from '@/types/automation';
import { TriggerBlockConfig } from './TriggerBlockConfig';
import { ConditionBlockConfig } from './ConditionBlockConfig';
import { ActionBlockConfig } from './ActionBlockConfig';
import { ValidationErrors } from './ValidationErrors';
import { BlockConfigProps } from './types';

export const BlockConfigManager: React.FC<BlockConfigProps> = ({ 
  blockType,
  blockCategory,
  initialConfig = {},
  onUpdateConfig
}) => {
  const [config, setConfig] = useState<Record<string, any>>(initialConfig);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update local config when props change
  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (onUpdateConfig) {
      onUpdateConfig(newConfig);
    }
  };

  const validateConfig = (): boolean => {
    const errors: string[] = [];
    
    // Common validation based on block type
    switch (blockType) {
      case 'send_message':
        if (!config.channel) errors.push("Selecione um canal");
        if (!config.message) errors.push("Digite uma mensagem");
        break;
      case 'create_task':
        if (!config.description) errors.push("Descrição é obrigatória");
        break;
      case 'move_pipeline':
        if (!config.stage) errors.push("Selecione um estágio");
        break;
      case 'lead_status':
        if (!config.value) errors.push("Valor é obrigatório");
        break;
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Render fields based on block category
  const renderConfigFields = () => {
    switch (blockCategory) {
      case 'trigger':
        return <TriggerBlockConfig 
                 blockType={blockType} 
                 config={config} 
                 updateConfig={updateConfig} 
               />;
      case 'condition':
        return <ConditionBlockConfig 
                 blockType={blockType} 
                 config={config} 
                 updateConfig={updateConfig} 
               />;
      case 'action':
        return <ActionBlockConfig 
                 blockType={blockType} 
                 config={config} 
                 updateConfig={updateConfig} 
               />;
      default:
        return (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Configuração para este tipo de bloco
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 py-4">
      {renderConfigFields()}
      <ValidationErrors errors={validationErrors} />
    </div>
  );
};
