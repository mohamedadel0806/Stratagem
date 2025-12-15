"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change, changeLabel, icon }: StatsCardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const getChangeColor = () => {
    if (change === undefined) return "text-muted-foreground"
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">{title}</h3>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && changeLabel && (
          <p className={`text-xs flex items-center gap-1 ${getChangeColor()}`}>
            {getTrendIcon()}
            {change > 0 ? '+' : ''}{change} {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

