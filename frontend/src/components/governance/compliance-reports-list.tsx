'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { governanceApi, ComplianceReport, ComplianceScore, ReportPeriod } from '@/lib/api/governance';

export const ComplianceReportsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [period, setPeriod] = useState<ReportPeriod | ''>('');
  const [rating, setRating] = useState<ComplianceScore | ''>('');
  const [search, setSearch] = useState('');

  // Fetch reports
  const { data: reportsData, isLoading, isError, error } = useQuery({
    queryKey: ['compliance-reports', page, limit, period, rating, search],
    queryFn: async () => {
      try {
        const params: any = {
          page,
          limit,
        };
        if (period) params.period = period;
        if (rating) params.rating = rating;
        if (search) params.search = search;

        const response = await governanceApi.getComplianceReports(params);
        return response;
      } catch (err) {
        console.error('Error fetching reports:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Get rating color
  const getRatingColor = (rating: ComplianceScore): string => {
    switch (rating) {
      case ComplianceScore.EXCELLENT:
        return 'text-green-700 bg-green-50';
      case ComplianceScore.GOOD:
        return 'text-blue-700 bg-blue-50';
      case ComplianceScore.FAIR:
        return 'text-yellow-700 bg-yellow-50';
      case ComplianceScore.POOR:
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const totalPages = reportsData?.meta?.totalPages || 1;
  const canNextPage = page < totalPages;
  const canPrevPage = page > 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Reports</h1>
          <p className="text-gray-500 mt-1">View and manage compliance reports</p>
        </div>
        <Link href="/governance/compliance/reports/generate">
          <Button>Generate New Report</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search reports..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Period */}
            <div>
              <label className="text-sm font-medium">Report Period</label>
              <Select value={period} onValueChange={(value) => {
                setPeriod(value as ReportPeriod || '');
                setPage(1);
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All periods</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium">Rating</label>
              <Select value={rating} onValueChange={(value) => {
                setRating(value as ComplianceScore || '');
                setPage(1);
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All ratings</SelectItem>
                  <SelectItem value={ComplianceScore.EXCELLENT}>Excellent</SelectItem>
                  <SelectItem value={ComplianceScore.GOOD}>Good</SelectItem>
                  <SelectItem value={ComplianceScore.FAIR}>Fair</SelectItem>
                  <SelectItem value={ComplianceScore.POOR}>Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items per page */}
            <div>
              <label className="text-sm font-medium">Items per page</label>
              <Select value={limit.toString()} onValueChange={(value) => {
                setLimit(parseInt(value));
                setPage(1);
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            {reportsData?.meta?.total || 0} reports found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to load reports'}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : reportsData?.data && reportsData.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsData.data.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.report_name}</TableCell>
                        <TableCell className="capitalize">
                          {report.report_period.toLowerCase()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(report.period_start_date).toLocaleDateString()} -{' '}
                          {new Date(report.period_end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {report.overall_compliance_score.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRatingColor(report.overall_compliance_rating)}`}>
                            {report.overall_compliance_rating}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.is_archived
                              ? 'bg-gray-100 text-gray-700'
                              : report.is_final
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {report.is_archived ? 'Archived' : report.is_final ? 'Final' : 'Draft'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(report.generated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Link href={`/governance/compliance/reports/${report.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages} ({reportsData?.meta?.total || 0} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!canPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!canNextPage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reports found. Generate your first compliance report to get started.</p>
              <Link href="/governance/compliance/reports/generate" className="mt-4">
                <Button>Generate Report</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
