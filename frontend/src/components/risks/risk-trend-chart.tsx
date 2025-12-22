"use client"

import { useQuery } from "@tanstack/react-query"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface RiskTrendChartProps {
  days?: number
  categoryId?: string
}

export function RiskTrendChart({ days = 30, categoryId }: RiskTrendChartProps) {
  // TODO: Replace with actual API endpoint when available
  // For now, we'll use mock data structure
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['risk-trends', days, categoryId],
    queryFn: async () => {
      // This should call: risksApi.getTrends({ days, categoryId })
      // For now, return empty array - actual implementation needs backend endpoint
      return []
    },
    enabled: false, // Disable until backend endpoint is ready
  })

  // Mock data structure for demonstration
  const mockData = [
    { date: '2024-11-01', critical: 2, high: 5, medium: 8, low: 12 },
    { date: '2024-11-08', critical: 3, high: 6, medium: 7, low: 11 },
    { date: '2024-11-15', critical: 2, high: 4, medium: 9, low: 13 },
    { date: '2024-11-22', critical: 1, high: 5, medium: 8, low: 14 },
    { date: '2024-11-29', critical: 2, high: 6, medium: 7, low: 13 },
  ]

  const chartData = trendData && trendData.length > 0 ? trendData : mockData

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-pulse text-muted-foreground">Loading trend data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString()
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="critical"
          name="Critical"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="high"
          name="High"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ fill: '#f97316', r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="medium"
          name="Medium"
          stroke="#eab308"
          strokeWidth={2}
          dot={{ fill: '#eab308', r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="low"
          name="Low"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: '#22c55e', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}







