'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ComplianceStatus {
  framework: string;
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'assessment-required';
  score: number;
  lastAssessment?: string;
}

interface GovernanceComplianceStatusProps {
  frameworks?: ComplianceStatus[];
  statuses?: ComplianceStatus[];
}

export function GovernanceComplianceStatus({ frameworks, statuses }: GovernanceComplianceStatusProps) {
  const data = frameworks || statuses || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'partially-compliant':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'non-compliant':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'assessment-required':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-emerald-100 text-emerald-700';
      case 'partially-compliant':
        return 'bg-amber-100 text-amber-700';
      case 'non-compliant':
        return 'bg-red-100 text-red-700';
      case 'assessment-required':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>Framework compliance assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No compliance data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
        <CardDescription>Framework compliance assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((status, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(status.status)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{status.framework}</p>
                  {status.lastAssessment && (
                    <p className="text-xs text-muted-foreground">
                      Last assessed: {new Date(status.lastAssessment).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getScoreColor(status.score)}`}>
                  {status.score}%
                </span>
                <Badge className={getStatusBadgeVariant(status.status)} variant="outline">
                  {status.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
