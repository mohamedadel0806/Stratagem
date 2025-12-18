'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Search, CheckSquare, Square } from 'lucide-react';

export interface FieldGroup {
  category: string;
  description?: string;
  fields: FieldOption[];
}

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
}

interface FieldSelectorProps {
  reportType: string;
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
  fieldGroups?: FieldGroup[];
}

// Default field groups for asset inventory reports
const DEFAULT_ASSET_FIELD_GROUPS: FieldGroup[] = [
  {
    category: 'Basic Information',
    description: 'Core asset identification fields',
    fields: [
      { value: 'uniqueIdentifier', label: 'Unique Identifier', description: 'Unique ID for the asset' },
      { value: 'assetDescription', label: 'Asset Description', description: 'Description of the asset' },
      { value: 'assetTypeId', label: 'Asset Type', description: 'Type of asset' },
      { value: 'manufacturer', label: 'Manufacturer', description: 'Asset manufacturer' },
      { value: 'model', label: 'Model', description: 'Asset model number' },
      { value: 'serialNumber', label: 'Serial Number', description: 'Serial number' },
      { value: 'assetTag', label: 'Asset Tag', description: 'Asset tag number' },
    ],
  },
  {
    category: 'Ownership & Organization',
    description: 'Ownership and organizational assignment',
    fields: [
      { value: 'ownerId', label: 'Owner', description: 'Asset owner' },
      { value: 'businessUnitId', label: 'Business Unit', description: 'Assigned business unit' },
      { value: 'physicalLocation', label: 'Physical Location', description: 'Physical location' },
      { value: 'businessPurpose', label: 'Business Purpose', description: 'Business purpose' },
    ],
  },
  {
    category: 'Criticality & Compliance',
    description: 'Risk and compliance information',
    fields: [
      { value: 'criticalityLevel', label: 'Criticality Level', description: 'Asset criticality (critical, high, medium, low)' },
      { value: 'complianceRequirements', label: 'Compliance Requirements', description: 'Applicable compliance frameworks' },
    ],
  },
  {
    category: 'Network & Connectivity',
    description: 'Network and connectivity details',
    fields: [
      { value: 'macAddresses', label: 'MAC Addresses', description: 'MAC addresses' },
      { value: 'ipAddresses', label: 'IP Addresses', description: 'IP addresses' },
      { value: 'connectivityStatus', label: 'Connectivity Status', description: 'Current connectivity status' },
      { value: 'networkApprovalStatus', label: 'Network Approval Status', description: 'Network approval status' },
      { value: 'lastConnectivityCheck', label: 'Last Connectivity Check', description: 'Last connectivity check date' },
    ],
  },
  {
    category: 'Purchase & Warranty',
    description: 'Purchase and warranty information',
    fields: [
      { value: 'purchaseDate', label: 'Purchase Date', description: 'Date of purchase' },
      { value: 'warrantyExpiry', label: 'Warranty Expiry', description: 'Warranty expiration date' },
    ],
  },
  {
    category: 'Software & Services',
    description: 'Installed software and active services',
    fields: [
      { value: 'installedSoftware', label: 'Installed Software', description: 'List of installed software' },
      { value: 'activePortsServices', label: 'Active Ports/Services', description: 'Active network ports and services' },
    ],
  },
];

export function FieldSelector({ reportType, selectedFields, onFieldsChange, fieldGroups }: FieldSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const groups = fieldGroups || DEFAULT_ASSET_FIELD_GROUPS;

  const toggleField = (fieldValue: string) => {
    if (selectedFields.includes(fieldValue)) {
      onFieldsChange(selectedFields.filter(f => f !== fieldValue));
    } else {
      onFieldsChange([...selectedFields, fieldValue]);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const selectAllInCategory = (category: string) => {
    const group = groups.find(g => g.category === category);
    if (!group) return;

    const categoryFields = group.fields.map(f => f.value);
    const allSelected = categoryFields.every(f => selectedFields.includes(f));

    if (allSelected) {
      // Deselect all in category
      onFieldsChange(selectedFields.filter(f => !categoryFields.includes(f)));
    } else {
      // Select all in category
      const newFields = [...selectedFields];
      categoryFields.forEach(field => {
        if (!newFields.includes(field)) {
          newFields.push(field);
        }
      });
      onFieldsChange(newFields);
    }
  };

  const selectAll = () => {
    const allFields = groups.flatMap(g => g.fields.map(f => f.value));
    if (selectedFields.length === allFields.length) {
      onFieldsChange([]);
    } else {
      onFieldsChange(allFields);
    }
  };

  // Filter groups and fields based on search
  const filteredGroups = groups.map(group => ({
    ...group,
    fields: group.fields.filter(field =>
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.fields.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={selectAll}
        >
          {selectedFields.length === groups.flatMap(g => g.fields).length ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="h-4 w-4 mr-2" />
              Select All
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto border rounded-lg p-4">
        {filteredGroups.map((group) => {
          const isExpanded = expandedCategories.has(group.category);
          const categoryFields = group.fields.map(f => f.value);
          const selectedInCategory = categoryFields.filter(f => selectedFields.includes(f)).length;
          const allSelectedInCategory = selectedInCategory === categoryFields.length && categoryFields.length > 0;

          return (
            <Card key={group.category} className="w-full">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleCategory(group.category)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <CardTitle className="text-sm font-medium">{group.category}</CardTitle>
                    {group.description && (
                      <span className="text-xs text-muted-foreground">({group.description})</span>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {selectedInCategory}/{categoryFields.length} selected
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllInCategory(group.category);
                      }}
                    >
                      {allSelectedInCategory ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {group.fields.map((field) => (
                      <div key={field.value} className="flex items-start space-x-3">
                        <Checkbox
                          id={field.value}
                          checked={selectedFields.includes(field.value)}
                          onCheckedChange={() => toggleField(field.value)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={field.value}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {field.label}
                          </Label>
                          {field.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {field.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground">
        {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}
