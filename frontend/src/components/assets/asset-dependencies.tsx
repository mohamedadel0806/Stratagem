'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

interface AssetDependenciesProps {
  assetType: AssetType;
  assetId: string;
}

interface Dependency {
  id: string;
  sourceAssetType: string;
  sourceAssetId: string;
  sourceAssetName: string;
  sourceAssetIdentifier: string;
  targetAssetType: string;
  targetAssetId: string;
  targetAssetName: string;
  targetAssetIdentifier: string;
  relationshipType: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export function AssetDependencies({ assetType, assetId }: AssetDependenciesProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetType, setSelectedTargetType] = useState<AssetType>('physical');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [relationshipType, setRelationshipType] = useState('depends_on');
  const [description, setDescription] = useState('');

  // Fetch outgoing dependencies
  const { data: outgoingDeps, isLoading: isLoadingOutgoing } = useQuery({
    queryKey: ['asset-dependencies', assetType, assetId, 'outgoing'],
    queryFn: () => assetsApi.getAssetDependencies(assetType, assetId),
    enabled: !!assetId,
  });

  // Fetch incoming dependencies
  const { data: incomingDeps, isLoading: isLoadingIncoming } = useQuery({
    queryKey: ['asset-dependencies', assetType, assetId, 'incoming'],
    queryFn: () => assetsApi.getIncomingDependencies(assetType, assetId),
    enabled: !!assetId,
  });

