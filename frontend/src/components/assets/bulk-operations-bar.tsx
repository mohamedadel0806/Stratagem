'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Trash2, Download, FileText, UserPlus, ChevronDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertToCSV, downloadCSV } from '@/lib/utils/export';
import { generateAssetReportPDF } from '@/lib/utils/pdf-export';

interface BulkOperationsBarProps {
  selectedCount: number;
  selectedItems: any[];
  onClearSelection: () => void;
  onDelete: (ids: string[]) => Promise<void>;
  assetType: string;
  exportColumns?: { header: string; key: string }[];
}

export function BulkOperationsBar({
  selectedCount,
  selectedItems,
  onClearSelection,
  onDelete,
  assetType,
  exportColumns,
}: BulkOperationsBarProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (selectedCount === 0) return null;

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = selectedItems.map((item) => item.id);
      await onDelete(ids);
      toast({
        title: 'Deleted successfully',
        description: `${selectedCount} item(s) have been deleted.`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Some items could not be deleted. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const columns = exportColumns || [
        { header: 'Name', key: 'assetName' },
        { header: 'Identifier', key: 'assetIdentifier' },
        { header: 'Type', key: 'assetType' },
        { header: 'Criticality', key: 'criticalityLevel' },
        { header: 'Created', key: 'createdAt' },
      ];

      const data = selectedItems.map((item) => {
        const row: Record<string, any> = {};
        columns.forEach((col) => {
          let value = item[col.key];
          if (col.key === 'createdAt' && value) {
            value = new Date(value).toLocaleDateString();
          } else if (col.key === 'assetType' && value) {
            // Handle assetType which can be a string or object
            value = typeof value === 'string' 
              ? value.replace('_', ' ')
              : (value.name || '');
          }
          row[col.header] = value || '';
        });
        return row;
      });

      const csv = convertToCSV(data, columns.map((c) => c.header));
      downloadCSV(csv, `${assetType}-export-${Date.now()}`);

      toast({
        title: 'Export successful',
        description: `Exported ${selectedCount} item(s) to CSV.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      generateAssetReportPDF(
        selectedItems,
        'all',
        `Selected ${assetType.charAt(0).toUpperCase() + assetType.slice(1)} Assets`
      );

      toast({
        title: 'Export successful',
        description: `Exported ${selectedCount} item(s) to PDF.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg">
          <Badge variant="secondary" className="bg-slate-700 text-white">
            {selectedCount} selected
          </Badge>

          <div className="h-4 w-px bg-slate-600" />

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700" disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-slate-600" />

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          <div className="h-4 w-px bg-slate-600" />

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:bg-slate-700"
            onClick={onClearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete {selectedCount} item(s)?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected
              {' '}{assetType} assets and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedCount} item(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

