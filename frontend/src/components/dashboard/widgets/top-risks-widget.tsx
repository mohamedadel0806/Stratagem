"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { risksApi, Risk } from "@/lib/api/risks"
import { AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface TopRisksWidgetProps {
  limit?: number
}

export function TopRisksWidget({ limit = 10 }: TopRisksWidgetProps) {
  const params = useParams()
  const locale = params.locale as string

  const { data: topRisks, isLoading, error } = useQuery({
    queryKey: ['top-risks', limit],
    queryFn: () => risksApi.getTopRisks(limit),
  })

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 text-white'
      case 'high':
        return 'bg-orange-500 text-white'
      case 'medium':
        return 'bg-yellow-400 text-black'
      case 'low':
        return 'bg-green-400 text-black'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading top risks...</p>
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
            Top Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-destructive">Failed to load top risks</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!topRisks || topRisks.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No risks found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Top Risks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topRisks.map((risk: Risk, index: number) => (
            <Link
              key={risk.id}
              href={`/${locale}/dashboard/risks/${risk.id}`}
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <h4 className="text-sm font-semibold truncate">{risk.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getRiskLevelColor(risk.current_risk_level)}>
                      {risk.current_risk_level?.toUpperCase() || 'N/A'}
                    </Badge>
                    {risk.current_risk_score !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        Score: {risk.current_risk_score}
                      </span>
                    )}
                    {risk.category_name && (
                      <span className="text-xs text-muted-foreground">
                        {risk.category_name}
                      </span>
                    )}
                  </div>
                </div>
                <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}





