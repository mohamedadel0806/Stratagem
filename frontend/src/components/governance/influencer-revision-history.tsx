'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, InfluencerRevision, RevisionType } from '@/lib/api/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, FileText, AlertTriangle } from 'lucide-react';

const revisionTypeLabels: Record<RevisionType, string> = {
  [RevisionType.CREATED]: 'Created',
  [RevisionType.UPDATED]: 'Updated',
  [RevisionType.STATUS_CHANGED]: 'Status Changed',
  [RevisionType.APPLICABILITY_CHANGED]: 'Applicability Changed',
  [RevisionType.REVIEWED]: 'Reviewed',
  [RevisionType.ARCHIVED]: 'Archived',
};

const revisionTypeColors: Record<RevisionType, string> = {
  [RevisionType.CREATED]: 'bg-green-100 text-green-800',
  [RevisionType.UPDATED]: 'bg-blue-100 text-blue-800',
  [RevisionType.STATUS_CHANGED]: 'bg-yellow-100 text-yellow-800',
  [RevisionType.APPLICABILITY_CHANGED]: 'bg-orange-100 text-orange-800',
  [RevisionType.REVIEWED]: 'bg-purple-100 text-purple-800',
  [RevisionType.ARCHIVED]: 'bg-gray-100 text-gray-800',
};

interface InfluencerRevisionHistoryProps {
  influencerId: string;
}

export function InfluencerRevisionHistory({ influencerId }: InfluencerRevisionHistoryProps) {
  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ['influencer-revisions', influencerId],
    queryFn: () => governanceApi.getInfluencerRevisions(influencerId),
    enabled: !!influencerId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revision History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading revision history...</p>
        </CardContent>
      </Card>
    );
  }

  if (revisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revision History</CardTitle>
          <CardDescription>Track all changes and reviews for this influencer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No revisions recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revision History</CardTitle>
        <CardDescription>Track all changes and reviews for this influencer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {revisions.map((revision) => (
              <div key={revision.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={revisionTypeColors[revision.revision_type]}>
                      {revisionTypeLabels[revision.revision_type]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(revision.revision_date).toLocaleDateString()}
                    </span>
                  </div>
                  {revision.reviewer && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {revision.reviewer.first_name} {revision.reviewer.last_name}
                    </div>
                  )}
                </div>

                {revision.revision_notes && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Notes
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{revision.revision_notes}</p>
                  </div>
                )}

                {revision.changes_summary && Object.keys(revision.changes_summary).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Changes:</div>
                    <div className="pl-4 space-y-1">
                      {Object.entries(revision.changes_summary).map(([field, change]) => (
                        <div key={field} className="text-sm">
                          <span className="font-medium">{field}:</span>{' '}
                          <span className="text-muted-foreground line-through">{String(change.old)}</span>
                          {' → '}
                          <span className="font-medium">{String(change.new)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {revision.impact_assessment && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <AlertTriangle className="h-4 w-4" />
                      Impact Assessment
                    </div>
                    {revision.impact_assessment.risk_level && (
                      <Badge variant="outline" className="ml-6">
                        Risk: {revision.impact_assessment.risk_level.toUpperCase()}
                      </Badge>
                    )}
                    {revision.impact_assessment.notes && (
                      <p className="text-sm text-muted-foreground pl-6">
                        {revision.impact_assessment.notes}
                      </p>
                    )}
                    {revision.impact_assessment.affected_policies &&
                      revision.impact_assessment.affected_policies.length > 0 && (
                        <div className="text-sm pl-6">
                          <span className="font-medium">Affected Policies:</span>{' '}
                          {revision.impact_assessment.affected_policies.length}
                        </div>
                      )}
                    {revision.impact_assessment.affected_controls &&
                      revision.impact_assessment.affected_controls.length > 0 && (
                        <div className="text-sm pl-6">
                          <span className="font-medium">Affected Controls:</span>{' '}
                          {revision.impact_assessment.affected_controls.length}
                        </div>
                      )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Clock className="h-3 w-3" />
                  {new Date(revision.created_at).toLocaleString()}
                  {revision.creator && (
                    <>
                      {' • '}
                      <User className="h-3 w-3" />
                      {revision.creator.first_name} {revision.creator.last_name}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


