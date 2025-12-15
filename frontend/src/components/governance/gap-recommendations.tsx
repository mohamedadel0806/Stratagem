'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface GapRecommendationsProps {
  recommendations: string[];
}

export function GapRecommendations({ recommendations }: GapRecommendationsProps) {
  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.includes('critical') || recommendation.includes('immediately')) {
      return <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />;
    }
    if (recommendation.includes('good') || recommendation.includes('looks good')) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />;
    }
    return <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />;
  };

  const isPositive = recommendations.some(r => r.includes('looks good'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPositive && (
          <Alert className="bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 ml-2">
              Your framework coverage is excellent! Continue monitoring for any new requirements.
            </AlertDescription>
          </Alert>
        )}

        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex gap-3">
            {getRecommendationIcon(recommendation)}
            <p className="text-sm leading-relaxed">{recommendation}</p>
          </div>
        ))}

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-2">Quick Actions:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Review critical gaps first</li>
            <li>• Create controls for unmapped requirements</li>
            <li>• Schedule regular gap analysis (monthly)</li>
            <li>• Document remediation plans for high-priority gaps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
