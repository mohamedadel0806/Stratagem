'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ExportFieldSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableFields: Array<{ header: string; key: string }>;
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
  onExport: (fields: string[]) => void;
  exportType: 'csv' | 'excel' | 'pdf';
}

export function ExportFieldSelector({
  open,
  onOpenChange,
  availableFields,
  selectedFields,
  onFieldsChange,
  onExport,
  exportType,
}: ExportFieldSelectorProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedFields);

  const handleToggleField = (key: string) => {
    setLocalSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSelectAll = () => {
    setLocalSelected(availableFields.map((f) => f.key));
  };

  const handleDeselectAll = () => {
    setLocalSelected([]);
  };

  const handleExport = () => {
    onFieldsChange(localSelected);
    onExport(localSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Fields to Export</DialogTitle>
          <DialogDescription>
            Choose which fields to include in your {exportType.toUpperCase()} export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {localSelected.length} of {availableFields.length} fields selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          <div className="h-[300px] overflow-y-auto rounded-md border p-4">
            <div className="space-y-3">
              {availableFields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={localSelected.includes(field.key)}
                    onCheckedChange={() => handleToggleField(field.key)}
                  />
                  <Label
                    htmlFor={field.key}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {field.header}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={localSelected.length === 0}>
            Export {localSelected.length} Field{localSelected.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

