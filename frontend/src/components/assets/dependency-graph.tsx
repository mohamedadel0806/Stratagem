'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Server, 
  Database, 
  AppWindow, 
  Package, 
  Building2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Download,
  Filter,
  X,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type AssetType = 'physical' | 'information' | 'application' | 'software' | 'supplier';

interface DependencyGraphProps {
  assetType: AssetType;
  assetId: string;
  assetName: string;
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
}

const assetTypeConfig: Record<string, { icon: any; color: string; bgColor: string; path: string }> = {
  physical: { icon: Server, color: '#3b82f6', bgColor: '#dbeafe', path: 'physical' },
  information: { icon: Database, color: '#10b981', bgColor: '#d1fae5', path: 'information' },
  application: { icon: AppWindow, color: '#8b5cf6', bgColor: '#ede9fe', path: 'applications' },
  software: { icon: Package, color: '#f59e0b', bgColor: '#fef3c7', path: 'software' },
  supplier: { icon: Building2, color: '#ef4444', bgColor: '#fee2e2', path: 'suppliers' },
};

const relationshipLabels: Record<string, string> = {
  depends_on: 'Depends On',
  uses: 'Uses',
  contains: 'Contains',
  hosts: 'Hosts',
  processes: 'Processes',
  stores: 'Stores',
  other: 'Related To',
};

