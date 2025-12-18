'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi, SecurityTestResult } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, AlertTriangle, Shield, CheckCircle2, XCircle, Clock, Upload, Download, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessApplicationForm } from '@/components/forms/business-application-form';
import { AssetDependencies } from '@/components/assets/asset-dependencies';
import { AssetAuditTrail } from '@/components/assets/asset-audit-trail';
import { DependencyGraph } from '@/components/assets/dependency-graph';
import { DependencyWarningDialog } from '@/components/assets/dependency-warning-dialog';
import { AssetComplianceTab } from '@/components/assets/asset-compliance-tab';
import { LinkedControlsList } from '@/components/governance/linked-controls-list';
import { AssetLinkedRisks } from '@/components/risks/asset-linked-risks';
import { SecurityTestUploadForm } from '@/components/forms/security-test-upload-form';

export default function BusinessApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const locale = (params.locale as string) || 'en';
  const assetId = params.id as string;

  const { data: app, isLoading, error } = useQuery<any, any>({
    queryKey: ['business-application', assetId],
    queryFn: () => assetsApi.getBusinessApplication(assetId),
    enabled: !!assetId,
  });

  const { data: testResults, isLoading: isLoadingTests } = useQuery<SecurityTestResult[]>({
    queryKey: ['security-test-results', 'application', assetId],
    queryFn: () => assetsApi.getSecurityTestResults('application', assetId),
    enabled: !!assetId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteBusinessApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-applications'] });
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
      router.push(`/${locale}/dashboard/assets/applications`);
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to delete application',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">Error loading application</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.response?.data?.message || error?.message || 'Unknown error'}
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/applications`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Application not found</p>
            <p className="text-sm text-muted-foreground mb-4">Application ID: {assetId}</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/assets/applications`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCriticalityBadge = (level: string | undefined) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    const cls = level ? colors[level] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
    return <Badge className={cls}>{level || 'Unknown'}</Badge>;
  };

  const getSecurityTestStatus = () => {
    if (!app.lastSecurityTestDate) {
      return { status: 'no-test', label: 'No Test', icon: Clock, variant: 'secondary' as const };
    }
    const testDate = new Date(app.lastSecurityTestDate);
    const daysSince = Math.floor((Date.now() - testDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince > 365) {
      return { status: 'overdue', label: 'Test Overdue', icon: AlertTriangle, variant: 'destructive' as const };
    }
    
    const severity = app.securityTestResults?.severity?.toLowerCase() || '';
    if (severity === 'critical' || severity === 'high' || severity === 'failed') {
      return { status: 'failed', label: 'Test Failed', icon: XCircle, variant: 'destructive' as const };
    }
    
    return { status: 'passed', label: 'Test Passed', icon: CheckCircle2, variant: 'default' as const };
  };

  const securityTestStatus = getSecurityTestStatus();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/assets/applications`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{app.applicationName}</h1>
              {(!app.versionNumber || !app.patchLevel) && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Outdated
                </Badge>
              )}
              {securityTestStatus.status !== 'no-test' && (
                <Badge variant={securityTestStatus.variant} className="flex items-center gap-1">
                  <securityTestStatus.icon className="h-4 w-4" />
                  {securityTestStatus.label}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{app.uniqueIdentifier}</p>
            <div className="flex items-center gap-2 mt-2">
              {app.versionNumber ? (
                <Badge variant="outline" className="font-mono text-base">
                  v{app.versionNumber}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  No Version
                </Badge>
              )}
              {app.patchLevel ? (
                <Badge variant="outline" className="font-mono text-base">
                  Patch {app.patchLevel}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  No Patch
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Security Tests</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Application Name</p>
                  <p>{app.applicationName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                  <p>{app.uniqueIdentifier}</p>
                </div>
                {app.applicationType && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <Badge>{String(app.applicationType).replace('_', ' ')}</Badge>
                  </div>
                )}
                {app.status && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={app.status === 'active' ? 'default' : 'secondary'}>
                      {app.status}
                    </Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                  {getCriticalityBadge(app.criticalityLevel)}
                </div>
                {app.versionNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p className="font-mono">{app.versionNumber}</p>
                  </div>
                )}
                {app.patchLevel && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patch Level</p>
                    <p className="font-mono">{app.patchLevel}</p>
                  </div>
                )}
                {app.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{app.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {app.hostingLocation && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hosting Location</p>
                    <p>{app.hostingLocation}</p>
                  </div>
                )}
                {app.technologyStack && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Technology Stack</p>
                    <p>{app.technologyStack}</p>
                  </div>
                )}
                {app.url && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">URL</p>
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {app.url}
                    </a>
                  </div>
                )}
                {app.deploymentDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deployment Date</p>
                    <p>{app.deploymentDate}</p>
                  </div>
                )}
                {app.lastUpdateDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Update Date</p>
                    <p>{app.lastUpdateDate}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {app.vendorName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                    <p>{app.vendorName}</p>
                  </div>
                )}
                {app.vendorContact && (
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Vendor Contact</p>
                    <p>{app.vendorContact.name}</p>
                    {app.vendorContact.email && (
                      <p className="text-sm text-muted-foreground">{app.vendorContact.email}</p>
                    )}
                    {app.vendorContact.phone && (
                      <p className="text-sm text-muted-foreground">{app.vendorContact.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <AssetComplianceTab assetType="application" assetId={assetId} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Test Results
                </CardTitle>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Test Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingTests ? (
                <div className="text-center py-8 text-muted-foreground">Loading test results...</div>
              ) : testResults && testResults.length > 0 ? (
                <>
                  {/* Latest Test Summary */}
                  {testResults[0] && (
                    <div className="border-b pb-4 mb-4">
                      <h3 className="text-sm font-semibold mb-3">Latest Test</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Test Date</p>
                          <p>{new Date(testResults[0].testDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge
                            variant={
                              testResults[0].passed
                                ? 'default'
                                : testResults[0].severity === 'critical' || testResults[0].severity === 'high'
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {testResults[0].passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                        {testResults[0].severity && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Severity</p>
                            <Badge
                              variant={
                                testResults[0].severity === 'critical' || testResults[0].severity === 'high'
                                  ? 'destructive'
                                  : testResults[0].severity === 'medium'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {testResults[0].severity}
                            </Badge>
                          </div>
                        )}
                        {testResults[0].overallScore !== undefined && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                            <p>{testResults[0].overallScore}/100</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-5 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Critical:</span> {testResults[0].findingsCritical}
                        </div>
                        <div>
                          <span className="text-muted-foreground">High:</span> {testResults[0].findingsHigh}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Medium:</span> {testResults[0].findingsMedium}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Low:</span> {testResults[0].findingsLow}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Info:</span> {testResults[0].findingsInfo}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Historical Test Results */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Test History</h3>
                    <div className="space-y-3">
                      {testResults.map((test) => (
                        <Card key={test.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{test.testType.replace('_', ' ')}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(test.testDate).toLocaleDateString()}
                                </span>
                                {test.testerName && (
                                  <span className="text-sm text-muted-foreground">by {test.testerName}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Status: </span>
                                  <Badge variant={test.passed ? 'default' : 'destructive'}>
                                    {test.passed ? 'Passed' : 'Failed'}
                                  </Badge>
                                </div>
                                {test.severity && (
                                  <div>
                                    <span className="text-muted-foreground">Severity: </span>
                                    <Badge
                                      variant={
                                        test.severity === 'critical' || test.severity === 'high'
                                          ? 'destructive'
                                          : 'secondary'
                                      }
                                    >
                                      {test.severity}
                                    </Badge>
                                  </div>
                                )}
                                {(test.findingsCritical > 0 ||
                                  test.findingsHigh > 0 ||
                                  test.findingsMedium > 0) && (
                                  <div className="text-muted-foreground">
                                    Findings: {test.findingsCritical}C {test.findingsHigh}H {test.findingsMedium}M
                                  </div>
                                )}
                              </div>
                              {test.summary && (
                                <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{test.summary}</p>
                              )}
                            </div>
                            {test.reportUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={test.reportUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-1" />
                                  Report
                                </a>
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No security test results available</p>
                  <p className="text-xs mt-1">Upload a security test report to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Linked risks help you understand threats to this application. Use the risk links below to jump into
            detailed risk views, assessments, and treatment plans.
          </p>
          <AssetLinkedRisks assetType="application" assetId={assetId} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <AssetDependencies assetType="application" assetId={assetId} />
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <DependencyGraph assetType="application" assetId={assetId} assetName={app.applicationName} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AssetAuditTrail assetType="application" assetId={assetId} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>Update the application details</DialogDescription>
          </DialogHeader>
          <BusinessApplicationForm
            asset={app}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['business-application', assetId] });
              queryClient.invalidateQueries({ queryKey: ['business-applications'] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DependencyWarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        assetType="application"
        assetId={assetId}
        assetName={app.applicationName}
        action="delete"
        onConfirm={() => {
          deleteMutation.mutate(app.id);
          setIsDeleteDialogOpen(false);
        }}
        isConfirming={deleteMutation.isPending}
      />

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Security Test Report</DialogTitle>
            <DialogDescription>
              Upload a security test report (PDF, CSV, XLS, XLSX, or XML) for this application.
            </DialogDescription>
          </DialogHeader>
          <SecurityTestUploadForm
            assetType="application"
            assetId={assetId}
            onSuccess={() => {
              setIsUploadDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['security-test-results', 'application', assetId] });
              queryClient.invalidateQueries({ queryKey: ['business-application', assetId] });
            }}
            onCancel={() => setIsUploadDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
