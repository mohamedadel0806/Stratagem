'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface EscalationChain {
  id: string;
  alertId: string;
  status: 'pending' | 'in_progress' | 'escalated' | 'resolved' | 'cancelled';
  currentLevel: number;
  maxLevels: number;
  nextEscalationAt: string;
  escalationHistory: Array<{
    level: number;
    escalatedAt: string;
    escalatedToRoles: string[];
    notificationsSent?: Array<{
      channel: string;
      recipients: string[];
      sentAt: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface EscalationChainsListProps {
  alertId: string;
  showCreateButton?: boolean;
  onEscalate?: (chainId: string) => void;
  onResolve?: (chainId: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  escalated: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  in_progress: <AlertCircle className="w-4 h-4" />,
  escalated: <AlertCircle className="w-4 h-4" />,
  resolved: <CheckCircle2 className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

export function EscalationChainsList({ alertId, showCreateButton = false, onEscalate, onResolve }: EscalationChainsListProps) {
  const [localChains, setLocalChains] = useState<EscalationChain[]>([]);

  // Fetch escalation chains for this alert
  const { data: chainsData, isLoading, error } = useQuery({
    queryKey: ['escalation-chains', alertId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/governance/alert-escalation/alerts/${alertId}/chains`);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (chainsData) {
      setLocalChains(chainsData);
    }
  }, [chainsData]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading escalation chains...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load escalation chains</div>;
  }

  if (!localChains || localChains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Escalation Chains
          </CardTitle>
          <CardDescription>No active escalation chains for this alert</CardDescription>
        </CardHeader>
        {showCreateButton && (
          <CardContent>
            <Button variant="outline" size="sm">
              Create Escalation Chain
            </Button>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Escalation Chains ({localChains.length})</h3>
        {showCreateButton && <Button variant="outline" size="sm">Create Chain</Button>}
      </div>

      {localChains.map((chain) => (
        <Card key={chain.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcons[chain.status]}
                <div>
                  <CardTitle className="text-base">Escalation Chain</CardTitle>
                  <CardDescription>Level {chain.currentLevel} of {chain.maxLevels}</CardDescription>
                </div>
              </div>
              <Badge className={statusColors[chain.status]} variant="outline">
                {chain.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Escalation Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="text-gray-600">{chain.currentLevel} / {chain.maxLevels}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(chain.currentLevel / chain.maxLevels) * 100}%` }}
                  />
                </div>
              </div>

              {/* Next Escalation Time */}
              {chain.nextEscalationAt && chain.status !== 'resolved' && (
                <div className="text-sm">
                  <span className="font-medium">Next Escalation:</span>
                  <p className="text-gray-600">
                    {new Date(chain.nextEscalationAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Escalation History */}
              {chain.escalationHistory && chain.escalationHistory.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">History</h4>
                  <div className="space-y-2 text-sm">
                    {chain.escalationHistory.map((entry, idx) => (
                      <div key={idx} className="border-l-2 border-gray-300 pl-3">
                        <div className="font-medium">Level {entry.level}</div>
                        <div className="text-gray-600">
                          {new Date(entry.escalatedAt).toLocaleString()}
                        </div>
                        <div className="text-gray-600">
                          Roles: {entry.escalatedToRoles.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {chain.status !== 'resolved' && chain.status !== 'cancelled' && (
                <div className="flex gap-2 pt-2">
                  {chain.currentLevel < chain.maxLevels && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEscalate?.(chain.id)}
                    >
                      Escalate Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResolve?.(chain.id)}
                  >
                    Mark as Resolved
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
