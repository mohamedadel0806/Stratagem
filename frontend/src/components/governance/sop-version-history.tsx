'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GitBranch, CheckCircle2, AlertCircle, Clock, User, MessageSquare, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SOPVersionHistoryProps {
  sopId: string;
  currentVersion?: string;
}

export function SOPVersionHistory({ sopId, currentVersion }: SOPVersionHistoryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState('');

  // Fetch version history
  const { data: versions, isLoading } = useQuery({
    queryKey: ['sop-versions', sopId],
    queryFn: () => governanceApi.getSOPVersions(sopId),
    enabled: !!sopId,
  });

  // Approve version mutation
  const approveMutation = useMutation({
    mutationFn: async (versionId: string) => {
      return governanceApi.approveSOPVersion({
        id: versionId,
        status: 'approved',
        approval_comments: approvalComments || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Version approved successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-versions', sopId] });
      setApproveId(null);
      setApprovalComments('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve version',
        variant: 'destructive',
      });
    },
  });

  // Reject version mutation
  const rejectMutation = useMutation({
    mutationFn: async (versionId: string) => {
      return governanceApi.approveSOPVersion({
        id: versionId,
        status: 'rejected',
        approval_comments: approvalComments || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Version rejected',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-versions', sopId] });
      setRejectId(null);
      setApprovalComments('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject version',
        variant: 'destructive',
      });
    },
  });

  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    draft: {
      color: 'bg-gray-100 text-gray-800',
      icon: <Clock className="h-4 w-4" />,
      label: 'Draft',
    },
    pending_approval: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Pending Approval',
    },
    approved: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Approved',
    },
    rejected: {
      color: 'bg-red-100 text-red-800',
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Rejected',
    },
    published: {
      color: 'bg-purple-100 text-purple-800',
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Published',
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Version History</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Track all versions and their approval status
        </p>
      </div>

      {/* Timeline */}
      {versions && versions.length > 0 ? (
        <div className="space-y-4">
          {versions.map((version: any, index: number) => {
            const config = statusConfig[version.status] || statusConfig.draft;
            const isCurrent = currentVersion === version.version;

            return (
              <Card
                key={version.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${isCurrent ? 'border-blue-200 bg-blue-50' : ''}`}
                onClick={() => setSelectedVersion(version)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    {/* Left side - Version info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <span className="font-semibold text-lg">v{version.version}</span>
                          {isCurrent && (
                            <Badge className="ml-2 bg-blue-600">Current</Badge>
                          )}
                        </div>
                        <Badge className={config.color}>
                          {config.icon}
                          <span className="ml-1">{config.label}</span>
                        </Badge>
                      </div>

                      {/* Version notes */}
                      {version.version_notes && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">{version.version_notes}</p>
                        </div>
                      )}

                      {/* Timeline info */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
                        {version.created_by && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Created by: {version.created_by}</span>
                          </div>
                        )}
                        {version.created_at && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(version.created_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        {version.effective_date && (
                          <div>Effective: {new Date(version.effective_date).toLocaleDateString()}</div>
                        )}
                      </div>

                      {/* Approval info */}
                      {version.approved_by && (
                        <div className="bg-muted p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Approved</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            By: {version.approved_by}
                          </p>
                          {version.approval_comments && (
                            <p className="text-xs">{version.approval_comments}</p>
                          )}
                          {version.approved_at && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(version.approved_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {version.status === 'pending_approval' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            setApproveId(version.id);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectId(version.id);
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <GitBranch className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No version history</p>
          </CardContent>
        </Card>
      )}

      {/* Version Details Dialog */}
      {selectedVersion && (
        <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Version v{selectedVersion.version}</DialogTitle>
              <DialogDescription>
                {selectedVersion.version_notes || 'No description provided'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                <Badge className={statusConfig[selectedVersion.status].color}>
                  {statusConfig[selectedVersion.status].icon}
                  <span className="ml-1">{statusConfig[selectedVersion.status].label}</span>
                </Badge>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {selectedVersion.created_at
                      ? new Date(selectedVersion.created_at).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                {selectedVersion.effective_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Effective</p>
                    <p className="text-sm">
                      {new Date(selectedVersion.effective_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Approval Details */}
              {selectedVersion.approved_by && (
                <div className="bg-muted p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Approval Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Approved by:</span> {selectedVersion.approved_by}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Date:</span>{' '}
                      {new Date(selectedVersion.approved_at).toLocaleString()}
                    </p>
                    {selectedVersion.approval_comments && (
                      <p>
                        <span className="text-muted-foreground">Comments:</span>{' '}
                        {selectedVersion.approval_comments}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Approve Dialog */}
      <AlertDialog open={approveId !== null} onOpenChange={(open) => !open && setApproveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this version? You can add comments below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <textarea
              placeholder="Add approval comments (optional)"
              value={approvalComments}
              onChange={(e) => setApprovalComments(e.target.value)}
              className="w-full p-2 border rounded text-sm min-h-[80px]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => approveId && approveMutation.mutate(approveId)}
              className="bg-green-600 hover:bg-green-700"
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Approve
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectId !== null} onOpenChange={(open) => !open && setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Version</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason for rejecting this version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <textarea
              placeholder="Reason for rejection"
              value={approvalComments}
              onChange={(e) => setApprovalComments(e.target.value)}
              className="w-full p-2 border rounded text-sm min-h-[80px]"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rejectId && rejectMutation.mutate(rejectId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={rejectMutation.isPending || !approvalComments}
            >
              {rejectMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reject
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SOPVersionHistory;
