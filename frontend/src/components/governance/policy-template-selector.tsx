'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POLICY_TEMPLATES, PolicyTemplate } from '@/lib/policy-templates';
import { FileText, Check } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PolicyTemplateSelectorProps {
  onSelectTemplate: (template: PolicyTemplate) => void;
  currentContent?: string;
  category?: PolicyTemplate['category'];
}

export function PolicyTemplateSelector({
  onSelectTemplate,
  currentContent,
  category,
}: PolicyTemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<PolicyTemplate | null>(null);

  const availableTemplates = category
    ? POLICY_TEMPLATES.filter((t) => t.category === category)
    : POLICY_TEMPLATES;

  const handleTemplateChange = (templateId: string) => {
    if (!templateId) {
      setSelectedTemplateId('');
      return;
    }

    const template = POLICY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    // If there's existing content, show confirmation dialog
    if (currentContent && currentContent.trim().length > 0) {
      setPendingTemplate(template);
      setShowConfirmDialog(true);
    } else {
      // No existing content, apply template directly
      onSelectTemplate(template);
      setSelectedTemplateId(templateId);
    }
  };

  const handleConfirmApply = () => {
    if (pendingTemplate) {
      onSelectTemplate(pendingTemplate);
      setSelectedTemplateId(pendingTemplate.id);
    }
    setShowConfirmDialog(false);
    setPendingTemplate(null);
  };

  const handleCancelApply = () => {
    setShowConfirmDialog(false);
    setPendingTemplate(null);
    setSelectedTemplateId('');
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template to start with..." />
          </SelectTrigger>
          <SelectContent>
            {availableTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Template?</AlertDialogTitle>
            <AlertDialogDescription>
              You have existing content in the editor. Applying a template will replace your current
              content with the template. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingTemplate && (
            <div className="my-4 p-3 bg-muted rounded-md">
              <p className="font-medium text-sm">Template: {pendingTemplate.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{pendingTemplate.description}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelApply}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApply} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Replace Content
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}




