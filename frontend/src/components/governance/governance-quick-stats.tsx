'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, ClipboardCheck, AlertTriangle } from 'lucide-react';

interface Summary {
  totalInfluencers?: number;
  totalPolicies?: number;
  totalControls?: number;
  totalAssessments?: number;
  totalFindings?: number;
  criticalFindings?: number;
}

interface GovernanceQuickStatsProps {
  summary: Summary;
}

export function GovernanceQuickStats({ summary }: GovernanceQuickStatsProps) {
  const stats = [
    {
      label: 'Policies',
      value: summary.totalPolicies || 0,
      icon: FileText,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      label: 'Controls',
      value: summary.totalControls || 0,
      icon: Shield,
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Assessments',
      value: summary.totalAssessments || 0,
      icon: ClipboardCheck,
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      label: 'Critical Findings',
      value: summary.criticalFindings || 0,
      icon: AlertTriangle,
      color: summary.criticalFindings > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200',
      textColor: summary.criticalFindings > 0 ? 'text-red-700' : 'text-gray-700',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`${stat.color} border`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <Icon className={`h-12 w-12 opacity-20 ${stat.textColor}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
