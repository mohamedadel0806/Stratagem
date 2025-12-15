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
import { risksApi, riskLinksApi, Risk } from '@/lib/api/risks';
import { Search, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

interface RiskBrowserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  controlId: string;
  controlName?: string;
  existingRiskIds?: Set<string>;
}

const getRiskLevelColor = (level?: string, score?: number) => {
  if (level) {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
    }
  }
  if (score) {
    if (score >= 20) return 'bg-red-500 text-white';
    if (score >= 12) return 'bg-orange-500 text-white';
    if (score >= 6) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  }
  return 'bg-gray-500 text-white';
};

const getRiskLevelLabel = (level?: string, score?: number) => {
  if (level) {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }
  if (score) {
    if (score >= 20) return 'Critical';
    if (score >= 12) return 'High';
    if (score >= 6) return 'Medium';
    return 'Low';
  }
  return 'Unknown';
};

export function RiskBrowserDialog({
  open,
  onOpenChange,
  controlId,
  controlName,
  existingRiskIds = new Set(),
}: RiskBrowserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRisks, setSelectedRisks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all risks
  const { data: risksData, isLoading, error } = useQuery({
    queryKey: ['risks-for-linking'],
    queryFn: async () => {
      // Backend limits max to 100, so we'll fetch in batches if needed
      const result = await risksApi.getAll({ limit: 100, page: 1 });
      return result;
    },
    enabled: open,
  });

  const risks = risksData?.data || [];

  // Filter risks based on search
  const filteredRisks = risks.filter((risk) => {
    const matchesSearch =
      !searchQuery ||
      risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.risk_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.category_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Mutation for linking risks
  const linkMutation = useMutation({
    mutationFn: async () => {
      const linkPromises = Array.from(selectedRisks).map((riskId) =>
        riskLinksApi.linkControl({
          risk_id: riskId,
          control_id: controlId,
        })
      );
      return Promise.all(linkPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-risks', controlId] });
      queryClient.invalidateQueries({ queryKey: ['control-effectiveness', controlId] });
      setSelectedRisks(new Set());
      setSearchQuery('');
      onOpenChange(false);

      toast({
        title: 'Success',
        description: `${selectedRisks.size} risk(s) linked successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to link risks',
        variant: 'destructive',
      });
    },
  });

  const handleToggleRisk = (riskId: string) => {
    const newSelected = new Set(selectedRisks);
    if (newSelected.has(riskId)) {
      newSelected.delete(riskId);
    } else {
      newSelected.add(riskId);
    }
    setSelectedRisks(newSelected);
  };

  const handleSelectAll = () => {
    const availableRisks = filteredRisks.filter((r) => !existingRiskIds.has(r.id));
    if (selectedRisks.size === availableRisks.length) {
      setSelectedRisks(new Set());
    } else {
      setSelectedRisks(new Set(availableRisks.map((r) => r.id)));
    }
  };

  const handleLink = () => {
    if (selectedRisks.size === 0) {
      toast({
        title: 'No risks selected',
        description: 'Please select at least one risk to link',
        variant: 'destructive',
      });
      return;
    }
    linkMutation.mutate();
  };

  const availableRisks = filteredRisks.filter((r) => !existingRiskIds.has(r.id));
  const linkedRisks = filteredRisks.filter((r) => existingRiskIds.has(r.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Link Risks to Control
          </DialogTitle>
          <DialogDescription>
            Select risks to link to {controlName || 'this control'}. Linking risks helps track which
            risks are mitigated by this control.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search risks by title, ID, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Risks List */}
          <div className="flex-1 overflow-hidden border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-40 text-destructive">
                Failed to load risks. Please try again.
              </div>
            ) : (
              <div className="h-[300px] overflow-y-auto">
                <div className="p-2 space-y-1">
                  {/* Select All Header */}
                  {availableRisks.length > 0 && (
                    <div className="flex items-center gap-2 p-2 border-b sticky top-0 bg-background">
                      <Checkbox
                        checked={
                          selectedRisks.size > 0 &&
                          selectedRisks.size === availableRisks.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm font-medium">
                        Select All ({availableRisks.length} available)
                      </span>
                      {selectedRisks.size > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {selectedRisks.size} selected
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Available Risks */}
                  {availableRisks.map((risk) => {
                    const riskLevel = getRiskLevelLabel(
                      risk.current_risk_level,
                      risk.current_risk_score
                    );
                    const riskColor = getRiskLevelColor(
                      risk.current_risk_level,
                      risk.current_risk_score
                    );
                    const riskScore = risk.current_risk_score || risk.likelihood * risk.impact;

                    return (
                      <div
                        key={risk.id}
                        className={`flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 cursor-pointer ${
                          selectedRisks.has(risk.id) ? 'bg-primary/5 border border-primary/20' : ''
                        }`}
                        onClick={() => handleToggleRisk(risk.id)}
                      >
                        <Checkbox
                          checked={selectedRisks.has(risk.id)}
                          onCheckedChange={() => handleToggleRisk(risk.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{risk.title}</span>
                            {risk.risk_id && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {risk.risk_id}
                              </Badge>
                            )}
                            <Badge className={`${riskColor} text-xs`}>
                              {riskLevel} ({riskScore})
                            </Badge>
                          </div>
                          {risk.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {risk.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {risk.category_name && (
                              <Badge variant="secondary" className="text-xs">
                                {risk.category_name}
                              </Badge>
                            )}
                            {risk.status && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {risk.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Already Linked Risks */}
                  {linkedRisks.length > 0 && (
                    <>
                      <div className="text-xs font-medium text-muted-foreground py-2 px-2 border-t mt-2">
                        Already Linked ({linkedRisks.length})
                      </div>
                      {linkedRisks.map((risk) => {
                        const riskLevel = getRiskLevelLabel(
                          risk.current_risk_level,
                          risk.current_risk_score
                        );
                        const riskColor = getRiskLevelColor(
                          risk.current_risk_level,
                          risk.current_risk_score
                        );
                        const riskScore = risk.current_risk_score || risk.likelihood * risk.impact;

                        return (
                          <div
                            key={risk.id}
                            className="flex items-start gap-3 p-3 rounded-md bg-green-50 dark:bg-green-950/30 opacity-60"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">{risk.title}</span>
                                {risk.risk_id && (
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {risk.risk_id}
                                  </Badge>
                                )}
                                <Badge className={`${riskColor} text-xs`}>
                                  {riskLevel} ({riskScore})
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {filteredRisks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No risks found matching your search
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
            disabled={selectedRisks.size === 0 || linkMutation.isPending}
          >
            {linkMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Linking...
              </>
            ) : (
              <>
                Link {selectedRisks.size} Risk{selectedRisks.size !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

