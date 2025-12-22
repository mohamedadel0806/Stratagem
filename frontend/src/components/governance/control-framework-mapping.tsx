'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, UnifiedControl, MappingCoverage } from '@/lib/api/governance';
import { complianceApi, Framework, FrameworkRequirement } from '@/lib/api/compliance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link2, ExternalLink, Trash2, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ControlFrameworkMappingProps {
  controlId: string;
}

interface FrameworkMapping {
  id: string;
  framework_requirement_id: string;
  framework_requirement?: {
    id: string;
    requirement_identifier: string;
    title?: string;
    requirement_text: string;
    framework?: {
      id: string;
      name: string;
    };
  };
  unified_control_id: string;
  coverage_level: MappingCoverage;
  mapping_notes?: string;
  mapped_at: string;
}

const coverageLabels: Record<MappingCoverage, string> = {
  [MappingCoverage.FULL]: 'Full Coverage',
  [MappingCoverage.PARTIAL]: 'Partial Coverage',
  [MappingCoverage.NOT_APPLICABLE]: 'Not Applicable',
};

const coverageColors: Record<MappingCoverage, string> = {
  [MappingCoverage.FULL]: 'default',
  [MappingCoverage.PARTIAL]: 'secondary',
  [MappingCoverage.NOT_APPLICABLE]: 'outline',
};