  // Search for target assets
  const { data: searchResults } = useQuery({
    queryKey: ['asset-search', searchQuery, selectedTargetType],
    queryFn: () =>
      assetsApi.searchAssets({
        q: searchQuery,
        type: selectedTargetType,
        limit: 20,
      }),
    enabled: searchQuery.length >= 2 && isAddOpen,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      targetAssetType: AssetType;
      targetAssetId: string;
      relationshipType: 'depends_on' | 'uses' | 'contains' | 'hosts' | 'processes' | 'stores' | 'other';
      description?: string;
    }) => assetsApi.createAssetDependency(assetType, assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-dependencies', assetType, assetId] });
      toast({
        title: 'Success',
        description: 'Dependency created successfully',
      });
      setIsAddOpen(false);
      // Reset all form fields
      setSearchQuery('');
      setSelectedTargetId('');
      setDescription('');
      setRelationshipType('depends_on');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create dependency',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (dependencyId: string) => assetsApi.deleteAssetDependency(dependencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-dependencies', assetType, assetId] });
      toast({
        title: 'Success',
        description: 'Dependency removed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove dependency',
        variant: 'destructive',
      });
    },
  });

  const getRelationshipLabel = (type: string) => {
    const labels: Record<string, string> = {
      depends_on: 'Depends On',
      uses: 'Uses',
      contains: 'Contains',
      hosts: 'Hosts',
      processes: 'Processes',
      stores: 'Stores',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      physical: 'bg-blue-100 text-blue-800',
      information: 'bg-green-100 text-green-800',
      application: 'bg-purple-100 text-purple-800',
      software: 'bg-yellow-100 text-yellow-800',
      supplier: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      physical: 'Physical',
      information: 'Information',
      application: 'Application',
      software: 'Software',
      supplier: 'Supplier',
    };
    return labels[type] || type;
  };

  const handleAddDependency = () => {
    if (!selectedTargetId) {
      toast({
        title: 'Error',
        description: 'Please search for and select a target asset from the search results',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      targetAssetType: selectedTargetType,
      targetAssetId: selectedTargetId,
      relationshipType: relationshipType as 'depends_on' | 'uses' | 'contains' | 'hosts' | 'processes' | 'stores' | 'other',
      description: description || undefined,
    } as any);
  };

  const handleViewAsset = (type: string, id: string) => {
    const typeMap: Record<string, string> = {
      physical: 'physical',
      information: 'information',
      application: 'applications',
      software: 'software',
      supplier: 'suppliers',
    };
    const path = `/dashboard/assets/${typeMap[type]}/${id}`;
    router.push(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Dependencies</h3>
          <p className="text-sm text-muted-foreground">
            Manage relationships between this asset and other assets
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Dependency
        </Button>
      </div>

      {/* Outgoing Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Outgoing Dependencies</CardTitle>
          <CardDescription>Assets that this asset depends on</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingOutgoing ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !outgoingDeps || outgoingDeps.length === 0 ? (
            <p className="text-muted-foreground">No outgoing dependencies</p>
          ) : (
            <div className="space-y-3">
              {outgoingDeps.map((dep: Dependency) => (
                <div
                  key={dep.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(dep.targetAssetType)}>
                        {getTypeLabel(dep.targetAssetType)}
                      </Badge>
                      <span className="font-medium">{dep.targetAssetName}</span>
                      <span className="text-sm text-muted-foreground">
                        ({dep.targetAssetIdentifier})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{getRelationshipLabel(dep.relationshipType)}</Badge>
                      {dep.description && <span>• {dep.description}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAsset(dep.targetAssetType, dep.targetAssetId)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(dep.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incoming Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Incoming Dependencies</CardTitle>
          <CardDescription>Assets that depend on this asset</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingIncoming ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !incomingDeps || incomingDeps.length === 0 ? (
            <p className="text-muted-foreground">No incoming dependencies</p>
          ) : (
            <div className="space-y-3">
              {incomingDeps.map((dep: Dependency) => (
                <div
                  key={dep.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(dep.sourceAssetType)}>
                        {getTypeLabel(dep.sourceAssetType)}
                      </Badge>
                      <span className="font-medium">{dep.sourceAssetName}</span>
                      <span className="text-sm text-muted-foreground">
                        ({dep.sourceAssetIdentifier})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{getRelationshipLabel(dep.relationshipType)}</Badge>
                      {dep.description && <span>• {dep.description}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAsset(dep.sourceAssetType, dep.sourceAssetId)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dependency Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Dependency</DialogTitle>
            <DialogDescription>
              Create a relationship between this asset and another asset
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Target Asset Type</Label>
              <Select value={selectedTargetType} onValueChange={(value) => {
                setSelectedTargetType(value as AssetType);
                setSearchQuery('');
                setSelectedTargetId('');
                setDescription('');
              }}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <Label>Search Target Asset</Label>
              <Input
                placeholder="Search by name or identifier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults && searchResults.data && searchResults.data.length > 0 && (
                <div className="mt-2 border rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.data.map((asset: any) => (
                    <div
                      key={asset.id}
                      role="button"
                      tabIndex={0}
                      data-testid={`asset-search-result-${asset.id}`}
                      data-asset-id={asset.id}
                      data-asset-type={asset.type}
                      data-asset-name={asset.name}
                      className={`p-2 cursor-pointer hover:bg-muted border focus:outline-none focus:ring-2 focus:ring-primary ${
                        selectedTargetId === asset.id ? 'bg-muted border-primary' : 'border-transparent'
                      }`}
                      onClick={() => {
                        setSelectedTargetId(asset.id);
                        // Keep the current search query instead of replacing it with asset name
                        // This prevents the search results from disappearing
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedTargetId(asset.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(asset.type)}>
                          {getTypeLabel(asset.type)}
                        </Badge>
                        <span className="font-medium">{asset.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({asset.identifier})
                        </span>
                        {selectedTargetId === asset.id && (
                          <span className="ml-auto text-primary">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedTargetId && searchResults?.data && (
                <div className="mt-2 p-2 bg-muted rounded border">
                  <span className="text-sm font-medium">Selected: </span>
                  {(() => {
                    const selectedAsset = searchResults.data.find((asset: any) => asset.id === selectedTargetId);
                    return selectedAsset ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(selectedAsset.type)}>
                          {getTypeLabel(selectedAsset.type)}
                        </Badge>
                        <span className="font-medium">{selectedAsset.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({selectedAsset.identifier})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-6 w-6 p-0"
                          onClick={() => {
                            setSelectedTargetId('');
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
            <div>
              <Label>Relationship Type</Label>
              <Select value={relationshipType} onValueChange={setRelationshipType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="depends_on">Depends On</SelectItem>
                  <SelectItem value="uses">Uses</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="hosts">Hosts</SelectItem>
                  <SelectItem value="processes">Processes</SelectItem>
                  <SelectItem value="stores">Stores</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Describe the relationship..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDependency} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Dependency'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

