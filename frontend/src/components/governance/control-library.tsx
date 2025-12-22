'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Search,
  Filter,
  BarChart3,
  Grid3x3,
  List,
} from 'lucide-react';
import { governanceApi } from '@/lib/api/governance';
import { ControlLibraryStatsDto, ControlDomainTreeNodeDto } from '@/lib/api/types/control-library';
import { UnifiedControl } from '@/lib/api/types/unified-control';

export function ControlLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'stats'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedControl, setSelectedControl] = useState<UnifiedControl | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Fetch library statistics
  const { data: statistics } = useQuery({
    queryKey: ['control-library-stats'],
    queryFn: () => governanceApi.getLibraryStatistics(),
  });

  // Fetch available domains
  const { data: domains } = useQuery({
    queryKey: ['control-domains'],
    queryFn: () => governanceApi.getActiveDomains(),
  });

  // Fetch available control types
  const { data: controlTypes } = useQuery({
    queryKey: ['control-types'],
    queryFn: () => governanceApi.getControlTypes(),
  });

  // Fetch domain hierarchy tree
  const { data: domainTree } = useQuery({
    queryKey: ['domain-hierarchy-tree'],
    queryFn: () => governanceApi.getDomainTree(),
  });

  // Browse library with filters
  const { data: libraryData, isLoading } = useQuery({
    queryKey: [
      'control-library-browse',
      searchQuery,
      selectedDomain,
      selectedType,
      selectedComplexity,
      selectedStatus,
      currentPage,
    ],
    queryFn: () =>
      governanceApi.browseLibrary({
        domain: selectedDomain || undefined,
        type: selectedType || undefined,
        complexity: selectedComplexity || undefined,
        status: selectedStatus || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 50,
      }),
  });

  // Handle control selection
  const handleSelectControl = useCallback((control: UnifiedControl) => {
    setSelectedControl(control);
    setShowDetailDialog(true);
  }, []);

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const csv = await governanceApi.exportControls({
        domain: selectedDomain,
        type: selectedType,
        status: selectedStatus,
      });
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
      element.setAttribute('download', `controls-${new Date().toISOString()}.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [selectedDomain, selectedType, selectedStatus]);

  const controls = libraryData?.data || [];
  const meta = libraryData?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Control Library</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage your organization's unified control library
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs defaultValue="grid" value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList className="grid w-full max-w-xs grid-cols-3">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        {/* Grid View */}
        <TabsContent value="grid" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDomain('');
                    setSelectedType('');
                    setSelectedComplexity('');
                    setSelectedStatus('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium">Search</label>
                <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search controls by name, ID, or description..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Domain Filter */}
                <div>
                  <label className="text-sm font-medium">Domain</label>
                  <Select value={selectedDomain} onValueChange={(v) => {
                    setSelectedDomain(v);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All domains" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All domains</SelectItem>
                      {domains?.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={selectedType} onValueChange={(v) => {
                    setSelectedType(v);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {controlTypes?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Complexity Filter */}
                <div>
                  <label className="text-sm font-medium">Complexity</label>
                  <Select value={selectedComplexity} onValueChange={(v) => {
                    setSelectedComplexity(v);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All complexity</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={(v) => {
                    setSelectedStatus(v);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All status</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DEPRECATED">Deprecated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {controls.length} of {meta?.total || 0} controls
              </div>
            </CardContent>
          </Card>

          {/* Controls Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full text-center py-8">Loading controls...</div>
            ) : controls.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No controls found matching your filters
              </div>
            ) : (
              controls.map((control) => (
                <Card
                  key={control.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelectControl(control)}
                >
                  <CardHeader className="pb-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-mono">
                            {control.control_identifier}
                          </p>
                          <CardTitle className="text-base leading-tight">
                            {control.title}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {control.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {control.description || 'No description'}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {control.control_type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {control.complexity}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {control.implementation_status}
                      </Badge>
                    </div>

                    {/* Details Row */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t pt-2">
                      <div>
                        <span className="font-medium">Domain:</span> {control.domain}
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span> {control.cost_impact}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page === 1}
                  onClick={() => setCurrentPage(meta.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page === meta.totalPages}
                  onClick={() => setCurrentPage(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Stats View */}
        <TabsContent value="stats" className="space-y-4">
          {statistics && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalControls}</div>
                  <p className="text-xs text-muted-foreground">All controls in library</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.activeControls}</div>
                  <p className="text-xs text-muted-foreground">Currently in use</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Implementation Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.implementationRate}%</div>
                  <p className="text-xs text-muted-foreground">Implemented controls</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Draft Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.draftControls}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Type Distribution */}
          {statistics && (
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(statistics.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${((count as number) / (statistics.totalControls || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {/* Filters (same as grid) */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Search</label>
                <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search controls..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Implementation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : controls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No controls found
                    </TableCell>
                  </TableRow>
                ) : (
                  controls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-mono text-xs">{control.control_identifier}</TableCell>
                      <TableCell className="font-medium">{control.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {control.control_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {control.complexity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {control.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {control.implementation_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectControl(control)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      {selectedControl && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedControl.title}</DialogTitle>
              <DialogDescription>{selectedControl.control_identifier}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <Badge className="mt-1">{selectedControl.control_type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className="mt-1">{selectedControl.status}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Complexity</p>
                  <Badge variant="secondary" className="mt-1">{selectedControl.complexity}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Implementation</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedControl.implementation_status}
                  </Badge>
                </div>
              </div>

              {selectedControl.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm">{selectedControl.description}</p>
                </div>
              )}

              {selectedControl.control_procedures && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Control Procedures</p>
                  <p className="mt-1 text-sm">{selectedControl.control_procedures}</p>
                </div>
              )}

              {selectedControl.testing_procedures && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Testing Procedures</p>
                  <p className="mt-1 text-sm">{selectedControl.testing_procedures}</p>
                </div>
              )}

              {selectedControl.tags && selectedControl.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedControl.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
