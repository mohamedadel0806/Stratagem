'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Edit, Trash2, CheckCircle, Circle, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { governanceApi } from '@/lib/api/governance';

const frameworkTypes = [
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'nist_cybersecurity', label: 'NIST Cybersecurity Framework' },
  { value: 'nist_privacy', label: 'NIST Privacy Framework' },
  { value: 'pci_dss', label: 'PCI DSS' },
  { value: 'gdpr', label: 'GDPR' },
  { value: 'nca_ecc', label: 'NCA ECC (UAE)' },
  { value: 'soc2', label: 'SOC 2' },
  { value: 'hipaa', label: 'HIPAA' },
  { value: 'custom', label: 'Custom' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  framework_type: z.string().min(1, 'Please select a framework type'),
  scope: z.string().optional(),
  is_active: z.boolean().default(true),
  require_policy_approval: z.boolean().default(false),
  require_control_testing: z.boolean().default(false),
  policy_review_frequency: z.string().optional(),
  control_review_frequency: z.string().optional(),
  risk_assessment_required: z.boolean().default(false),
  audit_required: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FrameworkConfigurationManagerProps {
  onFrameworkSelected?: (frameworkId: string) => void;
}

export function FrameworkConfigurationManager({
  onFrameworkSelected,
}: FrameworkConfigurationManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const queryClient = useQueryClient();

  // Fetch framework configs
  const { data: configsData, isLoading } = useQuery({
    queryKey: ['framework-configs', filterType, filterActive, searchQuery],
    queryFn: () =>
      governanceApi.getFrameworkConfigs({
        framework_type: filterType || undefined,
        is_active: filterActive !== null ? filterActive : undefined,
        search: searchQuery || undefined,
        page: 1,
        limit: 100,
      }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return governanceApi.createFrameworkConfig({
        name: data.name,
        description: data.description,
        framework_type: data.framework_type,
        scope: data.scope,
        is_active: data.is_active,
        metadata: {
          require_policy_approval: data.require_policy_approval,
          require_control_testing: data.require_control_testing,
          policy_review_frequency: data.policy_review_frequency,
          control_review_frequency: data.control_review_frequency,
          risk_assessment_required: data.risk_assessment_required,
          audit_required: data.audit_required,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['framework-configs'] });
      setIsCreateOpen(false);
      form.reset();
      toast.success('Framework configuration created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create framework configuration');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return governanceApi.updateFrameworkConfig(selectedConfig.id, {
        name: data.name,
        description: data.description,
        scope: data.scope,
        is_active: data.is_active,
        metadata: {
          require_policy_approval: data.require_policy_approval,
          require_control_testing: data.require_control_testing,
          policy_review_frequency: data.policy_review_frequency,
          control_review_frequency: data.control_review_frequency,
          risk_assessment_required: data.risk_assessment_required,
          audit_required: data.audit_required,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['framework-configs'] });
      setIsEditOpen(false);
      setSelectedConfig(null);
      form.reset();
      toast.success('Framework configuration updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update framework configuration');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return governanceApi.deleteFrameworkConfig(selectedConfig.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['framework-configs'] });
      setDeleteConfirmOpen(false);
      setSelectedConfig(null);
      toast.success('Framework configuration deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete framework configuration');
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (config: any) => {
      if (config.is_active) {
        return governanceApi.deactivateFrameworkConfig(config.id);
      } else {
        return governanceApi.activateFrameworkConfig(config.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['framework-configs'] });
      toast.success('Framework configuration status updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update framework configuration status');
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      framework_type: '',
      scope: '',
      is_active: true,
      require_policy_approval: false,
      require_control_testing: false,
      risk_assessment_required: false,
      audit_required: false,
    },
  });

  const onCreateSubmit = async (data: FormValues) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = async (data: FormValues) => {
    updateMutation.mutate(data);
  };

  const handleEdit = (config: any) => {
    setSelectedConfig(config);
    form.reset({
      name: config.name,
      description: config.description,
      framework_type: config.framework_type,
      scope: config.scope,
      is_active: config.is_active,
      require_policy_approval: config.metadata?.require_policy_approval || false,
      require_control_testing: config.metadata?.require_control_testing || false,
      policy_review_frequency: config.metadata?.policy_review_frequency || '',
      control_review_frequency: config.metadata?.control_review_frequency || '',
      risk_assessment_required: config.metadata?.risk_assessment_required || false,
      audit_required: config.metadata?.audit_required || false,
    });
    setIsEditOpen(true);
  };

  const getFrameworkTypeLabel = (type: string) => {
    return frameworkTypes.find(ft => ft.value === type)?.label || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const configs = configsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Framework Configuration</h2>
          <p className="text-muted-foreground mt-1">
            Select and configure compliance frameworks for your organization
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Framework
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Framework Configuration</DialogTitle>
              <DialogDescription>
                Configure a new compliance framework for your organization
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Primary ISO27001 Compliance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="framework_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Framework Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select framework type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frameworkTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Textarea placeholder="Configuration description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scope</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., All departments, Finance & IT only" {...field} />
                      </FormControl>
                      <FormDescription>Define the organizational scope of this framework</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="require_policy_approval"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Require Policy Approval</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="require_control_testing"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Require Control Testing</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_assessment_required"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Risk Assessment Required</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audit_required"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Audit Required</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="policy_review_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Review Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="control_review_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Control Review Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Active</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Framework Configuration'
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search frameworks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {frameworkTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterActive === null ? '' : filterActive ? 'active' : 'inactive'}
              onValueChange={value => {
                setFilterActive(value === '' ? null : value === 'active');
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Configurations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Configurations</CardTitle>
          <CardDescription>
            {configs.length} configuration{configs.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No framework configurations found</p>
              <Button onClick={() => setIsCreateOpen(true)}>Create Your First Configuration</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Framework Type</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map(config => (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">{config.name}</TableCell>
                      <TableCell>{getFrameworkTypeLabel(config.framework_type)}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {config.scope || 'Organization-wide'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {config.is_active ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Badge variant="outline" className="bg-green-50">
                                Active
                              </Badge>
                            </>
                          ) : (
                            <>
                              <Circle className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="outline">Inactive</Badge>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(config)}
                          disabled={updateMutation.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveMutation.mutate(config)}
                          disabled={toggleActiveMutation.isPending}
                        >
                          {config.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedConfig(config);
                            setDeleteConfirmOpen(true);
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedConfig && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Framework Configuration</DialogTitle>
              <DialogDescription>Update the framework configuration details</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Primary ISO27001 Compliance" {...field} />
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
                        <Textarea placeholder="Configuration description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scope</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., All departments, Finance & IT only" {...field} />
                      </FormControl>
                      <FormDescription>Define the organizational scope of this framework</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="require_policy_approval"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Require Policy Approval</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="require_control_testing"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Require Control Testing</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_assessment_required"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Risk Assessment Required</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audit_required"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Audit Required</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="policy_review_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Review Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="control_review_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Control Review Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Active</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Framework Configuration'
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Framework Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedConfig?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
