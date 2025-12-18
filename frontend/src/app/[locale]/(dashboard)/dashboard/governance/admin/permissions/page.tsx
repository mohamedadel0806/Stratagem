'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, GovernancePermission, GovernanceModule, GovernanceAction, CreateGovernancePermissionData } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Shield, Users, TestTube, UserPlus, X, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GovernancePermissionForm } from '@/components/governance/governance-permission-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usersApi, User } from '@/lib/api/users';
import { governanceApi, UserPermissionTestResult, AssignRoleData } from '@/lib/api/governance';
import { Loader2 } from 'lucide-react';

const moduleLabels: Record<GovernanceModule, string> = {
  [GovernanceModule.INFLUENCERS]: 'Influencers',
  [GovernanceModule.POLICIES]: 'Policies',
  [GovernanceModule.STANDARDS]: 'Standards',
  [GovernanceModule.CONTROLS]: 'Controls',
  [GovernanceModule.ASSESSMENTS]: 'Assessments',
  [GovernanceModule.EVIDENCE]: 'Evidence',
  [GovernanceModule.FINDINGS]: 'Findings',
  [GovernanceModule.SOPS]: 'SOPs',
  [GovernanceModule.REPORTING]: 'Reporting',
  [GovernanceModule.ADMIN]: 'Admin',
};

const actionLabels: Record<GovernanceAction, string> = {
  [GovernanceAction.CREATE]: 'Create',
  [GovernanceAction.READ]: 'Read',
  [GovernanceAction.UPDATE]: 'Update',
  [GovernanceAction.DELETE]: 'Delete',
  [GovernanceAction.PUBLISH]: 'Publish',
  [GovernanceAction.APPROVE]: 'Approve',
  [GovernanceAction.ASSIGN]: 'Assign',
  [GovernanceAction.EXPORT]: 'Export',
  [GovernanceAction.CONFIGURE]: 'Configure',
};

