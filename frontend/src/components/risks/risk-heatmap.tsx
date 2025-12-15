"use client"

import { useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams } from "next/navigation"

interface RiskHeatmapCell {
  likelihood: number
  impact: number
  score: number
  level: string
  count: number
  risk_ids: string[]
  risk_titles: string[]
}

interface RiskHeatmapData {
  cells: RiskHeatmapCell[]
  totalRisks?: number
  total_risks?: number
  maxRiskScore?: number
  critical_count?: number
  high_count?: number
  medium_count?: number
  low_count?: number
}

interface RiskHeatmapProps {
  data?: RiskHeatmapData
  isLoading?: boolean
  title?: string
  description?: string
}

const LIKELIHOOD_LABELS = [
  { value: 1, label: "Rare", description: "Unlikely to occur" },
  { value: 2, label: "Unlikely", description: "May occur occasionally" },
  { value: 3, label: "Possible", description: "Might occur" },
  { value: 4, label: "Likely", description: "Will probably occur" },
  { value: 5, label: "Almost Certain", description: "Expected to occur" },
]

const IMPACT_LABELS = [
  { value: 1, label: "Insignificant", description: "Minimal impact" },
  { value: 2, label: "Minor", description: "Limited impact" },
  { value: 3, label: "Moderate", description: "Significant impact" },
  { value: 4, label: "Major", description: "Severe impact" },
  { value: 5, label: "Catastrophic", description: "Critical impact" },
]

export function RiskHeatmap({ data, isLoading, title = "Risk Heat Map", description }: RiskHeatmapProps) {
  const params = useParams()
  const locale = params?.locale || 'en'

  // Build heatmap grid data
  const heatmapGrid = useMemo(() => {
    const grid: (RiskHeatmapCell | null)[][] = Array(5).fill(null).map(() => Array(5).fill(null))
    
    if (data?.cells) {
      data.cells.forEach(cell => {
        if (cell.likelihood >= 1 && cell.likelihood <= 5 && cell.impact >= 1 && cell.impact <= 5) {
          grid[5 - cell.likelihood][cell.impact - 1] = cell
        }
      })
    }
    
    return grid
  }, [data])

  const getCellColor = (likelihood: number, impact: number, count: number) => {
    const score = likelihood * impact
    const hasRisks = count > 0
    
    if (score >= 20) return hasRisks ? "bg-red-500 hover:bg-red-600" : "bg-red-100 hover:bg-red-200"
    if (score >= 12) return hasRisks ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-100 hover:bg-orange-200"
    if (score >= 6) return hasRisks ? "bg-yellow-500 hover:bg-yellow-600" : "bg-yellow-100 hover:bg-yellow-200"
    return hasRisks ? "bg-green-500 hover:bg-green-600" : "bg-green-100 hover:bg-green-200"
  }

  const getCellTextColor = (count: number) => {
    return count > 0 ? "text-white" : "text-gray-500"
  }

  const getLevelLabel = (likelihood: number, impact: number) => {
    const score = likelihood * impact
    if (score >= 20) return "Critical"
    if (score >= 12) return "High"
    if (score >= 6) return "Medium"
    return "Low"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
              {Array(36).fill(null).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {data && (
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                Critical: {data.critical_count}
              </Badge>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                High: {data.high_count}
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Medium: {data.medium_count}
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Low: {data.low_count}
              </Badge>
            </div>
          )}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground whitespace-nowrap">
            Likelihood →
          </div>
          
          <div className="ml-4">
            {/* Grid */}
            <div className="grid gap-1" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
              {/* Empty corner cell */}
              <div />
              {/* Impact header */}
              {IMPACT_LABELS.map(impact => (
                <div key={impact.value} className="text-center text-xs font-medium p-1">
                  <div>{impact.label}</div>
                  <div className="text-muted-foreground">({impact.value})</div>
                </div>
              ))}
              
              {/* Grid rows */}
              {heatmapGrid.map((row, rowIndex) => {
                const likelihoodValue = 5 - rowIndex
                const likelihood = LIKELIHOOD_LABELS.find(l => l.value === likelihoodValue)!
                
                return (
                  <Fragment key={`row-${rowIndex}`}>
                    {/* Likelihood label */}
                    <div className="flex items-center text-xs font-medium pr-2">
                      <div className="text-right w-full">
                        <div>{likelihood.label}</div>
                        <div className="text-muted-foreground">({likelihood.value})</div>
                      </div>
                    </div>
                    
                    {/* Risk cells */}
                    {row.map((cell, colIndex) => {
                      const impactValue = colIndex + 1
                      const count = cell?.count || 0
                      const cellColor = getCellColor(likelihoodValue, impactValue, count)
                      const textColor = getCellTextColor(count)
                      const score = likelihoodValue * impactValue
                      const level = getLevelLabel(likelihoodValue, impactValue)
                      
                      return (
                        <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "flex items-center justify-center h-14 rounded cursor-pointer transition-colors",
                                  cellColor,
                                  textColor
                                )}
                              >
                                {count > 0 ? (
                                  <div className="text-center">
                                    <div className="text-lg font-bold">{count}</div>
                                    <div className="text-xs opacity-80">risk{count !== 1 ? 's' : ''}</div>
                                  </div>
                                ) : (
                                  <span className="text-xs opacity-50">{score}</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-2">
                                <div className="font-semibold">
                                  {level} Risk (Score: {score})
                                </div>
                                <div className="text-xs">
                                  <div>Likelihood: {likelihood.label} ({likelihoodValue})</div>
                                  <div>Impact: {IMPACT_LABELS[colIndex].label} ({impactValue})</div>
                                </div>
                                {cell && cell.risk_titles && cell.risk_titles.length > 0 && (
                                  <div className="border-t pt-2 mt-2">
                                    <div className="font-medium text-xs mb-1">Risks in this cell:</div>
                                    <ul className="text-xs space-y-1">
                                      {cell.risk_titles.slice(0, 5).map((title, i) => (
                                        <li key={i} className="truncate">
                                          <Link 
                                            href={`/${locale}/dashboard/risks/${cell.risk_ids[i]}`}
                                            className="hover:underline"
                                          >
                                            • {title}
                                          </Link>
                                        </li>
                                      ))}
                                      {cell.risk_titles.length > 5 && (
                                        <li className="text-muted-foreground">
                                          ...and {cell.risk_titles.length - 5} more
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </Fragment>
                )
              })}
            </div>
            
            {/* X-axis label */}
            <div className="text-center text-sm font-medium text-muted-foreground mt-2">
              ← Impact →
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-xs">Low (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-xs">Medium (6-11)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span className="text-xs">High (12-19)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-xs">Critical (20-25)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

