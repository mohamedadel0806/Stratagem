"use client";

import { useQuery } from "@tanstack/react-query";
import {
  governanceReportingApi,
  ExportFormat,
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
} from "recharts";
import {
  FileText,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
  Users,
  Building,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1"];

export default function PolicyComplianceReportPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["policy-compliance-stats"],
    queryFn: () => governanceReportingApi.getPolicyComplianceStats(),
  });

  const handleExport = async (format: ExportFormat = ExportFormat.CSV) => {
    await governanceReportingApi.exportPolicyCompliance({ format });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating compliance report...</p>
      </div>
    );
  }

  const overallRate = stats ? Math.round(
    (stats.byPolicy.reduce((sum, p) => sum + p.acknowledged, 0) / 
     (stats.byPolicy.reduce((sum, p) => sum + p.totalAssignments, 0) || 1)) * 100
  ) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Policy Compliance Report
          </h1>
          <p className="text-muted-foreground">
            Analysis of policy assignments and employee acknowledgments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport(ExportFormat.CSV)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Overall Acknowledgment</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{overallRate}%</span>
              <Badge variant={overallRate >= 80 ? "default" : overallRate >= 50 ? "secondary" : "destructive"} className="mb-1">
                {overallRate >= 80 ? "Good" : overallRate >= 50 ? "Average" : "Poor"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4">
            <div className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              {stats?.byPolicy.reduce((sum, p) => sum + p.totalAssignments, 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Total Acknowledged</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4 text-green-600">
            <div className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              {stats?.byPolicy.reduce((sum, p) => sum + p.acknowledged, 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 pb-4 text-orange-600">
            <div className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {(stats?.byPolicy.reduce((sum, p) => sum + p.totalAssignments, 0) || 0) - 
               (stats?.byPolicy.reduce((sum, p) => sum + p.acknowledged, 0) || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Acknowledgment Rate by Policy
            </CardTitle>
            <CardDescription>Percent of assigned users who have acknowledged the policy</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.byPolicy || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="title" 
                  tick={{ fontSize: 10 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 100]} unit="%" />
                <RechartsTooltip />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {(stats?.byPolicy || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Department Compliance
            </CardTitle>
            <CardDescription>Compliance rates aggregated by business unit</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.byDepartment || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={100} />
                <RechartsTooltip />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {(stats?.byDepartment || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Policy Breakdown</TabsTrigger>
          <TabsTrigger value="departments">Department Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Title</TableHead>
                    <TableHead className="text-center">Total Assigned</TableHead>
                    <TableHead className="text-center">Acknowledged</TableHead>
                    <TableHead className="text-center">Pending</TableHead>
                    <TableHead className="text-right">Compliance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.byPolicy.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-center">{p.totalAssignments}</TableCell>
                      <TableCell className="text-center text-green-600">{p.acknowledged}</TableCell>
                      <TableCell className="text-center text-orange-600">{p.totalAssignments - p.acknowledged}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-muted rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${p.rate >= 80 ? 'bg-green-500' : p.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${p.rate}%` }}
                            />
                          </div>
                          <span className="font-bold w-10">{p.rate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department / Business Unit</TableHead>
                    <TableHead className="text-center">Total Staff Assigned</TableHead>
                    <TableHead className="text-center">Acknowledged</TableHead>
                    <TableHead className="text-center">Pending Action</TableHead>
                    <TableHead className="text-right">Compliance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.byDepartment.map((d, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{d.department}</TableCell>
                      <TableCell className="text-center">{d.total}</TableCell>
                      <TableCell className="text-center text-green-600">{d.acknowledged}</TableCell>
                      <TableCell className="text-center text-orange-600">{d.total - d.acknowledged}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-muted rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${d.rate >= 80 ? 'bg-green-500' : d.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${d.rate}%` }}
                            />
                          </div>
                          <span className="font-bold w-10">{d.rate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


