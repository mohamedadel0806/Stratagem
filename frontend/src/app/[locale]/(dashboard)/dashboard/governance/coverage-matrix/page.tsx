"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  governanceApi,
  MappingCoverage,
  UnifiedControl,
} from "@/lib/api/governance";
import { complianceApi } from "@/lib/api/compliance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  LayoutGrid,
  Loader2,
  FileSpreadsheet,
  Search,
  Filter,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ControlCoverageMatrixPage() {
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: frameworks = [], isLoading: isFrameworksLoading } = useQuery({
    queryKey: ["compliance-frameworks"],
    queryFn: async () => {
      const result = await complianceApi.getFrameworks();
      return result.data;
    },
  });

  const { data: matrixData = [], isLoading: isMatrixLoading } = useQuery({
    queryKey: ["control-coverage-matrix", selectedFrameworkId],
    queryFn: () => governanceApi.getCoverageMatrix(selectedFrameworkId),
    enabled: !!selectedFrameworkId,
  });

  const { data: requirements = [] } = useQuery({
    queryKey: ["framework-requirements", selectedFrameworkId],
    queryFn: async () => {
      const result = await complianceApi.getRequirements(selectedFrameworkId);
      return result.data;
    },
    enabled: !!selectedFrameworkId,
  });

  const { data: controlsData } = useQuery({
    queryKey: ["unified-controls-all"],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 1000 }),
    enabled: !!selectedFrameworkId,
  });

  const controls = controlsData?.data || [];

  // Filter controls that have at least one mapping in this matrix or match search
  const filteredControls = useMemo(() => {
    if (!selectedFrameworkId) return [];
    
    return controls.filter(control => {
      const hasMapping = matrixData.some(m => m.controlId === control.id);
      const matchesSearch = !searchQuery || 
        control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.control_identifier.toLowerCase().includes(searchQuery.toLowerCase());
      
      return hasMapping && matchesSearch;
    });
  }, [controls, matrixData, searchQuery, selectedFrameworkId]);

  const getCoverageIcon = (controlId: string, requirementId: string) => {
    const mapping = matrixData.find(
      (m) => m.controlId === controlId && m.requirementId === requirementId
    );

    if (!mapping) return null;

    switch (mapping.coverageLevel) {
      case MappingCoverage.FULL:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center w-full h-full p-2 bg-green-500/10 rounded-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Full Coverage</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case MappingCoverage.PARTIAL:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center w-full h-full p-2 bg-yellow-500/10 rounded-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Partial Coverage</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-8 w-8 text-primary" />
            Control Coverage Matrix
          </h1>
          <p className="text-muted-foreground">
            Visualize how Unified Controls map to Framework Requirements
          </p>
        </div>
        <Button variant="outline" disabled={!selectedFrameworkId}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Matrix
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Select Framework</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Select
              value={selectedFrameworkId}
              onValueChange={setSelectedFrameworkId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a framework..." />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} ({f.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mapped controls..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!selectedFrameworkId}
              />
            </div>
            <Button variant="outline" size="icon" disabled={!selectedFrameworkId}>
              <Filter className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {!selectedFrameworkId ? (
        <Card className="border-dashed py-24">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">No Framework Selected</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Please select a compliance framework from the dropdown above to visualize the coverage matrix.
            </p>
          </CardContent>
        </Card>
      ) : isMatrixLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating matrix data...</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Coverage Grid</CardTitle>
                <CardDescription>
                  Showing {filteredControls.length} mapped controls against {requirements.length} requirements
                </CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="w-3 h-3 bg-green-500/20 border border-green-500 rounded-sm flex items-center justify-center">
                    <CheckCircle2 className="h-2 w-2 text-green-600" />
                  </div>
                  Full
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded-sm flex items-center justify-center">
                    <AlertCircle className="h-2 w-2 text-yellow-600" />
                  </div>
                  Partial
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <div className="min-w-max">
                <Table className="border-collapse border-spacing-0">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[300px] sticky left-0 bg-background border-r z-20">
                        Unified Controls
                      </TableHead>
                      {requirements.map((req) => (
                        <TableHead key={req.id} className="w-[100px] px-1 text-center border-r min-w-[100px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help py-2">
                                  <Badge variant="outline" className="font-mono text-[10px]">
                                    {req.requirementCode || req.identifier || req.id.slice(0, 5)}
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="font-bold">{req.requirementCode}: {req.title}</p>
                                <p className="text-xs mt-1 line-clamp-3">{req.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredControls.map((control) => (
                      <TableRow key={control.id} className="group hover:bg-muted/50">
                        <TableCell className="sticky left-0 bg-background group-hover:bg-muted/50 border-r font-medium z-10">
                          <div className="flex flex-col max-w-[280px]">
                            <span className="text-sm truncate" title={control.title}>{control.title}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{control.control_identifier}</span>
                          </div>
                        </TableCell>
                        {requirements.map((req) => (
                          <TableCell key={req.id} className="p-0 border-r border-b text-center align-middle hover:bg-primary/5">
                            {getCoverageIcon(control.id, req.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


