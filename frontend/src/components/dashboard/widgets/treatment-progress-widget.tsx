"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { riskTreatmentsApi } from "@/lib/api/risks"
import { Target, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface TreatmentSummary {
  total: number
  by_status: {
    planned: number
    in_progress: number
    completed: number
    deferred: number
    cancelled: number
  }
  by_priority: {
    critical: number
    high: number
    medium: number
    low: number
  }
  overdue: number
  average_progress: number
}

export function TreatmentProgressWidget() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['treatment-summary'],
    queryFn: () => riskTreatmentsApi.getSummary(),
  })

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Treatment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading treatment data...</p>
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
            <Target className="h-4 w-4" />
            Treatment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-destructive">Failed to load treatment data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const treatmentSummary = summary as TreatmentSummary | undefined

  if (!treatmentSummary) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Treatment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No treatment data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeTreatments = (treatmentSummary.by_status?.planned || 0) + 
                          (treatmentSummary.by_status?.in_progress || 0)
  const completedTreatments = treatmentSummary.by_status?.completed || 0
  const totalTreatments = treatmentSummary.total || 0
  const completionRate = totalTreatments > 0 
    ? Math.round((completedTreatments / totalTreatments) * 100) 
    : 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Treatment Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm font-bold">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">By Status</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">Planned:</span>
              <Badge variant="outline" className="ml-auto">
                {treatmentSummary.by_status?.planned || 0}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-muted-foreground">In Progress:</span>
              <Badge variant="outline" className="ml-auto">
                {treatmentSummary.by_status?.in_progress || 0}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Completed:</span>
              <Badge variant="outline" className="ml-auto">
                {treatmentSummary.by_status?.completed || 0}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-muted-foreground">Overdue:</span>
              <Badge variant="destructive" className="ml-auto">
                {treatmentSummary.overdue || 0}
              </Badge>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">By Priority</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Critical:</span>
              <Badge variant="destructive" className="text-xs">
                {treatmentSummary.by_priority?.critical || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">High:</span>
              <Badge className="bg-orange-500 text-white text-xs">
                {treatmentSummary.by_priority?.high || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Medium:</span>
              <Badge className="bg-yellow-400 text-black text-xs">
                {treatmentSummary.by_priority?.medium || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Low:</span>
              <Badge className="bg-green-400 text-black text-xs">
                {treatmentSummary.by_priority?.low || 0}
              </Badge>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Treatments</span>
            <span className="text-lg font-bold">{totalTreatments}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium">Active</span>
            <span className="text-sm text-muted-foreground">{activeTreatments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}




