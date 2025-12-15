'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceAssessmentApi, AssetComplianceStatus, ComplianceGap, AssetType } from '@/lib/api/compliance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  HelpCircle,
  FileX,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface AssetComplianceTabProps {
  assetType: AssetType;
  assetId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant':
      return 'bg-green-500 hover:bg-green-500';
    case 'non_compliant':
      return 'bg-red-500 hover:bg-red-500';
    case 'partially_compliant':
      return 'bg-yellow-500 hover:bg-yellow-500';
    case 'requires_review':
      return 'bg-blue-500 hover:bg-blue-500';
    case 'not_applicable':
      return 'bg-gray-500 hover:bg-gray-500';
    default:
      return 'bg-gray-400 hover:bg-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'non_compliant':
      return <XCircle className="h-4 w-4" />;
    case 'partially_compliant':
      return <AlertCircle className="h-4 w-4" />;
    case 'requires_review':
      return <HelpCircle className="h-4 w-4" />;
    case 'not_applicable':
      return <FileX className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export function AssetComplianceTab({ assetType, assetId }: AssetComplianceTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null);

  const { data: complianceStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['asset-compliance-status', assetType, assetId],
    queryFn: () => complianceAssessmentApi.getAssetComplianceStatus(assetType, assetId),
  });

  const { data: gaps, isLoading: isLoadingGaps } = useQuery({
    queryKey: ['asset-compliance-gaps', assetType, assetId],
    queryFn: () => complianceAssessmentApi.getComplianceGaps(assetType, assetId),
    enabled: !!complianceStatus && complianceStatus.nonCompliantCount > 0,
  });

  const assessMutation = useMutation({
    mutationFn: () => complianceAssessmentApi.assessAsset(assetType, assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-compliance-status', assetType, assetId] });
      queryClient.invalidateQueries({ queryKey: ['asset-compliance-gaps', assetType, assetId] });
      toast({
        title: 'Success',
        description: 'Asset compliance assessment completed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to assess asset compliance.',
        variant: 'destructive',
      });
    },
  });

  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading compliance status...</span>
      </div>
    );
  }

  if (!complianceStatus) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Compliance Data</AlertTitle>
        <AlertDescription>
          This asset has no compliance requirements linked. Link compliance frameworks to this asset to enable
          automated compliance checking.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>
                Overall compliance: {complianceStatus.overallCompliancePercentage}%
              </CardDescription>
            </div>
            <Button
              onClick={() => assessMutation.mutate()}
              disabled={assessMutation.isPending}
              variant="outline"
            >
              {assessMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-assess
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={complianceStatus.overallCompliancePercentage} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{complianceStatus.compliantCount}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{complianceStatus.nonCompliantCount}</div>
              <div className="text-sm text-muted-foreground">Non-Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {complianceStatus.partiallyCompliantCount}
              </div>
              <div className="text-sm text-muted-foreground">Partial</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{complianceStatus.requiresReviewCount}</div>
              <div className="text-sm text-muted-foreground">Review Needed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap Analysis */}
      {gaps && gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Gaps</CardTitle>
            <CardDescription>Issues that need to be addressed for compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gaps.map((gap) => (
                <Alert key={gap.requirementId} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{gap.requirementTitle}</AlertTitle>
                  <AlertDescription>
                    <p className="mt-2">{gap.gapDescription}</p>
                    {gap.recommendations && gap.recommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-2">Recommendations:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {gap.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements List */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements Assessment</CardTitle>
          <CardDescription>
            {complianceStatus.totalRequirements} total requirements assessed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {complianceStatus.requirements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No requirements have been assessed yet. Click "Re-assess" to start.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Assessed</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceStatus.requirements.map((requirement) => (
                  <TableRow key={requirement.requirementId}>
                    <TableCell className="font-medium">{requirement.requirementTitle}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(requirement.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(requirement.status)}
                          {requirement.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {requirement.assessedAt
                        ? formatDistanceToNow(new Date(requirement.assessedAt), { addSuffix: true })
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedRequirement(
                            expandedRequirement === requirement.requirementId
                              ? null
                              : requirement.requirementId
                          )
                        }
                      >
                        {expandedRequirement === requirement.requirementId ? 'Hide' : 'Show'} Details
                      </Button>
                      {expandedRequirement === requirement.requirementId && (
                        <div className="mt-2 space-y-2 p-4 bg-muted rounded-md">
                          {requirement.ruleResults && requirement.ruleResults.length > 0 ? (
                            <>
                              <p className="font-medium text-sm">Rule Evaluations:</p>
                              {requirement.ruleResults.map((rule, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium">{rule.ruleName}:</span>{' '}
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(rule.status)}
                                  >
                                    {rule.status.replace('_', ' ')}
                                  </Badge>
                                  <p className="text-muted-foreground text-xs mt-1">{rule.message}</p>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">No rule evaluations available</p>
                          )}
                          {requirement.recommendations && requirement.recommendations.length > 0 && (
                            <div className="mt-3">
                              <p className="font-medium text-sm">Recommendations:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {requirement.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

