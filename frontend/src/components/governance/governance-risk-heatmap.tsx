'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RiskMatrix {
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  items?: string[];
}

interface GovernanceRiskHeatmapProps {
  risks: RiskMatrix[];
}

export function GovernanceRiskHeatmap({ risks }: GovernanceRiskHeatmapProps) {
  if (!risks || risks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Heat Map</CardTitle>
          <CardDescription>Risk distribution by likelihood and impact</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No risk data available</p>
        </CardContent>
      </Card>
    );
  }

  const getLevelIndex = (level: string): number => {
    const levels = { low: 0, medium: 1, high: 2, critical: 3 };
    return levels[level as keyof typeof levels] || 0;
  };

  const getLevelColor = (likelihood: string, impact: string): string => {
    const likelihoodIdx = getLevelIndex(likelihood);
    const impactIdx = getLevelIndex(impact);
    const severity = likelihoodIdx + impactIdx;

    if (severity >= 5) return 'bg-red-500 text-white';
    if (severity >= 3) return 'bg-orange-500 text-white';
    if (severity >= 2) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const levels = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Heat Map</CardTitle>
        <CardDescription>Risk distribution by likelihood and impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              <div className="w-24"></div>
              {levels.map(level => (
                <div key={level} className="w-20 text-xs font-medium text-center">
                  {level}
                </div>
              ))}
            </div>

            {levels.map((impactLevel, impactIdx) => (
              <div key={impactLevel} className="flex gap-1 min-w-max">
                <div className="w-24 text-xs font-medium flex items-center">
                  {impactLevel}
                </div>
                {levels.map((likelihoodLevel, likelihoodIdx) => {
                  const risk = risks.find(
                    r =>
                      getLevelIndex(r.likelihood) === likelihoodIdx &&
                      getLevelIndex(r.impact) === impactIdx
                  );

                  return (
                    <div
                      key={`${impactLevel}-${likelihoodLevel}`}
                      className={`w-20 h-20 flex items-center justify-center rounded text-center cursor-pointer transition-all hover:shadow-md ${
                        risk
                          ? getLevelColor(
                              levels[likelihoodIdx].toLowerCase(),
                              levels[impactIdx].toLowerCase()
                            )
                          : 'bg-gray-100'
                      }`}
                    >
                      {risk && (
                        <div>
                          <div className="text-lg font-bold">{risk.count}</div>
                          <div className="text-xs opacity-75">items</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium mb-2">Risk Level:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
