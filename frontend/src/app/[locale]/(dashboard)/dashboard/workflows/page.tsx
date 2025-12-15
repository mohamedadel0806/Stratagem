'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowsApi, Workflow, WorkflowTemplate } from '@/lib/api/workflows';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Edit, Trash2, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { WorkflowForm } from '@/components/forms/workflow-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WorkflowsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => workflowsApi.getAll(),
  });

  const { data: templates } = useQuery({
    queryKey: ['workflow-templates'],
    queryFn: () => workflowsApi.getTemplates(),
  });

  const instantiateTemplateMutation = useMutation({
    mutationFn: ({ templateId, name, description }: { templateId: string; name: string; description?: string }) =>
      workflowsApi.instantiateTemplate(templateId, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: 'Success',
        description: 'Workflow created from template',
      });
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create workflow from template',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workflowsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: 'Success',
        description: 'Workflow deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete workflow',
        variant: 'destructive',
      });
    },
  });

  const getTypeColor = (type: Workflow['type']) => {
    switch (type) {
      case 'approval':
        return 'bg-blue-100 text-blue-800';
      case 'notification':
        return 'bg-green-100 text-green-800';
      case 'escalation':
        return 'bg-orange-100 text-orange-800';
      case 'status_change':
        return 'bg-purple-100 text-purple-800';
      case 'deadline_reminder':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'archived':
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-2">
            Automate processes and approvals across your GRC platform
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <Tabs defaultValue="workflows" className="mb-6">
        <TabsList>
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="workflows">

      {!workflows || workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No workflows configured yet</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {workflow.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTypeColor(workflow.type)}>{workflow.type}</Badge>
                    <Badge variant="outline">{workflow.trigger}</Badge>
                    <Badge variant="outline">{workflow.entityType}</Badge>
                  </div>

                  {workflow.daysBeforeDeadline && (
                    <div className="text-sm text-muted-foreground">
                      Reminder: {workflow.daysBeforeDeadline} days before deadline
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingWorkflow(workflow)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(workflow.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>
        <TabsContent value="templates">
          {!templates || templates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No templates available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          {template.name}
                        </CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">{template.category}</Badge>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(template.workflow.type)}>
                          {template.workflow.type}
                        </Badge>
                        <Badge variant="outline">{template.workflow.trigger}</Badge>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          instantiateTemplateMutation.mutate({
                            templateId: template.id,
                            name: template.name,
                            description: template.description,
                          });
                        }}
                        disabled={instantiateTemplateMutation.isPending}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Configure an automated workflow to streamline your GRC processes
            </DialogDescription>
          </DialogHeader>
          <WorkflowForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ['workflows'] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {editingWorkflow && (
        <Dialog open={!!editingWorkflow} onOpenChange={() => setEditingWorkflow(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Workflow</DialogTitle>
              <DialogDescription>Update workflow configuration</DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <WorkflowForm
                workflow={editingWorkflow}
                onSuccess={() => {
                  setEditingWorkflow(null);
                  queryClient.invalidateQueries({ queryKey: ['workflows'] });
                }}
                onCancel={() => setEditingWorkflow(null)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

