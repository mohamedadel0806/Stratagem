'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { ComplianceGap } from '@/lib/api/governance';

interface ComplianceGapWidgetProps {
  gaps: ComplianceGap[];
}

export const ComplianceGapWidget: React.FC<ComplianceGapWidgetProps> = ({ gaps }) => {
  const criticalGaps = gaps.filter(g => g.severity === 'critical');
  const mediumGaps = gaps.filter(g => g.severity === 'medium');
  const lowGaps = gaps.filter(g => g.severity === 'low');

  const getIcon = (severity: 'critical' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: 'critical' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getSeverityBadgeColor = (severity: 'critical' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (gaps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Gaps</CardTitle>
          <CardDescription>No compliance gaps identified</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 text-sm">Great news! Your organization has no compliance gaps identified.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gap Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalGaps.length}</div>
            <p className="text-xs text-gray-500 mt-1">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Medium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{mediumGaps.length}</div>
            <p className="text-xs text-gray-500 mt-1">Should be addressed soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Low
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{lowGaps.length}</div>
            <p className="text-xs text-gray-500 mt-1">Monitor and plan</p>
          </CardContent>
        </Card>
      </div>

      {/* Gap Details */}
      <Card>
        <CardHeader>
          <CardTitle>Gap Details</CardTitle>
          <CardDescription>Detailed list of all compliance gaps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {gaps.length > 0 ? (
            gaps.map((gap, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(gap.severity)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(gap.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">{gap.description}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">Affected Item:</span> {gap.affected_item}
                        </p>
                        {gap.gap_id && (
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Gap ID:</span> {gap.gap_id}
                          </p>
                        )}
                        {gap.type && (
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Type:</span> {gap.type}
                          </p>
                        )}
                        {gap.remediation_steps && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Remediation Steps:</p>
                            <p className="text-xs text-gray-600 whitespace-pre-wrap mt-1">
                              {gap.remediation_steps}
                            </p>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ${getSeverityBadgeColor(gap.severity)}`}>
                        {gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No gaps to display</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
