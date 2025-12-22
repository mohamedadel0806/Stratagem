'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Mail, Users } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmailDistributionListForm } from '@/components/forms/email-distribution-list-form';

export default function EmailDistributionListsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingList, setEditingList] = useState<any>(null);

  const { data: lists, isLoading } = useQuery({
    queryKey: ['email-distribution-lists'],
    queryFn: () => assetsApi.getEmailDistributionLists(),
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteEmailDistributionList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-distribution-lists'] });
      toast({
        title: 'Success',
        description: 'Distribution list deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete distribution list',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this distribution list?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Distribution Lists</h1>
          <p className="text-muted-foreground">Manage email distribution lists for scheduled reports</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>

      {lists && lists.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list: any) => {
            const totalEmails =
              (list.emailAddresses?.length || 0) + (list.users?.length || 0);

            return (
              <Card key={list.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      <CardDescription>{list.description || 'No description'}</CardDescription>
                    </div>
                    {list.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email Addresses:</span>{' '}
                      {list.emailAddresses?.length || 0}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Users:</span> {list.users?.length || 0}
                    </div>
                    <div>
                      <span className="font-medium">Total Recipients:</span> {totalEmails}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingList(list);
                        setIsCreateOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(list.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No distribution lists found</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First List
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (!open) setEditingList(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingList ? 'Edit' : 'Create'} Distribution List</DialogTitle>
            <DialogDescription>
              Create an email distribution list for scheduled report delivery
            </DialogDescription>
          </DialogHeader>
          <EmailDistributionListForm
            list={editingList}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingList(null);
              queryClient.invalidateQueries({ queryKey: ['email-distribution-lists'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingList(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}



