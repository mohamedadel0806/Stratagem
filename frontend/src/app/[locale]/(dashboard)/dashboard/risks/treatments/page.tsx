"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { riskTreatmentsApi, RiskTreatment, TreatmentStatus, TreatmentPriority } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Target, Clock, DollarSign, TrendingDown, Download } from "lucide-react"
import { TreatmentForm } from "@/components/forms/treatment-form"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useParams } from "next/navigation"
import { DataTableFilters } from "@/components/filters/data-table-filters"
import { Progress } from "@/components/ui/progress"
import { generateTreatmentPlanPDF, Treatment } from "@/lib/utils/risk-export"

export default function TreatmentsPage() {
  const params = useParams()
  const locale = params?.locale || 'en'
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<RiskTreatment | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [priorityFilter, setPriorityFilter] = useState<string>("")

  const { data: treatments, isLoading } = useQuery({
    queryKey: ['treatments', statusFilter, priorityFilter],
    queryFn: () => riskTreatmentsApi.getAll({
      status: statusFilter as TreatmentStatus || undefined,
      priority: priorityFilter as TreatmentPriority || undefined,
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => riskTreatmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      toast({
        title: 'Success',
        description: 'Treatment deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete treatment',
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (treatment: RiskTreatment) => {
    setEditingTreatment(treatment)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this treatment?')) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusColor = (status: TreatmentStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-gray-100 text-gray-800'
      case 'deferred': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: TreatmentPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading treatments...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Risk Treatments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track risk treatment plans
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (treatments && treatments.length > 0) {
                generateTreatmentPlanPDF(treatments as Treatment[])
                toast({
                  title: 'Export Successful',
                  description: 'Treatment plan exported to PDF',
                })
              }
            }}
            disabled={!treatments || treatments.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => {
            setEditingTreatment(null)
            setIsFormOpen(true)
          }} data-testid="treatments-new-button">
            <Plus className="h-4 w-4 mr-2" />
            New Treatment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <DataTableFilters
            searchPlaceholder="Search treatments..."
            onSearchChange={() => {}}
            filters={[
              {
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: '', label: 'All Statuses' },
                  { value: 'planned', label: 'Planned' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'deferred', label: 'Deferred' },
                  { value: 'cancelled', label: 'Cancelled' },
                ],
              },
              {
                label: 'Priority',
                value: priorityFilter,
                onChange: setPriorityFilter,
                options: [
                  { value: '', label: 'All Priorities' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Treatments List */}
      {treatments && treatments.length > 0 ? (
        <div className="grid gap-4">
          {treatments.map((treatment) => (
            <Card key={treatment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {treatment.title}
                      {treatment.treatment_id && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {treatment.treatment_id}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {treatment.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(treatment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(treatment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status and Priority */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(treatment.status)}>
                      {treatment.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(treatment.priority)}>
                      {treatment.priority}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {treatment.strategy}
                    </Badge>
                    {treatment.risk_title && (
                      <Link href={`/${locale}/dashboard/risks/${treatment.risk_id}`}>
                        <Badge variant="outline" className="hover:bg-primary/10">
                          Risk: {treatment.risk_title}
                        </Badge>
                      </Link>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{treatment.progress_percentage}%</span>
                    </div>
                    <Progress value={treatment.progress_percentage} className="h-2" />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {treatment.treatment_owner_name && (
                      <div>
                        <div className="text-muted-foreground">Owner</div>
                        <div className="font-medium">{treatment.treatment_owner_name}</div>
                      </div>
                    )}
                    {treatment.start_date && (
                      <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Start Date
                        </div>
                        <div className="font-medium">
                          {new Date(treatment.start_date).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {treatment.target_completion_date && (
                      <div>
                        <div className="text-muted-foreground">Target Completion</div>
                        <div className="font-medium">
                          {new Date(treatment.target_completion_date).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {treatment.estimated_cost && (
                      <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Estimated Cost
                        </div>
                        <div className="font-medium">
                          ${treatment.estimated_cost.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {treatment.tasks && treatment.tasks.length > 0 && (
                      <div>
                        <div className="text-muted-foreground">Tasks</div>
                        <div className="font-medium">
                          {treatment.completed_tasks || 0} / {treatment.total_tasks || treatment.tasks.length}
                        </div>
                      </div>
                    )}
                  </div>

                  {treatment.expected_risk_reduction && (
                    <div className="border-t pt-4">
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1 flex items-center gap-1">
                          <TrendingDown className="h-4 w-4" />
                          Expected Risk Reduction
                        </div>
                        <p>{treatment.expected_risk_reduction}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No treatments found</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Treatment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Treatment Form Dialog */}
      <TreatmentForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setEditingTreatment(null)
          }
        }}
        treatmentId={editingTreatment?.id}
        riskId={editingTreatment?.risk_id}
        initialData={editingTreatment || undefined}
        onSuccess={() => {
          setIsFormOpen(false)
          setEditingTreatment(null)
        }}
      />
    </div>
  )
}

