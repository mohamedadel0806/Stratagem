'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Info,
  ArrowLeft,
  Check,
  X,
  Trash2,
  Calendar,
  User,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { governanceApi, Alert, AlertStatus, AlertSeverity } from '@/lib/api/governance';
import { EscalationChainsList } from './escalation-chains-list';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const AlertDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const alertId = params.id as string;

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: alertData, isLoading, error, refetch } = useQuery({
    queryKey: ['alert', alertId],
    queryFn: async () => {
      const response = await governanceApi.getAlert(alertId);
      return response.data;
    },
    enabled: !!alertId,
  });

  const alert = alertData as Alert | undefined;

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <AlertOctagon className="h-6 w-6 text-red-600" />;
      case AlertSeverity.HIGH:
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case AlertSeverity.MEDIUM:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case AlertSeverity.LOW:
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 'bg-red-100 text-red-800';
      case AlertSeverity.HIGH:
        return 'bg-orange-100 text-orange-800';
      case AlertSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case AlertSeverity.LOW:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return 'bg-blue-100 text-blue-800';
      case AlertStatus.ACKNOWLEDGED:
        return 'bg-yellow-100 text-yellow-800';
      case AlertStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case AlertStatus.DISMISSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcknowledge = async () => {
    if (!alert) return;
    setIsSubmitting(true);
    try {
      await governanceApi.acknowledgeAlert(alert.id);
      toast({
        title: 'Alert acknowledged',
        description: 'The alert has been marked as acknowledged.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!alert) return;
    setIsSubmitting(true);
    try {
      await governanceApi.resolveAlert(alert.id, resolutionNotes);
      toast({
        title: 'Alert resolved',
        description: 'The alert has been marked as resolved.',
      });
      refetch();
      setResolutionNotes('');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = async () => {
    if (!alert) return;
    setIsSubmitting(true);
    try {
      await governanceApi.dismissAlert(alert.id);
      toast({
        title: 'Alert dismissed',
        description: 'The alert has been dismissed.',
      });
      router.push('/governance/alerts');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to dismiss alert',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   const handleDelete = async () => {
     if (!alert) return;
     if (!confirm('Are you sure you want to delete this alert? This action cannot be undone.')) return;
     setIsSubmitting(true);
     try {
       await governanceApi.deleteAlert(alert.id);
       toast({
         title: 'Alert deleted',
         description: 'The alert has been permanently deleted.',
       });
       router.push('/governance/alerts');
     } catch (err) {
       toast({
         title: 'Error',
         description: 'Failed to delete alert',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };

   const handleEscalateChain = async (chainId: string) => {
     setIsSubmitting(true);
     try {
       await governanceApi.escalateAlert(chainId);
       toast({
         title: 'Chain escalated',
         description: 'The escalation chain has been escalated to the next level.',
       });
       refetch();
     } catch (err) {
       toast({
         title: 'Error',
         description: 'Failed to escalate chain',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };

   const handleResolveChain = async (chainId: string) => {
     setIsSubmitting(true);
     try {
       await governanceApi.resolveEscalationChain(chainId, 'Escalation chain resolved');
       toast({
         title: 'Chain resolved',
         description: 'The escalation chain has been marked as resolved.',
       });
       refetch();
     } catch (err) {
       toast({
         title: 'Error',
         description: 'Failed to resolve chain',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <p>Failed to load alert. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Alerts
          </Button>
        </div>
        <div className="flex gap-2">
          {alert.status === AlertStatus.ACTIVE && (
            <>
              <Button
                variant="outline"
                onClick={handleAcknowledge}
                disabled={isSubmitting}
              >
                <Clock className="mr-2 h-4 w-4" />
                Acknowledge
              </Button>
              <Button
                variant="outline"
                onClick={handleResolve}
                disabled={isSubmitting}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Resolve
              </Button>
            </>
          )}
          {alert.status !== AlertStatus.DISMISSED && (
            <Button
              variant="outline"
              onClick={handleDismiss}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Dismiss
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Alert Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{alert.title}</CardTitle>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
                <Badge className={getStatusColor(alert.status)}>
                  {alert.status}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {alert.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Information Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Type */}
            <div>
              <div className="text-xs font-medium text-gray-600">Alert Type</div>
              <div className="mt-1 text-sm capitalize">
                {alert.type.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Created */}
            <div>
              <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                <Calendar className="h-3 w-3" />
                Created
              </div>
              <div className="mt-1 text-sm">
                {format(new Date(alert.createdAt), 'MMM d, yyyy HH:mm:ss')}
              </div>
            </div>

            {/* Created By */}
            {alert.createdBy && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                  <User className="h-3 w-3" />
                  Created By
                </div>
                <div className="mt-1 text-sm">
                  {alert.createdBy.first_name} {alert.createdBy.last_name}
                </div>
              </div>
            )}

            {/* Acknowledged At */}
            {alert.acknowledgedAt && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Calendar className="h-3 w-3" />
                  Acknowledged At
                </div>
                <div className="mt-1 text-sm">
                  {format(new Date(alert.acknowledgedAt), 'MMM d, yyyy HH:mm:ss')}
                </div>
              </div>
            )}

            {/* Acknowledged By */}
            {alert.acknowledgedBy && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                  <User className="h-3 w-3" />
                  Acknowledged By
                </div>
                <div className="mt-1 text-sm">
                  {alert.acknowledgedBy.first_name} {alert.acknowledgedBy.last_name}
                </div>
              </div>
            )}

            {/* Resolved At */}
            {alert.resolvedAt && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Calendar className="h-3 w-3" />
                  Resolved At
                </div>
                <div className="mt-1 text-sm">
                  {format(new Date(alert.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                </div>
              </div>
            )}

            {/* Resolved By */}
            {alert.resolvedBy && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                  <User className="h-3 w-3" />
                  Resolved By
                </div>
                <div className="mt-1 text-sm">
                  {alert.resolvedBy.first_name} {alert.resolvedBy.last_name}
                </div>
              </div>
            )}

            {/* Related Entity */}
            {alert.relatedEntityId && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                  <LinkIcon className="h-3 w-3" />
                  Related Entity
                </div>
                <div className="mt-1 text-sm">
                  {alert.relatedEntityType}: {alert.relatedEntityId.substring(0, 8)}...
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          {alert.metadata && Object.keys(alert.metadata).length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Additional Metadata</h3>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <pre className="overflow-x-auto text-xs text-gray-700">
                  {JSON.stringify(alert.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Resolution Section */}
          {alert.status === AlertStatus.ACTIVE && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Resolve Alert</h3>
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder="Enter resolution notes (optional)"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="text-sm"
                />
                <Button
                  onClick={handleResolve}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Resolving...' : 'Mark as Resolved'}
                </Button>
              </div>
            </div>
          )}

          {/* Resolution Notes */}
          {alert.resolutionNotes && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Resolution Notes</h3>
              <div className="mt-3 rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {alert.resolutionNotes}
                </p>
              </div>
            </div>
          )}
        </CardContent>
       </Card>

       {/* Escalation Chains Section - Only for CRITICAL alerts */}
       {alert.severity === AlertSeverity.CRITICAL && (
         <EscalationChainsList
           alertId={alert.id}
           showCreateButton={true}
           onEscalate={handleEscalateChain}
           onResolve={handleResolveChain}
         />
       )}

       {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Created */}
            <div className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="h-12 w-0.5 bg-gray-300 mt-2"></div>
              </div>
              <div className="pt-1 flex-1">
                <p className="font-medium text-sm">Alert Created</p>
                <p className="text-xs text-gray-600">
                  {format(new Date(alert.createdAt), 'MMM d, yyyy HH:mm:ss')}
                </p>
              </div>
            </div>

            {/* Acknowledged */}
            {alert.acknowledgedAt && (
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="h-12 w-0.5 bg-gray-300 mt-2"></div>
                </div>
                <div className="pt-1 flex-1">
                  <p className="font-medium text-sm">Alert Acknowledged</p>
                  <p className="text-xs text-gray-600">
                    by {alert.acknowledgedBy?.first_name} {alert.acknowledgedBy?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(alert.acknowledgedAt), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
            )}

            {/* Resolved */}
            {alert.resolvedAt && (
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="pt-1 flex-1">
                  <p className="font-medium text-sm">Alert Resolved</p>
                  <p className="text-xs text-gray-600">
                    by {alert.resolvedBy?.first_name} {alert.resolvedBy?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(alert.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
            )}

            {/* No events */}
            {!alert.acknowledgedAt && !alert.resolvedAt && (
              <div className="text-center py-4 text-sm text-gray-600">
                No additional events yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
