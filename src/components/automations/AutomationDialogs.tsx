
import React from 'react';
import { TemplatesDialog } from './TemplatesDialog';
import { PreviewDialog } from './PreviewDialog';
import { TestResultsDialog } from './TestResultsDialog';
import { AutomationSaveDialog } from './AutomationSaveDialog';
import { AutomationVersionHistory } from './AutomationVersionHistory';
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
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showVersionHistory: boolean;
  setShowVersionHistory: (show: boolean) => void;
  blocks: Block[];
  testResults: TestResult[];
  testSummary: TestSummary | null;
  isTestRunning: boolean;
  automationId: string | undefined;
  currentVersion: number;
  isSaving: boolean;
  handleApplyTemplate: (blocks: Block[]) => void;
  handleRunTest: () => void;
  handleSaveWithDescription: (description: string) => Promise<void>;
  handleRestoreVersion: (versionId: string) => Promise<void>;
}

export const AutomationDialogs: React.FC<AutomationDialogsProps> = ({
  showTemplates,
  setShowTemplates,
  showPreview,
  setShowPreview,
  showTestResults,
  setShowTestResults,
  showSaveDialog,
  setShowSaveDialog,
  showVersionHistory,
  setShowVersionHistory,
  blocks,
  testResults,
  testSummary,
  isTestRunning,
  automationId,
  currentVersion,
  isSaving,
  handleApplyTemplate,
  handleRunTest,
  handleSaveWithDescription,
  handleRestoreVersion
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

      {/* Save Dialog */}
      <AutomationSaveDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveWithDescription}
        isSaving={isSaving}
      />

      {/* Version History Dialog */}
      <AutomationVersionHistory
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
        automationId={automationId}
        currentVersion={currentVersion}
        onRestoreVersion={handleRestoreVersion}
      />
    </>
  );
};
