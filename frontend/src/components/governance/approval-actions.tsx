'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { workflowsApi } from '@/lib/api/workflows';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Loader2, PenTool } from 'lucide-react';
import { SignatureCaptureDialog } from './signature-capture-dialog';

interface ApprovalActionsProps {
  approvalId: string;
  onSuccess?: () => void;
}

export function ApprovalActions({ approvalId, onSuccess }: ApprovalActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [capturedSignature, setCapturedSignature] = useState<any>(null);

  const approveMutation = useMutation({
    mutationFn: async ({ approvalId, comments, signature }: { approvalId: string; comments?: string; signature?: any }) => {
      await workflowsApi.approve(approvalId, 'approved', comments, signature);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Approval submitted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['my-approvals'] });
      setIsDialogOpen(false);
      setComments('');
      setAction(null);
      setCapturedSignature(null);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to submit approval',
        variant: 'destructive',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ approvalId, comments }: { approvalId: string; comments?: string }) => {
      await workflowsApi.approve(approvalId, 'rejected', comments);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Rejection submitted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['my-approvals'] });
      setIsDialogOpen(false);
      setComments('');
      setAction(null);
      setCapturedSignature(null);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to submit rejection',
        variant: 'destructive',
      });
    },
  });

  const handleApprove = () => {
    setAction('approve');
    setIsDialogOpen(true);
  };

  const handleReject = () => {
    setAction('reject');
    setIsDialogOpen(true);
  };

  const handleSignatureCapture = (signatureData: any) => {
    setCapturedSignature(signatureData);
    setIsSignatureDialogOpen(false);
  };

  const handleSubmit = () => {
    if (action === 'approve') {
      if (capturedSignature) {
        approveMutation.mutate({
          approvalId,
          comments: comments || undefined,
          signature: capturedSignature
        });
      } else {
        // Show signature dialog for approval
        setIsDialogOpen(false);
        setIsSignatureDialogOpen(true);
      }
    } else if (action === 'reject') {
      rejectMutation.mutate({ approvalId, comments: comments || undefined });
    }
  };

  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <PenTool className="h-4 w-4 mr-2" />
          Sign & Approve
        </Button>
        <Button
          onClick={handleReject}
          variant="destructive"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {action === 'approve'
                ? capturedSignature
                  ? 'Please confirm your approval with signature. You can add optional comments below.'
                  : 'Please provide your digital signature for approval. You can add optional comments below.'
                : 'Please provide a reason for rejection. This will be visible to the requester.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {action === 'approve' && capturedSignature && (
              <div className="space-y-2">
                <Label>Signature Preview</Label>
                <div className="border-2 border-gray-200 rounded-lg p-2 bg-white max-w-xs">
                  <img
                    src={capturedSignature.signatureData}
                    alt="Signature preview"
                    className="w-full h-auto max-h-12 object-contain"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="comments">
                Comments {action === 'reject' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="comments"
                placeholder={
                  action === 'approve'
                    ? 'Optional comments...'
                    : 'Please provide a reason for rejection...'
                }
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                required={action === 'reject'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setComments('');
                setAction(null);
                setCapturedSignature(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {action === 'approve' && !capturedSignature && (
              <Button
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsSignatureDialogOpen(true);
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PenTool className="h-4 w-4" />
                Add Signature
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (action === 'reject' && !comments.trim()) || (action === 'approve' && !capturedSignature)}
              variant={action === 'reject' ? 'destructive' : 'default'}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {action === 'approve' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Approval
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SignatureCaptureDialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
        onSignatureCapture={handleSignatureCapture}
      />
    </>
  );
}

