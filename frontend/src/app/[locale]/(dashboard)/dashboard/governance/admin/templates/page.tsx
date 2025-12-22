"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  FileCode,
  Settings,
  FileText,
  Activity,
  Shield,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";
import {
  governanceApi,
  DocumentTemplate,
  TemplateType,
} from "@/lib/api/governance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DocumentTemplateForm } from "@/components/governance/document-template-form";
import { Switch } from "@/components/ui/switch";

export default function DocumentTemplatesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["document-templates", searchQuery, typeFilter],
    queryFn: () => governanceApi.getDocumentTemplates({
      search: searchQuery,
      type: typeFilter === "all" ? undefined : (typeFilter as TemplateType),
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteDocumentTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      toast({ title: "Success", description: "Template deleted successfully" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      governanceApi.updateDocumentTemplate(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
    },
  });

  const getIcon = (type: TemplateType) => {
    switch (type) {
      case TemplateType.POLICY: return <FileText className="h-4 w-4 text-purple-500" />;
      case TemplateType.SOP: return <Activity className="h-4 w-4 text-green-500" />;
      case TemplateType.STANDARD: return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <FileCode className="h-4 w-4 text-slate-500" />;
    }
  };

  const filteredTemplates = templates.filter(t => 
    !searchQuery || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileCode className="h-8 w-8 text-primary" />
            Document Templates
          </h1>
          <p className="text-muted-foreground">
            Manage reusable structures for Policies, SOPs, and Compliance Standards
          </p>
        </div>
        <Button onClick={() => { setEditingTemplate(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or category..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value={TemplateType.POLICY}>Policies</SelectItem>
            <SelectItem value={TemplateType.SOP}>SOPs</SelectItem>
            <SelectItem value={TemplateType.STANDARD}>Standards</SelectItem>
            <SelectItem value={TemplateType.REPORT}>Reports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading templates...</p>
                  </TableCell>
                </TableRow>
              ) : filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No templates found. Create one to standardize your documentation.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{template.name}</span>
                        {template.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1 italic">{template.description}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getIcon(template.type)}
                        <span className="text-xs uppercase font-medium">{template.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.category || "Uncategorized"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">v{template.version}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={template.isActive} 
                        onCheckedChange={(val) => toggleMutation.mutate({ id: template.id, isActive: val })}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(template.updated_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingTemplate(template); setIsFormOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this template?")) {
                                deleteMutation.mutate(template.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Document Template" : "Create Document Template"}
            </DialogTitle>
            <DialogDescription>
              Design a reusable structure for your governance documents.
            </DialogDescription>
          </DialogHeader>
          <DocumentTemplateForm
            template={editingTemplate}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


