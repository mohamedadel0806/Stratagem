'use client';

import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExportButton } from '@/components/export/export-button';
import { convertToCSV, downloadCSV } from '@/lib/utils/export';
import { AssetRiskBadgeCompact } from '@/components/assets/asset-risk-badge';
import { RiskAssetType } from '@/lib/api/risks';

type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier' | 'all';

interface AssetResult {
  id: string;
  type: AssetType;
  name: string;
  identifier: string;
  criticality?: string;
  owner?: string;
  businessUnit?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllAssetsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Build query params
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
    };
    if (search) params.q = search;
    if (typeFilter && typeFilter !== 'all') params.type = typeFilter;
    if (criticalityFilter && criticalityFilter !== 'all') params.criticality = criticalityFilter;
    return params;
  }, [search, typeFilter, criticalityFilter, page, limit]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['all-assets', queryParams],
    queryFn: async () => {
      try {
        if (search) {
          return await assetsApi.searchAssets(queryParams);
        } else {
          return await assetsApi.getAllAssets(queryParams);
        }
      } catch (err: any) {
        console.error('Error fetching assets:', err);
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const getTypeColor = (type: AssetType) => {
    const colors: Record<string, string> = {
      physical: 'bg-blue-100 text-blue-800',
      information: 'bg-green-100 text-green-800',
      application: 'bg-purple-100 text-purple-800',
      software: 'bg-yellow-100 text-yellow-800',
      supplier: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: AssetType) => {
    const labels: Record<string, string> = {
      physical: 'Physical',
      information: 'Information',
      application: 'Application',
      software: 'Software',
      supplier: 'Supplier',
    };
    return labels[type] || type;
  };

  const getCriticalityColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[level] || colors.medium;
  };

  const handleViewAsset = (asset: AssetResult) => {
    const typeMap: Record<AssetType, string> = {
      physical: 'physical',
      information: 'information',
      application: 'applications',
      software: 'software',
      supplier: 'suppliers',
      all: 'physical',
    };
    const path = `/dashboard/assets/${typeMap[asset.type]}/${asset.id}`;
    router.push(path);
  };

  const handleExport = () => {
    if (!data?.data) return;
    
    const csvData = data.data.map((asset) => ({
      Type: getTypeLabel(asset.type),
      Name: asset.name,
      Identifier: asset.identifier,
      Criticality: asset.criticality || 'N/A',
      Owner: asset.owner || 'N/A',
      'Business Unit': asset.businessUnit || 'N/A',
      'Created At': new Date(asset.createdAt).toLocaleDateString(),
    }));

    const csv = convertToCSV(csvData);
    downloadCSV(csv, `all-assets-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Assets</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all assets across all types in one place
          </p>
        </div>
        <ExportButton onExportCSV={handleExport} disabled={!data?.data || data.data.length === 0} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter assets across all types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value as AssetType);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={criticalityFilter || undefined}
              onValueChange={(value) => {
                setCriticalityFilter(value === 'all' ? '' : value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Criticality</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              {data ? (
                <>
                  Showing {data.data.length} of {data.total} assets
                </>
              ) : (
                'Loading...'
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading assets...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading assets. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data && (
        <>
          {data.data.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No assets found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Identifier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Criticality
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Business Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Risks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.data.map((asset) => (
                        <tr key={asset.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getTypeColor(asset.type)}>
                              {getTypeLabel(asset.type)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">{asset.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">{asset.identifier}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {asset.criticality && (
                              <Badge className={getCriticalityColor(asset.criticality)}>
                                {asset.criticality}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {asset.owner || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {asset.businessUnit || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <AssetRiskBadgeCompact 
                              assetId={asset.id} 
                              assetType={asset.type as RiskAssetType} 
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAsset(asset)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && data && (
            <div className="flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={data.total}
                itemsPerPage={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

