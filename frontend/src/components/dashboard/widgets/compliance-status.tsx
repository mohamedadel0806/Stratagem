"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { complianceApi } from "@/lib/api/compliance"

export function ComplianceStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['compliance-status'],
    queryFn: () => complianceApi.getStatus(),
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.frameworks.map((framework) => (
            <div key={framework.name} className="flex items-center justify-between">
              <span className="text-sm font-medium">{framework.name}</span>
              <span className={`text-sm font-bold ${getColorClass(framework.compliancePercentage)}`}>
                {framework.compliancePercentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}