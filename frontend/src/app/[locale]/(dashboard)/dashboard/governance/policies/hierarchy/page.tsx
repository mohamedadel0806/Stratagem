"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  governanceApi,
  HierarchyNode,
} from "@/lib/api/governance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TreeDeciduous,
  Loader2,
  FileText,
  Shield,
  Activity,
  Target,
  ChevronRight,
  ChevronDown,
  Info,
  Search,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PolicyHierarchyPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { data: hierarchy = [], isLoading } = useQuery({
    queryKey: ["policy-hierarchy"],
    queryFn: () => governanceApi.getPolicyHierarchy(),
  });

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'policy': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'standard': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'sop': return <Activity className="h-4 w-4 text-green-500" />;
      case 'objective': return <Target className="h-4 w-4 text-orange-500" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderNode = (node: HierarchyNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const matchesSearch = !searchQuery || 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.identifier.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery && !matchesSearch && !hasChildrenMatch(node, searchQuery)) {
      return null;
    }

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group cursor-pointer ${depth === 0 ? 'bg-muted/20' : ''}`}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            <div className="w-4 h-4 text-muted-foreground">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          ) : (
            <div className="w-4 h-4" />
          )}
          
          <div className="flex-shrink-0">
            {getIcon(node.type)}
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded border text-muted-foreground">
              {node.identifier}
            </span>
            <span className={`text-sm truncate ${depth === 0 ? 'font-bold' : 'font-medium'}`}>
              {node.label}
            </span>
            <Badge variant="outline" className="text-[9px] uppercase h-4 px-1 shrink-0">
              {node.type}
            </Badge>
          </div>

          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="secondary" className="text-[10px] h-5">{node.status}</Badge>
            <Link href={`/${locale}/dashboard/governance/${node.type === 'objective' ? 'control-objectives' : node.type + 's'}/${node.id}`}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const hasChildrenMatch = (node: HierarchyNode, query: string): boolean => {
    if (!node.children) return false;
    return node.children.some(child => 
      child.label.toLowerCase().includes(query.toLowerCase()) ||
      child.identifier.toLowerCase().includes(query.toLowerCase()) ||
      hasChildrenMatch(child, query)
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TreeDeciduous className="h-8 w-8 text-primary" />
            Policy Framework Hierarchy
          </h1>
          <p className="text-muted-foreground">
            Structural overview of Policies, Standards, SOPs, and Control Objectives
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-purple-500/10 rounded-md"><FileText className="h-4 w-4 text-purple-500" /></div>
                <div className="flex flex-col">
                  <span className="font-semibold">Policy</span>
                  <span className="text-[10px] text-muted-foreground italic">High-level governing document</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-blue-500/10 rounded-md"><Shield className="h-4 w-4 text-blue-500" /></div>
                <div className="flex flex-col">
                  <span className="font-semibold">Standard</span>
                  <span className="text-[10px] text-muted-foreground italic">Mandatory technical requirement</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-green-500/10 rounded-md"><Activity className="h-4 w-4 text-green-500" /></div>
                <div className="flex flex-col">
                  <span className="font-semibold">SOP</span>
                  <span className="text-[10px] text-muted-foreground italic">Step-by-step procedure</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-orange-500/10 rounded-md"><Target className="h-4 w-4 text-orange-500" /></div>
                <div className="flex flex-col">
                  <span className="font-semibold">Objective</span>
                  <span className="text-[10px] text-muted-foreground italic">Measurable control goal</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Hierarchy View</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1" onClick={() => setExpandedNodes(new Set(hierarchy.map(n => n.id)))}>
                  Expand All
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1" onClick={() => setExpandedNodes(new Set())}>
                  Collapse All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Framework Explorer</CardTitle>
                <CardDescription>Click on nodes to expand their contents</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by title or ID..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Mapping policy structure...</p>
              </div>
            ) : hierarchy.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground border-2 border-dashed rounded-lg">
                No policies found.
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-1">
                  {hierarchy.map((node) => renderNode(node))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


