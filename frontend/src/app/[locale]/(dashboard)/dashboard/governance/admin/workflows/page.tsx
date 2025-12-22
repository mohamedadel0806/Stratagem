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
  Zap,
  Settings,
  Shield,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Code,
} from "lucide-react";
import {
  workflowsApi,
  WorkflowTriggerRule,
  RuleOperator,
} from "@/lib/api/workflows";
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
import { WorkflowRuleForm } from "@/components/governance/workflow-rule-form";
import { Switch } from "@/components/ui/switch";

export default function WorkflowAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<WorkflowTriggerRule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["workflow-rules"],
    queryFn: () => workflowsApi.getRules(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workflowsApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-rules"] });
      toast({ title: "Success", description: "Trigger rule deleted successfully" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      workflowsApi.updateRule(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-rules"] });
    },
  });

  const getOperatorLabel = (op: RuleOperator) => {
    switch (op) {
      case RuleOperator.EQUALS: return "==";
      case RuleOperator.NOT_EQUALS: return "!=";
      case RuleOperator.CONTAINS: return "contains";
      case RuleOperator.GREATER_THAN: return ">";
      case RuleOperator.LESS_THAN: return "<";
      case RuleOperator.IN: return "in";
      default: return op;
    }
  };

  const filteredRules = rules.filter(r => 
    !searchQuery || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.entityType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Workflow Triggers
          </h1>
          <p className="text-muted-foreground">
            Configure conditional rules to automatically trigger approval and notification workflows
          </p>
        </div>
        <Button onClick={() => { setEditingRule(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Trigger Rule
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules by name or entity type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Entity & Event</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Triggered Workflow</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading trigger rules...</p>
                  </TableCell>
                </TableRow>
              ) : filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No trigger rules found. Create one to automate your governance workflows.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map((rule) => (
                  <TableRow key={rule.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{rule.name}</span>
                        {rule.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1 italic">{rule.description}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{rule.entityType.replace(/_/g, " ")}</Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="capitalize">{rule.trigger.replace(/_/g, " ")}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {rule.conditions.map((c, i) => (
                          <div key={i} className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border">
                            <span className="text-blue-600">{c.field}</span>
                            <span className="text-muted-foreground">{getOperatorLabel(c.operator)}</span>
                            <span className="text-orange-600">"{c.value}"</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium">{rule.workflow?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">{rule.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={rule.isActive} 
                        onCheckedChange={(val) => toggleMutation.mutate({ id: rule.id, isActive: val })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingRule(rule); setIsFormOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this rule?")) {
                                deleteMutation.mutate(rule.id);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-blue-800 dark:text-blue-400">Rule Logic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Rules use <strong>AND</strong> logic. An entity event must match <strong>all</strong> conditions defined in a rule to trigger the associated workflow.
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Priority:</strong> Rules with higher priority numbers are evaluated first. Only the first matching rule will be executed if multiple rules overlap.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50/50 border-orange-100 dark:bg-orange-950/10 dark:border-orange-900/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-orange-800 dark:text-orange-400">Entity Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">status</Badge>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">category</Badge>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">priority</Badge>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">implementation_status</Badge>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">risk_level</Badge>
            </div>
            <p className="text-[10px] mt-3 text-orange-700 dark:text-orange-300">
              * Ensure field names match the database columns exactly for the rule to work correctly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Trigger Rule" : "Create Workflow Trigger Rule"}
            </DialogTitle>
            <DialogDescription>
              Define conditions that will automatically start a workflow when an entity changes.
            </DialogDescription>
          </DialogHeader>
          <WorkflowRuleForm
            rule={editingRule}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


