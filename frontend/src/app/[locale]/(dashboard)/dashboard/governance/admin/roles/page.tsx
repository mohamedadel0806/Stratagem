'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, GovernanceRoleAssignment, AssignRoleData, BulkAssignRoleData } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users, Shield } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GovernanceRoleAssignmentForm } from '@/components/governance/governance-role-assignment-form';
import { Input } from '@/components/ui/input';

export default function GovernanceRolesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // This would typically fetch from a users API
  // For now, we'll show a placeholder
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['governance-role-assignments', selectedUserId],
    queryFn: async () => {
      if (selectedUserId) {
        return governanceApi.getUserRoleAssignments(selectedUserId);
      }
      return { data: [] };
    },
    enabled: !!selectedUserId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.removeRoleAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-role-assignments'] });
      toast({
        title: 'Success',
        description: 'Role assignment removed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove role assignment',
        variant: 'destructive',
      });
    },
  });

  const roleAssignments = assignments?.data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Manage role assignments for governance modules
          </p>
        </div>
        <Button onClick={() => setIsAssignOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Role Lookup</CardTitle>
          <CardDescription>
            Enter a user ID to view their role assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter user ID..."
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['governance-role-assignments', selectedUserId] })}>
              Search
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : selectedUserId && roleAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No role assignments found for this user</p>
            </div>
          ) : selectedUserId && roleAssignments.length > 0 ? (
            <div className="space-y-2">
              {roleAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{assignment.role}</Badge>
                        {assignment.business_unit && (
                          <Badge variant="outline">{assignment.business_unit.name}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                        {assignment.expires_at && (
                          <span className="ml-2">
                            • Expires: {new Date(assignment.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this role assignment?')) {
                        deleteMutation.mutate(assignment.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Enter a user ID to view role assignments</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a governance role to a user
            </DialogDescription>
          </DialogHeader>
          <GovernanceRoleAssignmentForm
            onSuccess={() => {
              setIsAssignOpen(false);
              queryClient.invalidateQueries({ queryKey: ['governance-role-assignments'] });
            }}
            onCancel={() => setIsAssignOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