export function ControlFrameworkMapping({ controlId }: ControlFrameworkMappingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('');
  const [selectedRequirementIds, setSelectedRequirementIds] = useState<Set<string>>(new Set());
  const [coverageLevel, setCoverageLevel] = useState<MappingCoverage>(MappingCoverage.FULL);
  const [mappingNotes, setMappingNotes] = useState('');
  const [editingMapping, setEditingMapping] = useState<FrameworkMapping | null>(null);

  // Fetch existing mappings
  const { data: mappings, isLoading: mappingsLoading } = useQuery({
    queryKey: ['control-framework-mappings', controlId],
    queryFn: () => governanceApi.getControlFrameworkMappings(controlId),
  });

  // Fetch frameworks
  const { data: frameworks, isLoading: frameworksLoading } = useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: () => complianceApi.getFrameworks(),
    enabled: isMappingDialogOpen,
  });

  // Fetch requirements for selected framework
  const { data: requirementsData, isLoading: requirementsLoading } = useQuery({
    queryKey: ['framework-requirements', selectedFrameworkId],
    queryFn: async () => {
      if (!selectedFrameworkId) return { data: [] };
      return complianceApi.getRequirements({ frameworkId: selectedFrameworkId, limit: 1000 });
    },
    enabled: isMappingDialogOpen && !!selectedFrameworkId,
  });

  const requirements = requirementsData?.data || [];

  const bulkCreateMappingMutation = useMutation({
    mutationFn: (data: {
      requirement_ids: string[];
      coverage_level: string;
      mapping_notes?: string;
    }) => governanceApi.bulkCreateControlFrameworkMappings(controlId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-framework-mappings', controlId] });
      toast({
        title: 'Success',
        description: 'Framework mappings created successfully',
      });
      setIsMappingDialogOpen(false);
      setSelectedFrameworkId('');
      setSelectedRequirementIds(new Set());
      setMappingNotes('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create mappings',
        variant: 'destructive',
      });
    },
  });

  const deleteMappingMutation = useMutation({
    mutationFn: (mappingId: string) => governanceApi.deleteControlFrameworkMapping(mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-framework-mappings', controlId] });
      toast({
        title: 'Success',
        description: 'Mapping deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete mapping',
        variant: 'destructive',
      });
    },
  });

  const handleBulkMap = () => {
    if (selectedRequirementIds.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one framework requirement',
        variant: 'destructive',
      });
      return;
    }

    bulkCreateMappingMutation.mutate({
      requirement_ids: Array.from(selectedRequirementIds),
      coverage_level: coverageLevel,
      mapping_notes: mappingNotes || undefined,
    });
  };

  const toggleRequirement = (requirementId: string) => {
    const newSet = new Set(selectedRequirementIds);
    if (newSet.has(requirementId)) {
      newSet.delete(requirementId);
    } else {
      newSet.add(requirementId);
    }
    setSelectedRequirementIds(newSet);
  };

  const selectAllRequirements = () => {
    if (requirements) {
      setSelectedRequirementIds(new Set(requirements.map((r: any) => r.id)));
    }
  };

  const deselectAllRequirements = () => {
    setSelectedRequirementIds(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Framework Mappings</h3>
          <p className="text-sm text-muted-foreground">
            Map this control to compliance framework requirements
          </p>
        </div>
        <Button onClick={() => setIsMappingDialogOpen(true)}>
          <Link2 className="h-4 w-4 mr-2" />
          Map to Framework
        </Button>
      </div>

      {mappingsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : mappings && mappings.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Framework</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Coverage Level</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Mapped At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping: FrameworkMapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>
                      {mapping.framework_requirement?.framework?.name || 'Unknown Framework'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="text-xs mr-2">
                          {mapping.framework_requirement?.requirement_identifier}
                        </Badge>
                        <span className="text-sm">
                          {mapping.framework_requirement?.title || mapping.framework_requirement?.requirement_text}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={coverageColors[mapping.coverage_level] as any}>
                        {coverageLabels[mapping.coverage_level]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {mapping.mapping_notes || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(mapping.mapped_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMappingMutation.mutate(mapping.id)}
                        disabled={deleteMappingMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No framework mappings yet. Click "Map to Framework" to create mappings.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mapping Dialog */}
      <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Map Control to Framework Requirements</DialogTitle>
            <DialogDescription>
              Select a framework and requirements to map this control to
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="framework-select">Framework *</Label>
              <Select value={selectedFrameworkId} onValueChange={setSelectedFrameworkId}>
                <SelectTrigger id="framework-select">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks?.map((framework: Framework) => (
                    <SelectItem key={framework.id} value={framework.id}>
                      {framework.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedFrameworkId && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coverage-level">Coverage Level</Label>
                    <Select
                      value={coverageLevel}
                      onValueChange={(value) => setCoverageLevel(value as MappingCoverage)}
                    >
                      <SelectTrigger id="coverage-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MappingCoverage.FULL}>Full Coverage</SelectItem>
                        <SelectItem value={MappingCoverage.PARTIAL}>Partial Coverage</SelectItem>
                        <SelectItem value={MappingCoverage.NOT_APPLICABLE}>Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mapping-notes">Mapping Notes (Optional)</Label>
                  <Textarea
                    id="mapping-notes"
                    value={mappingNotes}
                    onChange={(e) => setMappingNotes(e.target.value)}
                    placeholder="Add notes about this mapping..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Select Requirements ({selectedRequirementIds.size} selected)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Select framework requirements to map this control to
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllRequirements}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={deselectAllRequirements}>
                      Deselect All
                    </Button>
                  </div>
                </div>

                {requirementsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : requirements && requirements.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
                    {requirements.map((requirement: any) => (
                      <div
                        key={requirement.id}
                        className="flex items-center gap-3 p-2 rounded border hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selectedRequirementIds.has(requirement.id)}
                          onCheckedChange={() => toggleRequirement(requirement.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {requirement.requirement_identifier}
                            </Badge>
                            <span className="text-sm font-medium">
                              {requirement.title || requirement.requirement_text}
                            </span>
                          </div>
                          {requirement.domain && (
                            <p className="text-xs text-muted-foreground mt-1">Domain: {requirement.domain}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No requirements found for this framework
                  </p>
                )}
              </>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsMappingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkMap}
                disabled={
                  !selectedFrameworkId ||
                  selectedRequirementIds.size === 0 ||
                  bulkCreateMappingMutation.isPending
                }
              >
                {bulkCreateMappingMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Map {selectedRequirementIds.size} Requirement(s)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


