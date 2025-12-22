'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Grid, List, Filter, Download, Eye } from 'lucide-react';
import { governanceApi, AssetType, ImplementationStatus } from '@/lib/api/governance';

interface ControlAssetMatrixProps {
  onSelectControl?: (controlId: string) => void;
  onSelectAsset?: (assetType: AssetType, assetId: string) => void;
}

export function ControlAssetMatrix({
  onSelectControl,
  onSelectAsset,
}: ControlAssetMatrixProps) {
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | ''>('');
  const [selectedControlDomain, setSelectedControlDomain] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<ImplementationStatus | ''>('');
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');
  const [selectedCell, setSelectedCell] = useState<{
    controlId: string;
    assetId: string;
    status: ImplementationStatus;
  } | null>(null);

  // Fetch matrix data
  const { data: matrixData, isLoading } = useQuery({
    queryKey: ['control-asset-matrix', selectedAssetType, selectedControlDomain, selectedStatus],
    queryFn: () =>
      governanceApi.getControlAssetMatrix({
        assetType: selectedAssetType || undefined,
        controlDomain: selectedControlDomain || undefined,
        implementationStatus: selectedStatus || undefined,
      }),
  });

  // Fetch domains for filter
  const { data: domains = [] } = useQuery({
    queryKey: ['active-domains'],
    queryFn: () => governanceApi.getActiveDomains(),
  });

  const controls = matrixData?.controls || [];
  const assets = matrixData?.assets || [];
  const matrix = matrixData?.matrix || [];

  // Create matrix lookup for quick access
  const matrixLookup = useMemo(() => {
    const lookup: Record<string, Record<string, ImplementationStatus | null>> = {};
    matrix.forEach(item => {
      if (!lookup[item.controlId]) lookup[item.controlId] = {};
      lookup[item.controlId][item.assetId] = item.implementationStatus;
    });
    return lookup;
  }, [matrix]);

  const getStatusColor = (status: ImplementationStatus | null) => {
    switch (status) {
      case ImplementationStatus.IMPLEMENTED:
        return 'bg-green-500 hover:bg-green-600';
      case ImplementationStatus.PARTIALLY_IMPLEMENTED:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case ImplementationStatus.NOT_IMPLEMENTED:
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  const getStatusLabel = (status: ImplementationStatus | null) => {
    switch (status) {
      case ImplementationStatus.IMPLEMENTED:
        return 'Implemented';
      case ImplementationStatus.PARTIALLY_IMPLEMENTED:
        return 'Partial';
      case ImplementationStatus.NOT_IMPLEMENTED:
        return 'Not Implemented';
      default:
        return 'Not Mapped';
    }
  };

  const handleCellClick = (controlId: string, assetId: string) => {
    const status = matrixLookup[controlId]?.[assetId] || null;
    setSelectedCell({ controlId, assetId, status });
  };

  const handleExport = () => {
    // Export matrix as CSV
    const headers = ['Control ID', 'Control Title', 'Domain', ...assets.map(a => `${a.type}-${a.id}`)];
    const rows = controls.map(control => [
      control.identifier,
      control.title,
      control.domain,
      ...assets.map(asset => getStatusLabel(matrixLookup[control.id]?.[asset.id] || null))
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `control-asset-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Control-Asset Compliance Matrix</CardTitle>
          <CardDescription>
            Interactive matrix showing control implementation across assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Select value={selectedAssetType} onValueChange={(value) => setSelectedAssetType(value as AssetType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Asset Types</SelectItem>
                  <SelectItem value={AssetType.PHYSICAL}>Physical Assets</SelectItem>
                  <SelectItem value={AssetType.INFORMATION}>Information Assets</SelectItem>
                  <SelectItem value={AssetType.APPLICATION}>Applications</SelectItem>
                  <SelectItem value={AssetType.SOFTWARE}>Software</SelectItem>
                  <SelectItem value={AssetType.SUPPLIER}>Suppliers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedControlDomain} onValueChange={setSelectedControlDomain}>
                <SelectTrigger>
                  <SelectValue placeholder="Control Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Domains</SelectItem>
                  {domains.map((domain: any) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ImplementationStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Implementation Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value={ImplementationStatus.IMPLEMENTED}>Implemented</SelectItem>
                  <SelectItem value={ImplementationStatus.PARTIALLY_IMPLEMENTED}>Partially Implemented</SelectItem>
                  <SelectItem value={ImplementationStatus.NOT_IMPLEMENTED}>Not Implemented</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'matrix' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('matrix')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Statistics */}
            {matrixData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{controls.length}</div>
                  <div className="text-sm text-gray-600">Controls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{assets.length}</div>
                  <div className="text-sm text-gray-600">Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {matrix.filter(m => m.implementationStatus === ImplementationStatus.IMPLEMENTED).length}
                  </div>
                  <div className="text-sm text-gray-600">Implemented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {matrix.filter(m => m.implementationStatus === ImplementationStatus.NOT_IMPLEMENTED).length}
                  </div>
                  <div className="text-sm text-gray-600">Not Implemented</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Matrix/List View */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : controls.length === 0 || assets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available for the selected filters
            </div>
          ) : viewMode === 'matrix' ? (
            <ScrollArea className="w-full">
              <div className="min-w-max">
                {/* Header Row */}
                <div className="flex border-b sticky top-0 bg-white z-10">
                  <div className="w-64 p-3 font-semibold border-r bg-gray-50">Control</div>
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="w-16 p-2 text-center text-xs font-medium border-r bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => onSelectAsset?.(asset.type, asset.id)}
                    >
                      <div>{asset.type.slice(0, 3).toUpperCase()}</div>
                      <div className="text-xs text-gray-500">{asset.id.slice(0, 4)}</div>
                      <div className="text-xs font-bold text-blue-600">{asset.complianceScore}%</div>
                    </div>
                  ))}
                </div>

                {/* Data Rows */}
                {controls.map((control) => (
                  <div key={control.id} className="flex border-b hover:bg-gray-50">
                    <div
                      className="w-64 p-3 border-r cursor-pointer hover:bg-blue-50"
                      onClick={() => onSelectControl?.(control.id)}
                    >
                      <div className="font-medium text-sm">{control.identifier}</div>
                      <div className="text-xs text-gray-600 truncate">{control.title}</div>
                      <div className="text-xs text-gray-500">{control.domain}</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {control.implementedAssets}/{control.totalAssets}
                        </Badge>
                      </div>
                    </div>
                    {assets.map((asset) => {
                      const status = matrixLookup[control.id]?.[asset.id] || null;
                      return (
                        <div
                          key={`${control.id}-${asset.id}`}
                          className={`w-16 h-16 border-r cursor-pointer ${getStatusColor(status)} flex items-center justify-center`}
                          onClick={() => handleCellClick(control.id, asset.id)}
                          title={`${control.identifier} - ${asset.type}-${asset.id}: ${getStatusLabel(status)}`}
                        >
                          {status && (
                            <div className="w-3 h-3 rounded-full bg-white opacity-80"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            /* List View */
            <ScrollArea className="w-full">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3 font-semibold">Control</th>
                    <th className="text-left p-3 font-semibold">Domain</th>
                    <th className="text-center p-3 font-semibold">Coverage</th>
                    <th className="text-center p-3 font-semibold">Implemented</th>
                    <th className="text-center p-3 font-semibold">Partial</th>
                    <th className="text-center p-3 font-semibold">Not Impl.</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.map((control) => (
                    <tr
                      key={control.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectControl?.(control.id)}
                    >
                      <td className="p-3">
                        <div className="font-medium">{control.identifier}</div>
                        <div className="text-xs text-gray-600">{control.title}</div>
                      </td>
                      <td className="p-3">{control.domain}</td>
                      <td className="p-3 text-center">
                        <div className="text-lg font-semibold">
                          {Math.round((control.implementedAssets / Math.max(control.totalAssets, 1)) * 100)}%
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">
                          {control.implementedAssets}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {control.partialAssets}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">
                          {control.notImplementedAssets}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Cell Detail Dialog */}
      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Control-Asset Mapping Details</DialogTitle>
            <DialogDescription>
              Implementation status and details for this control-asset relationship
            </DialogDescription>
          </DialogHeader>
          {selectedCell && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Control ID</label>
                  <p className="text-sm text-gray-600">{selectedCell.controlId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Asset ID</label>
                  <p className="text-sm text-gray-600">{selectedCell.assetId}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Implementation Status</label>
                <div className="mt-1">
                  <Badge
                    className={
                      selectedCell.status === ImplementationStatus.IMPLEMENTED
                        ? 'bg-green-100 text-green-800'
                        : selectedCell.status === ImplementationStatus.PARTIALLY_IMPLEMENTED
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {getStatusLabel(selectedCell.status)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => onSelectControl?.(selectedCell.controlId)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Control
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onSelectAsset?.(
                    assets.find(a => a.id === selectedCell.assetId)?.type || AssetType.PHYSICAL,
                    selectedCell.assetId
                  )}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Asset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}