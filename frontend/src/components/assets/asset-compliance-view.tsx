'use client';

import { useQuery } from '@tanstack/react-query';
import { assetComplianceListApi, AssetComplianceSummary, ComplianceStatusEnum } from '@/lib/api/compliance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Download,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface AssetComplianceViewProps {
  initialFilters?: {
    assetType?: string;
    complianceStatus?: ComplianceStatusEnum;
    businessUnit?: string;
  };
}

const complianceStatusColors: Record<ComplianceStatusEnum, string> = {
  compliant: 'bg-green-100 text-green-800',
  non_compliant: 'bg-red-100 text-red-800',
  partially_compliant: 'bg-yellow-100 text-yellow-800',
  not_assessed: 'bg-gray-100 text-gray-800',
  requires_review: 'bg-blue-100 text-blue-800',
  not_applicable: 'bg-gray-200 text-gray-600',
};

const complianceStatusLabels: Record<ComplianceStatusEnum, string> = {
  compliant: 'Compliant',
  non_compliant: 'Non-Compliant',
  partially_compliant: 'Partially Compliant',
  not_assessed: 'Not Assessed',
  requires_review: 'Requires Review',
  not_applicable: 'Not Applicable',
};

const assetTypeIcons = {
  physical: '📦',
  information: '📄',
  application: '💻',
  software: '⚙️',
  supplier: '🏢',
};

