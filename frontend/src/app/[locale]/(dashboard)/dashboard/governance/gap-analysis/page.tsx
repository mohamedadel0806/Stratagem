'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';
import { GapAnalysisChart } from '@/components/governance/gap-analysis-chart';
import { GapAnalysisTable } from '@/components/governance/gap-analysis-table';
import { GapRecommendations } from '@/components/governance/gap-recommendations';

export default function GapAnalysisPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    frameworkIds: '' as string,
    domain: '' as string,
    category: '' as string,
    priorityOnly: false,
  });
  const [selectedFramework, setSelectedFramework] = useState<string>('all');

  // Fetch gap analysis data
  const {
    data: gapAnalysis,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['gapAnalysis', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.frameworkIds) params.append('frameworkIds', filters.frameworkIds);
      if (filters.domain) params.append('domain', filters.domain);
      if (filters.category) params.append('category', filters.category);
      if (filters.priorityOnly) params.append('priorityOnly', 'true');

      const response = await apiClient.get(`/governance/reporting/gap-analysis?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch available frameworks
  const { data: frameworks } = useQuery({
    queryKey: ['frameworks'],
    queryFn: async () => {
      const response = await apiClient.get('/governance/frameworks');
      return response.data || [];
    },
  });

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: 'Gap analysis refreshed', description: 'Latest data loaded' });
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.frameworkIds) params.append('frameworkIds', filters.frameworkIds);
      if (filters.domain) params.append('domain', filters.domain);
      if (filters.category) params.append('category', filters.category);
      if (filters.priorityOnly) params.append('priorityOnly', 'true');

      const response = await apiClient.get(
        `/governance/reporting/gap-analysis/export?${params.toString()}&format=xlsx`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gap-analysis-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({ title: 'Export successful', description: 'Gap analysis report downloaded' });
    } catch (err) {
      toast({ title: 'Export failed', description: 'Could not export gap analysis report', variant: 'destructive' });
    }
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gap Analysis</h1>
          <p className="text-muted-foreground">Framework compliance mapping and gap identification</p>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error?.message || 'Failed to load gap analysis data'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gap Analysis</h1>
        <p className="text-muted-foreground">
          Identify compliance gaps across frameworks and requirements
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="frameworks">Frameworks</Label>
              <Select value={selectedFramework} onValueChange={(value) => {
                setSelectedFramework(value);
                // When "all" is selected, pass empty string to API, otherwise pass the framework ID
                handleFilterChange('frameworkIds', value === 'all' ? '' : value);
              }}>
                <SelectTrigger id="frameworks">
                  <SelectValue placeholder="All frameworks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All frameworks</SelectItem>
                  {frameworks?.map((fw: any) => (
                    <SelectItem key={fw.id} value={fw.id}>
                      {fw.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="Filter by domain"
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Filter by category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant={filters.priorityOnly ? 'default' : 'outline'}
                onClick={() => handleFilterChange('priorityOnly', !filters.priorityOnly)}
                className="w-full"
              >
                {filters.priorityOnly ? 'High Priority Only' : 'Show All Priority'}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={handleRefresh} disabled={isLoading} size="sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refresh
            </Button>
            <Button onClick={handleExport} disabled={isLoading || !gapAnalysis} variant="outline" size="sm">
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Analyzing frameworks and requirements...</p>
            </div>
          </CardContent>
        </Card>
      ) : gapAnalysis ? (
        <>
          {/* Summary Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gapAnalysis.overallCoveragePercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {gapAnalysis.totalMappedRequirements} of {gapAnalysis.totalRequirements} requirements
                </p>
                <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${gapAnalysis.overallCoveragePercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gapAnalysis.totalFrameworks}</div>
                <p className="text-xs text-muted-foreground mt-1">Frameworks analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Critical Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{gapAnalysis.criticalGapsCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Immediate attention needed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Unmapped Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{gapAnalysis.totalUnmappedRequirements}</div>
                <p className="text-xs text-muted-foreground mt-1">No control coverage</p>
              </CardContent>
            </Card>
          </div>

          {/* Gap Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Framework Coverage Overview</CardTitle>
              <CardDescription>
                Coverage percentage by framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GapAnalysisChart frameworks={gapAnalysis.frameworks} />
            </CardContent>
          </Card>

          {/* Recommendations */}
          {gapAnalysis.recommendations && gapAnalysis.recommendations.length > 0 && (
            <GapRecommendations recommendations={gapAnalysis.recommendations} />
          )}

          {/* Gap Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Gap Details</CardTitle>
              <CardDescription>
                {gapAnalysis.allGaps.length} gaps identified across all frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GapAnalysisTable gaps={gapAnalysis.allGaps} isLoading={isLoading} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
