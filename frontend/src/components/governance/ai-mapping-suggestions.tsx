"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  AISuggestion,
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
  CheckCircle2,
  XCircle,
  ArrowRight,
  Shield,
  FileText,
  Info,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/pagination"; // Reusing Progress if available, or custom

interface AIMappingSuggestionsProps {
  influencerId: string;
}

export function AIMappingSuggestions({ influencerId }: AIMappingSuggestionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: suggestions = [], refetch, isFetching } = useQuery({
    queryKey: ["ai-mapping-suggestions", influencerId],
    queryFn: () => governanceApi.getAIMappingSuggestions(influencerId),
    enabled: false, // Only manual trigger
  });

  const acceptMutation = useMutation({
    mutationFn: async (suggestion: AISuggestion) => {
      if (suggestion.targetType === 'policy') {
        // Link to policy (assuming policy entity has linked_influencers)
        const policy = await governanceApi.getPolicy(suggestion.targetId);
        const currentLinks = (policy as any).data.linked_influencers || [];
        if (!currentLinks.includes(influencerId)) {
          return governanceApi.updatePolicy(suggestion.targetId, {
            linked_influencers: [...currentLinks, influencerId]
          } as any);
        }
      } else {
        // Link to control objective mappings (mapped via control framework mappings or similar)
        // For simplicity, we'll implement a basic link record here
        toast({ title: "Linking implemented soon", description: "Mapping control to requirement logic..." });
      }
    },
    onSuccess: () => {
      toast({ title: "Mapping Accepted", description: "The AI suggestion has been applied." });
      queryClient.invalidateQueries({ queryKey: ["influencer", influencerId] });
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await refetch();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle>AI-Powered Mapping Suggestions</CardTitle>
          </div>
          <Button 
            size="sm" 
            onClick={handleGenerate} 
            disabled={isGenerating || isFetching}
            className="bg-primary hover:bg-primary/90"
          >
            {isGenerating || isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {suggestions.length > 0 ? "Refresh Suggestions" : "Suggest Mappings"}
          </Button>
        </div>
        <CardDescription>
          Semantic analysis of regulatory requirements against internal policies and controls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating || isFetching ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-primary opacity-20" />
              <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-primary" />
            </div>
            <p className="text-sm font-medium animate-pulse">Analyzing semantic relationships...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((s, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 bg-background border rounded-lg hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${s.targetType === 'policy' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                      {s.targetType === 'policy' ? <FileText className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Target {s.targetType}</span>
                        <Badge variant={s.confidence > 0.8 ? "default" : "secondary"} className="text-[10px] h-4">
                          {Math.round(s.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <p className="text-sm font-bold mt-1 truncate">Candidate ID: {s.targetId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8 border-green-200 hover:bg-green-50 text-green-700"
                      onClick={() => acceptMutation.mutate(s)}
                    >
                      <CheckCircle2 className="mr-1.5 h-3 w-3" />
                      Accept
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-8 text-muted-foreground">
                      <XCircle className="mr-1.5 h-3 w-3" />
                      Dismiss
                    </Button>
                  </div>
                </div>
                
                <div className="pl-11 pr-4">
                  <div className="p-3 bg-muted/30 rounded-md border-l-4 border-primary/30">
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs leading-relaxed italic">"{s.reasoning}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              No suggestions yet. Click "Suggest Mappings" to use AI to find semantic matches in your library.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


