'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  controlAssetMappingApi,
  governanceApi,
  AssetType,
  ImplementationStatus,
  UnifiedControl,
} from '@/lib/api/governance';
import { Search, Shield, Loader2, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ControlBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType: AssetType;
  assetId: string;
  assetName?: string;
  existingControlIds?: Set<string>;
}

const implementationStatusOptions = [
  { value: ImplementationStatus.NOT_IMPLEMENTED, label: 'Not Implemented' },
  { value: ImplementationStatus.PLANNED, label: 'Planned' },
  { value: ImplementationStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ImplementationStatus.IMPLEMENTED, label: 'Implemented' },
  { value: ImplementationStatus.NOT_APPLICABLE, label: 'Not Applicable' },
];

export function ControlBrowserDialog({
  open,
  onOpenChange,
  assetType,
  assetId,
  assetName,
  existingControlIds = new Set(),
}: ControlBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedControls, setSelectedControls] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [implementationStatus, setImplementationStatus] = useState<ImplementationStatus>(
    ImplementationStatus.NOT_IMPLEMENTED
  );
  const [implementationNotes, setImplementationNotes] = useState('');

  // Fetch all controls
  const { data: controlsData, isLoading, error } = useQuery({
    queryKey: ['unified-controls-for-linking'],
    queryFn: async () => {
      console.log('Fetching unified controls...');
      const result = await governanceApi.getUnifiedControls({ limit: 500 });
      console.log('Unified controls result:', result);
      return result;
    },
    enabled: open,
  });

  // Debug log
  console.log('ControlBrowserDialog:', { open, isLoading, error, controlsData });

  const controls = controlsData?.data || [];

  // Filter controls based on search
  const filteredControls = controls.filter((control) => {
    const matchesSearch =
      !searchQuery ||
      control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.control_identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Mutation for linking controls
  const linkMutation = useMutation({
    mutationFn: async () => {
      return controlAssetMappingApi.linkControlsToAsset(
        assetType,
        assetId,
        Array.from(selectedControls),
        implementationStatus,
        implementationNotes || undefined
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['asset-controls', assetType, assetId] });
      setSelectedControls(new Set());
      setSearchQuery('');
      setImplementationNotes('');
      onOpenChange(false);

      const linkedCount = result.created.length;
      const alreadyLinkedCount = result.alreadyLinked.length;

      if (linkedCount > 0) {
        toast({
          title: 'Success',
          description: `${linkedCount} control(s) linked successfully${
            alreadyLinkedCount > 0 ? ` (${alreadyLinkedCount} already linked)` : ''
          }`,
        });
      } else if (alreadyLinkedCount > 0) {
        toast({
          title: 'Info',
          description: 'All selected controls were already linked to this asset',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to link controls',
        variant: 'destructive',
      });
    },
  });

  const handleToggleControl = (controlId: string) => {
    const newSelected = new Set(selectedControls);
    if (newSelected.has(controlId)) {
      newSelected.delete(controlId);
    } else {
      newSelected.add(controlId);
    }
    setSelectedControls(newSelected);
  };

  const handleSelectAll = () => {
    const availableControls = filteredControls.filter((c) => !existingControlIds.has(c.id));
    if (selectedControls.size === availableControls.length) {
      setSelectedControls(new Set());
    } else {
      setSelectedControls(new Set(availableControls.map((c) => c.id)));
    }
  };

  const handleLink = () => {
    if (selectedControls.size === 0) {
      toast({
        title: 'No controls selected',
        description: 'Please select at least one control to link',
        variant: 'destructive',
      });
      return;
    }
    linkMutation.mutate();
  };

  const availableControls = filteredControls.filter((c) => !existingControlIds.has(c.id));
  const linkedControls = filteredControls.filter((c) => existingControlIds.has(c.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Link Controls to Asset
          </DialogTitle>
          <DialogDescription>
            Select controls to link to {assetName || 'this asset'}. Controls provide governance
            coverage and demonstrate compliance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search controls by name, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Implementation Settings */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>Implementation Status</Label>
              <Select
                value={implementationStatus}
                onValueChange={(value) => setImplementationStatus(value as ImplementationStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {implementationStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Implementation Notes (optional)</Label>
              <Textarea
                placeholder="Add notes about implementation..."
                value={implementationNotes}
                onChange={(e) => setImplementationNotes(e.target.value)}
                className="h-[38px] min-h-[38px] resize-none"
              />
            </div>
          </div>

          {/* Controls List */}
          <div className="flex-1 overflow-hidden border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px] overflow-y-auto">
                <div className="p-2 space-y-1">
                  {/* Select All Header */}
                  {availableControls.length > 0 && (
                    <div className="flex items-center gap-2 p-2 border-b sticky top-0 bg-background">
                      <Checkbox
                        checked={
                          selectedControls.size > 0 &&
                          selectedControls.size === availableControls.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm font-medium">
                        Select All ({availableControls.length} available)
                      </span>
                      {selectedControls.size > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {selectedControls.size} selected
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Available Controls */}
                  {availableControls.map((control) => (
                    <div
                      key={control.id}
                      className={`flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 cursor-pointer ${
                        selectedControls.has(control.id) ? 'bg-primary/5 border border-primary/20' : ''
                      }`}
                      onClick={() => handleToggleControl(control.id)}
                    >
                      <Checkbox
                        checked={selectedControls.has(control.id)}
                        onCheckedChange={() => handleToggleControl(control.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{control.title}</span>
                          {control.control_identifier && (
                            <Badge variant="outline" className="text-xs">
                              {control.control_identifier}
                            </Badge>
                          )}
                        </div>
                        {control.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {control.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {control.domain && (
                            <Badge variant="secondary" className="text-xs">
                              {control.domain}
                            </Badge>
                          )}
                          {control.implementation_status && (
                            <Badge variant="outline" className="text-xs">
                              {control.implementation_status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Already Linked Controls */}
                  {linkedControls.length > 0 && (
                    <>
                      <div className="text-xs font-medium text-muted-foreground py-2 px-2 border-t mt-2">
                        Already Linked ({linkedControls.length})
                      </div>
                      {linkedControls.map((control) => (
                        <div
                          key={control.id}
                          className="flex items-start gap-3 p-3 rounded-md bg-green-50 dark:bg-green-950/30 opacity-60"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{control.title}</span>
                              {control.control_identifier && (
                                <Badge variant="outline" className="text-xs">
                                  {control.control_identifier}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {filteredControls.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No controls found matching your search
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={selectedControls.size === 0 || linkMutation.isPending}
          >
            {linkMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Linking...
              </>
            ) : (
              <>
                Link {selectedControls.size} Control{selectedControls.size !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
