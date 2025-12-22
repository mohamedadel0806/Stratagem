'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardEmailApi, DashboardEmailSchedule, CreateDashboardEmailScheduleData } from '@/lib/api/governance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Send, ToggleLeft, ToggleRight, Clock, Mail } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const;

export function DashboardEmailSchedules() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DashboardEmailSchedule | null>(null);
  const [formData, setFormData] = useState<Partial<CreateDashboardEmailScheduleData>>({
    frequency: 'daily',
    sendTime: '09:00',
    recipientEmails: [],
    isActive: true,
  });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['dashboard-email-schedules'],
    queryFn: () => dashboardEmailApi.getAllSchedules(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDashboardEmailScheduleData) => dashboardEmailApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-email-schedules'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Dashboard email schedule created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create schedule',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dashboardEmailApi.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-email-schedules'] });
      setEditingSchedule(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Dashboard email schedule updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update schedule',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dashboardEmailApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-email-schedules'] });
      toast({
        title: 'Success',
        description: 'Dashboard email schedule deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete schedule',
        variant: 'destructive',
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => dashboardEmailApi.toggleScheduleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-email-schedules'] });
      toast({
        title: 'Success',
        description: 'Schedule status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update schedule status',
        variant: 'destructive',
      });
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: (id: string) => dashboardEmailApi.sendTestEmail(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Test email sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send test email',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      frequency: 'daily',
      sendTime: '09:00',
      recipientEmails: [],
      isActive: true,
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.sendTime || !formData.recipientEmails?.length) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(formData as CreateDashboardEmailScheduleData);
  };

  const handleUpdate = () => {
    if (!editingSchedule || !formData.name || !formData.sendTime || !formData.recipientEmails?.length) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    updateMutation.mutate({ id: editingSchedule.id, data: formData });
  };

  const handleEdit = (schedule: DashboardEmailSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name,
      description: schedule.description,
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek,
      dayOfMonth: schedule.dayOfMonth,
      sendTime: schedule.sendTime,
      recipientEmails: [...schedule.recipientEmails],
      isActive: schedule.isActive,
    });
  };

  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      recipientEmails: [...(prev.recipientEmails || []), ''],
    }));
  };

  const updateEmail = (index: number, email: string) => {
    setFormData(prev => ({
      ...prev,
      recipientEmails: prev.recipientEmails?.map((e, i) => i === index ? email : e) || [],
    }));
  };

  const removeEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipientEmails: prev.recipientEmails?.filter((_, i) => i !== index) || [],
    }));
  };

  const getFrequencyLabel = (frequency: string, dayOfWeek?: string, dayOfMonth?: number) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return `Weekly (${dayOfWeek})`;
      case 'monthly':
        return `Monthly (Day ${dayOfMonth})`;
      default:
        return frequency;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Email Schedules</h2>
          <p className="text-muted-foreground">Manage automated governance dashboard email reports</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Schedule Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Weekly Governance Report"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week *</Label>
                  <Select
                    value={formData.dayOfWeek}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.frequency === 'monthly' && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfMonth">Day of Month *</Label>
                  <Input
                    id="dayOfMonth"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                    placeholder="15"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sendTime">Send Time *</Label>
                  <Input
                    id="sendTime"
                    type="time"
                    value={formData.sendTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, sendTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Active</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      checked={formData.isActive ?? true}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.isActive ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description for this email schedule"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Recipient Emails *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addEmail}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Email
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.recipientEmails?.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder="email@example.com"
                        type="email"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmail(index)}
                        disabled={formData.recipientEmails?.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Schedule'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-sm text-muted-foreground">Loading schedules...</span>
            </div>
          ) : schedules?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Mail className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No email schedules configured</p>
              <p className="text-xs text-muted-foreground">Create your first schedule to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Send Time</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules?.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{schedule.name}</p>
                        {schedule.description && (
                          <p className="text-sm text-muted-foreground">{schedule.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getFrequencyLabel(schedule.frequency, schedule.dayOfWeek, schedule.dayOfMonth)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {schedule.sendTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {schedule.recipientEmails.length} recipient{schedule.recipientEmails.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {schedule.lastSentAt ? (
                        <span className="text-sm text-muted-foreground">
                          {new Date(schedule.lastSentAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMutation.mutate(schedule.id)}
                          disabled={toggleMutation.isPending}
                        >
                          {schedule.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testEmailMutation.mutate(schedule.id)}
                          disabled={testEmailMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(schedule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Email Schedule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the schedule "{schedule.name}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(schedule.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSchedule} onOpenChange={(open) => !open && setEditingSchedule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Email Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Schedule Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Weekly Governance Report"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-frequency">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.frequency === 'weekly' && (
              <div className="space-y-2">
                <Label htmlFor="edit-dayOfWeek">Day of Week *</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map(day => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.frequency === 'monthly' && (
              <div className="space-y-2">
                <Label htmlFor="edit-dayOfMonth">Day of Month *</Label>
                <Input
                  id="edit-dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dayOfMonth || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                  placeholder="15"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sendTime">Send Time *</Label>
                <Input
                  id="edit-sendTime"
                  type="time"
                  value={formData.sendTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, sendTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.isActive ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this email schedule"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Recipient Emails *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEmail}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Email
                </Button>
              </div>
              <div className="space-y-2">
                {formData.recipientEmails?.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="email@example.com"
                      type="email"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmail(index)}
                      disabled={formData.recipientEmails?.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingSchedule(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Schedule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}