'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, Trash2 } from 'lucide-react';

export type FilterOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'is_null' | 'is_not_null';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

interface FilterBuilderProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  availableFields?: Array<{ value: string; label: string; type?: 'string' | 'number' | 'date' | 'boolean' | 'array' }>;
  reportType?: string;
}

const DEFAULT_OPERATORS: Array<{ value: FilterOperator; label: string; requiresValue: boolean }> = [
  { value: 'equals', label: 'Equals', requiresValue: true },
  { value: 'not_equals', label: 'Not Equals', requiresValue: true },
  { value: 'contains', label: 'Contains', requiresValue: true },
  { value: 'not_contains', label: 'Not Contains', requiresValue: true },
  { value: 'greater_than', label: 'Greater Than', requiresValue: true },
  { value: 'less_than', label: 'Less Than', requiresValue: true },
  { value: 'in', label: 'In (list)', requiresValue: true },
  { value: 'not_in', label: 'Not In (list)', requiresValue: true },
  { value: 'is_null', label: 'Is Null', requiresValue: false },
  { value: 'is_not_null', label: 'Is Not Null', requiresValue: false },
];

// Default fields for asset inventory
const DEFAULT_ASSET_FIELDS = [
  { value: 'criticalityLevel', label: 'Criticality Level', type: 'string' as const },
  { value: 'ownerId', label: 'Owner', type: 'string' as const },
  { value: 'businessUnitId', label: 'Business Unit', type: 'string' as const },
  { value: 'connectivityStatus', label: 'Connectivity Status', type: 'string' as const },
  { value: 'networkApprovalStatus', label: 'Network Approval Status', type: 'string' as const },
  { value: 'purchaseDate', label: 'Purchase Date', type: 'date' as const },
  { value: 'warrantyExpiry', label: 'Warranty Expiry', type: 'date' as const },
];

export function FilterBuilder({ filters, onFiltersChange, availableFields, reportType }: FilterBuilderProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>(() => {
    // Convert filters object to conditions array
    if (!filters || Object.keys(filters).length === 0) {
      return [];
    }

    const conds: FilterCondition[] = [];
    Object.entries(filters).forEach(([field, value]) => {
      if (value === null) {
        conds.push({
          id: `${field}-${Date.now()}`,
          field,
          operator: 'is_null',
          value: null,
        });
      } else if (Array.isArray(value)) {
        conds.push({
          id: `${field}-${Date.now()}`,
          field,
          operator: 'in',
          value: value.join(','),
        });
      } else {
        conds.push({
          id: `${field}-${Date.now()}`,
          field,
          operator: 'equals',
          value: String(value),
        });
      }
    });
    return conds;
  });

  const fields = availableFields || DEFAULT_ASSET_FIELDS;

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: `filter-${Date.now()}-${Math.random()}`,
      field: fields[0]?.value || '',
      operator: 'equals',
      value: '',
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);
    updateFilters(newConditions);
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setConditions(newConditions);
    updateFilters(newConditions);
  };

  const updateFilters = (conds: FilterCondition[]) => {
    const newFilters: Record<string, any> = {};

    conds.forEach(cond => {
      if (!cond.field) return;

      switch (cond.operator) {
        case 'is_null':
          newFilters[cond.field] = null;
          break;
        case 'is_not_null':
          // For "is not null", we'll use a special marker
          newFilters[`${cond.field}_not_null`] = true;
          break;
        case 'in':
        case 'not_in':
          newFilters[cond.field] = cond.value
            ? cond.value.split(',').map((v: string) => v.trim()).filter(Boolean)
            : [];
          break;
        default:
          if (cond.value !== undefined && cond.value !== '') {
            newFilters[cond.field] = cond.value;
          }
      }
    });

    onFiltersChange(newFilters);
  };

  const getOperatorsForField = (fieldValue: string) => {
    const field = fields.find(f => f.value === fieldValue);
    if (!field) return DEFAULT_OPERATORS;

    // Filter operators based on field type
    switch (field.type) {
      case 'number':
        return DEFAULT_OPERATORS.filter(op =>
          ['equals', 'not_equals', 'greater_than', 'less_than', 'is_null', 'is_not_null'].includes(op.value)
        );
      case 'date':
        return DEFAULT_OPERATORS.filter(op =>
          ['equals', 'not_equals', 'greater_than', 'less_than', 'is_null', 'is_not_null'].includes(op.value)
        );
      case 'boolean':
        return DEFAULT_OPERATORS.filter(op =>
          ['equals', 'not_equals', 'is_null', 'is_not_null'].includes(op.value)
        );
      default:
        return DEFAULT_OPERATORS;
    }
  };

  const renderValueInput = (condition: FilterCondition) => {
    const operator = DEFAULT_OPERATORS.find(op => op.value === condition.operator);
    if (!operator || !operator.requiresValue) {
      return null;
    }

    const field = fields.find(f => f.value === condition.field);

    if (condition.operator === 'in' || condition.operator === 'not_in') {
      return (
        <Input
          placeholder="Comma-separated values (e.g., high,medium,low)"
          value={condition.value || ''}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1"
        />
      );
    }

    if (field?.type === 'date') {
      return (
        <Input
          type="date"
          value={condition.value || ''}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1"
        />
      );
    }

    if (field?.type === 'number') {
      return (
        <Input
          type="number"
          value={condition.value || ''}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="flex-1"
        />
      );
    }

    return (
      <Input
        placeholder="Enter value"
        value={condition.value || ''}
        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
        className="flex-1"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Filters</Label>
        <Button type="button" variant="outline" size="sm" onClick={addCondition}>
          <Plus className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </div>

      {conditions.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No filters applied. Click "Add Filter" to create filter conditions.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <Card key={condition.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-3">
                      <Label className="text-xs">Field</Label>
                      <Select
                        value={condition.field}
                        onValueChange={(value) => {
                          const field = fields.find(f => f.value === value);
                          updateCondition(condition.id, {
                            field: value,
                            operator: 'equals',
                            value: field?.type === 'boolean' ? 'true' : '',
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-3">
                      <Label className="text-xs">Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) =>
                          updateCondition(condition.id, { operator: value as FilterOperator })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getOperatorsForField(condition.field).map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-5">
                      {renderValueInput(condition) && (
                        <>
                          <Label className="text-xs">Value</Label>
                          {renderValueInput(condition)}
                        </>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                        className="mt-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {conditions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {conditions.map((condition) => {
            const field = fields.find(f => f.value === condition.field);
            const operator = DEFAULT_OPERATORS.find(op => op.value === condition.operator);
            return (
              <Badge key={condition.id} variant="secondary">
                {field?.label || condition.field} {operator?.label} {condition.value || ''}
                <button
                  type="button"
                  onClick={() => removeCondition(condition.id)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}


