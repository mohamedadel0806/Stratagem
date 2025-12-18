'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { usersApi } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play, Calendar, Mail, FileText, Download, Copy, Search, Sparkles, Eye, Users, Share2, X, History, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReportTemplateForm } from '@/components/forms/report-template-form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReportsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewData, setPreviewData] = useState<{ data: any[]; count: number; templateName: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sharingTemplate, setSharingTemplate] = useState<any>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [versionTemplate, setVersionTemplate] = useState<any>(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['report-templates'],
    queryFn: () => assetsApi.getReportTemplates(),
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.deleteReportTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast({
        title: 'Success',
        description: 'Report template deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete template',
        variant: 'destructive',
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: string) => assetsApi.sendScheduledReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast({
        title: 'Success',
        description: 'Report sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send report',
        variant: 'destructive',
      });
    },
  });

  const previewMutation = useMutation({
    mutationFn: (id: string) => assetsApi.previewReport(id),
    onSuccess: (result, templateId) => {
      const template = templates?.find((t: any) => t.id === templateId);
      setPreviewData({
        data: result.data,
        count: result.count,
        templateName: template?.name || 'Report',
      });
      setIsPreviewOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to preview report',
        variant: 'destructive',
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: (id: string) => assetsApi.generateReport(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Report generated and downloaded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate report',
        variant: 'destructive',
      });
    },
  });

  const useTemplateMutation = useMutation({
    mutationFn: (template: any) => {
      // Create a copy of the template without the ID and system template flag
      const { id, isSystemTemplate, createdAt, updatedAt, createdById, ...templateData } = template;
      return assetsApi.createReportTemplate({
        ...templateData,
        name: `${template.name} (Copy)`,
      });
    },
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast({
        title: 'Success',
        description: 'Template copied successfully. You can now customize it.',
      });
      // Open the form with the new template for editing
      setEditingTemplate(newTemplate);
      setIsCreateOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to copy template',
        variant: 'destructive',
      });
    },
  });

  const handleUseTemplate = (template: any) => {
    try {
      // Create a copy object for editing (without actually saving yet)
      const { id, isSystemTemplate, createdAt, updatedAt, createdById, ...templateData } = template;
      
      // Ensure fieldSelection is an array
      let fieldSelection = templateData.fieldSelection || [];
      if (typeof fieldSelection === 'string') {
        try {
          fieldSelection = JSON.parse(fieldSelection);
        } catch (e) {
          fieldSelection = [];
        }
      }
      if (!Array.isArray(fieldSelection)) {
        fieldSelection = [];
      }
      
      // Ensure filters is an object
      let filters = templateData.filters || {};
      if (typeof filters === 'string') {
        try {
          filters = JSON.parse(filters);
        } catch (e) {
          filters = {};
        }
      }
      if (typeof filters !== 'object' || Array.isArray(filters)) {
        filters = {};
      }
      
      // Ensure grouping is an object
      let grouping = templateData.grouping || {};
      if (typeof grouping === 'string') {
        try {
          grouping = JSON.parse(grouping);
        } catch (e) {
          grouping = {};
        }
      }
      if (typeof grouping !== 'object' || Array.isArray(grouping)) {
        grouping = {};
      }
      
      const templateCopy = {
        ...templateData,
        name: `${template.name} (Copy)`,
        fieldSelection,
        filters,
        grouping,
        // Ensure isScheduled is boolean
        isScheduled: Boolean(templateData.isScheduled),
        // Ensure isActive is boolean
        isActive: templateData.isActive !== undefined ? Boolean(templateData.isActive) : true,
      };
      
      // Set template and open dialog
      setEditingTemplate(templateCopy);
      setIsCreateOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to prepare template: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report template?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter templates
  const filteredTemplates = templates?.filter((template: any) => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.reportType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' ||
      (selectedCategory === 'system' && template.isSystemTemplate) ||
      (selectedCategory === 'custom' && !template.isSystemTemplate);

    return matchesSearch && matchesCategory;
  }) || [];

  const systemTemplates = filteredTemplates.filter((t: any) => t.isSystemTemplate);
  const customTemplates = filteredTemplates.filter((t: any) => !t.isSystemTemplate);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Report Templates</h1>
          <p className="text-muted-foreground">Browse pre-built templates or create custom reports</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="system">
              <Sparkles className="h-4 w-4 mr-2" />
              Pre-built
            </TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredTemplates.length > 0 ? (
        <>
          {systemTemplates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Pre-built Templates</h2>
                <Badge variant="secondary">{systemTemplates.length}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {systemTemplates.map((template: any) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isSystemTemplate && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          System
                        </Badge>
                      )}
                      {template.isShared && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {template.isOrganizationWide ? 'Organization' : 'Shared'}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{template.description || 'No description'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  <div>
                    <span className="font-medium">Type:</span> {template.reportType?.replace(/_/g, ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Format:</span> {template.format?.toUpperCase()}
                  </div>
                  {template.isScheduled && (
                    <>
                      <div>
                        <span className="font-medium">Frequency:</span>{' '}
                        {template.scheduleFrequency || 'Custom'}
                      </div>
                      {template.nextRunAt && (
                        <div>
                          <span className="font-medium">Next Run:</span>{' '}
                          {new Date(template.nextRunAt).toLocaleString()}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => generateMutation.mutate(template.id)}
                    disabled={generateMutation.isPending}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  {template.isSystemTemplate ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVersionTemplate(template);
                          setIsVersionHistoryOpen(true);
                        }}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Versions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                        disabled={useTemplateMutation.isPending}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </>
                  ) : (
                    <>
                      {template.isScheduled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendMutation.mutate(template.id)}
                          disabled={sendMutation.isPending}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsCreateOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
                ))}
              </div>
            </div>
          )}

          {customTemplates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Custom Templates</h2>
                <Badge variant="secondary">{customTemplates.length}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {customTemplates.map((template: any) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            {template.isShared && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {template.isOrganizationWide ? 'Organization' : 'Shared'}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{template.description || 'No description'}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm mb-4">
                        <div>
                          <span className="font-medium">Type:</span> {template.reportType?.replace(/_/g, ' ')}
                        </div>
                        <div>
                          <span className="font-medium">Format:</span> {template.format?.toUpperCase()}
                        </div>
                        {template.isScheduled && (
                          <>
                            <div>
                              <span className="font-medium">Frequency:</span>{' '}
                              {template.scheduleFrequency || 'Custom'}
                            </div>
                            {template.nextRunAt && (
                              <div>
                                <span className="font-medium">Next Run:</span>{' '}
                                {new Date(template.nextRunAt).toLocaleString()}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => previewMutation.mutate(template.id)}
                    disabled={previewMutation.isPending}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {previewMutation.isPending ? 'Loading...' : 'Preview'}
                  </Button>
                  {!template.isSystemTemplate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSharingTemplate(template);
                        setIsSharingOpen(true);
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => generateMutation.mutate(template.id)}
                    disabled={generateMutation.isPending}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                        {template.isScheduled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendMutation.mutate(template.id)}
                            disabled={sendMutation.isPending}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Send Now
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVersionTemplate(template);
                            setIsVersionHistoryOpen(true);
                          }}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Versions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTemplate(template);
                            setIsCreateOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'No templates match your search criteria'
                : 'No report templates found. Create your first template or run the seed script to load pre-built templates.'}
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        // Only clear template when closing, not when opening
        if (!open) {
          setEditingTemplate(null);
        }
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Report Template</DialogTitle>
            <DialogDescription>
              {editingTemplate?.name?.includes('(Copy)') 
                ? 'Customize this template copy. All fields from the original template are pre-filled.'
                : 'Configure a report template with field selection, filters, and scheduling options'}
            </DialogDescription>
          </DialogHeader>
          <ReportTemplateForm
            key={editingTemplate?.id || editingTemplate?.name || 'new-template'}
            template={editingTemplate}
            onSuccess={() => {
              setIsCreateOpen(false);
              setEditingTemplate(null);
              queryClient.invalidateQueries({ queryKey: ['report-templates'] });
            }}
            onCancel={() => {
              setIsCreateOpen(false);
              setEditingTemplate(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview: {previewData?.templateName}</DialogTitle>
            <DialogDescription>
              Showing preview of report data (limited to first 100 rows)
              {previewData && previewData.count > 100 && ` - Total: ${previewData.count} rows`}
            </DialogDescription>
          </DialogHeader>
          {previewData && previewData.data.length > 0 ? (
            <div className="max-h-[60vh] overflow-auto rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    {Object.keys(previewData.data[0]).map((key) => (
                      <TableHead key={key} className="whitespace-nowrap">
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.data.map((row: any, index: number) => (
                    <TableRow key={index}>
                      {Object.keys(previewData.data[0]).map((key) => (
                        <TableCell key={key} className="max-w-[200px] truncate" title={String(row[key] || '')}>
                          {row[key] !== null && row[key] !== undefined ? String(row[key]) : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No data available for preview
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            {previewData && (
              <Button
                onClick={() => {
                  const template = templates?.find((t: any) => t.name === previewData.templateName);
                  if (template) {
                    generateMutation.mutate(template.id);
                  }
                  setIsPreviewOpen(false);
                }}
                disabled={generateMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sharing Dialog */}
      <Dialog open={isSharingOpen} onOpenChange={setIsSharingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Template: {sharingTemplate?.name}</DialogTitle>
            <DialogDescription>
              Control who can view and use this template
            </DialogDescription>
          </DialogHeader>
          {sharingTemplate && (
            <SharingDialogContent
              template={sharingTemplate}
              onClose={() => {
                setIsSharingOpen(false);
                setSharingTemplate(null);
                queryClient.invalidateQueries({ queryKey: ['report-templates'] });
              }}
            />
          )}
          </DialogContent>
        </Dialog>

      {/* Version History Dialog */}
      <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Version History: {versionTemplate?.name}</DialogTitle>
            <DialogDescription>
              View and restore previous versions of this template
            </DialogDescription>
          </DialogHeader>
          {versionTemplate && (
            <VersionHistoryContent
              template={versionTemplate}
              onClose={() => {
                setIsVersionHistoryOpen(false);
                setVersionTemplate(null);
                queryClient.invalidateQueries({ queryKey: ['report-templates'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Version History Component
function VersionHistoryContent({ template, onClose }: { template: any; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['template-versions', template.id],
    queryFn: () => assetsApi.getTemplateVersions(template.id),
    enabled: !!template.id,
  });

  const restoreMutation = useMutation({
    mutationFn: (versionId: string) => assetsApi.restoreTemplateVersion(template.id, versionId),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Template restored successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      queryClient.invalidateQueries({ queryKey: ['template-versions', template.id] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to restore version',
        variant: 'destructive',
      });
    },
  });

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading version history...</div>;
  }

  // Include current version in the list
  const allVersions = [
    {
      id: 'current',
      versionNumber: template.version || 1,
      name: template.name,
      description: template.description,
      createdAt: template.updatedAt || template.createdAt,
      createdBy: null,
      versionComment: 'Current version',
      isCurrent: true,
    },
    ...versions.map((v: any) => ({ ...v, isCurrent: false })),
  ].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-4">
      <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allVersions.map((version: any) => (
              <TableRow key={version.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">v{version.versionNumber}</span>
                    {version.isCurrent && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{version.name}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {version.versionComment || '-'}
                </TableCell>
                <TableCell className="text-sm">{formatDate(version.createdAt)}</TableCell>
                <TableCell className="text-sm">
                  {version.createdBy
                    ? `${version.createdBy.firstName || ''} ${version.createdBy.lastName || ''}`.trim() || version.createdBy.email
                    : '-'}
                </TableCell>
                <TableCell>
                  {!version.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to restore version ${version.versionNumber}? This will create a new version with the current state.`)) {
                          restoreMutation.mutate(version.id);
                        }
                      }}
                      disabled={restoreMutation.isPending}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {allVersions.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No version history available
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

// Sharing Dialog Component
function SharingDialogContent({ template, onClose }: { template: any; onClose: () => void }) {
  const { toast } = useToast();
  const [isShared, setIsShared] = useState(template.isShared || false);
  const [isOrganizationWide, setIsOrganizationWide] = useState(template.isOrganizationWide || false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(template.sharedWithUserIds || []);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users for selection
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const updateSharingMutation = useMutation({
    mutationFn: (sharing: any) => assetsApi.updateTemplateSharing(template.id, sharing),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Sharing settings updated successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update sharing settings',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateSharingMutation.mutate({
      isShared,
      isOrganizationWide,
      sharedWithUserIds: isOrganizationWide ? [] : selectedUserIds,
      sharedWithTeamIds: template.sharedWithTeamIds || [],
    });
  };

  const addUser = (userId: string) => {
    if (!selectedUserIds.includes(userId)) {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      return `${user.firstName} ${user.lastName}`.trim() || user.email;
    }
    return userId;
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.email || '';
  };

  // Filter users based on search query
  const availableUsers = users.filter(user => {
    if (selectedUserIds.includes(user.id)) return false;
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          checked={isShared}
          onCheckedChange={setIsShared}
        />
        <div className="space-y-1 leading-none">
          <Label>Share this template</Label>
          <p className="text-sm text-muted-foreground">
            Allow other users to view and use this template
          </p>
        </div>
      </div>

      {isShared && (
        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
          <Checkbox
            checked={isOrganizationWide}
            onCheckedChange={(checked) => {
              setIsOrganizationWide(checked);
              // Clear selected users when making organization-wide
              if (checked) {
                setSelectedUserIds([]);
              }
            }}
            disabled={!isShared}
          />
          <div className="space-y-1 leading-none">
            <Label>Make available organization-wide</Label>
            <p className="text-sm text-muted-foreground">
              All users in the organization can access this template
            </p>
          </div>
        </div>
      )}

      {isShared && !isOrganizationWide && (
        <div className="space-y-3 rounded-md border p-4">
          <Label>Share with specific users</Label>
          <p className="text-sm text-muted-foreground">
            Select users who can view and use this template
          </p>
          
          {/* Selected users */}
          {selectedUserIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUserIds.map((userId) => (
                <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                  {getUserName(userId)}
                  {getUserEmail(userId) && (
                    <span className="text-xs text-muted-foreground">
                      ({getUserEmail(userId)})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeUser(userId)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* User selector */}
          <div className="space-y-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            {usersLoading ? (
              <div className="text-sm text-muted-foreground">Loading users...</div>
            ) : availableUsers.length > 0 ? (
              <Select onValueChange={addUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select users to share with..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : searchQuery ? (
              <div className="text-sm text-muted-foreground">No users found matching "{searchQuery}"</div>
            ) : selectedUserIds.length > 0 ? (
              <div className="text-sm text-muted-foreground">All users selected</div>
            ) : (
              <div className="text-sm text-muted-foreground">No users available</div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={updateSharingMutation.isPending}
        >
          {updateSharingMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
