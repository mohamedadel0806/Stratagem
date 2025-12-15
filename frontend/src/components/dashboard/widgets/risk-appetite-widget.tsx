"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { risksApi } from "@/lib/api/risks"
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react"

export function RiskAppetiteWidget() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['risk-dashboard-summary'],
    queryFn: () => risksApi.getDashboardSummary(),
  })

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Appetite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading risk appetite data...</p>
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
            <Shield className="h-4 w-4" />
            Risk Appetite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-destructive">Failed to load risk appetite data</p>
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
            <Shield className="h-4 w-4" />
            Risk Appetite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No risk appetite data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalRisks = summary.total_risks || 0
  const risksExceedingAppetite = summary.risks_exceeding_appetite || 0
  const maxAcceptableScore = summary.max_acceptable_score
  const appetiteEnabled = summary.risk_appetite_enabled
  const complianceRate = totalRisks > 0 
    ? Math.round(((totalRisks - risksExceedingAppetite) / totalRisks) * 100) 
    : 100

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Risk Appetite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!appetiteEnabled ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Risk appetite monitoring is disabled</p>
            </div>
          </div>
        ) : (
          <>
            {/* Compliance Status */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {complianceRate}%
              </div>
              <p className="text-sm text-muted-foreground">Within Appetite</p>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Within Appetite</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {totalRisks - risksExceedingAppetite}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Exceeding Appetite</span>
                </div>
                <Badge variant="destructive">
                  {risksExceedingAppetite}
                </Badge>
              </div>
            </div>

            {/* Threshold Info */}
            {maxAcceptableScore !== undefined && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Max Acceptable Score</span>
                  <span className="text-sm font-semibold">{maxAcceptableScore}</span>
                </div>
              </div>
            )}

            {/* Total Risks */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Risks</span>
                <span className="text-lg font-bold">{totalRisks}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}




