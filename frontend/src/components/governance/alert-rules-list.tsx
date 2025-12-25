'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit2,
  Toggle2,
  Zap,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  governanceApi,
  AlertRule,
  AlertRuleTriggerType,
  AlertRuleCondition,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';

interface AlertRulesListProps {
  showDashboard?: boolean;
}

export const AlertRulesList: React.FC<AlertRulesListProps> = ({ showDashboard = false }) => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterTrigger, setFilterTrigger] = useState<AlertRuleTriggerType | ''>('');
  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any | null>(null);
  const [showTestDialog, setShowTestDialog] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['alertRules', page, limit, search, filterActive, filterTrigger],
    queryFn: async () => {
      return await governanceApi.getAlertRules({
        page,
        limit,
        search: search || undefined,
        is_active: filterActive === 'all' ? undefined : filterActive === 'active',
        trigger_type: filterTrigger || undefined,
      });
    },
    staleTime: 30000,
  });

  const handleToggleRule = async (id: string, isActive: boolean) => {
    try {
      await governanceApi.toggleAlertRule(id, !isActive);
      toast({
        title: isActive ? 'Rule disabled' : 'Rule enabled',
        description: `The alert rule has been ${isActive ? 'disabled' : 'enabled'}.`,
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to toggle rule',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert rule?')) return;
    try {
      await governanceApi.deleteAlertRule(id);
      toast({
        title: 'Rule deleted',
        description: 'The alert rule has been permanently deleted.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete rule',
        variant: 'destructive',
      });
    }
  };

  const handleTestRule = async (id: string) => {
    setTestingRuleId(id);
    try {
      const results = await governanceApi.testAlertRule(id);
      setTestResults(results);
      setShowTestDialog(true);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to test rule',
        variant: 'destructive',
      });
    } finally {
      setTestingRuleId(null);
    }
  };

  const getTriggerTypeLabel = (type: AlertRuleTriggerType | string) => {
    switch (type) {
      case AlertRuleTriggerType.TIME_BASED:
        return 'Time-based';
      case AlertRuleTriggerType.THRESHOLD_BASED:
        return 'Threshold-based';
      case AlertRuleTriggerType.STATUS_CHANGE:
        return 'Status Change';
      case AlertRuleTriggerType.CUSTOM_CONDITION:
        return 'Custom Condition';
      default:
        return type;
    }
  };

  const getConditionLabel = (condition: AlertRuleCondition | string) => {
    switch (condition) {
      case AlertRuleCondition.EQUALS:
        return 'Equals';
      case AlertRuleCondition.NOT_EQUALS:
        return 'Not Equals';
      case AlertRuleCondition.GREATER_THAN:
        return '> (Greater than)';
      case AlertRuleCondition.LESS_THAN:
        return '< (Less than)';
      case AlertRuleCondition.CONTAINS:
        return 'Contains';
      case AlertRuleCondition.NOT_CONTAINS:
        return 'Not Contains';
      case AlertRuleCondition.IS_NULL:
        return 'Is Null';
      case AlertRuleCondition.IS_NOT_NULL:
        return 'Is Not Null';
      case AlertRuleCondition.DAYS_OVERDUE:
        return 'Days Overdue';
      case AlertRuleCondition.STATUS_EQUALS:
        return 'Status Equals';
      default:
        return condition;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <p>Failed to load alert rules. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rules = data?.rules || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>
                {total} rule{total !== 1 ? 's' : ''} configured
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search rules..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9"
            />
            <Select
              value={filterActive}
              onValueChange={(value: any) => {
                setFilterActive(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All rules</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="inactive">Inactive only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterTrigger}
              onValueChange={(value) => {
                setFilterTrigger(value as AlertRuleTriggerType | '');
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All triggers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All trigger types</SelectItem>
                <SelectItem value={AlertRuleTriggerType.TIME_BASED}>Time-based</SelectItem>
                <SelectItem value={AlertRuleTriggerType.THRESHOLD_BASED}>Threshold-based</SelectItem>
                <SelectItem value={AlertRuleTriggerType.STATUS_CHANGE}>Status Change</SelectItem>
                <SelectItem value={AlertRuleTriggerType.CUSTOM_CONDITION}>Custom Condition</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(parseInt(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rules Table */}
          {rules.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">No alert rules configured yet</p>
              <Button className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create your first rule
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Trigger Type</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{rule.name}</p>
                            {rule.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {rule.description.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTriggerTypeLabel(rule.triggerType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs capitalize text-gray-600">
                            {rule.entityType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div>
                              {rule.fieldName && (
                                <p className="text-gray-600">Field: {rule.fieldName}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-600">
                                {getConditionLabel(rule.condition)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              rule.isActive
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }
                          >
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleRule(rule.id, rule.isActive)}
                              >
                                <Toggle2 className="mr-2 h-4 w-4" />
                                {rule.isActive ? 'Disable' : 'Enable'} Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTestRule(rule.id)}
                                disabled={testingRuleId === rule.id}
                              >
                                <Zap className="mr-2 h-4 w-4" />
                                Test Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Rule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages} ({total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Test Results Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rule Test Results</DialogTitle>
            <DialogDescription>
              Results from testing this alert rule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {testResults && (
              <>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Matched: {testResults.matched_count} record{testResults.matched_count !== 1 ? 's' : ''}
                  </p>
                </div>

                {testResults.sample_alerts && testResults.sample_alerts.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Sample Alerts ({testResults.sample_alerts.length})
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {testResults.sample_alerts.map((alert: any, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 border border-gray-200"
                        >
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-gray-600 mt-1">{alert.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <Button onClick={() => setShowTestDialog(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
