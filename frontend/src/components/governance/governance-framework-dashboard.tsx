'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  BarChart3,
  Settings,
  FileText,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FrameworkConfig {
  id: string;
  name: string;
  framework_type: string;
  scope?: string;
  is_active: boolean;
  linked_framework_id?: string;
  metadata?: {
    require_policy_approval?: boolean;
    require_control_testing?: boolean;
    policy_review_frequency?: string;
    control_review_frequency?: string;
    risk_assessment_required?: boolean;
    audit_required?: boolean;
  };
  created_at: string;
}

const FRAMEWORK_TYPE_LABELS: Record<string, string> = {
  iso27001: 'ISO 27001',
  nist_cybersecurity: 'NIST Cybersecurity',
  nist_privacy: 'NIST Privacy',
  pci_dss: 'PCI DSS',
  gdpr: 'GDPR',
  nca_ecc: 'NCA ECC (UAE)',
  soc2: 'SOC 2',
  hipaa: 'HIPAA',
  custom: 'Custom Framework',
};

const REVIEW_FREQUENCY_LABELS: Record<string, string> = {
  annual: 'Annually',
  'bi-annual': 'Bi-annually',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
};

export function GovernanceFrameworkDashboard() {
  // Fetch all framework configurations
  const {
    data: configsResponse,
    isLoading: configsLoading,
    error: configsError,
  } = useQuery({
    queryKey: ['frameworkConfigs'],
    queryFn: async () => {
      const response = await governanceApi.getFrameworkConfigs({
        limit: 100,
      });
      return response as { data: FrameworkConfig[]; total: number };
    },
  });

  const configs = configsResponse?.data || [];
  const activeConfigs = configs.filter((c) => c.is_active);
  const inactiveConfigs = configs.filter((c) => !c.is_active);

  // Calculate statistics
  const stats = {
    totalConfigured: configs.length,
    active: activeConfigs.length,
    inactive: inactiveConfigs.length,
    requirePolicyApproval: configs.filter((c) => c.metadata?.require_policy_approval).length,
    requireControlTesting: configs.filter((c) => c.metadata?.require_control_testing).length,
    requireAudit: configs.filter((c) => c.metadata?.audit_required).length,
  };

  // Group by framework type
  const groupedByType = activeConfigs.reduce((acc, config) => {
    const type = config.framework_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(config);
    return acc;
  }, {} as Record<string, FrameworkConfig[]>);

  const isLoading = configsLoading;

  if (configsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load framework configurations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Framework Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of configured compliance frameworks and their settings
          </p>
        </div>
        <Link href="/governance/frameworks/configure">
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Frameworks
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Configured */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Configured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalConfigured}</div>
            <p className="text-xs text-gray-500 mt-1">Framework configurations</p>
          </CardContent>
        </Card>

        {/* Active Frameworks */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Active Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{stats.active}</div>
            <p className="text-xs text-green-700 mt-1">Currently in use</p>
          </CardContent>
        </Card>

        {/* Require Policy Approval */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Policy Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.requirePolicyApproval}</div>
            <p className="text-xs text-gray-500 mt-1">Frameworks requiring approval</p>
          </CardContent>
        </Card>

        {/* Require Control Testing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Control Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.requireControlTesting}</div>
            <p className="text-xs text-gray-500 mt-1">Require testing procedures</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : configs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Frameworks Configured</CardTitle>
            <CardDescription>
              Get started by configuring your first compliance framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/governance/frameworks/configure">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Configure Frameworks
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Frameworks by Type */}
          {Object.keys(groupedByType).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Frameworks by Type</CardTitle>
                <CardDescription>
                  Breakdown of configured frameworks by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(groupedByType).map(([type, typedConfigs]) => (
                    <div key={type} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {FRAMEWORK_TYPE_LABELS[type] || type}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {typedConfigs.length} configuration
                            {typedConfigs.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          Active
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {typedConfigs.map((config) => (
                          <div
                            key={config.id}
                            className="flex items-start justify-between bg-gray-50 rounded p-2 text-sm"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{config.name}</p>
                              {config.scope && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Scope: {config.scope}
                                </p>
                              )}
                            </div>
                            <div className="ml-2 flex gap-1 flex-shrink-0">
                              {config.metadata?.require_policy_approval && (
                                <Badge variant="outline" className="text-xs">
                                  Requires Approval
                                </Badge>
                              )}
                              {config.metadata?.require_control_testing && (
                                <Badge variant="outline" className="text-xs">
                                  Control Testing
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Frequency Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Review Frequency Settings
              </CardTitle>
              <CardDescription>
                Schedule for policy and control reviews across frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeConfigs.map((config) => (
                  <div key={config.id} className="border rounded-lg p-3">
                    <p className="font-medium text-gray-900 text-sm">{config.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600">Policy Review</p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {REVIEW_FREQUENCY_LABELS[
                            config.metadata?.policy_review_frequency || 'annual'
                          ] || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Control Review</p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {REVIEW_FREQUENCY_LABELS[
                            config.metadata?.control_review_frequency || 'quarterly'
                          ] || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Requirements</CardTitle>
              <CardDescription>
                Key requirements configured across active frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Policy Approval</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.requirePolicyApproval}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {stats.requirePolicyApproval} framework
                    {stats.requirePolicyApproval !== 1 ? 's' : ''} require policy approval before
                    publication
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold">Control Testing</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.requireControlTesting}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {stats.requireControlTesting} framework
                    {stats.requireControlTesting !== 1 ? 's' : ''} require control testing procedures
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold">Audit Required</h3>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.requireAudit}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {stats.requireAudit} framework
                    {stats.requireAudit !== 1 ? 's' : ''} require audit procedures
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inactive Frameworks */}
          {inactiveConfigs.length > 0 && (
            <Card className="border-gray-300">
              <CardHeader>
                <CardTitle>Inactive Frameworks</CardTitle>
                <CardDescription>
                  {inactiveConfigs.length} framework
                  {inactiveConfigs.length !== 1 ? 's' : ''} not currently active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {inactiveConfigs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div>
                        <p className="font-medium text-gray-900">{config.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {FRAMEWORK_TYPE_LABELS[config.framework_type] || config.framework_type}
                        </p>
                      </div>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your framework configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/governance/frameworks/configure" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="h-4 w-4" />
                    Configure Scope
                  </Button>
                </Link>
                <Link href="/governance/frameworks/view-structure" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Structure
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
