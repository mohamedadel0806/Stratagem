'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { governanceApi, Policy } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { GitCompare, ArrowLeftRight } from 'lucide-react';

interface PolicyVersionComparisonProps {
  policyId: string;
  currentVersion: Policy;
}


export function PolicyVersionComparison({ policyId, currentVersion }: PolicyVersionComparisonProps) {
  const [selectedVersion1Id, setSelectedVersion1Id] = useState<string>(policyId);
  const [selectedVersion2Id, setSelectedVersion2Id] = useState<string | null>(null);

  const { data: versionsData, isLoading } = useQuery({
    queryKey: ['policy-versions', policyId],
    queryFn: () => governanceApi.getPolicyVersions(policyId),
    enabled: !!policyId,
  });

  const versions = versionsData?.data || [];

  const version1 = useMemo(() => {
    return versions.find((v) => v.id === selectedVersion1Id) || currentVersion;
  }, [versions, selectedVersion1Id, currentVersion]);

  const version2 = useMemo(() => {
    if (!selectedVersion2Id) return null;
    return versions.find((v) => v.id === selectedVersion2Id) || null;
  }, [versions, selectedVersion2Id]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading versions...</p>
        </CardContent>
      </Card>
    );
  }

  if (versions.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Only one version available. Create a new version to compare.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Version Comparison
          </CardTitle>
          <CardDescription>Compare different versions of this policy side by side</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Version Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Version 1 (Base)</label>
              <Select value={selectedVersion1Id} onValueChange={setSelectedVersion1Id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versions
                    .sort((a, b) => b.version_number - a.version_number)
                    .map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>v{version.version}</span>
                          <Badge variant="outline" className="ml-2">
                            {new Date(version.updated_at).toLocaleDateString()}
                          </Badge>
                          {version.id === currentVersion.id && (
                            <Badge variant="default" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {version1 && (
                <div className="text-xs text-muted-foreground">
                  Updated: {new Date(version1.updated_at).toLocaleString()}
                  {version1.updated_by && ` • By: ${version1.updater?.first_name || 'Unknown'} ${version1.updater?.last_name || ''}`}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Version 2 (Compare)</label>
              <Select
                value={selectedVersion2Id || 'none'}
                onValueChange={(value) => setSelectedVersion2Id(value === 'none' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select version to compare" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {versions
                    .sort((a, b) => b.version_number - a.version_number)
                    .filter((v) => v.id !== selectedVersion1Id)
                    .map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>v{version.version}</span>
                          <Badge variant="outline" className="ml-2">
                            {new Date(version.updated_at).toLocaleDateString()}
                          </Badge>
                          {version.id === currentVersion.id && (
                            <Badge variant="default" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {version2 && (
                <div className="text-xs text-muted-foreground">
                  Updated: {new Date(version2.updated_at).toLocaleString()}
                  {version2.updated_by && ` • By: ${version2.updater?.first_name || 'Unknown'} ${version2.updater?.last_name || ''}`}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          {selectedVersion2Id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const temp = selectedVersion1Id;
                setSelectedVersion1Id(selectedVersion2Id!);
                setSelectedVersion2Id(temp);
              }}
              className="w-full"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Swap Versions
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Comparison View */}
      {version2 ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Version 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version {version1.version}</CardTitle>
              <CardDescription>
                {new Date(version1.updated_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Title</h4>
                  <p className="text-sm">{version1.title}</p>
                </div>
                {version1.content && (
                  <div>
                    <h4 className="font-semibold mb-2">Content</h4>
                    <div className="h-[500px] w-full border rounded-md p-4 overflow-auto">
                      <RichTextEditor
                        content={version1.content}
                        onChange={() => {}}
                        editable={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Version 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version {version2.version}</CardTitle>
              <CardDescription>
                {new Date(version2.updated_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Title</h4>
                  <p
                    className={`text-sm ${
                      version1.title !== version2.title
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded'
                        : ''
                    }`}
                  >
                    {version2.title}
                  </p>
                </div>
                {version2.content && (
                  <div>
                    <h4 className="font-semibold mb-2">Content</h4>
                    <div className="h-[500px] w-full border rounded-md p-4 overflow-auto">
                      <RichTextEditor
                        content={version2.content}
                        onChange={() => {}}
                        editable={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Select a version to compare with Version {version1.version}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary of Differences */}
      {version1 && version2 && (
        <Card>
          <CardHeader>
            <CardTitle>Change Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Title Changed:</span>
                <Badge variant={version1.title !== version2.title ? 'default' : 'outline'}>
                  {version1.title !== version2.title ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Content Changed:</span>
                <Badge variant={version1.content !== version2.content ? 'default' : 'outline'}>
                  {version1.content !== version2.content ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Version Difference:</span>
                <Badge variant="outline">
                  v{version1.version} → v{version2.version}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days Between Versions:</span>
                <Badge variant="outline">
                  {Math.round(
                    (new Date(version2.updated_at).getTime() -
                      new Date(version1.updated_at).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

