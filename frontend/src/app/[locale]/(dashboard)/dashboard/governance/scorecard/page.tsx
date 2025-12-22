'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, ComplianceScorecardResponse } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function ComplianceScorecardPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  const { data: scorecard, isLoading, error } = useQuery({
    queryKey: ['compliance-scorecard', selectedFrameworks],
    queryFn: () => governanceApi.getComplianceScorecard(
      selectedFrameworks.length > 0 ? selectedFrameworks : undefined,
    ),
  });

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBadgeVariant = (percentage: number): 'default' | 'secondary' | 'destructive' => {
    if (percentage >= 90) return 'default';
    if (percentage >= 70) return 'secondary';
    return 'destructive';
  };

  const exportScorecard = (data: ComplianceScorecardResponse) => {
    // Create CSV content
    const csvRows: string[] = [];
    
    // Header
    csvRows.push('Framework Compliance Scorecard');
    csvRows.push(`Generated: ${new Date(data.generatedAt).toLocaleString()}`);
    csvRows.push('');
    csvRows.push('Overall Summary');
    csvRows.push(`Average Compliance,${data.summary.averageCompliance}%`);
    csvRows.push(`Total Frameworks,${data.summary.totalFrameworks}`);
    csvRows.push(`Total Requirements,${data.summary.totalRequirements}`);
    csvRows.push(`Met Requirements,${data.summary.totalMet}`);
    csvRows.push(`Not Met Requirements,${data.summary.totalNotMet}`);
    csvRows.push('');
    
    // Framework details
    csvRows.push('Framework Details');
    csvRows.push('Framework Name,Framework Code,Overall Compliance,Total Requirements,Met,Not Met,Partially Met,Not Applicable');
    
    data.frameworks.forEach((fw) => {
      csvRows.push(
        `"${fw.frameworkName}","${fw.frameworkCode}",${fw.overallCompliance}%,${fw.totalRequirements},${fw.metRequirements},${fw.notMetRequirements},${fw.partiallyMetRequirements},${fw.notApplicableRequirements}`
      );
    });
    
    csvRows.push('');
    csvRows.push('Domain Breakdown');
    csvRows.push('Framework,Domain,Total Requirements,Met,Not Met,Partially Met,Not Applicable,Compliance %');
    
    data.frameworks.forEach((fw) => {
      fw.breakdownByDomain.forEach((domain) => {
        csvRows.push(
          `"${fw.frameworkName}","${domain.domain}",${domain.totalRequirements},${domain.met},${domain.notMet},${domain.partiallyMet},${domain.notApplicable},${domain.compliancePercentage}%`
        );
      });
    });
    
    // Create and download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compliance-scorecard-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="p-6">Loading scorecard...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          <h2 className="text-xl font-semibold">Error loading scorecard</h2>
          <p>{(error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!scorecard || scorecard.frameworks.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No framework data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Framework Compliance Scorecard</h1>
          <p className="text-muted-foreground mt-1">
            Compliance status across all frameworks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedFrameworks.length > 0 ? selectedFrameworks.join(',') : 'all'}
            onValueChange={(value) => {
              setSelectedFrameworks(value === 'all' ? [] : value.split(','));
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select frameworks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frameworks</SelectItem>
              {scorecard.frameworks.map((fw) => (
                <SelectItem key={fw.frameworkId} value={fw.frameworkId}>
                  {fw.frameworkName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => exportScorecard(scorecard)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Summary</CardTitle>
          <CardDescription>
            Generated at {new Date(scorecard.generatedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{scorecard.summary.averageCompliance}%</p>
              <p className="text-sm text-muted-foreground">Average Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{scorecard.summary.totalFrameworks}</p>
              <p className="text-sm text-muted-foreground">Frameworks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{scorecard.summary.totalRequirements}</p>
              <p className="text-sm text-muted-foreground">Total Requirements</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{scorecard.summary.totalMet}</p>
              <p className="text-sm text-muted-foreground">Met Requirements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Framework Scorecards */}
      <div className="space-y-4">
        {scorecard.frameworks.map((framework) => (
          <Card key={framework.frameworkId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{framework.frameworkName}</CardTitle>
                  <CardDescription>{framework.frameworkCode}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {framework.trend && (
                    <div className="flex items-center gap-1">
                      {framework.trend.trend === 'improving' && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                      {framework.trend.trend === 'declining' && (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      {framework.trend.trend === 'stable' && (
                        <Minus className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {framework.trend.change > 0 ? '+' : ''}{framework.trend.change}%
                      </span>
                    </div>
                  )}
                  <Badge variant={getComplianceBadgeVariant(framework.overallCompliance)}>
                    {framework.overallCompliance}% Compliant
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Compliance Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Met</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{framework.metRequirements}</p>
                  <Progress
                    value={(framework.metRequirements / framework.totalRequirements) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Not Met</span>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{framework.notMetRequirements}</p>
                  <Progress
                    value={(framework.notMetRequirements / framework.totalRequirements) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Partial</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{framework.partiallyMetRequirements}</p>
                  <Progress
                    value={(framework.partiallyMetRequirements / framework.totalRequirements) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">N/A</span>
                    <span className="h-4 w-4 text-muted-foreground">—</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-600">{framework.notApplicableRequirements}</p>
                  <Progress
                    value={(framework.notApplicableRequirements / framework.totalRequirements) * 100}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Domain Breakdown */}
              {framework.breakdownByDomain.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Compliance by Domain</h3>
                  <div className="space-y-3">
                    {framework.breakdownByDomain.map((domain) => (
                      <div key={domain.domain} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{domain.domain}</span>
                          <Badge variant={getComplianceBadgeVariant(domain.compliancePercentage)}>
                            {domain.compliancePercentage}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Met: </span>
                            <span className="font-medium text-green-600">{domain.met}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Not Met: </span>
                            <span className="font-medium text-red-600">{domain.notMet}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Partial: </span>
                            <span className="font-medium text-yellow-600">{domain.partiallyMet}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-medium">{domain.totalRequirements}</span>
                          </div>
                        </div>
                        <Progress
                          value={domain.compliancePercentage}
                          className="h-2 mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Control Implementation Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Control Implementation Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {framework.controlImplementationStatus.implemented}
                    </p>
                    <p className="text-sm text-muted-foreground">Implemented</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {framework.controlImplementationStatus.inProgress}
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {framework.controlImplementationStatus.planned}
                    </p>
                    <p className="text-sm text-muted-foreground">Planned</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {framework.controlImplementationStatus.notImplemented}
                    </p>
                    <p className="text-sm text-muted-foreground">Not Implemented</p>
                  </div>
                </div>
              </div>

              {/* Assessment Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Assessment Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{framework.assessmentResults.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{framework.assessmentResults.inProgress}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{framework.assessmentResults.averageScore}%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </div>

              {/* Gaps Summary */}
              {framework.gaps.total > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Gaps Summary</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{framework.gaps.total}</p>
                      <p className="text-sm text-muted-foreground">Total Gaps</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg border-red-200">
                      <p className="text-2xl font-bold text-red-600">{framework.gaps.critical}</p>
                      <p className="text-sm text-muted-foreground">Critical</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg border-orange-200">
                      <p className="text-2xl font-bold text-orange-600">{framework.gaps.high}</p>
                      <p className="text-sm text-muted-foreground">High</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{framework.gaps.medium + framework.gaps.low}</p>
                      <p className="text-sm text-muted-foreground">Medium/Low</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


