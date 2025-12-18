'use client';

import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function AllAssetsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [recentSearches, setRecentSearches] = useState<
    { q: string; type: AssetType; criticality?: string }[]
  >([]);
  const [showRecent, setShowRecent] = useState(false);
  const [suggestions, setSuggestions] = useState<AssetResult[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Read query parameter from URL on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('allAssetsRecentSearches');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveRecentSearch = (q: string, type: AssetType, criticality?: string) => {
    if (typeof window === 'undefined') return;
    const trimmed = q.trim();
    if (!trimmed) return;
    const entry = { q: trimmed, type, criticality: criticality || undefined };
    const existing = recentSearches.filter(
      (r) => !(r.q === entry.q && r.type === entry.type && (r.criticality || '') === (entry.criticality || '')),
    );
    const updated = [entry, ...existing].slice(0, 5);
    setRecentSearches(updated);
    try {
      window.localStorage.setItem('allAssetsRecentSearches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

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

  // Debounced suggestions for global search
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setSuggestError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsSuggesting(true);
      setSuggestError(null);
      try {
        const params: any = { q: search.trim(), page: 1, limit: 5 };
        if (typeFilter && typeFilter !== 'all') params.type = typeFilter;
        if (criticalityFilter && criticalityFilter !== 'all') params.criticality = criticalityFilter;
        const result = await assetsApi.searchAssets(params);
        setSuggestions(result.data || []);
      } catch (err: any) {
        console.error('Error fetching asset search suggestions:', err);
        setSuggestError('Failed to load suggestions');
      } finally {
        setIsSuggesting(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, typeFilter, criticalityFilter]);

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

  // Group assets by type
  const groupedAssets = useMemo(() => {
    if (!data?.data) return {};
    
    const grouped: Record<AssetType, AssetResult[]> = {
      physical: [],
      information: [],
      application: [],
      software: [],
      supplier: [],
      all: [],
    };

    data.data.forEach((asset) => {
      if (asset.type in grouped) {
        grouped[asset.type as AssetType].push(asset);
      }
    });

    return grouped;
  }, [data?.data]);

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
                  setShowRecent(true);
                }}
                onFocus={() => {
                  if (recentSearches.length > 0 && !search) {
                    setShowRecent(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding to allow click
                  setTimeout(() => setShowRecent(false), 150);
                }}
                className="pl-10"
              />
              {/* Recent searches dropdown */}
              {showRecent && recentSearches.length > 0 && !search && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                  <div className="px-2 py-1 text-xs text-muted-foreground">Recent searches</div>
                  {recentSearches.map((item, idx) => (
                    <button
                      key={`${item.q}-${item.type}-${idx}`}
                      type="button"
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setSearch(item.q);
                        setTypeFilter(item.type);
                        setCriticalityFilter(item.criticality || '');
                        setPage(1);
                        setShowRecent(false);
                      }}
                    >
                      <span className="font-medium">{item.q}</span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({item.type}{item.criticality ? `, ${item.criticality}` : ''})
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {/* Suggestions dropdown */}
              {search.trim() && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                  <div className="px-2 py-1 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Suggestions</span>
                    {isSuggesting && <span className="text-[10px]">Loading…</span>}
                  </div>
                  {suggestions.map((s) => (
                    <button
                      key={`${s.type}-${s.id}`}
                      type="button"
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setSearch(s.name || s.identifier);
                        saveRecentSearch(s.name || s.identifier, s.type, s.criticality);
                        setPage(1);
                      }}
                    >
                      <span className="font-medium">{s.name}</span>
                      {s.identifier && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({s.identifier})
                        </span>
                      )}
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Badge className={getTypeColor(s.type)}>{getTypeLabel(s.type)}</Badge>
                        {s.criticality && (
                          <Badge className={getCriticalityColor(s.criticality)}>{s.criticality}</Badge>
                        )}
                      </span>
                    </button>
                  ))}
                  {suggestError && (
                    <div className="px-3 py-1 text-xs text-destructive border-t">{suggestError}</div>
                  )}
                </div>
              )}
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
            <div className="space-y-6">
              {(['physical', 'information', 'application', 'software', 'supplier'] as AssetType[]).map((type) => {
                const assets = groupedAssets[type] || [];
                if (assets.length === 0) return null;

                return (
                  <Card key={type}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Badge className={getTypeColor(type)}>
                              {getTypeLabel(type)}
                            </Badge>
                            <span className="text-lg font-semibold">
                              {getTypeLabel(type)} Assets
                            </span>
                            <span className="text-sm text-muted-foreground font-normal">
                              ({assets.length})
                            </span>
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
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
                            {assets.map((asset) => (
                              <tr key={asset.id} className="hover:bg-muted/50">
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
                );
              })}
            </div>
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

export default function AllAssetsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Assets</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all assets across all types in one place
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AllAssetsPageContent />
    </Suspense>
  );
}

