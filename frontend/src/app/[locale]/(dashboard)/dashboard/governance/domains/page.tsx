'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, ControlDomain, DomainStatistics } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronRight, Building2, Users, FolderTree } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DomainForm } from '@/components/governance/domain-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function DomainTreeItem({
  domain,
  level = 0,
  onEdit,
  onDelete,
}: {
  domain: ControlDomain;
  level?: number;
  onEdit: (domain: ControlDomain) => void;
  onDelete: (domain: ControlDomain) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = domain.children && domain.children.length > 0;

  return (
    <div className="ml-4">
      <div
        className={`flex items-center gap-2 p-2 rounded hover:bg-accent ${
          level === 0 ? 'font-semibold' : ''
        }`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        <div className="flex-1 flex items-center gap-2">
          <span>{domain.name}</span>
          {domain.code && <Badge variant="outline">{domain.code}</Badge>}
          {!domain.is_active && <Badge variant="secondary">Inactive</Badge>}
          {domain.owner && (
            <Badge variant="outline" className="text-xs">
              {domain.owner.first_name} {domain.owner.last_name}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(domain)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(domain)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {domain.children!.map((child) => (
            <DomainTreeItem
              key={child.id}
              domain={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DomainsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<ControlDomain | null>(null);
  const [deletingDomain, setDeletingDomain] = useState<ControlDomain | null>(null);

  const { data: hierarchy = [], isLoading } = useQuery({
    queryKey: ['domain-hierarchy'],
    queryFn: () => governanceApi.getDomainHierarchy(),
  });

  const { data: statistics } = useQuery({
    queryKey: ['domain-statistics'],
    queryFn: () => governanceApi.getDomainStatistics(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['domain-statistics'] });
      toast({
        title: 'Success',
        description: 'Domain deleted successfully',
      });
      setDeletingDomain(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete domain',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (domain: ControlDomain) => {
    setDeletingDomain(domain);
  };

  const confirmDelete = () => {
    if (deletingDomain) {
      deleteMutation.mutate(deletingDomain.id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading domains...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Control Domains</h1>
          <p className="text-muted-foreground">Manage control domains and their hierarchy</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-muted-foreground">All domains</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.active}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Children</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.withChildren}</div>
              <p className="text-xs text-muted-foreground">Parent domains</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.withOwner}</div>
              <p className="text-xs text-muted-foreground">Assigned owners</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Domain Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Hierarchy</CardTitle>
          <CardDescription>View and manage domains in a hierarchical structure</CardDescription>
        </CardHeader>
        <CardContent>
          {hierarchy.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No domains found. Create your first domain to get started.
            </div>
          ) : (
            <div className="space-y-1">
              {hierarchy.map((domain) => (
                <DomainTreeItem
                  key={domain.id}
                  domain={domain}
                  onEdit={(d) => {
                    setEditingDomain(d);
                    setIsCreateOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDomain ? 'Edit Domain' : 'Create Domain'}
            </DialogTitle>
            <DialogDescription>
              {editingDomain
                ? 'Update domain information'
                : 'Add a new control domain to organize your controls'}
            </DialogDescription>
          </DialogHeader>
          <DomainForm
            domain={editingDomain}
            excludeId={editingDomain?.id}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingDomain(null);
              queryClient.invalidateQueries({ queryKey: ['domains'] });
              queryClient.invalidateQueries({ queryKey: ['domain-hierarchy'] });
              queryClient.invalidateQueries({ queryKey: ['domain-statistics'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingDomain(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingDomain} onOpenChange={(open) => !open && setDeletingDomain(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Domain</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the domain "{deletingDomain?.name}"? This action
              cannot be undone. If this domain has child domains, you must delete or reassign them
              first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


