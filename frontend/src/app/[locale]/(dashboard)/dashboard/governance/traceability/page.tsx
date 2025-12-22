"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  governanceApi,
  TraceabilityNode,
  TraceabilityLink,
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
  Network,
  Loader2,
  FileText,
  Shield,
  Target,
  Settings,
  ArrowRight,
  Search,
  Filter,
  Info,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export default function GovernanceTraceabilityPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: graph, isLoading } = useQuery({
    queryKey: ["governance-traceability-graph"],
    queryFn: () => governanceApi.getTraceabilityGraph(),
  });

  const influencers = useMemo(() => 
    graph?.nodes.filter(n => n.type === 'influencer') || [], 
  [graph]);

  const getChildren = (nodeId: string) => {
    if (!graph) return [];
    const targetIds = graph.links
      .filter(l => l.source === nodeId)
      .map(l => l.target);
    return graph.nodes.filter(n => targetIds.includes(n.id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'influencer': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'policy': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'objective': return <Target className="h-4 w-4 text-orange-500" />;
      case 'control': return <Shield className="h-4 w-4 text-green-500" />;
      case 'baseline': return <Settings className="h-4 w-4 text-slate-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const renderNode = (node: TraceabilityNode, depth: number = 0) => {
    const children = getChildren(node.id);
    
    return (
      <div key={node.id} className="ml-4 border-l pl-4 py-2 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors border bg-background shadow-sm">
          {getIcon(node.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-muted-foreground">{node.identifier}</span>
              <Badge variant="outline" className="text-[10px] uppercase h-4 px-1">{node.type}</Badge>
            </div>
            <p className="text-sm font-medium truncate" title={node.label}>{node.label}</p>
          </div>
          <Badge variant="secondary" className="text-[10px]">{node.status}</Badge>
        </div>
        
        {children.length > 0 && (
          <div className="space-y-1">
            {children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredInfluencers = influencers.filter(inf => 
    !searchQuery || 
    inf.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inf.identifier?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Network className="h-8 w-8 text-primary" />
            Governance Traceability
          </h1>
          <p className="text-muted-foreground">
            End-to-end mapping from regulatory requirements to technical configurations
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Traceability Map</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search root influencers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Drill down through the governance hierarchy to see how requirements are satisfied.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Building traceability graph...</p>
            </div>
          ) : filteredInfluencers.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              No traceability data found matching your search.
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {filteredInfluencers.map((inf) => (
                  <div key={inf.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-700">{inf.identifier || 'REG'}</span>
                          <Badge className="bg-blue-600 text-white text-[10px]">ROOT INFLUENCER</Badge>
                        </div>
                        <h3 className="text-base font-bold truncate">{inf.label}</h3>
                      </div>
                      <Badge variant="outline" className="bg-background">{inf.status}</Badge>
                    </div>
                    
                    <div className="relative">
                      {getChildren(inf.id).map(child => renderNode(child, 1))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Legend</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <FileText className="h-3.5 w-3.5 text-blue-500" /> Influencer (Law/Reg)
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Shield className="h-3.5 w-3.5 text-purple-500" /> Policy Document
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Target className="h-3.5 w-3.5 text-orange-500" /> Control Objective
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Shield className="h-3.5 w-3.5 text-green-500" /> Unified Control
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Settings className="h-3.5 w-3.5 text-slate-500" /> Secure Baseline
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Graph Insights</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex justify-between items-center h-full">
              <div className="text-center flex-1 border-r">
                <p className="text-2xl font-bold">{graph?.nodes.length || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total Nodes</p>
              </div>
              <div className="text-center flex-1 border-r">
                <p className="text-2xl font-bold">{graph?.links.length || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Active Links</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(((graph?.nodes.filter(n => n.type === 'control').length || 0) / (graph?.nodes.filter(n => n.type === 'influencer').length || 1)) * 10)}%
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">Fulfillment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


