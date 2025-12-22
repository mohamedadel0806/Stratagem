'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronDown,
  ChevronRight,
  folder,
  FolderOpen,
} from 'lucide-react';
import { governanceApi } from '@/lib/api/governance';
import { ControlDomainTreeNodeDto } from '@/lib/api/types/control-library';

interface DomainTreeItemProps {
  node: ControlDomainTreeNodeDto;
  level: number;
  onSelect: (domainId: string) => void;
  selectedDomain: string | null;
}

function DomainTreeItem({ node, level, onSelect, selectedDomain }: DomainTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg cursor-pointer transition-colors ${
          selectedDomain === node.id ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren && (
          <button
            className="p-0 hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        {!hasChildren && <div className="w-4" />}

        <span className="text-sm font-medium flex-1">{node.name}</span>

        {node.code && (
          <Badge variant="outline" className="text-xs">
            {node.code}
          </Badge>
        )}

        <Badge variant="secondary" className="text-xs">
          {node.controlCount}
        </Badge>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <DomainTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedDomain={selectedDomain}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DomainBrowser() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [expandAll, setExpandAll] = useState(true);

  // Fetch domain hierarchy tree
  const { data: domainTree, isLoading } = useQuery({
    queryKey: ['domain-hierarchy-tree'],
    queryFn: () => governanceApi.getDomainTree(),
  });

  // Fetch controls for selected domain
  const { data: selectedDomainControls } = useQuery({
    queryKey: ['domain-controls', selectedDomain],
    queryFn: () => governanceApi.getControlsByDomain(selectedDomain!),
    enabled: !!selectedDomain,
  });

  const flatDomainList = useMemo(() => {
    const flatten = (nodes: ControlDomainTreeNodeDto[], acc: ControlDomainTreeNodeDto[] = []): ControlDomainTreeNodeDto[] => {
      nodes.forEach((node) => {
        acc.push(node);
        if (node.children && node.children.length > 0) {
          flatten(node.children, acc);
        }
      });
      return acc;
    };

    return domainTree ? flatten(domainTree) : [];
  }, [domainTree]);

  const totalControls = useMemo(() => {
    const sum = (nodes: ControlDomainTreeNodeDto[]): number => {
      return nodes.reduce((acc, node) => {
        return acc + node.controlCount + (node.children ? sum(node.children) : 0);
      }, 0);
    };
    return domainTree ? sum(domainTree) : 0;
  }, [domainTree]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Domain Tree */}
      <div className="md:col-span-1">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Domain Hierarchy</CardTitle>
                <CardDescription className="text-xs">
                  {flatDomainList.length} domains
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandAll(!expandAll)}
                className="text-xs"
              >
                {expandAll ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading domains...
              </div>
            ) : !domainTree || domainTree.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No domains found
              </div>
            ) : (
              <div className="space-y-1">
                {domainTree.map((node) => (
                  <DomainTreeItem
                    key={node.id}
                    node={node}
                    level={0}
                    onSelect={setSelectedDomain}
                    selectedDomain={selectedDomain}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain Details */}
      <div className="md:col-span-2">
        {selectedDomain ? (
          <>
            {/* Summary Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      {
                        flatDomainList.find((d) => d.id === selectedDomain)
                          ?.name
                      }
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Domain ID: {selectedDomain}
                    </CardDescription>
                  </div>
                  <Badge>{selectedDomainControls?.length || 0} controls</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Controls List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls in This Domain</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDomainControls && selectedDomainControls.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDomainControls.map((control) => (
                      <div
                        key={control.id}
                        className="p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-mono text-xs text-muted-foreground">
                              {control.control_identifier}
                            </p>
                            <p className="font-medium text-sm">{control.title}</p>
                            {control.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {control.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs whitespace-nowrap">
                              {control.control_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                              {control.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {control.complexity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {control.implementation_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No controls in this domain
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <p>Select a domain from the hierarchy to view its controls</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
