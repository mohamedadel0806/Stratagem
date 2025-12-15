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
import { governanceApi, UnifiedControl } from '@/lib/api/governance';
import { riskLinksApi } from '@/lib/api/risks';
import { Search, Shield, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RiskControlBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskId: string;
  existingControlIds?: Set<string>;
}

export function RiskControlBrowserDialog({ open, onOpenChange, riskId, existingControlIds = new Set() }: RiskControlBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedControls, setSelectedControls] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [effectivenessRating, setEffectivenessRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // Fetch all controls
  const { data: controlsData, isLoading, error } = useQuery({
    queryKey: ['unified-controls-for-risk-linking', searchQuery],
    queryFn: async () => {
      const result = await governanceApi.getUnifiedControls({ 
        limit: 500,
        search: searchQuery || undefined,
      });
      return result;
    },
    enabled: open,
  });

  const controls = controlsData?.data || [];

  // Filter controls based on search and exclude already linked
  const filteredControls = controls.filter((control) => {
    const matchesSearch =
      !searchQuery ||
      control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.control_identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isNotLinked = !existingControlIds.has(control.id);
    
    return matchesSearch && isNotLinked;
  });

  // Mutation for linking controls to risk
  const linkMutation = useMutation({
    mutationFn: async () => {
      const linkPromises = Array.from(selectedControls).map(controlId =>
        riskLinksApi.linkControl({
          risk_id: riskId,
          control_id: controlId,
          effectiveness_rating: effectivenessRating,
          notes: notes || undefined,
        })
      );
      return Promise.all(linkPromises);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['risk-controls', riskId] });
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] });
      setSelectedControls(new Set());
      setSearchQuery('');
      setEffectivenessRating(undefined);
      setNotes('');
      onOpenChange(false);
      toast({
        title: 'Success',
        description: `${result.length} control(s) linked successfully`,
      });
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

  const handleClose = () => {
    setSelectedControls(new Set());
    setSearchQuery('');
    setEffectivenessRating(undefined);
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Link Controls to Risk
          </DialogTitle>
          <DialogDescription>
            Select controls to link to this risk. Controls help mitigate and manage the risk.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search controls by title, identifier, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {selectedControls.size > 0 && (
            <div className="space-y-2">
              <Label htmlFor="effectiveness">Effectiveness Rating (Optional)</Label>
              <Input
                id="effectiveness"
                type="number"
                min="1"
                max="5"
                placeholder="1-5"
                value={effectivenessRating || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setEffectivenessRating(value ? parseInt(value, 10) : undefined);
                }}
              />
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about how this control mitigates the risk..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto border rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <p className="text-sm text-muted-foreground">
                  Failed to load controls. Please try again.
                </p>
              </div>
            ) : filteredControls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No controls found matching your search' : 'No available controls to link'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredControls.map((control: UnifiedControl) => {
                  const isSelected = selectedControls.has(control.id);
                  return (
                    <div
                      key={control.id}
                      onClick={() => handleToggleControl(control.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleControl(control.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{control.title}</span>
                            {control.control_identifier && (
                              <Badge variant="outline" className="font-mono text-xs">
                                {control.control_identifier}
                              </Badge>
                            )}
                          </div>
                          {control.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {control.description}
                            </p>
                          )}
                          {control.control_type && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {control.control_type}
                            </Badge>
                          )}
                        </div>
                        {isSelected && (
                          <div className="ml-2">
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={linkMutation.isPending}>
            Cancel
          </Button>
            <Button
              onClick={handleLink}
              disabled={selectedControls.size === 0 || linkMutation.isPending}
              data-testid="risk-control-dialog-submit-button"
            >
              {linkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Link {selectedControls.size > 0 ? `${selectedControls.size} ` : ''}Control(s)
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
