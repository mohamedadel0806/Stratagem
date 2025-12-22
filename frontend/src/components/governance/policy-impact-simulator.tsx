"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  Policy,
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
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Target,
  ClipboardCheck,
  CheckCircle2,
  Zap,
  Info,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PolicyImpactSimulatorProps {
  policy: Policy;
  proposedChanges?: Partial<Policy>;
}

export function PolicyImpactSimulator({ policy, proposedChanges }: PolicyImpactSimulatorProps) {
  const { toast } = useToast();
  const [result, setResult] = useState<any | null>(null);

  const simulateMutation = useMutation({
    mutationFn: () => governanceApi.simulatePolicyImpact(policy.id, proposedChanges || {}),
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Simulation Complete",
        description: "AI has successfully simulated the downstream impact.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Simulation Failed",
        description: error.response?.data?.message || "Could not generate impact analysis.",
        variant: "destructive",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'control_objective': return <Target className="h-4 w-4" />;
      case 'unified_control': return <Shield className="h-4 w-4" />;
      case 'assessment': return <ClipboardCheck className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-5 w-5 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <CardTitle>AI Policy Impact Simulator</CardTitle>
              <CardDescription>Analyze cascading effects of policy changes across the governance structure</CardDescription>
            </div>
          </div>
          <Button 
            onClick={() => simulateMutation.mutate()} 
            disabled={simulateMutation.isPending}
            className="bg-primary shadow-lg shadow-primary/20"
          >
            {simulateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Run Simulation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {simulateMutation.isPending ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <div className="text-center animate-pulse">
              <p className="font-bold text-primary">Calculating Dependencies...</p>
              <p className="text-xs text-muted-foreground mt-1">Tracing links to Controls, SOPs and Assessments</p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-background border-red-100">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-red-50/30">
                  <CardTitle className="text-xs font-bold uppercase text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" /> Implementation Risk
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] border-red-200 text-red-700">HIGH RISK</Badge>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{result.riskSummary}</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-blue-100">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-blue-50/30">
                  <CardTitle className="text-xs font-bold uppercase text-blue-800 flex items-center gap-2">
                    <History className="h-3 w-3" /> Effort Estimate
                  </CardTitle>
                  <Badge variant="outline" className={`text-[10px] capitalize ${result.effortEstimate === 'high' ? 'border-red-200 text-red-700' : 'border-blue-200 text-blue-700'}`}>
                    {result.effortEstimate} Effort
                  </Badge>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">
                    This change requires significant updates to {result.affectedAreas.length} linked governance items.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Affected Areas Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Cascading Impact Map
              </h3>
              <div className="space-y-3">
                {result.affectedAreas.map((area: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full border-2 ${getSeverityColor(area.severity)}`}>
                        {getEntityIcon(area.entityType)}
                      </div>
                      {idx < result.affectedAreas.length - 1 && (
                        <div className="w-0.5 h-full bg-muted mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-muted-foreground px-1.5 py-0.5 bg-muted rounded uppercase">
                          {area.entityType.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold">{area.label}</h4>
                        <Badge variant="outline" className={`text-[10px] h-4 ${getSeverityColor(area.severity)}`}>
                          {area.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic bg-background p-2 rounded border border-dashed">
                        "{area.impactDescription}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="py-3 px-4 border-b border-primary/10">
                <CardTitle className="text-xs font-bold uppercase text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" /> AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs flex gap-3 items-start">
                      <div className="h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-lg bg-background/50">
            <div className="relative inline-block mb-4">
              <Zap className="h-12 w-12 text-primary opacity-20" />
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-primary animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold">Ready to Simulate</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
              Click "Run Simulation" to identify downstream impacts on controls, assessments, and technical standards before committing changes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


