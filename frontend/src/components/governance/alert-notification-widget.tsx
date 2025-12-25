'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  governanceApi,
  Alert,
  AlertSeverity,
  AlertStatus,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AlertNotificationWidgetProps {
  showLabel?: boolean;
  refreshInterval?: number;
}

export const AlertNotificationWidget: React.FC<AlertNotificationWidgetProps> = ({
  showLabel = true,
  refreshInterval = 30000,
}) => {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const { data: alertsData, refetch: refetchAlerts } = useQuery({
    queryKey: ['recent-critical-alerts'],
    queryFn: async () => {
      return await governanceApi.getRecentCriticalAlerts(5);
    },
    refetchInterval: refreshInterval,
    staleTime: 10000,
  });

  const { data: statsData } = useQuery({
    queryKey: ['alert-statistics'],
    queryFn: async () => {
      return await governanceApi.getAlertStatistics();
    },
    refetchInterval: refreshInterval,
    staleTime: 10000,
  });

  // Update unread count based on statistics
  useEffect(() => {
    if (statsData) {
      const unread = (statsData.active || 0) + (statsData.acknowledged || 0);
      setUnreadCount(unread);
    }
  }, [statsData]);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case AlertSeverity.HIGH:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case AlertSeverity.MEDIUM:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case AlertSeverity.LOW:
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4" />;
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

  const handleAcknowledgeAll = async () => {
    try {
      await governanceApi.markAllAlertsAsAcknowledged();
      toast({
        title: 'All alerts acknowledged',
        description: 'All unread alerts have been marked as acknowledged.',
      });
      refetchAlerts();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alerts',
        variant: 'destructive',
      });
    }
  };

  const alerts = alertsData || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {showLabel && <span className="ml-2 text-xs">Alerts</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
          <div>
            <h3 className="font-semibold text-sm">Notifications</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAcknowledgeAll}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Alerts List */}
        <div className="max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-600">
              <CheckCircle2 className="h-8 w-8 mb-2 text-green-600" />
              <p className="text-sm font-medium">No critical alerts</p>
              <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/governance/alerts/${alert.id}`}
                  onClick={() => setOpen(false)}
                >
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {alert.title}
                          </p>
                          <Badge
                            className={`flex-shrink-0 text-xs ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        {alert.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {alert.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{format(new Date(alert.createdAt), 'MMM d HH:mm')}</span>
                          {alert.status === AlertStatus.ACTIVE && (
                            <span className="inline-flex items-center gap-1 text-blue-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-4 py-3">
          <Link href="/governance/alerts" onClick={() => setOpen(false)}>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View All Alerts
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        {statsData && (
          <div className="border-t bg-gray-50 px-4 py-2 grid grid-cols-4 gap-2 text-center">
            <div className="text-xs">
              <p className="font-semibold text-gray-900">{statsData.active || 0}</p>
              <p className="text-gray-600 text-xs">Active</p>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-gray-900">{statsData.acknowledged || 0}</p>
              <p className="text-gray-600 text-xs">Acknowledged</p>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-gray-900">{statsData.resolved || 0}</p>
              <p className="text-gray-600 text-xs">Resolved</p>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-gray-900">{statsData.total || 0}</p>
              <p className="text-gray-600 text-xs">Total</p>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