// Custom node component
function AssetNode({ data, selected }: NodeProps) {
  const assetTypeStr = typeof data.assetType === 'string' 
    ? data.assetType 
    : (typeof data.assetType === 'object' && data.assetType !== null && 'name' in data.assetType)
      ? (data.assetType as any).name || (data.assetType as any).code || 'unknown'
      : String(data.assetType || 'unknown');
  const config = assetTypeConfig[assetTypeStr] || assetTypeConfig.physical;
  const Icon = config.icon;
  const isCenter = data.isCenter;
  const isImpacted = data.isImpacted || false;
  const isSPOF = data.isSPOF || false;
  const impactDepth = data.impactDepth || 0;

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 shadow-md transition-all min-w-[180px] max-w-[220px]
        ${selected ? 'ring-2 ring-offset-2 ring-primary' : ''}
        ${isCenter ? 'ring-2 ring-offset-2 ring-amber-400' : ''}
        ${isImpacted ? 'ring-2 ring-offset-2 ring-red-500 opacity-90' : ''}
        ${isSPOF ? 'ring-2 ring-offset-2 ring-purple-500' : ''}
      `}
      style={{ 
        backgroundColor: isImpacted ? (isSPOF ? '#fef3c7' : '#fee2e2') : config.bgColor,
        borderColor: isSPOF ? '#a855f7' : (isImpacted ? '#ef4444' : config.color),
        opacity: isImpacted && !isCenter ? 0.85 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-3 !h-3" />
      
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="p-1.5 rounded"
          style={{ backgroundColor: isSPOF ? '#a855f7' : (isImpacted ? '#ef4444' : config.color) }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <Badge 
          variant="secondary" 
          className="text-[10px] px-1.5 py-0"
          style={{ backgroundColor: isSPOF ? '#a855f7' : (isImpacted ? '#ef4444' : config.color), color: 'white' }}
        >
          {assetTypeStr}
        </Badge>
        {isSPOF && (
          <Badge variant="destructive" className="text-[9px] px-1 py-0">
            SPOF
          </Badge>
        )}
      </div>
      
      <p className="font-medium text-sm truncate" title={data.label}>
        {data.label}
      </p>
      <p className="text-xs text-muted-foreground truncate" title={data.identifier}>
        {data.identifier}
      </p>
      
      {isCenter && (
        <div className="mt-2 pt-2 border-t border-dashed" style={{ borderColor: config.color }}>
          <span className="text-xs font-medium" style={{ color: config.color }}>
            Current Asset
          </span>
        </div>
      )}
      
      {isImpacted && !isCenter && impactDepth > 0 && (
        <div className="mt-1 pt-1 border-t border-dashed border-red-300">
          <span className="text-[10px] text-red-600 font-medium">
            Impact Level {impactDepth}
          </span>
        </div>
      )}
    </div>
  );
}

const nodeTypes = {
  asset: AssetNode,
};

export function DependencyGraph({ assetType, assetId, assetName }: DependencyGraphProps) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [filterAssetType, setFilterAssetType] = useState<string>('all');
  const [filterRelationship, setFilterRelationship] = useState<string>('all');
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [impactMode, setImpactMode] = useState<boolean>(false);
  const [showSPOF, setShowSPOF] = useState<boolean>(false);

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

  // Fetch dependency chain for impact analysis
  const { data: dependencyChain, isLoading: isLoadingChain } = useQuery({
    queryKey: ['asset-dependency-chain', assetType, assetId],
    queryFn: () => assetsApi.getDependencyChain(assetType, assetId),
    enabled: !!assetId && impactMode,
  });

  const isLoading = isLoadingOutgoing || isLoadingIncoming || isLoadingChain;

  // Build graph data when dependencies are loaded
  useEffect(() => {
    if (isLoading && !impactMode) return;
    if (isLoading && impactMode && isLoadingChain) return;

    const nodeMap = new Map<string, Node>();
    let edgeList: Edge[] = [];
    const impactedNodeIds = new Set<string>();
    const spofNodeIds = new Set<string>();
    const impactDepthMap = new Map<string, number>();

    // If impact mode is enabled, mark impacted nodes
    if (impactMode && dependencyChain) {
      dependencyChain.chain.forEach((item) => {
        const nodeKey = `${item.assetType}-${item.assetId}`;
        impactedNodeIds.add(nodeKey);
        impactDepthMap.set(nodeKey, item.depth);
      });
    }

    // Calculate SPOF nodes (nodes with many incoming dependencies)
    if (showSPOF && incomingDeps) {
      const incomingCountMap = new Map<string, number>();
      incomingDeps.forEach((dep) => {
        const sourceKey = `${dep.sourceAssetType}-${dep.sourceAssetId}`;
        incomingCountMap.set(sourceKey, (incomingCountMap.get(sourceKey) || 0) + 1);
      });
      incomingCountMap.forEach((count, key) => {
        if (count >= 3) {
          // SPOF threshold: 3+ incoming dependencies
          spofNodeIds.add(key);
        }
      });
    }

    // Add center node (current asset)
    const centerNodeId = `${assetType}-${assetId}`;
    nodeMap.set(centerNodeId, {
      id: centerNodeId,
      type: 'asset',
      position: { x: 300, y: 200 },
      data: {
        label: assetName,
        assetType,
        identifier: assetId.substring(0, 8) + '...',
        isCenter: true,
        isImpacted: false,
        isSPOF: spofNodeIds.has(centerNodeId),
        impactDepth: 0,
      },
    });

    // Add outgoing dependency nodes and edges
    if (outgoingDeps && outgoingDeps.length > 0) {
      outgoingDeps.forEach((dep: Dependency, index: number) => {
        const targetNodeId = `${dep.targetAssetType}-${dep.targetAssetId}`;
        
        if (!nodeMap.has(targetNodeId)) {
          // Position nodes in a semicircle below the center
          const angle = (Math.PI / (outgoingDeps.length + 1)) * (index + 1);
          const radius = 200;
          const x = 300 + Math.cos(angle - Math.PI / 2) * radius;
          const y = 200 + Math.sin(angle - Math.PI / 2) * radius + 150;

          nodeMap.set(targetNodeId, {
            id: targetNodeId,
            type: 'asset',
            position: { x, y },
            data: {
              label: dep.targetAssetName,
              assetType: dep.targetAssetType,
              identifier: dep.targetAssetIdentifier,
              assetId: dep.targetAssetId,
              isCenter: false,
              isImpacted: impactedNodeIds.has(targetNodeId),
              isSPOF: spofNodeIds.has(targetNodeId),
              impactDepth: impactDepthMap.get(targetNodeId) || 0,
            },
          });
        }

        const edge = {
          id: `edge-${dep.id}`,
          source: centerNodeId,
          target: targetNodeId,
          label: relationshipLabels[dep.relationshipType] || dep.relationshipType,
          labelStyle: { fontSize: 10, fill: '#666' },
          labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
          labelBgPadding: [4, 2] as [number, number],
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          animated: true,
          data: {
            relationshipType: dep.relationshipType,
            targetAssetType: dep.targetAssetType,
          },
        };
        edgeList.push(edge);
      });
    }

    // Add incoming dependency nodes and edges
    if (incomingDeps && incomingDeps.length > 0) {
      incomingDeps.forEach((dep: Dependency, index: number) => {
        const sourceNodeId = `${dep.sourceAssetType}-${dep.sourceAssetId}`;
        
        if (!nodeMap.has(sourceNodeId)) {
          // Position nodes in a semicircle above the center
          const angle = (Math.PI / (incomingDeps.length + 1)) * (index + 1);
          const radius = 200;
          const x = 300 + Math.cos(angle + Math.PI / 2) * radius;
          const y = 200 - Math.sin(angle + Math.PI / 2) * radius - 100;

          nodeMap.set(sourceNodeId, {
            id: sourceNodeId,
            type: 'asset',
            position: { x, y },
            data: {
              label: dep.sourceAssetName,
              assetType: dep.sourceAssetType,
              identifier: dep.sourceAssetIdentifier,
              assetId: dep.sourceAssetId,
              isCenter: false,
              isImpacted: impactedNodeIds.has(sourceNodeId),
              isSPOF: spofNodeIds.has(sourceNodeId),
              impactDepth: impactDepthMap.get(sourceNodeId) || 0,
            },
          });
        }

        const edge = {
          id: `edge-in-${dep.id}`,
          source: sourceNodeId,
          target: centerNodeId,
          label: relationshipLabels[dep.relationshipType] || dep.relationshipType,
          labelStyle: { fontSize: 10, fill: '#666' },
          labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
          labelBgPadding: [4, 2] as [number, number],
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#64748b',
          },
          style: { stroke: '#64748b', strokeWidth: 2, strokeDasharray: '5,5' },
          data: {
            relationshipType: dep.relationshipType,
            sourceAssetType: dep.sourceAssetType,
          },
        };
        edgeList.push(edge);
      });
    }

    // Apply filters
    let filteredEdges = edgeList;
    let filteredNodes = Array.from(nodeMap.values());

    if (filterAssetType !== 'all') {
      filteredEdges = edgeList.filter((edge) => {
        const sourceNode = filteredNodes.find((n) => n.id === edge.source);
        const targetNode = filteredNodes.find((n) => n.id === edge.target);
        return (
          sourceNode?.data.assetType === filterAssetType ||
          targetNode?.data.assetType === filterAssetType
        );
      });
      // Filter nodes to only show those connected by filtered edges
      const connectedNodeIds = new Set([
        ...filteredEdges.map((e) => e.source),
        ...filteredEdges.map((e) => e.target),
        centerNodeId, // Always include center node
      ]);
      filteredNodes = filteredNodes.filter((node) => connectedNodeIds.has(node.id));
    }

    if (filterRelationship !== 'all') {
      filteredEdges = filteredEdges.filter((edge) => edge.data?.relationshipType === filterRelationship);
      const connectedNodeIds = new Set([
        ...filteredEdges.map((e) => e.source),
        ...filteredEdges.map((e) => e.target),
        centerNodeId,
      ]);
      filteredNodes = filteredNodes.filter((node) => connectedNodeIds.has(node.id));
    }

    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [outgoingDeps, incomingDeps, isLoading, assetType, assetId, assetName, filterAssetType, filterRelationship, impactMode, dependencyChain, showSPOF, isLoadingChain, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data.isCenter) return;
    
    const config = assetTypeConfig[node.data.assetType as string];
    if (config && node.data.assetId) {
      router.push(`/dashboard/assets/${config.path}/${node.data.assetId}`);
    }
  }, [router]);

  const handleExportDiagram = useCallback(async () => {
    if (!reactFlowInstance) return;

    try {
      // Export as PNG
      const imageData = await reactFlowInstance.toImage({
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      // Create download link
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `dependency-graph-${assetName}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export diagram:', error);
    }
  }, [reactFlowInstance, assetName]);

  const totalDeps = (outgoingDeps?.length || 0) + (incomingDeps?.length || 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dependency Graph</CardTitle>
          <CardDescription>Visual representation of asset relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading dependencies...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalDeps === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dependency Graph</CardTitle>
          <CardDescription>Visual representation of asset relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Server className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">No dependencies</p>
            <p className="text-sm text-muted-foreground mt-1">
              This asset has no incoming or outgoing dependencies.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Dependency Graph</CardTitle>
            <CardDescription>
              {outgoingDeps?.length || 0} outgoing • {incomingDeps?.length || 0} incoming dependencies
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {edges.length} visible
            </Badge>
          </div>
        </div>
        {/* Impact Mode and SPOF Controls */}
        <div className="flex items-center gap-4 mt-3 p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Switch
              id="impact-mode"
              checked={impactMode}
              onCheckedChange={setImpactMode}
            />
            <Label htmlFor="impact-mode" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              Impact Analysis
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="spof-mode"
              checked={showSPOF}
              onCheckedChange={setShowSPOF}
            />
            <Label htmlFor="spof-mode" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Show SPOF
            </Label>
          </div>
          {impactMode && dependencyChain && (
            <Badge variant="outline" className="text-xs">
              {dependencyChain.totalCount} impacted assets (max depth: {dependencyChain.maxDepthReached})
            </Badge>
          )}
          {showSPOF && incomingDeps && (
            <Badge variant="outline" className="text-xs">
              {Array.from(new Set(incomingDeps.map(d => `${d.sourceAssetType}-${d.sourceAssetId}`))).filter(id => {
                const count = incomingDeps.filter(d => `${d.sourceAssetType}-${d.sourceAssetId}` === id).length;
                return count >= 3;
              }).length} SPOF detected
            </Badge>
          )}
        </div>
        {/* Filters and Export */}
        <div className="flex items-center gap-2 mt-3">
          <Select value={filterAssetType} onValueChange={setFilterAssetType}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Filter by type" />
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
          <Select value={filterRelationship} onValueChange={setFilterRelationship}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Filter by relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Relationships</SelectItem>
              {Object.entries(relationshipLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(filterAssetType !== 'all' || filterRelationship !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setFilterAssetType('all');
                setFilterRelationship('all');
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs ml-auto"
            onClick={handleExportDiagram}
          >
            <Download className="h-3 w-3 mr-1" />
            Export PNG
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] w-full border-t">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.5}
            maxZoom={1.5}
            className="bg-slate-50 dark:bg-slate-900"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls 
              position="bottom-left"
              showInteractive={false}
            />
            <Panel position="top-right" className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(assetTypeConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <div 
                          className="w-4 h-4 rounded flex items-center justify-center"
                          style={{ backgroundColor: config.bgColor, borderColor: config.color, borderWidth: 1 }}
                        >
                          <Icon className="h-2.5 w-2.5" style={{ color: config.color }} />
                        </div>
                        <span className="capitalize">{key}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-6 h-0.5 bg-slate-400" />
                    <span>Outgoing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <div className="w-6 h-0.5 bg-slate-500 border-dashed border-t-2" />
                    <span>Incoming</span>
                  </div>
                  {impactMode && (
                    <>
                      <div className="flex items-center gap-2 text-xs text-red-600 mt-1">
                        <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-100" />
                        <span>Impacted</span>
                      </div>
                    </>
                  )}
                  {showSPOF && (
                    <div className="flex items-center gap-2 text-xs text-purple-600 mt-1">
                      <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-100" />
                      <span>SPOF</span>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}

