'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { RemediationTracker, RemediationStatus } from '@/lib/api/governance';
import { cn } from '@/lib/utils';

interface RemediationGanttProps {
  trackers: RemediationTracker[];
  isLoading?: boolean;
}

const statusConfig: Record<RemediationStatus, { color: string; icon: React.ReactNode; label: string }> = {
  on_track: {
    color: 'bg-green-500',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'On Track',
  },
  at_risk: {
    color: 'bg-yellow-500',
    icon: <Clock className="h-4 w-4" />,
    label: 'At Risk',
  },
  overdue: {
    color: 'bg-red-500',
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Overdue',
  },
  completed: {
    color: 'bg-blue-500',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Completed',
  },
};

export function RemediationGanttChart({ trackers, isLoading }: RemediationGanttProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Remediation Timeline</CardTitle>
          <CardDescription>Gantt view of remediation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trackers.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Remediation Timeline</CardTitle>
          <CardDescription>Gantt view of remediation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No active remediations
          </div>
        </CardContent>
      </Card>
    );
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  // Calculate date range (current + 30 days ahead)
  const minDate = today;
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  const getBarPosition = (date: string): { left: number; width: number } => {
    const itemDate = new Date(date);
    itemDate.setUTCHours(0, 0, 0, 0);
    const daysFromStart = Math.ceil((itemDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const left = (Math.max(0, daysFromStart) / totalDays) * 100;
    return {
      left: Math.max(0, Math.min(100, left)),
      width: 4,
    };
  };

  const getProgressBar = (
    tracker: RemediationTracker,
  ): { left: number; width: number; percentComplete: number } => {
    const startDate = new Date(tracker.created_at);
    startDate.setUTCHours(0, 0, 0, 0);
    let endDate = new Date(tracker.sla_due_date);
    endDate.setUTCHours(0, 0, 0, 0);

    if (tracker.completion_date) {
      endDate = new Date(tracker.completion_date);
      endDate.setUTCHours(0, 0, 0, 0);
    }

    const taskStartDays = Math.max(
      0,
      Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const taskEndDays = Math.max(
      0,
      Math.ceil((endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const taskDuration = Math.max(1, taskEndDays - taskStartDays);

    return {
      left: (taskStartDays / totalDays) * 100,
      width: (taskDuration / totalDays) * 100,
      percentComplete: tracker.progress_percent,
    };
  };

  const sortedTrackers = [...trackers].sort((a, b) => {
    const statusOrder = { overdue: 0, at_risk: 1, on_track: 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remediation Timeline</CardTitle>
        <CardDescription>Gantt view of remediation progress (30-day window)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Timeline header */}
            <div className="flex gap-4 mb-4">
              <div className="w-48 flex-shrink-0" />
              <div className="flex-1 relative h-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-border" />
                </div>
                <div className="relative h-full flex justify-between">
                  {[0, 7, 14, 21, 28].map((day) => (
                    <div key={day} className="text-xs text-muted-foreground">
                      {day}d
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gantt rows */}
            {sortedTrackers.map((tracker) => {
              const config = statusConfig[tracker.status];
              const progressBar = getProgressBar(tracker);
              const dueBar = getBarPosition(tracker.sla_due_date);

              return (
                <div key={tracker.id} className="flex gap-4 mb-3 items-center">
                  <div className="w-48 flex-shrink-0">
                    <div className="text-sm font-medium truncate">{tracker.finding_title}</div>
                    <div className="text-xs text-muted-foreground">{tracker.finding_identifier}</div>
                  </div>
                  <div className="flex-1 relative h-8">
                    {/* SLA due date marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-300 opacity-50"
                      style={{ left: `${dueBar.left}%` }}
                      title={`SLA Due: ${tracker.sla_due_date}`}
                    />

                    {/* Progress bar background */}
                    <div
                      className={cn(
                        'absolute top-2 bottom-2 rounded-sm opacity-20',
                        config.color,
                      )}
                      style={{
                        left: `${progressBar.left}%`,
                        width: `${progressBar.width}%`,
                      }}
                    />

                    {/* Progress bar fill */}
                    <div
                      className={cn(
                        'absolute top-2 bottom-2 rounded-sm transition-all',
                        config.color,
                      )}
                      style={{
                        left: `${progressBar.left}%`,
                        width: `${(progressBar.width * progressBar.percentComplete) / 100}%`,
                      }}
                    />

                    {/* Status label */}
                    <div className="absolute inset-y-0 left-full ml-2 flex items-center gap-1 whitespace-nowrap">
                      {config.icon}
                      <span className="text-xs font-medium">{config.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ({tracker.progress_percent}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="mt-6 pt-4 border-t flex gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm bg-red-300" />
                <span>SLA Due Date</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500 opacity-50" />
                <span>Timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <span>Progress</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
