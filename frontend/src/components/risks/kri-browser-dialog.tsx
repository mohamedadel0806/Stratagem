'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { krisApi, KRI, KRIStatus } from '@/lib/api/risks';
import { Search, Activity, Loader2, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface KRIBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskId: string;
  existingKRIIds?: Set<string>; // Track already linked KRIs
}

// KRI Status constants
const KRI_STATUS = {
  GREEN: 'green' as const,
  AMBER: 'amber' as const,
  RED: 'red' as const,
} as const;

const statusColors: Record<KRIStatus, string> = {
  green: 'bg-green-100 text-green-800 border-green-300',
  amber: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  red: 'bg-red-100 text-red-800 border-red-300',
};

const statusIcons: Record<KRIStatus, typeof CheckCircle2> = {
  green: CheckCircle2,
  amber: AlertTriangle,
  red: AlertCircle,
};

export function KRIBrowserDialog({ open, onOpenChange, riskId, existingKRIIds = new Set() }: KRIBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedKRIs, setSelectedKRIs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<KRIStatus | 'all'>('all');
  const [linkProgress, setLinkProgress] = useState(0);

  // Fetch all KRIs
  const { data: kris, isLoading } = useQuery({
    queryKey: ['kris', { search: searchQuery, status: statusFilter }],
    queryFn: () => krisApi.getAll({ 
      status: statusFilter !== 'all' ? statusFilter : undefined,
      isActive: true,
    }),
    enabled: open,
  });

  // Filter KRIs based on search and exclude already linked ones
  const filteredKRIs = (kris || []).filter((kri) => {
    const matchesSearch = !searchQuery || 
      kri.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kri.kri_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kri.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const notAlreadyLinked = !existingKRIIds.has(kri.id);
    return matchesSearch && notAlreadyLinked;
  });

  const linkMutation = useMutation({
    mutationFn: async (kriIds: string[]) => {
      setLinkProgress(0);
      const total = kriIds.length;
      const results = [];
      
      for (let i = 0; i < kriIds.length; i++) {
        await krisApi.linkToRisk(kriIds[i], riskId);
        setLinkProgress(((i + 1) / total) * 100);
        results.push(kriIds[i]);
      }
      
      return results;
    },
    onSuccess: (linkedIds) => {
      queryClient.invalidateQueries({ queryKey: ['risk-kris', riskId] });
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] });
      setSelectedKRIs(new Set());
      setSearchQuery('');
      setLinkProgress(0);
      onOpenChange(false);
      toast({
        title: 'Success',
        description: `${linkedIds.length} KRI(s) linked successfully`,
      });
    },
    onError: (error: any) => {
      setLinkProgress(0);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to link KRIs',
        variant: 'destructive',
      });
    },
  });

  const handleToggleKRI = (kriId: string) => {
    const newSelected = new Set(selectedKRIs);
    if (newSelected.has(kriId)) {
      newSelected.delete(kriId);
    } else {
      newSelected.add(kriId);
    }
    setSelectedKRIs(newSelected);
  };

  const handleLink = () => {
    if (selectedKRIs.size === 0) {
      toast({
        title: 'No KRIs selected',
        description: 'Please select at least one KRI to link',
        variant: 'destructive',
      });
      return;
    }
    linkMutation.mutate(Array.from(selectedKRIs));
  };

  const handleClose = () => {
    if (linkProgress > 0 && linkProgress < 100) {
      // Don't close if linking is in progress
      return;
    }
    setSelectedKRIs(new Set());
    setSearchQuery('');
    setStatusFilter('all');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link KRIs to Risk</DialogTitle>
            <DialogDescription>
              Select Key Risk Indicators to link to this risk. Only active KRIs not already linked are shown.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search KRIs by name, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="kri-search-input"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as KRIStatus | 'all')}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value={KRI_STATUS.GREEN}>Green</option>
                <option value={KRI_STATUS.AMBER}>Amber</option>
                <option value={KRI_STATUS.RED}>Red</option>
              </select>
            </div>

            {/* KRI List */}
            <div className="flex-1 overflow-y-auto border rounded-md">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading KRIs...</span>
                </div>
              ) : filteredKRIs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'No KRIs match your search criteria'
                      : 'No available KRIs to link. All KRIs may already be linked or inactive.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredKRIs.map((kri) => {
                    const StatusIcon = kri.current_status ? statusIcons[kri.current_status] : Activity;
                    const isSelected = selectedKRIs.has(kri.id);
                    
                    return (
                      <div
                        key={kri.id}
                        className={cn(
                          'p-4 hover:bg-accent cursor-pointer transition-colors',
                          isSelected && 'bg-accent'
                        )}
                        onClick={() => handleToggleKRI(kri.id)}
                        data-testid={`kri-item-${kri.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleKRI(kri.id)}
                            onClick={(e) => e.stopPropagation()}
                            data-testid={`kri-checkbox-${kri.id}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{kri.name}</span>
                              {kri.kri_id && (
                                <Badge variant="outline" className="text-xs">
                                  {kri.kri_id}
                                </Badge>
                              )}
                              {kri.current_status && (
                                <Badge
                                  variant="outline"
                                  className={cn('text-xs', statusColors[kri.current_status])}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {kri.current_status.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            {kri.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {kri.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              {kri.measurement_unit && (
                                <span>Unit: {kri.measurement_unit}</span>
                              )}
                              {kri.measurement_frequency && (
                                <span>Frequency: {kri.measurement_frequency}</span>
                              )}
                              {kri.current_value !== null && kri.current_value !== undefined && (
                                <span>Current: {kri.current_value}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selection Summary */}
            {selectedKRIs.size > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedKRIs.size} KRI{selectedKRIs.size !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={linkProgress > 0}>
              Cancel
            </Button>
            <Button
              onClick={handleLink}
              disabled={selectedKRIs.size === 0 || linkProgress > 0}
              data-testid="link-kri-submit"
            >
              {linkProgress > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking...
                </>
              ) : (
                `Link ${selectedKRIs.size > 0 ? `${selectedKRIs.size} ` : ''}KRI${selectedKRIs.size !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>

          {linkProgress > 0 && linkProgress < 100 && (
            <div className="px-6 pb-4">
              <Progress value={linkProgress} className="h-2" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

