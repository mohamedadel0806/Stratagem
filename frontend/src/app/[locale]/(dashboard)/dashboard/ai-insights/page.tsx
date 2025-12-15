"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

export default function AIInsightsPage() {
  // Mock insights - will be replaced with real AI service integration
  const insights = [
    {
      id: 1,
      type: 'recommendation',
      title: 'High Priority Risk Detected',
      description: 'Ransomware Attack risk has a critical score of 20. Consider implementing additional security controls.',
      priority: 'high',
      category: 'risk',
      icon: AlertCircle,
    },
    {
      id: 2,
      type: 'insight',
      title: 'Compliance Trend Improving',
      description: 'Your overall compliance has improved by 5% this quarter. NCA framework shows strong progress.',
      priority: 'medium',
      category: 'compliance',
      icon: TrendingUp,
    },
    {
      id: 3,
      type: 'action',
      title: 'Policy Review Due',
      description: '3 policies are due for review in the next 30 days. Schedule review meetings to maintain compliance.',
      priority: 'medium',
      category: 'policy',
      icon: CheckCircle2,
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Automated Risk Assessment',
      description: 'AI analysis suggests reviewing vendor management processes to reduce third-party risk exposure.',
      priority: 'low',
      category: 'risk',
      icon: Sparkles,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8" />
          <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
        </div>
        <Badge variant="outline" className="gap-2">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <Card key={insight.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {insight.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {insight.type === 'recommendation' ? 'Recommendation' : 
                     insight.type === 'insight' ? 'Insight' : 'Action Item'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">Risk Assessment</h4>
              <p className="text-sm text-blue-800">
                AI analysis identified 2 critical risks requiring immediate attention. 
                Recommended actions include enhanced monitoring and additional controls.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2 text-green-900">Compliance Status</h4>
              <p className="text-sm text-green-800">
                Overall compliance is strong at 81%. Focus areas: SAMA framework 
                (75%) could benefit from additional attention to reach target levels.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-900">Policy Management</h4>
              <p className="text-sm text-yellow-800">
                4 active policies are well-maintained. 1 policy is under review. 
                Consider automating policy review reminders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
