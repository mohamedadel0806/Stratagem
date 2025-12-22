'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Plus, Trash2, User, UserCheck, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SOPAssignmentDialogProps {
  sopId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SOPAssignmentDialog({ sopId, open, onOpenChange }: SOPAssignmentDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch users for assignment
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users', { limit: 100 }],
    queryFn: () => governanceApi.getUsers?.({ limit: 100 }),
  });

  // Fetch roles
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => governanceApi.getRoles?.(),
  });

  // Fetch current assignments
  const { data: assignments } = useQuery({
    queryKey: ['sop-assignments', sopId],
    queryFn: () => governanceApi.getSOPAssignments?.(sopId),
    enabled: open && !!sopId,
  });

  // Create assignment mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      return governanceApi.publishSOP(sopId, selectedUserIds, selectedRoleIds);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'SOP assignments created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-assignments', sopId] });
      setSelectedUserIds([]);
      setSelectedRoleIds([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create assignments',
        variant: 'destructive',
      });
    },
  });

  // Delete assignment mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteSOPAssignment?.(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Assignment removed successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-assignments', sopId] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete assignment',
        variant: 'destructive',
      });
    },
  });

  const handleAddUser = (userId: string) => {
    if (!selectedUserIds.includes(userId)) {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
  };

  const handleAddRole = (roleId: string) => {
    if (!selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  const handleRemoveRole = (roleId: string) => {
    setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage SOP Assignments</DialogTitle>
            <DialogDescription>
              Assign this SOP to users and roles for acknowledgment and compliance tracking
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Assignments */}
            {assignments && assignments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Current Assignments</h4>
                <div className="space-y-2">
                  {assignments.map((assignment: any) => (
                    <Card key={assignment.id}>
                      <CardContent className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {assignment.user ? (
                            <>
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {assignment.user.first_name} {assignment.user.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {assignment.user.email}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">{assignment.role_id}</p>
                            </>
                          )}

                          {assignment.acknowledged_at && (
                            <Badge className="ml-auto bg-green-100 text-green-800">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(assignment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* User Selection */}
            <div>
              <h4 className="font-semibold mb-3">Assign to Users</h4>
              <div className="space-y-2">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : users ? (
                  <>
                    <Select onValueChange={handleAddUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.first_name} {user.last_name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedUserIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedUserIds.map((userId) => {
                          const user = users.find((u: any) => u.id === userId);
                          return (
                            <Badge key={userId} variant="outline" className="gap-2">
                              <User className="h-3 w-3" />
                              {user?.first_name} {user?.last_name}
                              <button
                                onClick={() => handleRemoveUser(userId)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>

            {/* Role Selection */}
            {roles && (
              <div>
                <h4 className="font-semibold mb-3">Assign to Roles</h4>
                <div className="space-y-2">
                  <Select onValueChange={handleAddRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role: any) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedRoleIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRoleIds.map((roleId) => {
                        const role = roles.find((r: any) => r.id === roleId);
                        return (
                          <Badge key={roleId} variant="outline" className="gap-2">
                            <Users className="h-3 w-3" />
                            {role?.name}
                            <button
                              onClick={() => handleRemoveRole(roleId)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={
                  createMutation.isPending ||
                  (selectedUserIds.length === 0 && selectedRoleIds.length === 0)
                }
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Assignments
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this assignment? The user will no longer be required to acknowledge this SOP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remove
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SOPAssignmentDialog;
