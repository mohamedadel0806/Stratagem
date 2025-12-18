'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, TestTube, Shield } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ValidationRuleForm } from '@/components/forms/validation-rule-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ValidationRulesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('');

  const { data: rules, isLoading } = useQuery({
    queryKey: ['validation-rules', assetTypeFilter],
    queryFn: () => assetsApi.getValidationRules(assetTypeFilter || undefined),
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteValidationRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validation-rules'] });
      toast({
        title: 'Success',
        description: 'Validation rule deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete rule',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this validation rule?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Validation Rules</h1>
          <p className="text-muted-foreground">Configure data validation rules for asset imports</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="information">Information</SelectItem>
            <SelectItem value="application">Application</SelectItem>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {rules && rules.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule: any) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <CardDescription>{rule.description || 'No description'}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {rule.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {rule.severity === 'error' ? (
                      <Badge variant="destructive">Error</Badge>
                    ) : (
                      <Badge variant="outline">Warning</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Asset Type:</span> {rule.assetType}
                  </div>
                  <div>
                    <span className="font-medium">Field:</span> {rule.fieldName}
                  </div>
                  <div>
                    <span className="font-medium">Validation:</span> {rule.validationType?.replace('_', ' ')}
                  </div>
                  {rule.applyToImport && (
                    <Badge variant="outline" className="text-xs">
                      Applied to Imports
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRule(rule);
                      setIsCreateOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rule.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No validation rules found</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Rule
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (!open) setEditingRule(null);
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit' : 'Create'} Validation Rule</DialogTitle>
            <DialogDescription>
              Configure validation rules for asset data quality and import validation
            </DialogDescription>
          </DialogHeader>
          <ValidationRuleForm
            rule={editingRule}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingRule(null);
              queryClient.invalidateQueries({ queryKey: ['validation-rules'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingRule(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

