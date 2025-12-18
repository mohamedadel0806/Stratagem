'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi, AssetFieldConfig, CreateAssetFieldConfigData } from '@/lib/api/assets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

type AssetTypeKey = AssetFieldConfig['assetType'];
type FieldTypeKey = AssetFieldConfig['fieldType'];

const ASSET_TYPE_LABELS: Record<AssetTypeKey, string> = {
  physical: 'Physical',
  information: 'Information',
  application: 'Application',
  software: 'Software',
  supplier: 'Supplier',
};

const FIELD_TYPE_LABELS: Record<FieldTypeKey, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
  boolean: 'Boolean',
  select: 'Select',
  multi_select: 'Multi‑select',
  textarea: 'Textarea',
  email: 'Email',
  url: 'URL',
};

interface FieldConfigFormState extends Partial<CreateAssetFieldConfigData> {
  selectOptionsText?: string;
}

export default function AssetFieldConfigPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssetType, setSelectedAssetType] = useState<AssetTypeKey>('physical');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<AssetFieldConfig | null>(null);
  const [formState, setFormState] = useState<FieldConfigFormState>({});

  const { data: fieldConfigs = [], isLoading } = useQuery({
    queryKey: ['asset-field-configs', selectedAssetType],
    queryFn: () => assetsApi.getFieldConfigs(selectedAssetType),
    staleTime: 60 * 1000,
  });

  const openCreateDialog = () => {
    setEditingField(null);
    setFormState({
      assetType: selectedAssetType,
      fieldName: '',
      displayName: '',
      fieldType: 'text',
      isRequired: false,
      isEnabled: true,
      selectOptionsText: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (config: AssetFieldConfig) => {
    setEditingField(config);
    setFormState({
      assetType: config.assetType,
      fieldName: config.fieldName,
      displayName: config.displayName,
      fieldType: config.fieldType,
      isRequired: config.isRequired,
      isEnabled: config.isEnabled,
      displayOrder: config.displayOrder,
      validationRule: config.validationRule,
      validationMessage: config.validationMessage,
      defaultValue: config.defaultValue,
      helpText: config.helpText,
      selectOptionsText: (config.selectOptions || []).join(', '),
    });
    setIsDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAssetFieldConfigData) => assetsApi.createFieldConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-field-configs', selectedAssetType] });
      toast({ title: 'Field Created', description: 'Asset field configuration created successfully.' });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create asset field configuration.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<CreateAssetFieldConfigData> }) =>
      assetsApi.updateFieldConfig(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-field-configs', selectedAssetType] });
      toast({ title: 'Field Updated', description: 'Asset field configuration updated successfully.' });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update asset field configuration.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteFieldConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-field-configs', selectedAssetType] });
      toast({
        title: 'Field Removed',
        description: 'Field was deleted or disabled depending on whether it had data.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete asset field configuration.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!formState.assetType || !formState.fieldName || !formState.displayName || !formState.fieldType) {
      toast({
        title: 'Missing required fields',
        description: 'Asset type, field name, display name, and field type are required.',
        variant: 'destructive',
      });
      return;
    }

    const payload: CreateAssetFieldConfigData = {
      assetType: formState.assetType,
      fieldName: formState.fieldName.trim(),
      displayName: formState.displayName.trim(),
      fieldType: formState.fieldType,
      isRequired: formState.isRequired ?? false,
      isEnabled: formState.isEnabled ?? true,
      displayOrder: formState.displayOrder,
      validationRule: formState.validationRule,
      validationMessage: formState.validationMessage,
      defaultValue: formState.defaultValue,
      helpText: formState.helpText,
      fieldDependencies: formState.fieldDependencies,
      selectOptions:
        formState.fieldType === 'select' || formState.fieldType === 'multi_select'
          ? (formState.selectOptionsText || '')
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean)
          : undefined,
    };

    if (editingField) {
      updateMutation.mutate({ id: editingField.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const sortedFields = useMemo(
    () =>
      [...fieldConfigs].sort((a, b) => {
        const orderA = a.displayOrder ?? 9999;
        const orderB = b.displayOrder ?? 9999;
        return orderA - orderB;
      }),
    [fieldConfigs],
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Asset Field Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Manage custom fields, dropdown options, and validation rules for each asset type.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Select
            value={selectedAssetType}
            onValueChange={(value) => setSelectedAssetType(value as AssetTypeKey)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ASSET_TYPE_LABELS) as AssetTypeKey[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {ASSET_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fields for {ASSET_TYPE_LABELS[selectedAssetType]} Assets</CardTitle>
          <CardDescription>
            Configure which fields are required, optional, or disabled. Fields with existing data will
            be disabled instead of deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground">Loading field configurations...</div>
          ) : sortedFields.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No custom field configurations yet. Click &quot;Add Field&quot; to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-mono text-xs">{field.fieldName}</TableCell>
                    <TableCell>{field.displayName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{FIELD_TYPE_LABELS[field.fieldType]}</Badge>
                    </TableCell>
                    <TableCell>
                      {field.isRequired ? (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          Required
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Optional</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {field.isEnabled ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{field.displayOrder ?? '-'}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">
                      {field.validationRule ? field.validationRule : '—'}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">
                      {field.selectOptions && field.selectOptions.length > 0
                        ? field.selectOptions.join(', ')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(field)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteMutation.mutate(field.id)}
                          title="Delete or Disable"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Field' : 'Add Field'}</DialogTitle>
            <DialogDescription>
              Configure how this field behaves across {ASSET_TYPE_LABELS[selectedAssetType]} assets.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Asset Type</Label>
                <Select
                  value={formState.assetType || selectedAssetType}
                  onValueChange={(value) =>
                    setFormState((prev) => ({ ...prev, assetType: value as AssetTypeKey }))
                  }
                  disabled={!!editingField}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ASSET_TYPE_LABELS) as AssetTypeKey[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {ASSET_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Field Name (API)</Label>
                <Input
                  value={formState.fieldName || ''}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, fieldName: e.target.value }))
                  }
                  placeholder="e.g. customTag"
                  disabled={!!editingField}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={formState.displayName || ''}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, displayName: e.target.value }))
                  }
                  placeholder="Field label shown in forms"
                />
              </div>
              <div>
                <Label>Field Type</Label>
                <Select
                  value={formState.fieldType || 'text'}
                  onValueChange={(value) =>
                    setFormState((prev) => ({ ...prev, fieldType: value as FieldTypeKey }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(FIELD_TYPE_LABELS) as FieldTypeKey[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {FIELD_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formState.isRequired ?? false}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({ ...prev, isRequired: checked }))
                  }
                />
                <Label>Required</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formState.isEnabled ?? true}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({ ...prev, isEnabled: checked }))
                  }
                />
                <Label>Enabled</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formState.displayOrder ?? ''}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      displayOrder: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>Default Value</Label>
                <Input
                  value={formState.defaultValue || ''}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, defaultValue: e.target.value }))
                  }
                  placeholder="Optional"
                />
              </div>
            </div>
            {(formState.fieldType === 'select' || formState.fieldType === 'multi_select') && (
              <div>
                <Label>Options (comma‑separated)</Label>
                <Input
                  value={formState.selectOptionsText || ''}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, selectOptionsText: e.target.value }))
                  }
                  placeholder="e.g. Critical, High, Medium, Low"
                />
              </div>
            )}
            <div>
              <Label>Validation Regex (optional)</Label>
              <Input
                value={formState.validationRule || ''}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, validationRule: e.target.value }))
                }
                placeholder="e.g. ^[A-Z0-9-]+$"
              />
            </div>
            <div>
              <Label>Validation Message (optional)</Label>
              <Input
                value={formState.validationMessage || ''}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, validationMessage: e.target.value }))
                }
                placeholder="Custom error message when validation fails"
              />
            </div>
            <div>
              <Label>Help Text (optional)</Label>
              <Textarea
                value={formState.helpText || ''}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, helpText: e.target.value }))
                }
                rows={3}
                placeholder="Additional guidance shown alongside this field in forms"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : editingField
                ? 'Save Changes'
                : 'Create Field'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


