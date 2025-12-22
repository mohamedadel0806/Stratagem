"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  History, 
  Users, 
  Activity, 
  Database,
  Calendar,
  AlertCircle
} from "lucide-react";
import { governanceApi } from "@/lib/api/governance";
import { AuditLogList } from "@/components/governance/audit-log-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GovernanceAuditLogsPage() {
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["governance-audit-summary"],
    queryFn: () => governanceApi.getAuditLogSummary(),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Trails</h1>
          <p className="text-muted-foreground">
            Monitor and track all governance-related activities and changes
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalLogs || 0}</div>
            <p className="text-xs text-muted-foreground">Recorded events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.uniqueUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Types</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.uniqueActions || 0}</div>
            <p className="text-xs text-muted-foreground">Distinct operations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entities Tracked</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.uniqueEntities || 0}</div>
            <p className="text-xs text-muted-foreground">Managed resources</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AuditLogList />
        </TabsContent>

        <TabsContent value="policies">
          <AuditLogList entityType="Policy" title="Policy Audit Trail" />
        </TabsContent>

        <TabsContent value="influencers">
          <AuditLogList entityType="Influencer" title="Influencer Audit Trail" />
        </TabsContent>

        <TabsContent value="controls">
          <AuditLogList entityType="UnifiedControl" title="Control Audit Trail" />
        </TabsContent>

        <TabsContent value="frameworks">
          <AuditLogList entityType="FrameworkVersion" title="Framework Audit Trail" />
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Audit Retention Policy</AlertTitle>
        <AlertDescription>
          Governance audit logs are retained for 90 days. For long-term archival, please use the export feature to generate monthly reports.
        </AlertDescription>
      </Alert>
    </div>
  );
}


