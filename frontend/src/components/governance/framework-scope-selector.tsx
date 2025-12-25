'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Framework {
  id: string;
  framework_code: string;
  name: string;
  version?: string;
  issuing_authority?: string;
  description?: string;
  effective_date?: string;
  url?: string;
  status: string;
  tags?: string[];
}

export function FrameworkScopeSelector() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFrameworkIds, setSelectedFrameworkIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all available frameworks
  const { data: frameworks, isLoading: frameworksLoading, error: frameworksError } = useQuery({
    queryKey: ['frameworks'],
    queryFn: async () => {
      const response = await governanceApi.getAllFrameworks();
      return response as Framework[];
    },
  });

  // Fetch active framework configs to determine scope
  const { data: activeConfigs, isLoading: configsLoading } = useQuery({
    queryKey: ['activeFrameworkConfigs'],
    queryFn: async () => {
      const response = await governanceApi.getActiveFrameworkConfigs();
      return response as any[];
    },
  });

  // Initialize selected frameworks from active configs
  useEffect(() => {
    if (activeConfigs && frameworks) {
      const activeFrameworkIds = new Set(
        activeConfigs
          .filter((config) => config.is_active)
          .map((config) => config.linked_framework_id)
          .filter(Boolean),
      );
      setSelectedFrameworkIds(activeFrameworkIds);
    }
  }, [activeConfigs, frameworks]);

  // Mutation for creating/updating framework configurations
  const updateFrameworkScopeMutation = useMutation({
    mutationFn: async (frameworksToActivate: Framework[]) => {
      const results = [];
      const frameworkIds = new Set(frameworksToActivate.map((f) => f.id));

      // First, deactivate frameworks not in the new scope
      if (activeConfigs) {
        for (const config of activeConfigs) {
          if (config.is_active && !frameworkIds.has(config.linked_framework_id)) {
            await governanceApi.deactivateFrameworkConfig(config.id);
          }
        }
      }

      // Then, activate or create configurations for selected frameworks
      for (const framework of frameworksToActivate) {
        const existingConfig = activeConfigs?.find(
          (c) => c.linked_framework_id === framework.id,
        );

        if (existingConfig) {
          if (!existingConfig.is_active) {
            await governanceApi.activateFrameworkConfig(existingConfig.id);
          }
        } else {
          // Create new configuration
          await governanceApi.createFrameworkConfig({
            name: `${framework.name} Configuration`,
            description: `Scope configuration for ${framework.name}`,
            framework_type: framework.framework_code.toLowerCase(),
            scope: 'Organization-wide',
            linked_framework_id: framework.id,
            is_active: true,
            metadata: {
              require_policy_approval: true,
              require_control_testing: true,
              policy_review_frequency: 'annual',
              control_review_frequency: 'quarterly',
              risk_assessment_required: true,
              audit_required: true,
            },
          });
        }
        results.push(framework.id);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeFrameworkConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['frameworkConfigs'] });
      toast({
        title: 'Success',
        description: 'Framework scope has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update framework scope',
        variant: 'destructive',
      });
    },
  });

  const handleToggleFramework = (frameworkId: string) => {
    const newSelected = new Set(selectedFrameworkIds);
    if (newSelected.has(frameworkId)) {
      newSelected.delete(frameworkId);
    } else {
      newSelected.add(frameworkId);
    }
    setSelectedFrameworkIds(newSelected);
  };

  const handleScopeChanges = async () => {
    if (!frameworks) return;

    setIsSaving(true);
    try {
      const selectedFrameworks = frameworks.filter((f) =>
        selectedFrameworkIds.has(f.id),
      );
      await updateFrameworkScopeMutation.mutateAsync(selectedFrameworks);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = frameworksLoading || configsLoading;

  if (frameworksError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load frameworks. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Framework Scope Configuration</CardTitle>
          <CardDescription>
            Select which compliance frameworks should be active in your organization.
            This determines which frameworks will be used for policy, control, and audit
            activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : frameworks && frameworks.length > 0 ? (
            <div className="space-y-4">
              {/* Frameworks Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`relative flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                      selectedFrameworkIds.has(framework.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Checkbox
                      id={`framework-${framework.id}`}
                      checked={selectedFrameworkIds.has(framework.id)}
                      onCheckedChange={() => handleToggleFramework(framework.id)}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`framework-${framework.id}`}
                        className="cursor-pointer text-sm font-medium text-gray-900"
                      >
                        {framework.name}
                      </label>
                      <p className="text-xs text-gray-500">{framework.framework_code}</p>
                      {framework.version && (
                        <p className="mt-1 text-xs text-gray-600">
                          Version: {framework.version}
                        </p>
                      )}
                      {framework.issuing_authority && (
                        <p className="mt-1 text-xs text-gray-600">
                          Authority: {framework.issuing_authority}
                        </p>
                      )}
                      {framework.tags && framework.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {framework.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Selected Frameworks
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {selectedFrameworkIds.size} of {frameworks.length}
                    </p>
                  </div>
                  <div className="text-right">
                    {selectedFrameworkIds.size > 0 ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-amber-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4">
                <Button
                  onClick={handleScopeChanges}
                  disabled={isSaving || updateFrameworkScopeMutation.isPending}
                  className="gap-2"
                >
                  {isSaving || updateFrameworkScopeMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Apply Changes'
                  )}
                </Button>
                <p className="text-sm text-gray-600">
                  {selectedFrameworkIds.size === 0
                    ? 'Select at least one framework'
                    : `${selectedFrameworkIds.size} framework${selectedFrameworkIds.size !== 1 ? 's' : ''} selected`}
                </p>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Frameworks Available</AlertTitle>
              <AlertDescription>
                No compliance frameworks found. Please contact your administrator to add
                frameworks to the system.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Framework Details Section */}
      {selectedFrameworkIds.size > 0 && frameworks && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Frameworks Details</CardTitle>
            <CardDescription>
              Details of frameworks that will be active in your organization scope
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frameworks
                .filter((f) => selectedFrameworkIds.has(f.id))
                .map((framework) => (
                  <div key={framework.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                        <p className="text-sm text-gray-600">{framework.framework_code}</p>
                        {framework.description && (
                          <p className="mt-2 text-sm text-gray-700">{framework.description}</p>
                        )}
                      </div>
                      {framework.version && (
                        <Badge variant="outline">v{framework.version}</Badge>
                      )}
                    </div>
                    {framework.url && (
                      <div className="mt-3">
                        <a
                          href={framework.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Framework Documentation →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
