'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowsApi, Workflow, CreateWorkflowData, WorkflowActions } from '@/lib/api/workflows';
import { usersApi, User } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.enum(['approval', 'notification', 'escalation', 'status_change', 'deadline_reminder']),
  trigger: z.enum(['manual', 'on_create', 'on_update', 'on_status_change', 'on_deadline_approaching', 'on_deadline_passed', 'scheduled']),
  entityType: z.enum(['risk', 'policy', 'compliance_requirement', 'task']),
  daysBeforeDeadline: z.number().min(0).max(365).optional(),
  // Actions
  approvers: z.array(z.string()).optional(),
  changeStatus: z.string().optional(),
  assignTo: z.string().optional(),
  notifyUsers: z.array(z.string()).optional(),
  createTaskEnabled: z.boolean().optional(),
  taskTitle: z.string().optional(),
  taskDescription: z.string().optional(),
  taskPriority: z.string().optional(),
});

type WorkflowFormValues = z.infer<typeof workflowSchema>;

interface WorkflowFormProps {
  workflow?: Workflow;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: Record<string, { value: string; label: string }[]> = {
  policy: [
    { value: 'draft', label: 'Draft' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ],
  risk: [
    { value: 'identified', label: 'Identified' },
    { value: 'assessing', label: 'Assessing' },
    { value: 'mitigating', label: 'Mitigating' },
    { value: 'monitoring', label: 'Monitoring' },
    { value: 'closed', label: 'Closed' },
  ],
  compliance_requirement: [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'compliant', label: 'Compliant' },
    { value: 'non_compliant', label: 'Non-Compliant' },
    { value: 'not_applicable', label: 'Not Applicable' },
  ],
  task: [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'cancelled', label: 'Cancelled' },
  ],
};

export function WorkflowForm({ workflow, onSuccess, onCancel }: WorkflowFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>(workflow?.actions?.approvers || []);
  const [selectedNotifyUsers, setSelectedNotifyUsers] = useState<string[]>(workflow?.actions?.notify || []);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: workflow?.name || '',
      description: workflow?.description || '',
      type: workflow?.type || 'approval',
      trigger: workflow?.trigger || 'on_create',
      entityType: workflow?.entityType || 'policy',
      daysBeforeDeadline: workflow?.daysBeforeDeadline,
      approvers: workflow?.actions?.approvers || [],
      changeStatus: workflow?.actions?.changeStatus || 'no_change',
      assignTo: workflow?.actions?.assignTo || 'no_assignment',
      notifyUsers: workflow?.actions?.notify || [],
      createTaskEnabled: !!workflow?.actions?.createTask,
      taskTitle: workflow?.actions?.createTask?.title || '',
      taskDescription: workflow?.actions?.createTask?.description || '',
      taskPriority: workflow?.actions?.createTask?.priority || 'medium',
    },
  });

  const watchType = form.watch('type');
  const watchEntityType = form.watch('entityType');
  const watchTrigger = form.watch('trigger');
  const watchCreateTaskEnabled = form.watch('createTaskEnabled');

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkflowData) => workflowsApi.create(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Workflow created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create workflow',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateWorkflowData>) => {
      if (!workflow) throw new Error('No workflow to update');
      return workflowsApi.update(workflow.id, data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Workflow updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update workflow',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: WorkflowFormValues) => {
    // Build actions object
    const actions: WorkflowActions = {};

    if (values.type === 'approval' && selectedApprovers.length > 0) {
      actions.approvers = selectedApprovers;
    }

    if (values.changeStatus && values.changeStatus !== 'no_change') {
      actions.changeStatus = values.changeStatus;
    }

    if (values.assignTo && values.assignTo !== 'no_assignment') {
      actions.assignTo = values.assignTo;
    }

    if (selectedNotifyUsers.length > 0) {
      actions.notify = selectedNotifyUsers;
    }

    if (values.createTaskEnabled && values.taskTitle) {
      actions.createTask = {
        title: values.taskTitle,
        description: values.taskDescription,
        priority: values.taskPriority || 'medium',
      };
    }

    const data: CreateWorkflowData = {
      name: values.name,
      description: values.description,
      type: values.type,
      trigger: values.trigger,
      entityType: values.entityType,
      daysBeforeDeadline: values.daysBeforeDeadline,
      actions,
    };

    if (workflow) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addApprover = (userId: string) => {
    if (!selectedApprovers.includes(userId)) {
      setSelectedApprovers([...selectedApprovers, userId]);
    }
  };

  const removeApprover = (userId: string) => {
    setSelectedApprovers(selectedApprovers.filter(id => id !== userId));
  };

  const addNotifyUser = (userId: string) => {
    if (!selectedNotifyUsers.includes(userId)) {
      setSelectedNotifyUsers([...selectedNotifyUsers, userId]);
    }
  };

  const removeNotifyUser = (userId: string) => {
    setSelectedNotifyUsers(selectedNotifyUsers.filter(id => id !== userId));
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}`.trim() || user.email : userId;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Configure the workflow name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Policy Approval Workflow" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this workflow does..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Workflow Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Configuration</CardTitle>
            <CardDescription>Define when and how the workflow should run</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="approval">Approval</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="escalation">Escalation</SelectItem>
                        <SelectItem value="status_change">Status Change</SelectItem>
                        <SelectItem value="deadline_reminder">Deadline Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trigger"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="on_create">On Create</SelectItem>
                        <SelectItem value="on_update">On Update</SelectItem>
                        <SelectItem value="on_status_change">On Status Change</SelectItem>
                        <SelectItem value="on_deadline_approaching">On Deadline Approaching</SelectItem>
                        <SelectItem value="on_deadline_passed">On Deadline Passed</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="risk">Risk</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="compliance_requirement">Compliance Requirement</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchTrigger === 'on_deadline_approaching' || watchTrigger === 'on_deadline_passed') && (
              <FormField
                control={form.control}
                name="daysBeforeDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Before Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={365}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of days before the deadline to trigger this workflow
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Actions Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Configure what happens when the workflow runs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Approvers (for approval workflows) */}
            {watchType === 'approval' && (
              <div className="space-y-3">
                <Label>Approvers</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedApprovers.map((userId) => (
                    <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                      {getUserName(userId)}
                      <button
                        type="button"
                        onClick={() => removeApprover(userId)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addApprover}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add approver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(u => !selectedApprovers.includes(u.id))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select users who need to approve in order
                </FormDescription>
              </div>
            )}

            {/* Status Change */}
            <FormField
              control={form.control}
              name="changeStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Status To</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'no_change'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No status change" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no_change">No status change</SelectItem>
                      {STATUS_OPTIONS[watchEntityType]?.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assign To */}
            <FormField
              control={form.control}
              name="assignTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'no_assignment'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No assignment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no_assignment">No assignment</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notify Users */}
            <div className="space-y-3">
              <Label>Notify Users</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedNotifyUsers.map((userId) => (
                  <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                    {getUserName(userId)}
                    <button
                      type="button"
                      onClick={() => removeNotifyUser(userId)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addNotifyUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Add user to notify..." />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(u => !selectedNotifyUsers.includes(u.id))
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Task */}
            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
                name="createTaskEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Create a follow-up task</FormLabel>
                  </FormItem>
                )}
              />

              {watchCreateTaskEnabled && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <FormField
                    control={form.control}
                    name="taskTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Review and take action" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taskDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Task details..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taskPriority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'medium'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {workflow ? 'Update' : 'Create'} Workflow
          </Button>
        </div>
      </form>
    </Form>
  );
}
