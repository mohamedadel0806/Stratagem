'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { governanceApi } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/hooks/use-toast';

export interface PolicyTreeNode {
  id: string;
  title: string;
  policy_type: string;
  status: string;
  version: string;
  parent_policy_id?: string;
  children: PolicyTreeNode[];
}

export interface PolicyHierarchyProps {
  policyId?: string;
  onPolicySelect?: (policyId: string) => void;
  viewMode?: 'tree' | 'hierarchy' | 'full';
}

/**
 * Component for displaying and managing policy hierarchies
 * Story 2.1: Policy Hierarchy & Management
 */
export function PolicyHierarchy({
  policyId,
  onPolicySelect,
  viewMode = 'tree',
}: PolicyHierarchyProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showParentDialog, setShowParentDialog] = useState(false);
  const [parentPolicies, setParentPolicies] = useState<PolicyTreeNode[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>('');

  // Fetch hierarchy tree
  const {
    data: hierarchyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['policy-hierarchy-tree', policyId],
    queryFn: async () => {
      if (!policyId) {
        // Get all root hierarchies
        const response = await governanceApi.policies.getHierarchyRoots();
        return response;
      }
      const response = await governanceApi.policies.getHierarchyTree(policyId);
      return response;
    },
    enabled: !!policyId || viewMode === 'full',
  });

  // Fetch complete hierarchy info
  const {
    data: completeHierarchy,
    isLoading: isLoadingComplete,
  } = useQuery({
    queryKey: ['policy-complete-hierarchy', selectedNode],
    queryFn: async () => {
      if (!selectedNode) return null;
      return governanceApi.policies.getCompleteHierarchy(selectedNode);
    },
    enabled: !!selectedNode && viewMode === 'hierarchy',
  });

  // Get all root policies for parent selection
  const fetchRootPolicies = async () => {
    try {
      const response = await governanceApi.policies.getHierarchyRoots();
      setParentPolicies(response || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load root policies',
        variant: 'destructive',
      });
    }
  };

  const toggleNodeExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSetParent = async () => {
    if (!selectedNode || !selectedParent) return;

    try {
      await governanceApi.policies.setHierarchyParent(selectedNode, {
        parent_policy_id: selectedParent || null,
        reason: 'Updated via hierarchy visualization',
      });

      toast({
        title: 'Success',
        description: 'Policy parent updated successfully',
      });

      setShowParentDialog(false);
      setSelectedParent('');
      // Refetch hierarchy
      // You might need to add a refetch function here
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update parent policy',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Spinner />
        <span className="ml-2">Loading policy hierarchy...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-800">Error loading policy hierarchy</p>
        <p className="text-red-600 text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </Card>
    );
  }

  const TreeNode = ({ node, depth = 0 }: { node: PolicyTreeNode; depth?: number }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer group',
            selectedNode === node.id && 'bg-blue-100 border-l-4 border-blue-500',
          )}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => {
            setSelectedNode(node.id);
            onPolicySelect?.(node.id);
          }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpanded(node.id);
              }}
              className="flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{node.title}</span>
              <Badge variant="outline" className={getStatusColor(node.status)}>
                {node.status}
              </Badge>
              <span className="text-xs text-gray-500">v{node.version}</span>
            </div>
            <div className="text-xs text-gray-600">{node.policy_type}</div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fetchRootPolicies();
                setShowParentDialog(true);
              }}
            >
              <GitBranch className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPolicySelect?.(node.id);
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const hierarchyContent = policyId ? (
    hierarchyData && <TreeNode node={hierarchyData} depth={0} />
  ) : (
    <div className="space-y-4">
      {Array.isArray(hierarchyData) &&
        hierarchyData.map((root: PolicyTreeNode) => (
          <div key={root.id}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              {root.title}
            </h3>
            <div className="border-l-2 border-gray-200 pl-4">
              <TreeNode node={root} depth={0} />
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tree View */}
      {(viewMode === 'tree' || viewMode === 'full') && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Policy Hierarchy
            </h2>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {hierarchyContent}
          </div>
        </Card>
      )}

      {/* Hierarchy Details */}
      {viewMode === 'hierarchy' && selectedNode && completeHierarchy && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-600">Hierarchy Level</h3>
              <p className="text-2xl font-bold">{completeHierarchy.level}</p>
            </div>

            {completeHierarchy.ancestors && completeHierarchy.ancestors.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-2">Ancestors</h3>
                <div className="space-y-1">
                  {completeHierarchy.ancestors.map((ancestor: any) => (
                    <div key={ancestor.id} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Level {ancestor.level}</span>
                      <span>{ancestor.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">
                Children ({completeHierarchy.children?.length || 0})
              </h3>
              {completeHierarchy.children && completeHierarchy.children.length > 0 ? (
                <div className="space-y-1">
                  {completeHierarchy.children.map((child: any) => (
                    <div
                      key={child.id}
                      className="p-2 bg-gray-50 rounded text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedNode(child.id)}
                    >
                      {child.title}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No child policies</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-600">
                Descendants: {completeHierarchy.descendantCount || 0}
              </h3>
              <p className="text-xs text-gray-500">
                Max Depth: {completeHierarchy.maxDepth || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Parent Assignment Dialog */}
      <Dialog open={showParentDialog} onOpenChange={setShowParentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Parent Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="parent">Parent Policy</Label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent policy or leave empty for root" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Parent (Root)</SelectItem>
                  {parentPolicies.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowParentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetParent}>Set Parent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
