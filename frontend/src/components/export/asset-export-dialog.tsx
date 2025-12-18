'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { exportToExcel } from '@/lib/utils/excel-export';
import { generatePDFTable, TableColumn } from '@/lib/utils/pdf-export';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText } from 'lucide-react';

interface AssetExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: any[];
  assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier';
  availableFields: Array<{ key: string; label: string }>;
}

export function AssetExportDialog({ open, onOpenChange, assets, assetType, availableFields }: AssetExportDialogProps) {
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(availableFields.map(f => f.key)));
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');

  const handleToggleField = (fieldKey: string) => {
    setSelectedFields(prev => {
      const next = new Set(prev);
      if (next.has(fieldKey)) {
        next.delete(fieldKey);
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedFields.size === availableFields.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(availableFields.map(f => f.key)));
    }
  };

  const handleExport = async () => {
    if (selectedFields.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one field to export',
        variant: 'destructive',
      });
      return;
    }

    try {
      const selectedFieldsArray = Array.from(selectedFields);
      const exportData = assets.map(asset => {
        const row: any = {};
        selectedFieldsArray.forEach(fieldKey => {
          const field = availableFields.find(f => f.key === fieldKey);
          if (field) {
            let value = asset[fieldKey];
            // Format dates
            if (value instanceof Date) {
              value = value.toLocaleDateString();
            } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
              value = new Date(value).toLocaleDateString();
            }
            // Format arrays
            if (Array.isArray(value)) {
              value = value.join(', ');
            }
            // Format objects
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
              value = JSON.stringify(value);
            }
            row[field.label] = value ?? '';
          }
        });
        return row;
      });

      if (exportFormat === 'excel') {
        await exportToExcel(exportData, `${assetType}-assets-${new Date().toISOString().split('T')[0]}`, 'Assets');
        toast({
          title: 'Success',
          description: 'Assets exported to Excel successfully',
        });
      } else {
        const columns: TableColumn[] = selectedFieldsArray.map(fieldKey => {
          const field = availableFields.find(f => f.key === fieldKey)!;
          return {
            header: field.label,
            dataKey: field.label,
            width: 40,
          };
        });

        generatePDFTable(exportData, columns, {
          title: `${assetType.charAt(0).toUpperCase() + assetType.slice(1)} Assets Export`,
          subtitle: `${assets.length} assets exported`,
          filename: `${assetType}-assets-${new Date().toISOString().split('T')[0]}`,
          orientation: 'landscape',
        });

        toast({
          title: 'Success',
          description: 'Assets exported to PDF successfully',
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to export assets',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Assets</DialogTitle>
          <DialogDescription>
            Select fields to include in the export and choose export format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <Button
              variant={exportFormat === 'excel' ? 'default' : 'outline'}
              onClick={() => setExportFormat('excel')}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Excel (.xlsx)
            </Button>
            <Button
              variant={exportFormat === 'pdf' ? 'default' : 'outline'}
              onClick={() => setExportFormat('pdf')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>

          <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Select Fields</Label>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedFields.size === availableFields.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="space-y-2">
              {availableFields.map(field => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields.has(field.key)}
                    onCheckedChange={() => handleToggleField(field.key)}
                  />
                  <Label
                    htmlFor={field.key}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {assets.length} asset(s) will be exported with {selectedFields.size} field(s)
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedFields.size === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

