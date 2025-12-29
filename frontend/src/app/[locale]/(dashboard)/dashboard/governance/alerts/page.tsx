'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  Alert,
  AlertSeverity,
  AlertStatus,
  AlertType,
  AlertRule,
  AlertSubscription,
  CreateAlertDto,
  CreateAlertRuleDto,
  CreateAlertSubscriptionDto
} from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Bell,
  BellOff,
  Filter,
  Search,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const severityLabels: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: 'Low',
  [AlertSeverity.MEDIUM]: 'Medium',
  [AlertSeverity.HIGH]: 'High',
  [AlertSeverity.CRITICAL]: 'Critical',
};

const severityColors: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: 'bg-blue-100 text-blue-800 border-blue-200',
  [AlertSeverity.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [AlertSeverity.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
  [AlertSeverity.CRITICAL]: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels: Record<AlertStatus, string> = {
  [AlertStatus.ACTIVE]: 'Active',
  [AlertStatus.ACKNOWLEDGED]: 'Acknowledged',
  [AlertStatus.RESOLVED]: 'Resolved',
  [AlertStatus.DISMISSED]: 'Dismissed',
};

const typeLabels: Record<AlertType, string> = {
  [AlertType.POLICY_REVIEW_OVERDUE]: 'Policy Review Overdue',
  [AlertType.CONTROL_ASSESSMENT_PAST_DUE]: 'Control Assessment Past Due',
  [AlertType.SOP_EXECUTION_FAILURE]: 'SOP Execution Failure',
  [AlertType.AUDIT_FINDING]: 'Audit Finding',
  [AlertType.COMPLIANCE_VIOLATION]: 'Compliance Violation',
  [AlertType.RISK_THRESHOLD_EXCEEDED]: 'Risk Threshold Exceeded',
  [AlertType.CUSTOM]: 'Custom',
};

export default function AlertsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'subscriptions'>('alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');

  // Dialog states
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);
  const [isCreateSubscriptionOpen, setIsCreateSubscriptionOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<AlertSubscription | null>(null);
  const [resolveDialog, setResolveDialog] = useState<{ alert: Alert; isOpen: boolean }>({ alert: {} as Alert, isOpen: false });
  const [deleteDialog, setDeleteDialog] = useState<{ item: AlertRule | AlertSubscription; type: 'rule' | 'subscription'; isOpen: boolean }>({
    item: {} as AlertRule,
    type: 'rule',
    isOpen: false
  });

  // Form states
  const [newAlert, setNewAlert] = useState<Partial<CreateAlertDto>>({
    type: AlertType.CUSTOM,
    severity: AlertSeverity.MEDIUM
  });
  const [newRule, setNewRule] = useState<Partial<CreateAlertRuleDto>>({
    triggerType: 'time_based' as any,
    condition: 'days_overdue' as any,
    severityScore: 2,
    isActive: true
  });
  const [newSubscription, setNewSubscription] = useState<Partial<CreateAlertSubscriptionDto>>({
    notificationChannel: 'in_app' as any,
    frequency: 'immediate' as any
  });
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Queries
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', statusFilter, severityFilter, typeFilter, searchQuery],
    queryFn: () => governanceApi.getAlerts(
      statusFilter === 'all' ? undefined : statusFilter,
      severityFilter === 'all' ? undefined : severityFilter,
      50,
      0
    ),
  });

  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['alert-rules'],
    queryFn: () => governanceApi.getAlertRules(),
  });

  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['alert-subscriptions'],
    queryFn: () => governanceApi.getAlertSubscriptions(),
  });

  // Mutations
  const createAlertMutation = useMutation({
    mutationFn: (data: CreateAlertDto) => governanceApi.createAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setIsCreateAlertOpen(false);
      setNewAlert({ type: AlertType.CUSTOM, severity: AlertSeverity.MEDIUM });
      toast({ title: 'Success', description: 'Alert created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create alert',
        variant: 'destructive'
      });
    },
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: (id: string) => governanceApi.acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({ title: 'Success', description: 'Alert acknowledged' });
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      governanceApi.resolveAlert(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setResolveDialog({ alert: {} as Alert, isOpen: false });
      setResolutionNotes('');
      toast({ title: 'Success', description: 'Alert resolved' });
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: (data: CreateAlertRuleDto) => governanceApi.createAlertRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
      setIsCreateRuleOpen(false);
      setNewRule({ triggerType: 'time_based' as any, condition: 'days_overdue' as any, severityScore: 2 });
      toast({ title: 'Success', description: 'Alert rule created successfully' });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAlertRuleDto> }) =>
      governanceApi.updateAlertRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
      setEditingRule(null);
      toast({ title: 'Success', description: 'Alert rule updated' });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteAlertRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
      setDeleteDialog({ item: {} as AlertRule, type: 'rule', isOpen: false });
      toast({ title: 'Success', description: 'Alert rule deleted' });
    },
  });

  const triggerRuleMutation = useMutation({
    mutationFn: (id: string) => governanceApi.triggerAlertRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({ title: 'Success', description: 'Alert rule triggered. Check dashboard for updates.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to trigger rule',
        variant: 'destructive'
      });
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: (data: CreateAlertSubscriptionDto) => governanceApi.createAlertSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-subscriptions'] });
      setIsCreateSubscriptionOpen(false);
      setNewSubscription({ notificationChannel: 'in_app' as any, frequency: 'immediate' as any });
      toast({ title: 'Success', description: 'Alert subscription created successfully' });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAlertSubscriptionDto> }) =>
      governanceApi.updateAlertSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-subscriptions'] });
      setEditingSubscription(null);
      toast({ title: 'Success', description: 'Alert subscription updated' });
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteAlertSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-subscriptions'] });
      setDeleteDialog({ item: {} as AlertSubscription, type: 'subscription', isOpen: false });
      toast({ title: 'Success', description: 'Alert subscription deleted' });
    },
  });

  const filteredAlerts = useMemo(() => {
    if (!alertsData?.alerts) return [];
    return alertsData.alerts.filter(alert => {
      const matchesSearch = !searchQuery ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [alertsData, searchQuery]);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
      case AlertSeverity.HIGH:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case AlertSeverity.MEDIUM:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case AlertSeverity.LOW:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return <Bell className="h-4 w-4 text-red-500" />;
      case AlertStatus.ACKNOWLEDGED:
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case AlertStatus.RESOLVED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case AlertStatus.DISMISSED:
        return <BellOff className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage governance alerts and notifications
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>
                    {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setIsCreateAlertOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AlertStatus || 'all')}>
                    <SelectTrigger className="w-40" aria-label="Status Filter">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as AlertSeverity || 'all')}>
                    <SelectTrigger className="w-40" aria-label="Severity Filter">
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      {Object.entries(severityLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as AlertType || 'all')}>
                    <SelectTrigger className="w-48" aria-label="Type Filter">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Alerts List */}
                {alertsLoading ? (
                  <div className="text-center py-8">Loading alerts...</div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No alerts found</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="alerts-list">
                    {filteredAlerts.map((alert) => (
                      <Card key={alert.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getSeverityIcon(alert.severity)}
                                <h3 className="font-semibold">{alert.title}</h3>
                                <Badge className={severityColors[alert.severity]}>
                                  {severityLabels[alert.severity]}
                                </Badge>
                                <Badge variant="outline">
                                  {typeLabels[alert.type]}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(alert.status)}
                                  <span className="text-sm text-muted-foreground">
                                    {statusLabels[alert.status]}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                                {alert.acknowledgedAt && (
                                  <span>Acknowledged: {new Date(alert.acknowledgedAt).toLocaleDateString()}</span>
                                )}
                                {alert.resolvedAt && (
                                  <span>Resolved: {new Date(alert.resolvedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {alert.status === AlertStatus.ACTIVE && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => acknowledgeAlertMutation.mutate(alert.id)}
                                  disabled={acknowledgeAlertMutation.isPending}
                                  data-testid={`acknowledge-alert-${alert.id}`}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Acknowledge
                                </Button>
                              )}
                              {(alert.status === AlertStatus.ACTIVE || alert.status === AlertStatus.ACKNOWLEDGED) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setResolveDialog({ alert, isOpen: true })}
                                  data-testid={`resolve-alert-${alert.id}`}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alert Rules</CardTitle>
                  <CardDescription>
                    Configure automated alert generation rules
                  </CardDescription>
                </div>
                <Button onClick={() => setIsCreateRuleOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="text-center py-8">Loading rules...</div>
              ) : !rulesData?.rules.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alert rules configured</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsCreateRuleOpen(true)}
                  >
                    Create First Rule
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rulesData.rules.map((rule) => (
                    <Card key={rule.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{rule.name}</h3>
                              <Badge variant={rule.isActive ? "default" : "secondary"}>
                                {rule.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {rule.description && (
                              <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                            )}
                            <div className="text-xs text-muted-foreground">
                              <span>Entity: {rule.entityType}</span>
                              {rule.fieldName && <span> • Field: {rule.fieldName}</span>}
                              <span> • Condition: {rule.condition}</span>
                              {rule.conditionValue && <span> • Value: {rule.conditionValue}</span>}
                              <span> • Severity Score: {rule.severityScore}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => triggerRuleMutation.mutate(rule.id)} data-testid={`trigger-rule-${rule.id}`}>
                              Trigger Rule
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingRule(rule)} data-testid={`edit-rule-${rule.id}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteDialog({ isOpen: true, type: 'rule', item: rule })} data-testid={`delete-rule-${rule.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alert Subscriptions</CardTitle>
                  <CardDescription>
                    Manage notification preferences and subscriptions
                  </CardDescription>
                </div>
                <Button onClick={() => setIsCreateSubscriptionOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subscriptionsLoading ? (
                <div className="text-center py-8">Loading subscriptions...</div>
              ) : !subscriptionsData?.subscriptions.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alert subscriptions configured</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsCreateSubscriptionOpen(true)}
                  >
                    Create First Subscription
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptionsData.subscriptions.map((subscription) => (
                    <Card key={subscription.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="h-4 w-4" />
                              <span className="font-medium">
                                {subscription.user?.first_name} {subscription.user?.last_name}
                              </span>
                              <Badge variant={subscription.isActive ? "default" : "secondary"}>
                                {subscription.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span>Channel: {subscription.notificationChannel}</span>
                              <span> • Frequency: {subscription.frequency}</span>
                              {subscription.alertType && <span> • Type: {typeLabels[subscription.alertType]}</span>}
                              {subscription.severity && <span> • Severity: {severityLabels[subscription.severity]}</span>}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setEditingSubscription(subscription)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateSubscriptionMutation.mutate({
                                  id: subscription.id,
                                  data: { ...subscription, isActive: !subscription.isActive }
                                })}
                              >
                                {subscription.isActive ? <BellOff className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                                {subscription.isActive ? 'Disable' : 'Enable'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteDialog({ item: subscription, type: 'subscription', isOpen: true })}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Alert Dialog */}
      <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Alert</DialogTitle>
            <DialogDescription>
              Create a new alert to notify stakeholders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alert-title">Title</Label>
              <Input
                id="alert-title"
                value={newAlert.title || ''}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                placeholder="Alert title"
              />
            </div>
            <div>
              <Label htmlFor="alert-description">Alert Message</Label>
              <Textarea
                id="alert-description"
                value={newAlert.description || ''}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                placeholder="Alert description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alert-type">Type</Label>
                <Select
                  value={newAlert.type}
                  onValueChange={(value) => setNewAlert({ ...newAlert, type: value as AlertType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="alert-severity">Severity</Label>
                <Select
                  value={newAlert.severity}
                  onValueChange={(value) => setNewAlert({ ...newAlert, severity: value as AlertSeverity })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(severityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createAlertMutation.mutate(newAlert as CreateAlertDto)}
                disabled={createAlertMutation.isPending || !newAlert.title || !newAlert.description}
              >
                Create Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Rule Dialog */}
      <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Alert Rule' : 'Create Alert Rule'}</DialogTitle>
            <DialogDescription>
              Configure automated alert generation based on governance conditions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  value={editingRule?.name || newRule.name || ''}
                  onChange={(e) => editingRule
                    ? setEditingRule({ ...editingRule, name: e.target.value })
                    : setNewRule({ ...newRule, name: e.target.value })
                  }
                  placeholder="Rule name"
                />
              </div>
              <div>
                <Label htmlFor="rule-entity-type">Entity Type</Label>
                <Select
                  value={editingRule?.entityType || newRule.entityType || 'all'}
                  onValueChange={(value) => editingRule
                    ? setEditingRule({ ...editingRule, entityType: value })
                    : setNewRule({ ...newRule, entityType: value })
                  }
                >
                  <SelectTrigger id="rule-entity-type">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select entity type</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="control">Control</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="sop">SOP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="rule-description">Description</Label>
              <Textarea
                id="rule-description"
                value={editingRule?.description || newRule.description || ''}
                onChange={(e) => editingRule
                  ? setEditingRule({ ...editingRule, description: e.target.value })
                  : setNewRule({ ...newRule, description: e.target.value })
                }
                placeholder="Rule description"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rule-trigger-type">Trigger Type</Label>
                <Select
                  value={editingRule?.triggerType || newRule.triggerType || 'all'}
                  onValueChange={(value) => editingRule
                    ? setEditingRule({ ...editingRule, triggerType: value as any })
                    : setNewRule({ ...newRule, triggerType: value as any })
                  }
                >
                  <SelectTrigger data-testid="alert-rule-trigger-type-dropdown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time_based">Time Based</SelectItem>
                    <SelectItem value="threshold_based">Threshold Based</SelectItem>
                    <SelectItem value="status_change">Status Change</SelectItem>
                    <SelectItem value="custom_condition">Custom Condition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-alert-type">Alert Type</Label>
                <Select
                  value={editingRule?.filters?.alertType || newRule.filters?.alertType || 'all'}
                  onValueChange={(value) => {
                    const filters = editingRule?.filters || newRule.filters || {};
                    const val = value === 'all' ? undefined : value;
                    if (editingRule) {
                      setEditingRule({ ...editingRule, filters: { ...filters, alertType: val } });
                    } else {
                      setNewRule({ ...newRule, filters: { ...filters, alertType: val } });
                    }
                  }}
                >
                  <SelectTrigger data-testid="alert-rule-alert-type-dropdown">
                    <SelectValue placeholder="Alert Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-alert-severity">Severity</Label>
                <Select
                  value={editingRule?.filters?.severity || newRule.filters?.severity || 'all'}
                  onValueChange={(value) => {
                    const filters = editingRule?.filters || newRule.filters || {};
                    const val = value === 'all' ? undefined : value;
                    const scoreMap: Record<string, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
                    const score = scoreMap[value] || 2;
                    if (editingRule) {
                      setEditingRule({
                        ...editingRule,
                        severityScore: score,
                        filters: { ...filters, severity: val }
                      });
                    } else {
                      setNewRule({
                        ...newRule,
                        severityScore: score,
                        filters: { ...filters, severity: val }
                      });
                    }
                  }}
                >
                  <SelectTrigger data-testid="alert-rule-severity-dropdown">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(severityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-condition">Condition</Label>
                <Select
                  value={editingRule?.condition || newRule.condition || 'all'}
                  onValueChange={(value) => editingRule
                    ? setEditingRule({ ...editingRule, condition: value as any })
                    : setNewRule({ ...newRule, condition: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="not_contains">Not Contains</SelectItem>
                    <SelectItem value="is_null">Is Null</SelectItem>
                    <SelectItem value="is_not_null">Is Not Null</SelectItem>
                    <SelectItem value="days_overdue">Days Overdue</SelectItem>
                    <SelectItem value="status_equals">Status Equals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-severity-score">Severity Score</Label>
                <Input
                  id="rule-severity-score"
                  type="number"
                  min="1"
                  max="4"
                  value={editingRule?.severityScore || newRule.severityScore || 2}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    editingRule
                      ? setEditingRule({ ...editingRule, severityScore: value })
                      : setNewRule({ ...newRule, severityScore: value });
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-field-name">Field Name</Label>
                <Input
                  id="rule-field-name"
                  value={editingRule?.fieldName || newRule.fieldName || ''}
                  onChange={(e) => editingRule
                    ? setEditingRule({ ...editingRule, fieldName: e.target.value })
                    : setNewRule({ ...newRule, fieldName: e.target.value })
                  }
                  placeholder="Field to check"
                />
              </div>
              <div>
                <Label htmlFor="rule-condition-value">Condition Value</Label>
                <Input
                  id="rule-condition-value"
                  value={editingRule?.conditionValue || newRule.conditionValue || ''}
                  onChange={(e) => editingRule
                    ? setEditingRule({ ...editingRule, conditionValue: e.target.value })
                    : setNewRule({ ...newRule, conditionValue: e.target.value })
                  }
                  placeholder="Value to compare"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="rule-alert-message">Alert Message</Label>
              <Textarea
                id="rule-alert-message"
                value={editingRule?.alertMessage || newRule.alertMessage || ''}
                onChange={(e) => editingRule
                  ? setEditingRule({ ...editingRule, alertMessage: e.target.value })
                  : setNewRule({ ...newRule, alertMessage: e.target.value })
                }
                placeholder="Custom alert message template"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateRuleOpen(false);
                  setEditingRule(null);
                  setNewRule({ triggerType: 'time_based' as any, condition: 'days_overdue' as any, severityScore: 2, isActive: true });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const data = editingRule || newRule;
                  if (editingRule) {
                    updateRuleMutation.mutate({ id: editingRule.id, data: data as CreateAlertRuleDto });
                  } else {
                    createRuleMutation.mutate(data as CreateAlertRuleDto);
                  }
                }}
                disabled={createRuleMutation.isPending || updateRuleMutation.isPending || (!editingRule && !newRule.name)}
              >
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Subscription Dialog */}
      <Dialog open={isCreateSubscriptionOpen} onOpenChange={setIsCreateSubscriptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubscription ? 'Edit Subscription' : 'Create Alert Subscription'}</DialogTitle>
            <DialogDescription>
              Configure how you receive alert notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subscription-channel">Notification Channel</Label>
                <Select
                  value={editingSubscription?.notificationChannel || newSubscription.notificationChannel || 'in_app'}
                  onValueChange={(value) => editingSubscription
                    ? setEditingSubscription({ ...editingSubscription, notificationChannel: value as any })
                    : setNewSubscription({ ...newSubscription, notificationChannel: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in_app">In App</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subscription-frequency">Frequency</Label>
                <Select
                  value={editingSubscription?.frequency || newSubscription.frequency || 'immediate'}
                  onValueChange={(value) => editingSubscription
                    ? setEditingSubscription({ ...editingSubscription, frequency: value as any })
                    : setNewSubscription({ ...newSubscription, frequency: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subscription-alert-type">Alert Type</Label>
                <Select
                  value={editingSubscription?.alertType || newSubscription.alertType || 'all'}
                  onValueChange={(value) => {
                    const val = value === 'all' ? undefined : value as AlertType;
                    editingSubscription
                      ? setEditingSubscription({ ...editingSubscription, alertType: val })
                      : setNewSubscription({ ...newSubscription, alertType: val })
                  }}
                >
                  <SelectTrigger data-testid="alert-subscription-type-dropdown" id="subscription-alert-type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subscription-severity">Severity</Label>
                <Select
                  value={editingSubscription?.severity || newSubscription.severity || 'all'}
                  onValueChange={(value) => {
                    const val = value === 'all' ? undefined : value as AlertSeverity;
                    editingSubscription
                      ? setEditingSubscription({ ...editingSubscription, severity: val })
                      : setNewSubscription({ ...newSubscription, severity: val })
                  }}
                >
                  <SelectTrigger data-testid="alert-subscription-severity-dropdown" id="subscription-severity">
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    {Object.entries(severityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateSubscriptionOpen(false);
                  setEditingSubscription(null);
                  setNewSubscription({ notificationChannel: 'in_app' as any, frequency: 'immediate' as any });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const data = editingSubscription || newSubscription;
                  if (editingSubscription) {
                    updateSubscriptionMutation.mutate({ id: editingSubscription.id, data: data as CreateAlertSubscriptionDto });
                  } else {
                    createSubscriptionMutation.mutate(data as CreateAlertSubscriptionDto);
                  }
                }}
              >
                {editingSubscription ? 'Update Subscription' : 'Create Subscription'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resolve Alert Dialog */}
      <Dialog open={resolveDialog.isOpen} onOpenChange={(open) => setResolveDialog({ ...resolveDialog, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Provide resolution notes for this alert
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe how this alert was resolved"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResolveDialog({ alert: {} as Alert, isOpen: false })}>
                Cancel
              </Button>
              <Button
                onClick={() => resolveAlertMutation.mutate({ id: resolveDialog.alert.id, resolution: resolutionNotes })}
                disabled={resolveAlertMutation.isPending || !resolutionNotes.trim()}
                data-testid="confirm-resolve-alert"
              >
                Resolve Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteDialog.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => {
              if (deleteDialog.type === 'rule') {
                deleteRuleMutation.mutate((deleteDialog.item as AlertRule).id);
              } else {
                deleteSubscriptionMutation.mutate((deleteDialog.item as AlertSubscription).id);
              }
            }}
          >
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}