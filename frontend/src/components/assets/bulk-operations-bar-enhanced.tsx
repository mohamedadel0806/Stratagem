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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Trash2, Download, FileText, Edit, ChevronDown, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertToCSV, downloadCSV } from '@/lib/utils/export';
import { exportToExcel } from '@/lib/utils/excel-export';
import { generateAssetReportPDF } from '@/lib/utils/pdf-export';
import { assetsApi } from '@/lib/api/assets';
import { usersApi } from '@/lib/api/users';
import { useQuery } from '@tanstack/react-query';
import { ExportFieldSelector } from './export-field-selector';

interface BulkOperationsBarProps {
  selectedCount: number;
  selectedItems: any[];
  onClearSelection: () => void;
  onDelete: (ids: string[]) => Promise<void>;
  onUpdate?: () => void; // Callback to refresh data after update
  assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier';
  exportColumns?: { header: string; key: string }[];
}

export function BulkOperationsBar({
  selectedCount,
  selectedItems,
  onClearSelection,
  onDelete,
  onUpdate,
  assetType,
  exportColumns,
}: BulkOperationsBarProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateResult, setUpdateResult] = useState<{ successful: number; failed: number; errors: any[] } | null>(null);
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Update form state
  const [updateOwnerId, setUpdateOwnerId] = useState<string>('');
  const [updateCriticality, setUpdateCriticality] = useState<string>('');
  const [updateComplianceTags, setUpdateComplianceTags] = useState<string>('');

  // Fetch users for owner selection
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  if (selectedCount === 0) return null;

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = selectedItems.map((item) => item.id);
      await assetsApi.bulkDelete(assetType, ids);
      toast({
        title: 'Deleted successfully',
        description: `${selectedCount} item(s) have been deleted.`,
      });
      onClearSelection();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.response?.data?.message || 'Some items could not be deleted. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleBulkUpdate = async () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    setUpdateResult(null);

    try {
      const updateData: any = {
        assetIds: selectedItems.map((item) => item.id),
      };

      if (updateOwnerId && updateOwnerId !== 'no-change') {
        updateData.ownerId = updateOwnerId;
      }
      if (updateCriticality && updateCriticality !== 'no-change') {
        updateData.criticalityLevel = updateCriticality;
      }
      if (updateComplianceTags) {
        updateData.complianceTags = updateComplianceTags.split(',').map((tag) => tag.trim()).filter(Boolean);
      }

      setUpdateProgress(50);
      const result = await assetsApi.bulkUpdate(assetType, updateData);
      setUpdateProgress(100);
      setUpdateResult(result);

      if (result.failed === 0) {
        toast({
          title: 'Update successful',
          description: `Successfully updated ${result.successful} item(s).`,
        });
        setIsUpdateDialogOpen(false);
        onClearSelection();
        onUpdate?.();
      } else {
        toast({
          title: 'Partial success',
          description: `Updated ${result.successful} item(s), ${result.failed} failed.`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update items. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateProgress(0), 2000);
    }
  };

  const performExport = (fields: string[], type: 'csv' | 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      const allColumns = exportColumns || [
        { header: 'Name', key: 'assetName' },
        { header: 'Identifier', key: 'assetIdentifier' },
        { header: 'Type', key: 'assetType' },
        { header: 'Criticality', key: 'criticalityLevel' },
        { header: 'Created', key: 'createdAt' },
      ];

      // Filter columns based on selected fields
      const columns = fields.length > 0
        ? allColumns.filter((col) => fields.includes(col.key))
        : allColumns;

      const data = selectedItems.map((item) => {
        const row: Record<string, any> = {};
        columns.forEach((col) => {
          let value = item[col.key];
          if (col.key === 'createdAt' && value) {
            value = new Date(value).toLocaleDateString();
          } else if (col.key === 'assetType' && value) {
            value = typeof value === 'string' ? value.replace('_', ' ') : (value.name || '');
          }
          row[col.header] = value || '';
        });
        return row;
      });

      if (type === 'csv') {
        const csv = convertToCSV(data, columns.map((c) => c.header));
        downloadCSV(csv, `${assetType}-export-${Date.now()}`);
      } else if (type === 'excel') {
        exportToExcel(data, `${assetType}-export-${Date.now()}`);
      } else if (type === 'pdf') {
        generateAssetReportPDF(
          selectedItems,
          'all',
          `Selected ${assetType.charAt(0).toUpperCase() + assetType.slice(1)} Assets`,
        );
      }

      toast({
        title: 'Export successful',
        description: `Exported ${selectedCount} item(s) to ${type.toUpperCase()}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message || 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    setSelectedExportType('csv');
    if (exportColumns && exportColumns.length > 5) {
      // Show field selector if there are many fields
      setIsFieldSelectorOpen(true);
    } else {
      // Direct export if few fields
      performExport([], 'csv');
    }
  };

  const handleExportExcel = () => {
    setSelectedExportType('excel');
    if (exportColumns && exportColumns.length > 5) {
      setIsFieldSelectorOpen(true);
    } else {
      performExport([], 'excel');
    }
  };

  const handleExportPDF = () => {
    setSelectedExportType('pdf');
    // PDF export typically uses all fields, but we can still show selector
    if (exportColumns && exportColumns.length > 5) {
      setIsFieldSelectorOpen(true);
    } else {
      performExport([], 'pdf');
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

          {/* Update Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700"
            onClick={() => setIsUpdateDialogOpen(true)}
            disabled={isUpdating}
          >
            <Edit className="h-4 w-4 mr-2" />
            Update
          </Button>

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
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileText className="h-4 w-4 mr-2" />
                Export to Excel
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

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Update {selectedCount} Item(s)</DialogTitle>
            <DialogDescription>
              Update the selected fields for all selected assets. Leave fields empty to skip.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Owner Selection */}
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={updateOwnerId} onValueChange={setUpdateOwnerId}>
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Select owner (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-change">-- No Change --</SelectItem>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Criticality Selection (only for supported asset types) */}
            {(assetType === 'physical' || assetType === 'application' || assetType === 'supplier') && (
              <div className="space-y-2">
                <Label htmlFor="criticality">Criticality Level</Label>
                <Select value={updateCriticality} onValueChange={setUpdateCriticality}>
                  <SelectTrigger id="criticality">
                    <SelectValue placeholder="Select criticality (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">-- No Change --</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Compliance Tags (only for supported asset types) */}
            {(assetType === 'physical' || assetType === 'application' || assetType === 'information') && (
              <div className="space-y-2">
                <Label htmlFor="compliance">Compliance Tags</Label>
                <input
                  id="compliance"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="Comma-separated tags (e.g., GDPR, PCI-DSS)"
                  value={updateComplianceTags}
                  onChange={(e) => setUpdateComplianceTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter comma-separated compliance tags. Leave empty to skip.
                </p>
              </div>
            )}

            {/* Progress Indicator */}
            {isUpdating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Updating assets...</span>
                  <span>{updateProgress}%</span>
                </div>
                <Progress value={updateProgress} />
              </div>
            )}

            {/* Results */}
            {updateResult && !isUpdating && (
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {updateResult.failed === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>
                    {updateResult.successful} successful, {updateResult.failed} failed
                  </span>
                </div>
                {updateResult.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto text-xs text-muted-foreground">
                    {updateResult.errors.slice(0, 5).map((error, idx) => (
                      <div key={idx} className="truncate">
                        {error.assetId}: {error.error}
                      </div>
                    ))}
                    {updateResult.errors.length > 5 && (
                      <div>... and {updateResult.errors.length - 5} more errors</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Field Selector Dialog */}
      {exportColumns && exportColumns.length > 0 && (
        <ExportFieldSelector
          open={isFieldSelectorOpen}
          onOpenChange={setIsFieldSelectorOpen}
          availableFields={exportColumns}
          selectedFields={selectedFields}
          onFieldsChange={setSelectedFields}
          onExport={(fields) => performExport(fields, selectedExportType)}
          exportType={selectedExportType}
        />
      )}
    </>
  );
}

