"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { risksApi } from "@/lib/api/risks"
import { AlertCircle } from "lucide-react"

interface RiskHeatmapProps { }

const likelihoodLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
const impactLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High']

function getRiskScoreColor(riskScore: number, maxScore: number): string {
  if (riskScore === 0) return 'bg-gray-100 dark:bg-gray-800'

  const intensity = riskScore / maxScore

  if (intensity >= 0.8) return 'bg-red-600 dark:bg-red-800'
  if (intensity >= 0.6) return 'bg-orange-500 dark:bg-orange-700'
  if (intensity >= 0.4) return 'bg-yellow-400 dark:bg-yellow-600'
  if (intensity >= 0.2) return 'bg-green-400 dark:bg-green-600'
  return 'bg-green-200 dark:bg-green-800'
}

export function RiskHeatmap({ }: RiskHeatmapProps) {
  const { data: heatmapData, isLoading, error } = useQuery({
    queryKey: ['risk-heatmap'],
    queryFn: () => risksApi.getHeatmap(),
  })

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Risk Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading heatmap...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Risk Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-destructive">
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8" />
              <p className="text-sm">Failed to load heatmap</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Create a 5x5 grid (likelihood x impact)
  const grid: (typeof heatmapData.cells[0] | null)[][] = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null))

  heatmapData?.cells.forEach((cell) => {
    // Convert 1-5 to 0-4 index
    const likelihoodIndex = cell.likelihood - 1
    const impactIndex = cell.impact - 1
    grid[4 - impactIndex][likelihoodIndex] = cell // Reverse impact for visual (high impact at top)
  })

  const maxRiskScore = heatmapData?.maxRiskScore || 25

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Risk Heatmap</CardTitle>
        {heatmapData && (
          <p className="text-sm text-muted-foreground">
            {heatmapData.totalRisks} total risks
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Impact labels (left side) */}
          <div className="grid grid-cols-6 gap-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-end pr-2">
              Impact →
            </div>
            <div className="text-xs font-medium text-center">Very Low</div>
            <div className="text-xs font-medium text-center">Low</div>
            <div className="text-xs font-medium text-center">Medium</div>
            <div className="text-xs font-medium text-center">High</div>
            <div className="text-xs font-medium text-center">Very High</div>
          </div>

          {/* Heatmap grid */}
          {grid.map((row, impactIndex) => (
            <div key={impactIndex} className="grid grid-cols-6 gap-1">
              <div className="text-xs font-medium text-muted-foreground flex items-center justify-end pr-2">
                {impactLabels[4 - impactIndex]}
              </div>
              {row.map((cell, likelihoodIndex) => {
                const cellData = cell
                const riskScore = cellData?.riskScore || 0
                const count = cellData?.count || 0

                return (
                  <div
                    key={`${impactIndex}-${likelihoodIndex}`}
                    className={`
                      ${getRiskScoreColor(riskScore, maxRiskScore)}
                      border border-gray-300 dark:border-gray-700
                      rounded-md p-2 min-h-[40px] flex flex-col items-center justify-center
                      transition-all hover:scale-105 cursor-pointer
                      ${count > 0 ? 'shadow-md' : ''}
                    `}
                    title={`Likelihood: ${likelihoodLabels[likelihoodIndex]}, Impact: ${impactLabels[4 - impactIndex]}, Count: ${count}, Score: ${riskScore}`}
                  >
                    {count > 0 && (
                      <>
                        <span className="text-xs font-bold text-white dark:text-gray-100">
                          {count}
                        </span>
                        <span className="text-[10px] text-white/80 dark:text-gray-200/80">
                          Score: {riskScore}
                        </span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Likelihood labels (bottom) */}
          <div className="grid grid-cols-6 gap-1 pt-1">
            <div className="text-xs font-medium text-muted-foreground"></div>
            <div className="text-xs font-medium text-center">Very Low</div>
            <div className="text-xs font-medium text-center">Low</div>
            <div className="text-xs font-medium text-center">Medium</div>
            <div className="text-xs font-medium text-center">High</div>
            <div className="text-xs font-medium text-center">Very High</div>
            <div className="text-xs font-medium text-muted-foreground col-span-6 text-center pt-1">
              ← Likelihood
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Risk Score:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-200 dark:bg-green-800 rounded"></div>
                  <span>Low (1-5)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                  <span>Medium (6-12)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-orange-500 dark:bg-orange-700 rounded"></div>
                  <span>High (13-20)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-600 dark:bg-red-800 rounded"></div>
                  <span>Critical (21-25)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
