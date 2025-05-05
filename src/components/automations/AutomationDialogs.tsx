
import React from 'react';
import { TemplatesDialog } from './TemplatesDialog';
import { PreviewDialog } from './PreviewDialog';
import { TestResultsDialog } from './TestResultsDialog';
import { Block } from '@/types/automation';

interface TestResult {
  blockId: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

interface TestSummary {
  success: boolean;
  message: string;
  details: string[];
}

interface AutomationDialogsProps {
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  showTestResults: boolean;
  setShowTestResults: (show: boolean) => void;
  blocks: Block[];
  testResults: TestResult[];
  testSummary: TestSummary | null;
  isTestRunning: boolean;
  handleApplyTemplate: (blocks: Block[]) => void;
  handleRunTest: () => void;
}

export const AutomationDialogs: React.FC<AutomationDialogsProps> = ({
  showTemplates,
  setShowTemplates,
  showPreview,
  setShowPreview,
  showTestResults,
  setShowTestResults,
  blocks,
  testResults,
  testSummary,
  isTestRunning,
  handleApplyTemplate,
  handleRunTest
}) => {
  return (
    <>
      {/* Templates Dialog */}
      <TemplatesDialog
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onApplyTemplate={handleApplyTemplate}
      />
      
      {/* Preview Dialog */}
      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        blocks={blocks}
      />

      {/* Test Results Dialog */}
      <TestResultsDialog 
        open={showTestResults}
        onOpenChange={setShowTestResults}
        blocks={blocks}
        testResults={testResults}
        testSummary={testSummary}
        isTestRunning={isTestRunning}
        onRetest={handleRunTest}
      />
    </>
  );
};
