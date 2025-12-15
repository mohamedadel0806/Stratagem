'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetComplianceView } from '@/components/assets/asset-compliance-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AssetComplianceStatusPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Compliance Status</h1>
        <p className="text-muted-foreground mt-2">
          View the compliance status of all assets based on assigned controls and compliance requirements.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AssetComplianceView />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
              <CardDescription>
                This section will show detailed compliance information for selected assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select an asset from the overview to see its detailed compliance information including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                <li>Linked compliance requirements</li>
                <li>Implementation status of each requirement</li>
                <li>Assessment results and recommendations</li>
                <li>Compliance gaps and remediation actions</li>
                <li>Historical compliance trends</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
