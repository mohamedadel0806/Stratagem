'use client';

import React from 'react';
import { ControlAssetMapping, ImplementationStatus } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface AssetComplianceStatusProps {
  mappings: ControlAssetMapping[];
  assetName?: string;
}

interface ComplianceMetrics {
  totalControls: number;
  implementedControls: number;
  plannedControls: number;
  inProgressControls: number;
  notImplementedControls: number;
  notApplicableControls: number;
  testedControls: number;
  passedControls: number;
  failedControls: number;
  averageEffectivenessScore: number;
  compliancePercentage: number;
  implementationPercentage: number;
  testCoveragePercentage: number;
  complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant';
  trend: 'improving' | 'stable' | 'declining';
}

function calculateComplianceMetrics(mappings: ControlAssetMapping[]): ComplianceMetrics {
  const totalControls = mappings.length;

  // Count by implementation status
  const implementedControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.IMPLEMENTED
  ).length;
  const plannedControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.PLANNED
  ).length;
  const inProgressControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.IN_PROGRESS
  ).length;
  const notImplementedControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.NOT_IMPLEMENTED
  ).length;
  const notApplicableControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.NOT_APPLICABLE
  ).length;

  // Count tested controls
  const testedControls = mappings.filter((m) => m.last_test_date).length;
  const passedControls = mappings.filter((m) => m.last_test_result === 'passed').length;
  const failedControls = mappings.filter((m) => m.last_test_result === 'failed').length;

  // Calculate percentages
  const implementationPercentage = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;
  const testCoveragePercentage = totalControls > 0 ? (testedControls / totalControls) * 100 : 0;

  // Calculate effectiveness score
  const effectivenessScores = mappings
    .filter((m) => m.effectiveness_score !== null && m.effectiveness_score !== undefined)
    .map((m) => m.effectiveness_score as number);
  const averageEffectivenessScore =
    effectivenessScores.length > 0
      ? effectivenessScores.reduce((a, b) => a + b, 0) / effectivenessScores.length
      : 0;

  // Determine compliance status
  const applicableControls = totalControls - notApplicableControls;
  let compliancePercentage = 0;
  let complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant' = 'compliant';

  if (applicableControls > 0) {
    // Compliance calculation: weighted by implementation status and test results
    let complianceScore = 0;

    mappings.forEach((m) => {
      if (m.implementation_status === ImplementationStatus.NOT_APPLICABLE) {
        return; // Skip non-applicable
      }

      if (m.implementation_status === ImplementationStatus.IMPLEMENTED) {
        if (m.last_test_result === 'passed') {
          complianceScore += 100;
        } else if (m.last_test_result === 'failed') {
          complianceScore += 25; // Partial credit for failed
        } else {
          complianceScore += 75; // No test, assume implemented correctly
        }
      } else if (m.implementation_status === ImplementationStatus.IN_PROGRESS) {
        complianceScore += 50;
      } else if (m.implementation_status === ImplementationStatus.PLANNED) {
        complianceScore += 25;
      } else {
        complianceScore += 0; // Not implemented
      }
    });

    compliancePercentage = (complianceScore / (applicableControls * 100)) * 100;

    if (compliancePercentage >= 90) {
      complianceStatus = 'compliant';
    } else if (compliancePercentage >= 70) {
      complianceStatus = 'partially_compliant';
    } else {
      complianceStatus = 'non_compliant';
    }
  }

  // Determine trend (based on test pass rate vs implementation rate)
  const testPassRate = testedControls > 0 ? (passedControls / testedControls) * 100 : 0;
  const trend: 'improving' | 'stable' | 'declining' =
    testPassRate > implementationPercentage ? 'improving' : testPassRate < implementationPercentage ? 'declining' : 'stable';

  return {
    totalControls,
    implementedControls,
    plannedControls,
    inProgressControls,
    notImplementedControls,
    notApplicableControls,
    testedControls,
    passedControls,
    failedControls,
    averageEffectivenessScore,
    compliancePercentage: Math.round(compliancePercentage),
    implementationPercentage: Math.round(implementationPercentage),
    testCoveragePercentage: Math.round(testCoveragePercentage),
    complianceStatus,
    trend,
  };
}

