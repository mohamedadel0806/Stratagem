"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { tasksApi } from "@/lib/api/tasks"

export function TaskList() {
  const { data, isLoading } = useQuery({
    queryKey: ['pending-tasks'],
    queryFn: () => tasksApi.getPending(),
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due: Today'
    if (diffDays === 1) return 'Due: Tomorrow'
    if (diffDays <= 7) return `Due: In ${diffDays} days`
    return `Due: ${date.toLocaleDateString()}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((task, index) => (
              <div
                key={task.id}
                className={`flex items-center justify-between ${index < data.length - 1 ? 'border-b pb-2' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{task.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
                <Badge variant={getBadgeVariant(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-muted-foreground">No pending tasks</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}