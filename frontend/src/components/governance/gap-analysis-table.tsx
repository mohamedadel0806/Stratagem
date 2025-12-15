'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, AlertTriangle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Gap {
  requirementId: string;
  requirementIdentifier: string;
  requirementText: string;
  frameworkId: string;
  frameworkName: string;
  domain: string;
  category: string;
  priority: string;
  gapSeverity: 'critical' | 'high' | 'medium' | 'low';
  mappedControlsCount: number;
  coverageLevel: string;
}

interface GapAnalysisTableProps {
  gaps: Gap[];
  isLoading?: boolean;
}

export function GapAnalysisTable({ gaps, isLoading = false }: GapAnalysisTableProps) {
  const [selectedGap, setSelectedGap] = useState<Gap | null>(null);
  const [sortBy, setSortBy] = useState<'severity' | 'priority' | 'framework'>('severity');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'critical' || priority === 'high') {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    if (priority === 'medium') {
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    }
    return null;
  };

  const sortedGaps = [...gaps].sort((a, b) => {
    if (sortBy === 'severity') {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return (severityOrder[b.gapSeverity] || 0) - (severityOrder[a.gapSeverity] || 0);
    }
    if (sortBy === 'framework') {
      return a.frameworkName.localeCompare(b.frameworkName);
    }
    return a.priority.localeCompare(b.priority);
  });

  if (gaps.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No gaps found. Your framework mapping is complete!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {sortedGaps.length} gaps
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sortBy === 'severity' ? 'default' : 'outline'}
              onClick={() => setSortBy('severity')}
            >
              Sort by Severity
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'framework' ? 'default' : 'outline'}
              onClick={() => setSortBy('framework')}
            >
              Sort by Framework
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <span className="text-xs font-medium">Priority</span>
                </TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-20">Severity</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGaps.map(gap => (
                <TableRow key={gap.requirementId} className="hover:bg-muted/50">
                  <TableCell>
                    {getPriorityIcon(gap.priority)}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div>
                      <p className="font-medium text-sm truncate">{gap.requirementIdentifier}</p>
                      <p className="text-xs text-muted-foreground truncate">{gap.requirementText.slice(0, 50)}...</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{gap.frameworkName}</TableCell>
                  <TableCell className="text-sm">{gap.domain}</TableCell>
                  <TableCell className="text-sm">{gap.category}</TableCell>
                  <TableCell>
                    <Badge className={`${getSeverityColor(gap.gapSeverity)} capitalize text-xs`}>
                      {gap.gapSeverity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedGap(gap)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Create Control
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Map Existing Control
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Mark as N/A
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Gap Details Dialog */}
      <Dialog open={selectedGap !== null} onOpenChange={(open) => !open && setSelectedGap(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gap Details</DialogTitle>
            <DialogDescription>
              Review gap information and remediation options
            </DialogDescription>
          </DialogHeader>

          {selectedGap && (
            <div className="space-y-6">
              {/* Requirement Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Requirement</h3>
                <div className="bg-muted p-3 rounded-lg space-y-1">
                  <p className="font-medium">{selectedGap.requirementIdentifier}</p>
                  <p className="text-sm text-muted-foreground">{selectedGap.requirementText}</p>
                </div>
              </div>

              {/* Gap Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Framework</p>
                  <p className="text-sm font-medium mt-1">{selectedGap.frameworkName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Severity</p>
                  <Badge className={`${getSeverityColor(selectedGap.gapSeverity)} mt-1 capitalize`}>
                    {selectedGap.gapSeverity}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Domain</p>
                  <p className="text-sm font-medium mt-1">{selectedGap.domain}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Priority</p>
                  <p className="text-sm font-medium mt-1 capitalize">{selectedGap.priority}</p>
                </div>
              </div>

              {/* Remediation Options */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold text-sm">Remediation Options</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    Create New Control
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Map to Existing Control
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Mark as Not Applicable
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