export default function GovernancePermissionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isRoleAssignmentOpen, setIsRoleAssignmentOpen] = useState(false);
  const [isPermissionTestOpen, setIsPermissionTestOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [testResult, setTestResult] = useState<UserPermissionTestResult | null>(null);
  const [assignRoleData, setAssignRoleData] = useState<AssignRoleData>({
    user_id: '',
    role: '',
    business_unit_id: undefined,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['governance-permissions', selectedRole],
    queryFn: () => governanceApi.getGovernancePermissions(selectedRole || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteGovernancePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-permissions'] });
      toast({
        title: 'Success',
        description: 'Permission deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete permission',
        variant: 'destructive',
      });
    },
  });

  const permissions = data?.data || [];

  // Group permissions by role
  const permissionsByRole = permissions.reduce((acc, perm) => {
    if (!acc[perm.role]) {
      acc[perm.role] = [];
    }
    acc[perm.role].push(perm);
    return acc;
  }, {} as Record<string, GovernancePermission[]>);

  const roles = Object.keys(permissionsByRole);

  // Get users for role assignment
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const users = usersData || [];

  // Test permissions mutation
  const testPermissionsMutation = useMutation({
    mutationFn: (userId: string) => governanceApi.testUserPermissions(userId),
    onSuccess: (data) => {
      setTestResult(data.data);
      toast({
        title: 'Success',
        description: 'Permission test completed',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to test permissions',
        variant: 'destructive',
      });
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: (data: AssignRoleData) => governanceApi.assignRole(data),
    onSuccess: () => {
      setIsRoleAssignmentOpen(false);
      setAssignRoleData({ user_id: '', role: '', business_unit_id: undefined });
      queryClient.invalidateQueries({ queryKey: ['governance-permissions'] });
      toast({
        title: 'Success',
        description: 'Role assigned successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to assign role',
        variant: 'destructive',
      });
    },
  });

  const handleTestPermissions = () => {
    if (selectedUserId) {
      testPermissionsMutation.mutate(selectedUserId);
    }
  };

  const handleAssignRole = () => {
    if (assignRoleData.user_id && assignRoleData.role) {
      assignRoleMutation.mutate(assignRoleData);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Governance Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles and permissions for governance modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsRoleAssignmentOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Role
          </Button>
          <Button variant="outline" onClick={() => setIsPermissionTestOpen(true)}>
            <TestTube className="h-4 w-4 mr-2" />
            Test Permissions
          </Button>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Permission
          </Button>
        </div>
      </div>

      <Tabs defaultValue={roles[0] || 'all'} className="space-y-4">
        <TabsList>
          {roles.length > 0 ? (
            roles.map((role) => (
              <TabsTrigger key={role} value={role}>
                <Shield className="h-4 w-4 mr-2" />
                {role} ({permissionsByRole[role].length})
              </TabsTrigger>
            ))
          ) : (
            <TabsTrigger value="all">All Permissions</TabsTrigger>
          )}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role} value={role} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissions for {role}</CardTitle>
                <CardDescription>
                  {permissionsByRole[role].length} permission{permissionsByRole[role].length !== 1 ? 's' : ''} defined
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {permissionsByRole[role].map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{moduleLabels[permission.module]}</Badge>
                        <Badge variant="secondary">{actionLabels[permission.action]}</Badge>
                        {permission.resource_type && (
                          <Badge variant="outline" className="text-xs">
                            {permission.resource_type}
                          </Badge>
                        )}
                        {permission.conditions && (
                          <Badge variant="outline" className="text-xs" title={JSON.stringify(permission.conditions, null, 2)}>
                            Row-Level Security
                            {permission.conditions.business_unit_id && (
                              <span className="ml-1">
                                (BU: {permission.conditions.business_unit_id === 'user.business_unit_id' ? 'User BU' : permission.conditions.business_unit_id})
                              </span>
                            )}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this permission?')) {
                            deleteMutation.mutate(permission.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {roles.length === 0 && (
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No Permissions Defined</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create permissions to control access to governance modules
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Permission
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
            <DialogDescription>
              Define a new permission for a role and module
            </DialogDescription>
          </DialogHeader>
          <GovernancePermissionForm
            onSuccess={() => {
              setIsCreateOpen(false);
              queryClient.invalidateQueries({ queryKey: ['governance-permissions'] });
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleAssignmentOpen} onOpenChange={setIsRoleAssignmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
            <DialogDescription>
              Assign a governance role to a user, optionally scoped to a business unit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-select">User *</Label>
              <Select
                value={assignRoleData.user_id}
                onValueChange={(value) => setAssignRoleData({ ...assignRoleData, user_id: value })}
              >
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role-select">Role *</Label>
              <Select
                value={assignRoleData.role}
                onValueChange={(value) => setAssignRoleData({ ...assignRoleData, role: value })}
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                  <SelectItem value="risk_manager">Risk Manager</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="business-unit">Business Unit (Optional)</Label>
              <Input
                id="business-unit"
                placeholder="Business Unit ID"
                value={assignRoleData.business_unit_id || ''}
                onChange={(e) => setAssignRoleData({ ...assignRoleData, business_unit_id: e.target.value || undefined })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty for organization-wide role assignment
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRoleAssignmentOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignRole}
                disabled={!assignRoleData.user_id || !assignRoleData.role || assignRoleMutation.isPending}
              >
                {assignRoleMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Assign Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permission Testing Dialog */}
      <Dialog open={isPermissionTestOpen} onOpenChange={setIsPermissionTestOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test User Permissions</DialogTitle>
            <DialogDescription>
              Test all permissions for a specific user to see what they can access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-user-select">User</Label>
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
              >
                <SelectTrigger id="test-user-select">
                  <SelectValue placeholder="Select a user to test" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleTestPermissions}
              disabled={!selectedUserId || testPermissionsMutation.isPending}
              className="w-full"
            >
              {testPermissionsMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <TestTube className="h-4 w-4 mr-2" />
              Test Permissions
            </Button>

            {testResult && (
              <div className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                    <CardDescription>
                      User: {users.find((u) => u.id === testResult.userId)?.firstName}{' '}
                      {users.find((u) => u.id === testResult.userId)?.lastName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Roles:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {testResult.roles.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Permission Matrix</CardTitle>
                    <CardDescription>
                      All permissions for this user across all modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.values(GovernanceModule).map((module) => {
                        const modulePermissions = testResult.permissions.filter(
                          (p) => p.module === module,
                        );
                        if (modulePermissions.length === 0) return null;

                        return (
                          <div key={module} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">{moduleLabels[module]}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {modulePermissions.map((perm) => (
                                <div
                                  key={`${perm.module}-${perm.action}`}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  {perm.allowed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className={perm.allowed ? 'text-green-700' : 'text-red-700'}>
                                    {actionLabels[perm.action]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
