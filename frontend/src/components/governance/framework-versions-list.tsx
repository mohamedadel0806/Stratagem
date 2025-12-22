"use client";

import { FrameworkVersion } from "@/lib/api/governance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface FrameworkVersionsListProps {
  versions: FrameworkVersion[];
  currentVersion?: string;
  onSetCurrent: (version: string) => void;
}

export function FrameworkVersionsList({
  versions,
  currentVersion,
  onSetCurrent,
}: FrameworkVersionsListProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No versions found. Create the first version to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <Card key={version.id} className={version.is_current ? "border-primary" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Version {version.version}</CardTitle>
                {version.is_current && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Current
                  </Badge>
                )}
                {currentVersion === version.version && !version.is_current && (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
              {!version.is_current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetCurrent(version.version)}
                >
                  Set as Current
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {version.version_notes && (
                <p className="text-muted-foreground">{version.version_notes}</p>
              )}
              <div className="flex items-center gap-4 text-muted-foreground">
                {version.effective_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Effective: {format(new Date(version.effective_date), "MMM d, yyyy")}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {format(new Date(version.created_at), "MMM d, yyyy")}</span>
                </div>
                {version.creator && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>
                      {version.creator.first_name} {version.creator.last_name}
                    </span>
                  </div>
                )}
              </div>
              {version.structure?.domains && (
                <div className="mt-2">
                  <Badge variant="outline">
                    {version.structure.domains.length} domain{version.structure.domains.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


