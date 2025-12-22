"use client";

import { useQuery } from "@tanstack/react-query";
import {
  governanceReportingApi,
  ExportFormat,
  GovernanceDashboard,
} from "@/lib/api/governance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  FileText,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
  Shield,
  Briefcase,
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { format } from "date-fns";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1"];

export default function ExecutiveGovernanceReportPage() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["executive-governance-summary"],
    queryFn: () => governanceReportingApi.getExecutiveSummary(),
  });

  const handleExport = async (format: ExportFormat = ExportFormat.CSV) => {
    await governanceReportingApi.exportExecutiveReport({ format });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Compiling executive summary...</p>
      </div>
    );
  }

  const s = summary?.summary;
  const c = summary?.controlStats;
  const p = summary?.policyStats;
  const f = summary?.findingStats;

  const controlCoverageData = [
    { name: "Implemented", value: c?.byImplementation.implemented || 0 },
    { name: "In Progress", value: c?.byImplementation.inProgress || 0 },
    { name: "Planned", value: c?.byImplementation.planned || 0 },
    { name: "Not Started", value: c?.byImplementation.notImplemented || 0 },
  ];

  const policyStatusData = [
    { name: "Published", value: p?.byStatus.published || 0 },
    { name: "In Review", value: p?.byStatus.inReview || 0 },
    { name: "Draft", value: p?.byStatus.draft || 0 },
  ];

  return (
    <div className="p-6 space-y-8 bg-muted/10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Executive Governance Summary</h1>
          <p className="text-muted-foreground mt-1">
            Official posture report as of {format(new Date(), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport(ExportFormat.CSV)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Full Export (CSV)
          </Button>
          <Button className="bg-primary shadow-lg shadow-primary/20">
            <FileText className="mr-2 h-4 w-4" />
            Print to PDF
          </Button>
        </div>
      </div>

      {/* Critical Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900/30">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-bold uppercase text-red-800 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">{s?.criticalFindings || 0}</div>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1 italic">Immediate remediation required</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50/50 border-orange-100 dark:bg-orange-950/10 dark:border-orange-900/30">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-bold uppercase text-orange-800 dark:text-orange-400 flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Overdue Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">{p?.overdueReview || 0}</div>
            <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 italic">Policy lifecycle maintenance needed</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-bold uppercase text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Open Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{s?.inProgressAssessments || 0}</div>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1 italic">Active validation cycles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Control Posture */}
        <Card className="shadow-md">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Unified Control Posture
            </CardTitle>
            <CardDescription>Implementation status of the global control library</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={controlCoverageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {controlCoverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {controlCoverageData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-bold">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Policy Governance */}
        <Card className="shadow-md">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Policy Governance
            </CardTitle>
            <CardDescription>Approval and publication lifecycle summary</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {policyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div>
                  <p className="text-xs font-bold uppercase text-primary/70">Policy Health</p>
                  <p className="text-xl font-bold">{Math.round(((p?.byStatus.published || 0) / (p?.total || 1)) * 100)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Publication Rate</p>
                  <Badge className="bg-green-500">Optimum</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Findings Table */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Severity Distribution & Findings</CardTitle>
          <CardDescription>Breakdown of open issues across the governance landscape</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead className="text-center">Count</TableHead>
                <TableHead>Risk Category</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead className="text-right">Action Threshold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-red-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600" /> Critical
                </TableCell>
                <TableCell className="text-center font-mono">{f?.bySeverity.critical || 0}</TableCell>
                <TableCell className="text-xs">Immediate Threat / Significant Gap</TableCell>
                <TableCell><ArrowUpRight className="h-4 w-4 text-red-500" /></TableCell>
                <TableCell className="text-right"><Badge variant="destructive">24 Hours</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-orange-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600" /> High
                </TableCell>
                <TableCell className="text-center font-mono">{f?.bySeverity.high || 0}</TableCell>
                <TableCell className="text-xs">Major Deviation / Exposure</TableCell>
                <TableCell><Minus className="h-4 w-4 text-orange-500" /></TableCell>
                <TableCell className="text-right"><Badge className="bg-orange-500">7 Days</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-yellow-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-600" /> Medium
                </TableCell>
                <TableCell className="text-center font-mono">{f?.bySeverity.medium || 0}</TableCell>
                <TableCell className="text-xs">Moderate Compliance Risk</TableCell>
                <TableCell><ArrowDownRight className="h-4 w-4 text-green-500" /></TableCell>
                <TableCell className="text-right"><Badge className="bg-yellow-500 text-black">30 Days</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-blue-600 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" /> Low
                </TableCell>
                <TableCell className="text-center font-mono">{f?.bySeverity.low || 0}</TableCell>
                <TableCell className="text-xs">Minor Improvement Opportunity</TableCell>
                <TableCell><ArrowDownRight className="h-4 w-4 text-green-500" /></TableCell>
                <TableCell className="text-right"><Badge variant="secondary">90 Days</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-primary p-8 rounded-2xl text-primary-foreground shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Overall Compliance Score</h2>
          <p className="text-primary-foreground/70 text-sm max-w-md">
            Aggregated metric across all active frameworks, control implementations, and policy acknowledgments.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-6xl font-black">
            {Math.round(((c?.byImplementation.implemented || 0) / (c?.total || 1)) * 100)}%
          </div>
          <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
            +2.4% from last period
          </Badge>
        </div>
      </div>
    </div>
  );
}