export function AssetComplianceView({ initialFilters }: AssetComplianceViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState<string | undefined>();
  const [complianceStatusFilter, setComplianceStatusFilter] = useState<string | undefined>();
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>('');
  const [criticalityFilter, setCriticalityFilter] = useState<string | undefined>();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'asset-compliance-list',
      page,
      pageSize,
      searchQuery,
      assetTypeFilter,
      complianceStatusFilter,
      businessUnitFilter,
      criticalityFilter,
    ],
    queryFn: () =>
      assetComplianceListApi.getAssetComplianceList(
        {
          assetType: assetTypeFilter as any,
          complianceStatus: complianceStatusFilter as ComplianceStatusEnum,
          businessUnit: businessUnitFilter || undefined,
          criticality: criticalityFilter || undefined,
          searchQuery: searchQuery || undefined,
        },
        { page, pageSize }
      ),
  });

  const getComplianceIcon = (status: ComplianceStatusEnum) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'non_compliant':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'partially_compliant':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleExport = () => {
    if (!data?.assets) return;

    const csvContent = [
      ['Asset ID', 'Asset Name', 'Asset Type', 'Criticality', 'Business Unit', 'Total Requirements', 'Compliant', 'Non-Compliant', 'Compliance %', 'Controls Linked'].join(','),
      ...data.assets.map((asset) => {
        // Convert assetType to string for CSV export
        const assetTypeStr = typeof asset.assetType === 'string' 
          ? asset.assetType 
          : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
            ? (asset.assetType as any).name || (asset.assetType as any).code || (asset.assetType as any).id || 'unknown'
            : String(asset.assetType || 'unknown');
        return [
          asset.assetId,
          asset.assetName,
          assetTypeStr,
          asset.criticality || '',
          asset.businessUnit || '',
          asset.totalRequirements,
          asset.compliantCount,
          asset.nonCompliantCount,
          asset.overallCompliancePercentage,
          asset.controlsLinkedCount,
        ].join(',');
      }),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `asset-compliance-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Success',
      description: 'Asset compliance report exported successfully',
    });
  };

  const handleAssetClick = (assetType: string, assetId: string) => {
    const basePath = '/en/dashboard/assets';
    const paths: Record<string, string> = {
      physical: `${basePath}/physical/${assetId}`,
      information: `${basePath}/information/${assetId}`,
      application: `${basePath}/applications/${assetId}`,
      software: `${basePath}/software/${assetId}`,
      supplier: `${basePath}/suppliers/${assetId}`,
    };
    router.push(paths[assetType] || basePath);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading asset compliance data...</span>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600 font-semibold">Error loading compliance data</p>
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          <p className="text-gray-600 text-sm mt-4">Please try refreshing the page or contact support if the issue persists.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {data?.complianceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{data.complianceSummary.totalAssets}</div>
                <p className="text-sm text-muted-foreground mt-1">Total Assets</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{data.complianceSummary.compliantAssets}</div>
                <p className="text-sm text-muted-foreground mt-1">Compliant</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{data.complianceSummary.nonCompliantAssets}</div>
                <p className="text-sm text-muted-foreground mt-1">Non-Compliant</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{data.complianceSummary.partiallyCompliantAssets}</div>
                <p className="text-sm text-muted-foreground mt-1">Partially Compliant</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{data.complianceSummary.averageCompliancePercentage}%</div>
                <p className="text-sm text-muted-foreground mt-1">Avg. Compliance</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by asset name or ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Type</label>
              <Select value={assetTypeFilter || ''} onValueChange={(value) => {
                setAssetTypeFilter(value || undefined);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="information">Information</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Compliance Status</label>
              <Select value={complianceStatusFilter || ''} onValueChange={(value) => {
                setComplianceStatusFilter(value || undefined);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="partially_compliant">Partially Compliant</SelectItem>
                  <SelectItem value="not_assessed">Not Assessed</SelectItem>
                  <SelectItem value="requires_review">Requires Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Business Unit</label>
              <Input
                placeholder="Filter by business unit"
                value={businessUnitFilter}
                onChange={(e) => {
                  setBusinessUnitFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Criticality</label>
              <Select value={criticalityFilter || ''} onValueChange={(value) => {
                setCriticalityFilter(value || undefined);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All criticality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleExport} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets Compliance Status</CardTitle>
          <CardDescription>{data?.total} total assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Criticality</TableHead>
                  <TableHead>Total Req.</TableHead>
                  <TableHead>Compliant</TableHead>
                  <TableHead>Non-Compliant</TableHead>
                  <TableHead>Compliance %</TableHead>
                  <TableHead>Controls</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.assets && data.assets.length > 0 ? (
                  data.assets.map((asset: AssetComplianceSummary) => {
                    // Convert assetType to string for React key
                    const assetTypeKey = typeof asset.assetType === 'string' 
                      ? asset.assetType 
                      : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
                        ? (asset.assetType as any).name || (asset.assetType as any).code || (asset.assetType as any).id || 'unknown'
                        : String(asset.assetType || 'unknown');
                    return (
                    <TableRow key={`${assetTypeKey}-${asset.assetId}`}>
                      <TableCell>
                        <div
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            const assetTypeForClick = typeof asset.assetType === 'string' 
                              ? asset.assetType 
                              : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
                                ? (asset.assetType as any).name || (asset.assetType as any).code || 'unknown'
                                : String(asset.assetType || 'unknown');
                            handleAssetClick(assetTypeForClick, asset.assetId);
                          }}
                        >
                          <div className="font-medium">{asset.assetName}</div>
                          <div className="text-xs text-muted-foreground">{asset.assetIdentifier}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const assetTypeStr = typeof asset.assetType === 'string' 
                            ? asset.assetType 
                            : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
                              ? (asset.assetType as any).name || (asset.assetType as any).code || 'unknown'
                              : String(asset.assetType || 'unknown');
                          return (
                            <span className="text-sm">{assetTypeIcons[assetTypeStr as keyof typeof assetTypeIcons] || ''} {assetTypeStr}</span>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.criticality || '-'}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{asset.totalRequirements}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-green-600 font-medium">{asset.compliantCount}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-red-600 font-medium">{asset.nonCompliantCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{asset.overallCompliancePercentage}%</div>
                          <Progress value={asset.overallCompliancePercentage} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{asset.controlsLinkedCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getComplianceIcon(asset.overallComplianceStatus)}
                          <Badge className={complianceStatusColors[asset.overallComplianceStatus]}>
                            {complianceStatusLabels[asset.overallComplianceStatus]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              const assetTypeForClick = typeof asset.assetType === 'string' 
                                ? asset.assetType 
                                : (typeof asset.assetType === 'object' && asset.assetType !== null && 'name' in asset.assetType)
                                  ? (asset.assetType as any).name || (asset.assetType as any).code || 'unknown'
                                  : String(asset.assetType || 'unknown');
                              handleAssetClick(assetTypeForClick, asset.assetId);
                            }}>
                              <ChevronRight className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No assets found matching the selected filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.total)} of {data.total} assets
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                    const pageNum = Math.max(1, page - 2) + i;
                    if (pageNum > data.totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page === data.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
