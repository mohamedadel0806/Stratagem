'use client';

import React from 'react';
import { ControlAssetMapping } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

interface ControlComplianceOverviewProps {
  mappings: ControlAssetMapping[];
  controlName?: string;
}

const IMPLEMENTATION_COLORS = {
  implemented: '#22c55e',
  in_progress: '#eab308',
  planned: '#3b82f6',
  not_implemented: '#ef4444',
  not_applicable: '#9ca3af',
};

const TEST_RESULT_COLORS = {
  passed: '#22c55e',
  failed: '#ef4444',
  not_tested: '#d1d5db',
};

export function ControlComplianceOverview({
  mappings,
  controlName,
}: ControlComplianceOverviewProps) {
  if (!mappings || mappings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Control Implementation Overview</CardTitle>
          <CardDescription>No assets linked to this control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Link assets to this control to view implementation coverage.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Count implementation statuses
  const implementationCounts = {
    implemented: mappings.filter((m) => m.implementation_status === 'implemented').length,
    in_progress: mappings.filter((m) => m.implementation_status === 'in_progress').length,
    planned: mappings.filter((m) => m.implementation_status === 'planned').length,
    not_implemented: mappings.filter((m) => m.implementation_status === 'not_implemented').length,
    not_applicable: mappings.filter((m) => m.implementation_status === 'not_applicable').length,
  };

  // Count test results
  const testResults = {
    passed: mappings.filter((m) => m.last_test_result === 'passed').length,
    failed: mappings.filter((m) => m.last_test_result === 'failed').length,
    not_tested: mappings.filter((m) => !m.last_test_date).length,
  };

  const implementationData = Object.entries(implementationCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' ').charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
      value,
      fill:
        IMPLEMENTATION_COLORS[name as keyof typeof IMPLEMENTATION_COLORS] ||
        '#9ca3af',
    }));

  const testResultData = Object.entries(testResults)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' ').charAt(0).toUpperCase() + name.slice(1),
      value,
      fill:
        TEST_RESULT_COLORS[name as keyof typeof TEST_RESULT_COLORS] ||
        '#9ca3af',
    }));

  const implementationPercentage = Math.round(
    (implementationCounts.implemented / mappings.length) * 100
  );
  const testPassRate =
    testResults.passed + testResults.failed > 0
      ? Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mappings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">linked to control</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {implementationCounts.implemented}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {implementationPercentage}% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {implementationCounts.in_progress}
            </div>
            <p className="text-xs text-muted-foreground mt-1">pending completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Test Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{testPassRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">of tested assets</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Implementation Status Chart */}
        {implementationData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status Distribution</CardTitle>
              <CardDescription>
                How this control is implemented across linked assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={implementationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {implementationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Test Results Chart */}
        {testResultData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results Distribution</CardTitle>
              <CardDescription>
                Assessment results for this control across assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={testResultData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {testResultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Implementation Status List */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(implementationCounts)
            .filter(([_, count]) => count > 0)
            .map(([status, count], idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          IMPLEMENTATION_COLORS[
                            status as keyof typeof IMPLEMENTATION_COLORS
                          ] || '#9ca3af',
                      }}
                    />
                    {status.replace(/_/g, ' ').charAt(0).toUpperCase() +
                      status.slice(1).replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {count} ({((count / mappings.length) * 100).toFixed(0)}%)
                  </span>
                </div>
                <Progress value={(count / mappings.length) * 100} className="h-1" />
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Test Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Test Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(testResults)
            .filter(([_, count]) => count > 0)
            .map(([status, count], idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          TEST_RESULT_COLORS[
                            status as keyof typeof TEST_RESULT_COLORS
                          ] || '#9ca3af',
                      }}
                    />
                    {status === 'not_tested'
                      ? 'Not Tested'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {count} ({((count / mappings.length) * 100).toFixed(0)}%)
                  </span>
                </div>
                <Progress value={(count / mappings.length) * 100} className="h-1" />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
