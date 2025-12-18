'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Policy, PolicyStatus } from '@/lib/api/governance';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';

interface PolicyPublishDialogProps {
  policy: Policy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PolicyPublishDialog({ policy, open, onOpenChange, onSuccess }: PolicyPublishDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [assignToUserIds, setAssignToUserIds] = useState<string[]>([]);
  const [assignToRoleIds, setAssignToRoleIds] = useState<string[]>([]);
  const [assignToBusinessUnitIds, setAssignToBusinessUnitIds] = useState<string[]>([]);
  const [notificationMessage, setNotificationMessage] = useState('');

  const publishMutation = useMutation({
    mutationFn: () =>
      governanceApi.publishPolicy(
        policy.id,
        assignToUserIds.length > 0 ? assignToUserIds : undefined,
        assignToRoleIds.length > 0 ? assignToRoleIds : undefined,
        assignToBusinessUnitIds.length > 0 ? assignToBusinessUnitIds : undefined,
        notificationMessage || undefined,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast({
        title: 'Success',
        description: 'Policy published and assigned successfully',
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to publish policy',
        variant: 'destructive',
      });
    },
  });

  const handlePublish = () => {
    if (
      assignToUserIds.length === 0 &&
      assignToRoleIds.length === 0 &&
      assignToBusinessUnitIds.length === 0
    ) {
      toast({
        title: 'Warning',
        description: 'Please assign the policy to at least one user, role, or business unit',
        variant: 'destructive',
      });
      return;
    }

    publishMutation.mutate();
  };

  // Role options (from UserRole enum)
  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'compliance_officer', label: 'Compliance Officer' },
    { value: 'risk_manager', label: 'Risk Manager' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'user', label: 'User' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish Policy</DialogTitle>
          <DialogDescription>
            Publish "{policy.title}" and assign it to users, roles, or business units
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="assign-roles">Assign to Roles (Optional)</Label>
            <MultiSelect
              options={roleOptions}
              selected={assignToRoleIds}
              onChange={setAssignToRoleIds}
              placeholder="Select roles..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              All users with selected roles will receive this policy
            </p>
          </div>

          <div>
            <Label htmlFor="assign-business-units">Assign to Business Units (Optional)</Label>
            <MultiSelect
              options={[]} // Would need to fetch from API
              selected={assignToBusinessUnitIds}
              onChange={setAssignToBusinessUnitIds}
              placeholder="Select business units..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              All users in selected business units will receive this policy
            </p>
          </div>

          <div>
            <Label htmlFor="assign-users">Assign to Specific Users (Optional)</Label>
            <MultiSelect
              options={[]} // Would need to fetch from API
              selected={assignToUserIds}
              onChange={setAssignToUserIds}
              placeholder="Select users..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Selected users will receive this policy
            </p>
          </div>

          <div>
            <Label htmlFor="notification-message">Notification Message (Optional)</Label>
            <Textarea
              id="notification-message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Custom message to include in the notification email..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={publishMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={publishMutation.isPending}>
            {publishMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish & Notify'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
