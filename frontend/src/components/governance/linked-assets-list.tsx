'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { controlAssetMappingApi, ControlAssetMapping, AssetType, ImplementationStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, ExternalLink, Package, FileText, Monitor, Code, Building2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ControlComplianceOverview } from './control-compliance-overview';

interface LinkedAssetsListProps {
  controlId: string;
}

const assetTypeIcons = {
  [AssetType.PHYSICAL]: Package,
  [AssetType.INFORMATION]: FileText,
  [AssetType.APPLICATION]: Monitor,
  [AssetType.SOFTWARE]: Code,
  [AssetType.SUPPLIER]: Building2,
};

const assetTypeLabels = {
  [AssetType.PHYSICAL]: 'Physical',
  [AssetType.INFORMATION]: 'Information',
  [AssetType.APPLICATION]: 'Application',
  [AssetType.SOFTWARE]: 'Software',
  [AssetType.SUPPLIER]: 'Supplier',
};

const implementationStatusLabels: Record<ImplementationStatus, string> = {
  [ImplementationStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [ImplementationStatus.PLANNED]: 'Planned',
  [ImplementationStatus.IN_PROGRESS]: 'In Progress',
  [ImplementationStatus.IMPLEMENTED]: 'Implemented',
  [ImplementationStatus.NOT_APPLICABLE]: 'Not Applicable',
};

const implementationStatusColors: Record<ImplementationStatus, string> = {
  [ImplementationStatus.NOT_IMPLEMENTED]: 'destructive',
  [ImplementationStatus.PLANNED]: 'secondary',
  [ImplementationStatus.IN_PROGRESS]: 'default',
  [ImplementationStatus.IMPLEMENTED]: 'default',
  [ImplementationStatus.NOT_APPLICABLE]: 'outline',
};

export function LinkedAssetsList({ controlId }: LinkedAssetsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMapping, setEditingMapping] = useState<ControlAssetMapping | null>(null);
  const [selectedMappings, setSelectedMappings] = useState<Set<string>>(new Set());
  const [isBulkUnlinkDialogOpen, setIsBulkUnlinkDialogOpen] = useState(false);

  const { data: mappings, isLoading } = useQuery({
    queryKey: ['control-asset-mappings', controlId],
    queryFn: () => controlAssetMappingApi.getLinkedAssets(controlId),
  });

  const deleteMutation = useMutation({
    mutationFn: (mappingId: string) => controlAssetMappingApi.unlinkAsset(controlId, mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-asset-mappings', controlId] });
      toast({
        title: 'Success',
        description: 'Asset unlinked successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to unlink asset',
        variant: 'destructive',
      });
    },
  });

  const bulkUnlinkMutation = useMutation({
    mutationFn: (mappingIds: string[]) => controlAssetMappingApi.bulkUnlinkAssets(controlId, mappingIds),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['control-asset-mappings', controlId] });
      setSelectedMappings(new Set());
      setIsBulkUnlinkDialogOpen(false);
      toast({
        title: 'Success',
        description: `${result.deleted} asset(s) unlinked successfully${result.notFound.length > 0 ? `. ${result.notFound.length} mapping(s) not found.` : ''}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to unlink assets',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ mappingId, data }: { mappingId: string; data: any }) =>
      controlAssetMappingApi.updateMapping(controlId, mappingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-asset-mappings', controlId] });
      setEditingMapping(null);
      toast({
        title: 'Success',
        description: 'Mapping updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update mapping',
        variant: 'destructive',
      });
    },
  });

  const getAssetUrl = (assetType: AssetType, assetId: string) => {
    const basePath = '/en/dashboard/assets';
    switch (assetType) {
      case AssetType.PHYSICAL:
        return `${basePath}/physical/${assetId}`;
      case AssetType.INFORMATION:
        return `${basePath}/information/${assetId}`;
      case AssetType.APPLICATION:
        return `${basePath}/applications/${assetId}`;
      case AssetType.SOFTWARE:
        return `${basePath}/software/${assetId}`;
      case AssetType.SUPPLIER:
        return `${basePath}/suppliers/${assetId}`;
      default:
        return '#';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">Loading linked assets...</p>
        </CardContent>
      </Card>
    );
  }

  if (!mappings || mappings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linked Assets</CardTitle>
          <CardDescription>Assets linked to this control will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No assets linked to this control yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleToggleSelection = (mappingId: string) => {
    const newSelected = new Set(selectedMappings);
    if (newSelected.has(mappingId)) {
      newSelected.delete(mappingId);
    } else {
      newSelected.add(mappingId);
    }
    setSelectedMappings(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMappings.size === mappings.length) {
      setSelectedMappings(new Set());
    } else {
      setSelectedMappings(new Set(mappings.map(m => m.id)));
    }
  };

  const handleBulkUnlink = () => {
    if (selectedMappings.size === 0) return;
    setIsBulkUnlinkDialogOpen(true);
  };

  return (
    <>
      {/* Control Compliance Overview */}
      {mappings && mappings.length > 0 && (
        <div className="mb-6">
          <ControlComplianceOverview mappings={mappings} />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Linked Assets ({mappings.length})</CardTitle>
              <CardDescription>Assets that implement or relate to this control</CardDescription>
            </div>
            {selectedMappings.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedMappings.size} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkUnlink}
                  disabled={bulkUnlinkMutation.isPending}
                >
                  {bulkUnlinkMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Unlink Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMappings(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mappings.length > 0 && (
              <div className="flex items-center gap-3 p-2 border-b">
                <Checkbox
                  checked={selectedMappings.size === mappings.length && mappings.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
            )}
            <div className="space-y-2">
              {mappings.map((mapping) => {
                const AssetIcon = assetTypeIcons[mapping.asset_type] || Package;
                const isSelected = selectedMappings.has(mapping.id);
                return (
                  <div
                    key={mapping.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                      isSelected ? 'bg-muted border-primary' : ''
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleSelection(mapping.id)}
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <AssetIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{assetTypeLabels[mapping.asset_type]}</Badge>
                          <Badge variant={implementationStatusColors[mapping.implementation_status] as any}>
                            {implementationStatusLabels[mapping.implementation_status]}
                          </Badge>
                          {mapping.is_automated && (
                            <Badge variant="secondary">Automated</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium mt-1">
                          Asset ID: {mapping.asset_id.substring(0, 8)}...
                        </p>
                        {mapping.implementation_notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {mapping.implementation_notes}
                          </p>
                        )}
                        {mapping.implementation_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Implemented: {new Date(mapping.implementation_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getAssetUrl(mapping.asset_type, mapping.asset_id), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMapping(mapping)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to unlink this asset?')) {
                            deleteMutation.mutate(mapping.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {editingMapping && (
        <EditMappingDialog
          mapping={editingMapping}
          controlId={controlId}
          open={!!editingMapping}
          onClose={() => setEditingMapping(null)}
          onSave={(data) => {
            updateMutation.mutate({
              mappingId: editingMapping.id,
              data,
            });
          }}
        />
      )}

      <BulkUnlinkDialog
        open={isBulkUnlinkDialogOpen}
        onOpenChange={setIsBulkUnlinkDialogOpen}
        selectedCount={selectedMappings.size}
        onConfirm={() => {
          bulkUnlinkMutation.mutate(Array.from(selectedMappings));
        }}
        isPending={bulkUnlinkMutation.isPending}
      />
    </>
  );
}

interface EditMappingDialogProps {
  mapping: ControlAssetMapping;
  controlId: string;
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

function EditMappingDialog({ mapping, open, onClose, onSave }: EditMappingDialogProps) {
  const [formData, setFormData] = useState({
    implementation_status: mapping.implementation_status,
    implementation_date: mapping.implementation_date ? mapping.implementation_date.split('T')[0] : '',
    implementation_notes: mapping.implementation_notes || '',
    last_test_date: mapping.last_test_date ? mapping.last_test_date.split('T')[0] : '',
    last_test_result: mapping.last_test_result || '',
    effectiveness_score: mapping.effectiveness_score || '',
    is_automated: mapping.is_automated,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      effectiveness_score: formData.effectiveness_score ? Number(formData.effectiveness_score) : undefined,
      implementation_date: formData.implementation_date || undefined,
      last_test_date: formData.last_test_date || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Asset Mapping</DialogTitle>
          <DialogDescription>Update the implementation status and details for this asset</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="implementation_status">Implementation Status</Label>
            <Select
              value={formData.implementation_status}
              onValueChange={(value) =>
                setFormData({ ...formData, implementation_status: value as ImplementationStatus })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(implementationStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="implementation_date">Implementation Date</Label>
              <Input
                id="implementation_date"
                type="date"
                value={formData.implementation_date}
                onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_test_date">Last Test Date</Label>
              <Input
                id="last_test_date"
                type="date"
                value={formData.last_test_date}
                onChange={(e) => setFormData({ ...formData, last_test_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_test_result">Last Test Result</Label>
            <Input
              id="last_test_result"
              value={formData.last_test_result}
              onChange={(e) => setFormData({ ...formData, last_test_result: e.target.value })}
              placeholder="e.g., Passed, Failed, Needs Review"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveness_score">Effectiveness Score (1-5)</Label>
            <Input
              id="effectiveness_score"
              type="number"
              min="1"
              max="5"
              value={formData.effectiveness_score}
              onChange={(e) => setFormData({ ...formData, effectiveness_score: e.target.value })}
              placeholder="1-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="implementation_notes">Implementation Notes</Label>
            <textarea
              id="implementation_notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.implementation_notes}
              onChange={(e) => setFormData({ ...formData, implementation_notes: e.target.value })}
              placeholder="Add notes about this implementation..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_automated"
              checked={formData.is_automated}
              onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_automated" className="text-sm font-normal">
              Is Automated
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface BulkUnlinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirm: () => void;
  isPending: boolean;
}

function BulkUnlinkDialog({ open, onOpenChange, selectedCount, onConfirm, isPending }: BulkUnlinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Unlink Assets</DialogTitle>
          <DialogDescription>
            Are you sure you want to unlink {selectedCount} asset(s) from this control? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unlink {selectedCount} Asset(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

