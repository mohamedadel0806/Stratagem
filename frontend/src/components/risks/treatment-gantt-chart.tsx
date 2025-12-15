"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Clock, Target } from "lucide-react"
import { RiskTreatment, TreatmentStatus, TreatmentPriority } from "@/lib/api/risks"
import { cn } from "@/lib/utils"

interface TreatmentGanttChartProps {
  treatments: RiskTreatment[]
  isLoading?: boolean
}

const statusConfig: Record<TreatmentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  planned: {
    color: "bg-gray-400",
    icon: <Clock className="h-4 w-4" />,
    label: "Planned",
  },
  in_progress: {
    color: "bg-blue-500",
    icon: <Clock className="h-4 w-4" />,
    label: "In Progress",
  },
  completed: {
    color: "bg-green-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: "Completed",
  },
  on_hold: {
    color: "bg-yellow-500",
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "On Hold",
  },
  cancelled: {
    color: "bg-red-500",
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Cancelled",
  },
}

const priorityConfig: Record<TreatmentPriority, { color: string; label: string }> = {
  critical: { color: "border-red-500", label: "Critical" },
  high: { color: "border-orange-500", label: "High" },
  medium: { color: "border-yellow-500", label: "Medium" },
  low: { color: "border-blue-500", label: "Low" },
}

export function TreatmentGanttChart({ treatments, isLoading }: TreatmentGanttChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Treatment Timeline</CardTitle>
          <CardDescription>Gantt view of treatment plan progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!treatments || treatments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Treatment Timeline</CardTitle>
          <CardDescription>Gantt view of treatment plan progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No active treatments
          </div>
        </CardContent>
      </Card>
    )
  }

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  // Calculate date range: from earliest start date to latest completion date + buffer
  const dates = treatments
    .flatMap((t) => [
      t.start_date ? new Date(t.start_date) : null,
      t.target_completion_date ? new Date(t.target_completion_date) : null,
      t.actual_completion_date ? new Date(t.actual_completion_date) : null,
    ])
    .filter((d): d is Date => d !== null)

  if (dates.length === 0) {
    // If no dates, show today + 90 days
    const minDate = today
    const maxDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    dates.push(minDate, maxDate)
  }

  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime()), today.getTime() + 90 * 24 * 60 * 60 * 1000))

  // Ensure we show at least 60 days
  if (maxDate.getTime() - minDate.getTime() < 60 * 24 * 60 * 60 * 1000) {
    maxDate.setTime(minDate.getTime() + 60 * 24 * 60 * 60 * 1000)
  }

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.ceil(totalDays / 7)

  const getBarPosition = (date: string | undefined): number => {
    if (!date) return 0
    const treatmentDate = new Date(date)
    treatmentDate.setUTCHours(0, 0, 0, 0)
    const diffTime = treatmentDate.getTime() - minDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getBarWidth = (startDate: string | undefined, endDate: string | undefined): number => {
    if (!startDate || !endDate) return 50 // Default width
    const start = getBarPosition(startDate)
    const end = getBarPosition(endDate)
    return Math.max(1, end - start)
  }

  // Sort treatments: overdue first, then by priority, then by date
  const sortedTreatments = [...treatments].sort((a, b) => {
    // Check if overdue
    const aOverdue = a.target_completion_date && new Date(a.target_completion_date) < today && a.status !== "completed"
    const bOverdue = b.target_completion_date && new Date(b.target_completion_date) < today && b.status !== "completed"

    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const aPriority = priorityOrder[a.priority] ?? 3
    const bPriority = priorityOrder[b.priority] ?? 3
    if (aPriority !== bPriority) return aPriority - bPriority

    // Sort by start date
    if (a.start_date && b.start_date) {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    }
    return 0
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Timeline</CardTitle>
        <CardDescription>Gantt view of treatment plan progress ({totalDays} days)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Timeline header */}
            <div className="flex gap-4 mb-4">
              <div className="w-56 flex-shrink-0" />
              <div className="flex-1 relative h-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-border" />
                </div>
                {/* Today marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-10"
                  style={{
                    left: `${(getBarPosition(today.toISOString().split("T")[0]) / totalDays) * 100}%`,
                  }}
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 whitespace-nowrap">
                    Today
                  </div>
                </div>
                {/* Week markers */}
                <div className="relative h-full flex justify-between">
                  {Array.from({ length: Math.min(totalWeeks + 1, 13) }, (_, i) => {
                    const weekDays = i * 7
                    return (
                      <div
                        key={i}
                        className="absolute text-xs text-muted-foreground"
                        style={{
                          left: `${(weekDays / totalDays) * 100}%`,
                        }}
                      >
                        {weekDays}d
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Gantt rows */}
            {sortedTreatments.map((treatment) => {
              const config = statusConfig[treatment.status]
              const priority = priorityConfig[treatment.priority] || priorityConfig.medium
              const startDate = treatment.start_date
              const endDate = treatment.actual_completion_date || treatment.target_completion_date
              const targetDate = treatment.target_completion_date

              const startPos = startDate ? getBarPosition(startDate) : 0
              const endPos = endDate ? getBarPosition(endDate) : startPos + 30
              const targetPos = targetDate ? getBarPosition(targetDate) : null

              const barLeft = (startPos / totalDays) * 100
              const barWidth = ((endPos - startPos) / totalDays) * 100

              const isOverdue = targetDate && new Date(targetDate) < today && treatment.status !== "completed"

              return (
                <div key={treatment.id} className="flex gap-4 mb-3 pb-3 border-b last:border-b-0">
                  {/* Left sidebar - Treatment info */}
                  <div className="w-56 flex-shrink-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{treatment.title}</span>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-xs ${priority.color}`}>
                            {priority.label}
                          </Badge>
                          <Badge className={cn("text-xs", config.color, "text-white")}>{config.label}</Badge>
                          {treatment.progress_percentage !== undefined && (
                            <span className="text-xs text-muted-foreground">{treatment.progress_percentage}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gantt bar area */}
                  <div className="flex-1 relative h-12">
                    {/* Background grid */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: totalWeeks + 1 }, (_, i) => (
                        <div key={i} className="flex-1 border-l border-border" />
                      ))}
                    </div>

                    {/* Treatment bar */}
                    {startDate && (
                      <div
                        className={cn(
                          "absolute top-2 h-8 rounded flex items-center justify-between px-2 text-white text-xs font-medium shadow-sm",
                          config.color,
                          isOverdue && "ring-2 ring-red-500"
                        )}
                        style={{
                          left: `${barLeft}%`,
                          width: `${Math.max(2, barWidth)}%`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {config.icon}
                          <span className="truncate">{treatment.treatment_id}</span>
                        </div>
                        {/* Progress indicator */}
                        {treatment.progress_percentage !== undefined && treatment.progress_percentage > 0 && (
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-black/20 rounded-l"
                            style={{ width: `${treatment.progress_percentage}%` }}
                          />
                        )}
                      </div>
                    )}

                    {/* Target completion date marker */}
                    {targetPos !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-10"
                        style={{
                          left: `${(targetPos / totalDays) * 100}%`,
                        }}
                      >
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 whitespace-nowrap">
                          Target
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span>Target Date</span>
            </div>
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded", config.color)} />
                <span>{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
