"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { risksApi } from "@/lib/api/risks"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface RiskTrendChartProps {
  days?: number
}

export function RiskTrendChart({ days = 30 }: RiskTrendChartProps) {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['risk-dashboard-summary'],
    queryFn: () => risksApi.getDashboardSummary(),
  })

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Risk Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading trend data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Risk Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-destructive">Failed to load trend data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!summary) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Risk Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No trend data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // For now, show a summary view. In the future, this can be enhanced with actual time-series data
  const criticalRisks = summary.critical_risks || 0
  const highRisks = summary.high_risks || 0
  const mediumRisks = summary.medium_risks || 0
  const lowRisks = summary.low_risks || 0
  const totalRisks = summary.total_risks || 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Risk Trends ({days} days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Risk Level Distribution */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Risk Level Distribution</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-sm">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{criticalRisks}</span>
                  {totalRisks > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((criticalRisks / totalRisks) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${totalRisks > 0 ? (criticalRisks / totalRisks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{highRisks}</span>
                  {totalRisks > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((highRisks / totalRisks) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${totalRisks > 0 ? (highRisks / totalRisks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{mediumRisks}</span>
                  {totalRisks > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((mediumRisks / totalRisks) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${totalRisks > 0 ? (mediumRisks / totalRisks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{lowRisks}</span>
                  {totalRisks > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((lowRisks / totalRisks) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${totalRisks > 0 ? (lowRisks / totalRisks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Risks</p>
                <p className="text-lg font-bold">{totalRisks}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue Reviews</p>
                <p className="text-lg font-bold text-orange-600">
                  {summary.overdue_reviews || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground italic">
              Note: Historical trend data will be available once risk assessment history is tracked.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}





