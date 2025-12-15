'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { controlAssetMappingApi, ControlAssetMapping, AssetType, ImplementationStatus } from '@/lib/api/governance';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, Clock, XCircle, Plus, Shield } from 'lucide-react';
import { ControlBrowserDialog } from './control-browser-dialog';
import { AssetComplianceStatus } from './asset-compliance-status';

interface LinkedControlsListProps {
  assetType: AssetType;
  assetId: string;
  assetName?: string;
}

const implementationStatusConfig: Record<ImplementationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  not_implemented: { label: 'Not Implemented', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
  implemented: { label: 'Implemented', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
  not_applicable: { label: 'Not Applicable', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" /> },
};

const effectivenessScoreConfig: Record<number, { label: string; color: string }> = {
  1: { label: 'Very Low', color: 'bg-red-100 text-red-800' },
  2: { label: 'Low', color: 'bg-orange-100 text-orange-800' },
  3: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  4: { label: 'High', color: 'bg-blue-100 text-blue-800' },
  5: { label: 'Very High', color: 'bg-green-100 text-green-800' },
};

export function LinkedControlsList({ assetType, assetId, assetName }: LinkedControlsListProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [isControlBrowserOpen, setIsControlBrowserOpen] = useState(false);
  
  const { data: mappings, isLoading, error } = useQuery({
    queryKey: ['asset-controls', assetType, assetId],
    queryFn: () => controlAssetMappingApi.getControlsForAsset(assetType, assetId),
    refetchOnWindowFocus: false,
  });

  // Get existing control IDs for the browser dialog
  const existingControlIds = new Set(
    mappings?.map((m) => m.unified_control?.id || m.unified_control_id) || []
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Controls Protecting This Asset</h3>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Link Controls
          </Button>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control Name</TableHead>
                <TableHead>Implementation Status</TableHead>
                <TableHead>Effectiveness Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-3/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Controls Protecting This Asset</h3>
          <Button onClick={() => setIsControlBrowserOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Link Controls
          </Button>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Failed to load controls for this asset.</p>
        </div>
        <ControlBrowserDialog
          open={isControlBrowserOpen}
          onOpenChange={setIsControlBrowserOpen}
          assetType={assetType}
          assetId={assetId}
          assetName={assetName}
          existingControlIds={existingControlIds}
        />
      </div>
    );
  }

  const isEmpty = !mappings || mappings.length === 0;

  return (
    <div className="space-y-6">
      {/* Compliance Status Section */}
      {!isEmpty && (
        <AssetComplianceStatus mappings={mappings || []} assetName={assetName} />
      )}

      <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Controls Protecting This Asset ({mappings?.length || 0})
        </h3>
        <Button onClick={() => setIsControlBrowserOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Link Controls
        </Button>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-gray-500 mb-3">No controls are protecting this asset yet.</p>
          <Button variant="outline" onClick={() => setIsControlBrowserOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Link Your First Control
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control Name</TableHead>
                <TableHead>Implementation Status</TableHead>
                <TableHead>Effectiveness Score</TableHead>
                <TableHead>Mapped Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings?.map((mapping: ControlAssetMapping) => {
                const statusConfig = implementationStatusConfig[mapping.implementation_status];
                const scoreConfig = mapping.effectiveness_score 
                  ? (effectivenessScoreConfig[mapping.effectiveness_score] || { label: 'Unknown', color: 'bg-gray-100' })
                  : { label: 'Not Assessed', color: 'bg-gray-100 text-gray-800' };
                
                const controlName = mapping.unified_control?.title || mapping.unified_control_id;
                const controlId = mapping.unified_control?.id || mapping.unified_control_id;

                return (
                  <TableRow key={mapping.id}>
                    <TableCell>
                      <Link 
                        href={`/${locale}/dashboard/governance/controls/${controlId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {controlName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color} variant="default">
                        <span className="flex items-center gap-2">
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={scoreConfig.color} variant="default">
                        {mapping.effectiveness_score 
                          ? `${scoreConfig.label} (${mapping.effectiveness_score}/5)`
                          : scoreConfig.label
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {mapping.mapped_at
                        ? new Date(mapping.mapped_at).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ControlBrowserDialog
        open={isControlBrowserOpen}
        onOpenChange={setIsControlBrowserOpen}
        assetType={assetType}
        assetId={assetId}
        assetName={assetName}
        existingControlIds={existingControlIds}
      />
      </div>
    </div>
  );
}
