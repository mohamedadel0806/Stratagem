'use client';

import { Clock, FileText, Shield, CheckCircle, AlertTriangle, FileUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'policy' | 'control' | 'assessment' | 'finding' | 'evidence';
  action: string;
  entityName: string;
  userName?: string;
  createdAt: string;
}

interface GovernanceActivityFeedProps {
  activities: Activity[];
}

export function GovernanceActivityFeed({ activities }: GovernanceActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'control':
        return <Shield className="h-5 w-5 text-emerald-600" />;
      case 'assessment':
        return <CheckCircle className="h-5 w-5 text-amber-600" />;
      case 'finding':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'evidence':
        return <FileUp className="h-5 w-5 text-purple-600" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0">
          <div className="flex-shrink-0 mt-1">
            {getIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              <span className="capitalize">{activity.action}</span> {getTypeLabel(activity.type)}
            </p>
            <p className="text-sm text-muted-foreground">{activity.entityName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
              {activity.userName && (
                <>
                  <span>•</span>
                  <span>by {activity.userName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