function getComplianceStatusColor(
  status: 'compliant' | 'partially_compliant' | 'non_compliant'
): string {
  switch (status) {
    case 'compliant':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'partially_compliant':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'non_compliant':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getComplianceStatusIcon(
  status: 'compliant' | 'partially_compliant' | 'non_compliant'
): React.ReactNode {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'partially_compliant':
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case 'non_compliant':
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-600" />;
  }
}

export function AssetComplianceStatus({ mappings, assetName }: AssetComplianceStatusProps) {
  if (!mappings || mappings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Status
          </CardTitle>
          <CardDescription>No controls linked to this asset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Link controls to this asset to view compliance metrics.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = calculateComplianceMetrics(mappings);

  const implementationData = [
    {
      name: 'Implemented',
      value: metrics.implementedControls,
      fill: '#22c55e',
    },
    {
      name: 'In Progress',
      value: metrics.inProgressControls,
      fill: '#eab308',
    },
    {
      name: 'Planned',
      value: metrics.plannedControls,
      fill: '#3b82f6',
    },
    {
      name: 'Not Implemented',
      value: metrics.notImplementedControls,
      fill: '#ef4444',
    },
    {
      name: 'Not Applicable',
      value: metrics.notApplicableControls,
      fill: '#9ca3af',
    },
  ].filter((item) => item.value > 0);

  const testResultsData = [
    {
      name: 'Passed',
      value: metrics.passedControls,
      fill: '#22c55e',
    },
    {
      name: 'Failed',
      value: metrics.failedControls,
      fill: '#ef4444',
    },
    {
      name: 'Not Tested',
      value: metrics.totalControls - metrics.testedControls,
      fill: '#d1d5db',
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Main Compliance Card */}
      <Card className={`border-2 ${getComplianceStatusColor(metrics.complianceStatus)}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getComplianceStatusIcon(metrics.complianceStatus)}
                Compliance Status
              </CardTitle>
              <CardDescription>
                Overall compliance assessment for {assetName || 'this asset'}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`text-lg px-3 py-1 ${getComplianceStatusColor(metrics.complianceStatus)}`}
            >
              {metrics.complianceStatus.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Compliance Percentage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Compliance Score</span>
              <span className="text-2xl font-bold">{metrics.compliancePercentage}%</span>
            </div>
            <Progress value={metrics.compliancePercentage} className="h-2" />
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Trend:</span>
            <div className="flex items-center gap-1">
              {metrics.trend === 'improving' && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Improving</span>
                </>
              )}
              {metrics.trend === 'stable' && (
                <>
                  <Minus className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-600 font-medium">Stable</span>
                </>
              )}
              {metrics.trend === 'declining' && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">Declining</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalControls}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.notApplicableControls > 0
                ? `${metrics.totalControls - metrics.notApplicableControls} applicable`
                : 'All applicable'}
            </p>
          </CardContent>
        </Card>

        {/* Implementation Percentage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.implementationPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.implementedControls} of {metrics.totalControls - metrics.notApplicableControls}
            </p>
          </CardContent>
        </Card>

        {/* Test Coverage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Test Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.testCoveragePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.testedControls} of {metrics.totalControls}
            </p>
          </CardContent>
        </Card>

        {/* Avg Effectiveness */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Avg Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageEffectivenessScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Status Breakdown</CardTitle>
          <CardDescription>Distribution of controls by implementation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                label: 'Implemented',
                value: metrics.implementedControls,
                color: 'bg-green-500',
                percentage: ((metrics.implementedControls / metrics.totalControls) * 100).toFixed(0),
              },
              {
                label: 'In Progress',
                value: metrics.inProgressControls,
                color: 'bg-yellow-500',
                percentage: ((metrics.inProgressControls / metrics.totalControls) * 100).toFixed(0),
              },
              {
                label: 'Planned',
                value: metrics.plannedControls,
                color: 'bg-blue-500',
                percentage: ((metrics.plannedControls / metrics.totalControls) * 100).toFixed(0),
              },
              {
                label: 'Not Implemented',
                value: metrics.notImplementedControls,
                color: 'bg-red-500',
                percentage: ((metrics.notImplementedControls / metrics.totalControls) * 100).toFixed(0),
              },
              {
                label: 'Not Applicable',
                value: metrics.notApplicableControls,
                color: 'bg-gray-500',
                percentage: ((metrics.notApplicableControls / metrics.totalControls) * 100).toFixed(0),
              },
            ]
              .filter((item) => item.value > 0)
              .map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={parseFloat(item.percentage)} className="h-1" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results Summary</CardTitle>
          <CardDescription>Controls that have been tested and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.passedControls}</div>
              <div className="text-sm text-green-700 mt-1">Tests Passed</div>
              <div className="text-xs text-green-600 mt-2">
                {metrics.testedControls > 0
                  ? ((metrics.passedControls / metrics.testedControls) * 100).toFixed(0)
                  : 0}
                % success rate
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics.failedControls}</div>
              <div className="text-sm text-red-700 mt-1">Tests Failed</div>
              <div className="text-xs text-red-600 mt-2">Requires attention</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {metrics.totalControls - metrics.testedControls}
              </div>
              <div className="text-sm text-gray-700 mt-1">Not Tested</div>
              <div className="text-xs text-gray-600 mt-2">
                {((
                  ((metrics.totalControls - metrics.testedControls) / metrics.totalControls) *
                  100
                ).toFixed(0))}
                % pending
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Controls</p>
              <p className="text-lg font-semibold">{metrics.totalControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Implemented</p>
              <p className="text-lg font-semibold text-green-600">{metrics.implementedControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">In Progress</p>
              <p className="text-lg font-semibold text-yellow-600">{metrics.inProgressControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Planned</p>
              <p className="text-lg font-semibold text-blue-600">{metrics.plannedControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Not Implemented</p>
              <p className="text-lg font-semibold text-red-600">{metrics.notImplementedControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Not Applicable</p>
              <p className="text-lg font-semibold text-gray-600">{metrics.notApplicableControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tests Passed</p>
              <p className="text-lg font-semibold text-green-600">{metrics.passedControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tests Failed</p>
              <p className="text-lg font-semibold text-red-600">{metrics.failedControls}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg Effectiveness</p>
              <p className="text-lg font-semibold">{metrics.averageEffectivenessScore.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
