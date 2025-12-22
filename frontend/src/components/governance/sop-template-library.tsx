'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, DocumentTemplate, TemplateType } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Copy, Trash2, Search, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SOPTemplateBrowserProps {
  onSelect?: (template: DocumentTemplate) => void;
  onlyActive?: boolean;
}

export function SOPTemplateLibrary({ onSelect, onlyActive = true }: SOPTemplateBrowserProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Fetch templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['document-templates', { type: 'sop', isActive: onlyActive }],
    queryFn: () =>
      governanceApi.getDocumentTemplates({
        type: TemplateType.SOP,
        isActive: onlyActive,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteDocumentTemplate(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete template',
        variant: 'destructive',
      });
    },
  });

  // Copy template content to clipboard
  const handleCopy = (template: DocumentTemplate) => {
    navigator.clipboard.writeText(template.content);
    toast({
      title: 'Success',
      description: 'Template content copied to clipboard',
    });
  };

  // Filter templates
  const filteredTemplates = templates?.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTemplates && filteredTemplates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {template.category && (
                      <Badge variant="outline" className="mt-2">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                  {template.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>v{template.version}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(template);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {!onlyActive && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this template?')) {
                          deleteMutation.mutate(template.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  )}
                </div>

                {onSelect && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(template);
                    }}
                  >
                    Use Template
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No templates found' : 'No templates available'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="outline">v{selectedTemplate.version}</Badge>
                {selectedTemplate.category && (
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg border">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {selectedTemplate.content}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCopy(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </Button>
                {onSelect && (
                  <Button
                    onClick={() => {
                      onSelect(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                  >
                    Use Template
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default SOPTemplateLibrary;
