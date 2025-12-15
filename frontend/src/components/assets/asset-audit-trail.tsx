'use client';

import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, FileEdit, Plus, Trash2, Download, FileText } from 'lucide-react';
import { generateAuditTrailPDF } from '@/lib/utils/pdf-export';
import { useState, useCallback, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

interface AssetAuditTrailProps {
  assetType: AssetType;
  assetId: string;
}

interface AuditLog {
  id: string;
  assetType: string;
  assetId: string;
  action: 'create' | 'update' | 'delete';
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  changedBy?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  changeReason?: string;
  createdAt: string;
}

export function AssetAuditTrail({ assetType, assetId }: AssetAuditTrailProps) {
  const { toast } = useToast();
  const [actionFilter, setActionFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['asset-audit-trail', assetType, assetId, actionFilter, page],
    queryFn: async () => {
      const params: any = { page, limit };
      if (actionFilter && actionFilter !== 'all') {
        params.action = actionFilter;
      }
      return assetsApi.getAssetAuditTrail(assetType, assetId, params);
    },
    enabled: !!assetId && assetId.length > 0,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Export to CSV
  const exportToCSV = useCallback(async () => {
    if (!data?.data || data.data.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no audit logs to export.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch all audit logs for export (not just current page)
      const allData = await assetsApi.getAssetAuditTrail(assetType, assetId, { 
        page: 1, 
        limit: 1000,
        ...(actionFilter && actionFilter !== 'all' ? { action: actionFilter } : {})
      });

      const logs = allData.data as AuditLog[];
      
      // CSV headers
      const headers = [
        'Date/Time',
        'Action',
        'Field Name',
        'Old Value',
        'New Value',
        'Changed By',
        'Change Reason',
      ];

      // CSV rows
      const rows = logs.map((log) => [
        new Date(log.createdAt).toISOString(),
        log.action,
        log.fieldName || '',
        log.oldValue || '',
        log.newValue || '',
        getUserName(log.changedBy),
        log.changeReason || '',
      ]);

      // Escape CSV values
      const escapeCSV = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      // Build CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map(escapeCSV).join(',')),
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit-trail-${assetType}-${assetId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export successful',
        description: `Exported ${logs.length} audit log entries to CSV.`,
      });
    } catch (err) {
      toast({
        title: 'Export failed',
        description: 'Failed to export audit logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [assetType, assetId, actionFilter, data, toast]);

  // Export to PDF
  const exportToPDF = useCallback(async () => {
    if (!data?.data || data.data.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no audit logs to export.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch all audit logs for export
      const allData = await assetsApi.getAssetAuditTrail(assetType, assetId, { 
        page: 1, 
        limit: 1000,
        ...(actionFilter && actionFilter !== 'all' ? { action: actionFilter } : {})
      });

      const logs = allData.data as AuditLog[];
      generateAuditTrailPDF(logs, `Asset ${assetId.substring(0, 8)}`, assetType);

      toast({
        title: 'Export successful',
        description: `Exported ${logs.length} audit log entries to PDF.`,
      });
    } catch (err) {
      toast({
        title: 'Export failed',
        description: 'Failed to export audit logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [assetType, assetId, actionFilter, data, toast]);

  // Export to JSON
  const exportToJSON = useCallback(async () => {
    if (!data?.data || data.data.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no audit logs to export.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch all audit logs for export
      const allData = await assetsApi.getAssetAuditTrail(assetType, assetId, { 
        page: 1, 
        limit: 1000,
        ...(actionFilter && actionFilter !== 'all' ? { action: actionFilter } : {})
      });

      const exportData = {
        assetType,
        assetId,
        exportDate: new Date().toISOString(),
        totalRecords: allData.data.length,
        auditLogs: allData.data.map((log: AuditLog) => ({
          timestamp: log.createdAt,
          action: log.action,
          fieldName: log.fieldName,
          oldValue: log.oldValue,
          newValue: log.newValue,
          changedBy: getUserName(log.changedBy),
          changeReason: log.changeReason,
        })),
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit-trail-${assetType}-${assetId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export successful',
        description: `Exported ${allData.data.length} audit log entries to JSON.`,
      });
    } catch (err) {
      toast({
        title: 'Export failed',
        description: 'Failed to export audit logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [assetType, assetId, actionFilter, data, toast]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'update':
        return <FileEdit className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create':
        return 'Created';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      default:
        return action;
    }
  };

  const formatValue = (value?: string) => {
    if (!value) return 'N/A';
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2);
      }
      return String(parsed);
    } catch {
      return value;
    }
  };

  const getUserName = (user?: { email: string; firstName?: string; lastName?: string }) => {
    if (!user) return 'System';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Audit Trail</h3>
          <p className="text-sm text-muted-foreground">
            Complete history of all changes made to this asset
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="action-filter" className="text-sm">
              Filter:
            </Label>
            <Select value={actionFilter || 'all'} onValueChange={setActionFilter}>
              <SelectTrigger id="action-filter" className="w-40">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Created</SelectItem>
                <SelectItem value="update">Updated</SelectItem>
                <SelectItem value="delete">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Only render dropdown on client to avoid hydration mismatch */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting || !data?.data?.length}>
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* Fallback button on server */}
          {!mounted && (
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading audit trail...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading audit trail. Please try again.</p>
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
              <p>Error: {error?.message || 'Unknown error'}</p>
              <p>Status: {error?.response?.status}</p>
              {error?.response?.data && (
                <details>
                  <summary className="cursor-pointer">Response details</summary>
                  <pre className="text-xs mt-2 whitespace-pre-wrap">
                    {JSON.stringify(error.response.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data && (
        <>
          {data.data.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No audit logs found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {data.data.map((log: AuditLog) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getActionColor(log.action)}>
                            <span className="flex items-center gap-1">
                              {getActionIcon(log.action)}
                              {getActionLabel(log.action)}
                            </span>
                          </Badge>
                          {log.fieldName && (
                            <Badge variant="outline">Field: {log.fieldName}</Badge>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{getUserName(log.changedBy)}</span>
                        </div>

                        {log.action === 'update' && log.fieldName && (
                          <div className="mt-3 p-3 bg-muted rounded-lg space-y-2">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Old Value:
                              </span>
                              <p className="text-sm mt-1 break-words">{formatValue(log.oldValue)}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                New Value:
                              </span>
                              <p className="text-sm mt-1 break-words">{formatValue(log.newValue)}</p>
                            </div>
                          </div>
                        )}

                        {log.changeReason && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Reason:
                            </span>
                            <p className="text-sm mt-1">{log.changeReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination info */}
          {data.total > limit && (
            <div className="text-sm text-muted-foreground text-center">
              Showing {data.data.length} of {data.total} audit logs
              {data.total > limit && (
                <span className="ml-2">
                  (Page {page} of {Math.ceil(data.total / limit)})
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

