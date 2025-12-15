'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { validationRulesApi, complianceApi, AssetType } from '@/lib/api/compliance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, Filter, Loader2 } from 'lucide-react';
import { ValidationRuleForm } from '@/components/forms/validation-rule-form';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ValidationRulesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [requirementFilter, setRequirementFilter] = useState<string>('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | 'all'>('all');

  // Fetch frameworks for filter
  const { data: frameworks } = useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: () => complianceApi.getFrameworks(),
  });

  // Fetch requirements for filter
  const { data: requirementsData } = useQuery({
    queryKey: ['compliance-requirements', requirementFilter],
    queryFn: () => complianceApi.getRequirements(
      requirementFilter && requirementFilter !== 'all'
        ? { frameworkId: requirementFilter }
        : undefined
    ),
    enabled: !!frameworks && requirementFilter !== undefined,
  });

  // Fetch validation rules
  const { data: rules, isLoading } = useQuery({
    queryKey: ['validation-rules', requirementFilter, assetTypeFilter],
    queryFn: () => validationRulesApi.getAll(
      requirementFilter === 'all' ? undefined : requirementFilter,
      assetTypeFilter === 'all' ? undefined : assetTypeFilter
    ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => validationRulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validation-rules'] });
      toast({
        title: 'Success',
        description: 'Validation rule deleted successfully',
      });
      setDeletingRuleId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete validation rule',
        variant: 'destructive',
      });
    },
  });

  const filteredRules = rules?.filter((rule) => {
    const matchesSearch =
      !searchTerm ||
      rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.ruleDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getAssetTypeColor = (assetType: AssetType) => {
    const colors: Record<AssetType, string> = {
      physical: 'bg-blue-500',
      information: 'bg-green-500',
      application: 'bg-purple-500',
      software: 'bg-orange-500',
      supplier: 'bg-red-500',
    };
    return colors[assetType] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Validation Rules</h1>
          <p className="text-muted-foreground">
            Manage automated compliance validation rules for assets
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={requirementFilter} onValueChange={setRequirementFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by requirement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requirements</SelectItem>
                {requirementsData?.data.map((req) => (
                  <SelectItem key={req.id} value={req.id}>
                    {req.requirementCode || req.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={assetTypeFilter}
              onValueChange={(value) => setAssetTypeFilter(value as AssetType | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Asset Types</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
              </SelectContent>
            </Select>
            {(requirementFilter !== 'all' || assetTypeFilter !== 'all' || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setRequirementFilter('all');
                  setAssetTypeFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Rules</CardTitle>
          <CardDescription>
            {filteredRules?.length || 0} rule{filteredRules?.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !filteredRules || filteredRules.length === 0 ? (
            <Alert>
              <AlertDescription>
                No validation rules found. Create your first rule to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.ruleName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {rule.requirementTitle || rule.requirementCode || rule.requirementId.substring(0, 8) + '...'}
                        </div>
                        {rule.requirementCode && (
                          <div className="text-xs text-muted-foreground">
                            {rule.requirementCode}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAssetTypeColor(rule.assetType)}>
                        {rule.assetType}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell>
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingRuleId(rule.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Validation Rule</DialogTitle>
            <DialogDescription>
              Create a new validation rule for automated compliance checking
            </DialogDescription>
          </DialogHeader>
          <ValidationRuleForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ['validation-rules'] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Validation Rule</DialogTitle>
            <DialogDescription>Update validation rule details</DialogDescription>
          </DialogHeader>
          <ValidationRuleForm
            rule={editingRule}
            onSuccess={() => {
              setEditingRule(null);
              queryClient.invalidateQueries({ queryKey: ['validation-rules'] });
            }}
            onCancel={() => setEditingRule(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingRuleId} onOpenChange={(open) => !open && setDeletingRuleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Validation Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this validation rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingRuleId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingRuleId && deleteMutation.mutate(deletingRuleId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

