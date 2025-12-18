'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, ControlObjective, Policy } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BulkPolicyMappingProps {
  onSuccess?: () => void;
}

export function BulkPolicyMapping({ onSuccess }: BulkPolicyMappingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [selectedObjectiveIds, setSelectedObjectiveIds] = useState<Set<string>>(new Set());

  const { data: objectives, isLoading: objectivesLoading } = useQuery({
    queryKey: ['control-objectives'],
    queryFn: () => governanceApi.getControlObjectives(),
    enabled: isOpen,
  });

  const { data: policies, isLoading: policiesLoading } = useQuery({
    queryKey: ['policies', { limit: 1000 }],
    queryFn: () => governanceApi.getPolicies({ limit: 1000 }),
    enabled: isOpen,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ objectiveId, policyId }: { objectiveId: string; policyId: string }) => {
      const objective = objectives?.find((obj) => obj.id === objectiveId);
      if (!objective) throw new Error('Objective not found');
      
      return governanceApi.updateControlObjective(objectiveId, {
        ...objective,
        policy_id: policyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-objectives'] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });

  const handleBulkUpdate = async () => {
    if (!selectedPolicyId || selectedObjectiveIds.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select a policy and at least one control objective',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updates = Array.from(selectedObjectiveIds).map((objectiveId) =>
        updateMutation.mutateAsync({ objectiveId, policyId: selectedPolicyId }),
      );

      await Promise.all(updates);

      toast({
        title: 'Success',
        description: `Successfully mapped ${selectedObjectiveIds.size} control objective(s) to the selected policy`,
      });

      setSelectedObjectiveIds(new Set());
      setSelectedPolicyId('');
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update control objectives',
        variant: 'destructive',
      });
    }
  };

  const toggleObjective = (objectiveId: string) => {
    const newSet = new Set(selectedObjectiveIds);
    if (newSet.has(objectiveId)) {
      newSet.delete(objectiveId);
    } else {
      newSet.add(objectiveId);
    }
    setSelectedObjectiveIds(newSet);
  };

  const selectAll = () => {
    if (objectives) {
      setSelectedObjectiveIds(new Set(objectives.map((obj) => obj.id)));
    }
  };

  const deselectAll = () => {
    setSelectedObjectiveIds(new Set());
  };

  // Group objectives by current policy
  const objectivesByPolicy = objectives?.reduce((acc, obj) => {
    const policyId = obj.policy_id || 'unassigned';
    if (!acc[policyId]) {
      acc[policyId] = [];
    }
    acc[policyId].push(obj);
    return acc;
  }, {} as Record<string, ControlObjective[]>);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Link2 className="h-4 w-4 mr-2" />
        Bulk Map Policies
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Map Control Objectives to Policies</DialogTitle>
            <DialogDescription>
              Select a policy and multiple control objectives to link them together
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Policy</label>
              <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a policy" />
                </SelectTrigger>
                <SelectContent>
                  {policies?.data.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.title} (v{policy.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Select Control Objectives ({selectedObjectiveIds.size} selected)
                </p>
                <p className="text-xs text-muted-foreground">
                  Select control objectives to map to the chosen policy
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>

            {objectivesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {objectivesByPolicy &&
                  Object.entries(objectivesByPolicy).map(([policyId, objs]) => {
                    const policy = policies?.data.find((p) => p.id === policyId);
                    return (
                      <Card key={policyId}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">
                            {policy ? policy.title : 'Unassigned'} ({objs.length} objectives)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {objs.map((objective) => (
                              <div
                                key={objective.id}
                                className="flex items-center gap-3 p-2 rounded border hover:bg-muted/50"
                              >
                                <Checkbox
                                  checked={selectedObjectiveIds.has(objective.id)}
                                  onCheckedChange={() => toggleObjective(objective.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {objective.objective_identifier}
                                    </Badge>
                                    <span className="text-sm font-medium">{objective.statement}</span>
                                  </div>
                                  {objective.domain && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Domain: {objective.domain}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkUpdate}
                disabled={!selectedPolicyId || selectedObjectiveIds.size === 0 || updateMutation.isPending}
              >
                {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Map {selectedObjectiveIds.size} Objective(s)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
