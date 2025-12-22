'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, ControlObjective, CreateControlObjectiveData } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, Eye } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ControlObjectiveForm } from './control-objective-form';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ControlObjectivesSectionProps {
  policyId: string;
}

export function ControlObjectivesSection({ policyId }: ControlObjectivesSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<ControlObjective | null>(null);

  const { data: objectives, isLoading } = useQuery({
    queryKey: ['control-objectives', policyId],
    queryFn: () => governanceApi.getControlObjectives(policyId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteControlObjective(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-objectives', policyId] });
      toast({
        title: 'Success',
        description: 'Control objective deleted successfully',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this control objective?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading control objectives...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Control Objectives</h3>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Control Objective
        </Button>
      </div>

      {objectives && objectives.length > 0 ? (
        <div className="space-y-2">
          {objectives.map((objective) => (
            <div
              key={objective.id}
              className="border rounded-lg p-4 flex justify-between items-start hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{objective.objective_identifier}</Badge>
                  {objective.priority && (
                    <Badge variant="secondary">{objective.priority}</Badge>
                  )}
                  <Badge variant="outline">{objective.implementation_status}</Badge>
                  {objective.mandatory && (
                    <Badge variant="default" className="text-xs">Mandatory</Badge>
                  )}
                </div>
                <p className="text-sm font-medium mb-1">{objective.statement}</p>
                {objective.rationale && (
                  <p className="text-sm text-muted-foreground">{objective.rationale}</p>
                )}
                {objective.domain && (
                  <p className="text-xs text-muted-foreground mt-1">Domain: {objective.domain}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/${locale}/dashboard/governance/control-objectives/${objective.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingObjective(objective);
                    setIsCreateOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(objective.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-8">
          No control objectives defined yet. Click "Add Control Objective" to create one.
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingObjective ? 'Edit Control Objective' : 'Create Control Objective'}
            </DialogTitle>
            <DialogDescription>
              Define a control objective for this policy
            </DialogDescription>
          </DialogHeader>
          <ControlObjectiveForm
            policyId={policyId}
            objective={editingObjective}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingObjective(null);
              queryClient.invalidateQueries({ queryKey: ['control-objectives', policyId] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingObjective(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}







