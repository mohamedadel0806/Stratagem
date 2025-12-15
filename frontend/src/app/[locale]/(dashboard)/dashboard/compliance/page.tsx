"use client"

import { useState, useMemo } from "react"
import * as React from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { complianceApi } from "@/lib/api/compliance"
import { DataTableFilters } from "@/components/filters/data-table-filters"
import { Pagination } from "@/components/ui/pagination"
import { ExportButton } from "@/components/export/export-button"
import { BulkActionsToolbar } from "@/components/bulk/bulk-actions-toolbar"
import { convertToCSV, downloadCSV, formatRequirementForExport } from "@/lib/utils/export"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, TrendingUp, TrendingDown, Minus, Plus, Edit, Trash2, ChevronDown, ChevronRight, Upload } from "lucide-react"
import { FrameworkForm } from "@/components/forms/framework-form"
import { RequirementForm } from "@/components/forms/requirement-form"
import { CSVUploadForm } from "@/components/forms/csv-upload-form"

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

export default function CompliancePage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'status' | 'frameworks' | 'requirements'>('status')
  const [expandedFrameworks, setExpandedFrameworks] = useState<Set<string>>(new Set())
  const [isFrameworkDialogOpen, setIsFrameworkDialogOpen] = useState(false)
  const [isRequirementDialogOpen, setIsRequirementDialogOpen] = useState(false)
  const [isCSVUploadOpen, setIsCSVUploadOpen] = useState(false)
  const [uploadFrameworkId, setUploadFrameworkId] = useState<string | null>(null)
  const [uploadFrameworkName, setUploadFrameworkName] = useState<string>("")
  const [editingFramework, setEditingFramework] = useState<any>(null)
  const [editingRequirement, setEditingRequirement] = useState<any>(null)
  const [deletingFrameworkId, setDeletingFrameworkId] = useState<string | null>(null)
  const [deletingRequirementId, setDeletingRequirementId] = useState<string | null>(null)
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()

  // Filter state for requirements
  const [requirementSearch, setRequirementSearch] = useState("")
  const [requirementStatusFilter, setRequirementStatusFilter] = useState<string>("")
  const [requirementCategoryFilter, setRequirementCategoryFilter] = useState<string>("")
  const [requirementFrameworkFilter, setRequirementFrameworkFilter] = useState<string>("")
  const [requirementPage, setRequirementPage] = useState(1)
  const [requirementLimit] = useState(20)
  const [selectedRequirements, setSelectedRequirements] = useState<Set<string>>(new Set())

  const { data: complianceStatus } = useQuery({
    queryKey: ['compliance-status'],
    queryFn: () => complianceApi.getStatus(),
  })

  const { data: frameworks } = useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: () => complianceApi.getFrameworks(),
    enabled: activeTab !== 'status',
  })

  // Build requirements query params
  const requirementsQueryParams = useMemo(() => {
    const params: any = {
      page: requirementPage,
      limit: requirementLimit,
    }
    if (requirementSearch && requirementSearch.trim()) params.search = requirementSearch.trim()
    if (requirementStatusFilter && requirementStatusFilter !== 'all' && requirementStatusFilter.trim()) {
      params.status = requirementStatusFilter.trim()
    }
    if (requirementCategoryFilter && requirementCategoryFilter !== 'all' && requirementCategoryFilter.trim()) {
      params.category = requirementCategoryFilter.trim()
    }
    if (requirementFrameworkFilter && requirementFrameworkFilter !== 'all' && requirementFrameworkFilter.trim()) {
      params.frameworkId = requirementFrameworkFilter.trim()
    } else if (selectedFrameworkId && selectedFrameworkId.trim() && !requirementFrameworkFilter) {
      params.frameworkId = selectedFrameworkId.trim()
    }
    return params
  }, [requirementSearch, requirementStatusFilter, requirementCategoryFilter, requirementFrameworkFilter, selectedFrameworkId, requirementPage, requirementLimit])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setRequirementPage(1)
  }, [requirementSearch, requirementStatusFilter, requirementCategoryFilter, requirementFrameworkFilter])

  const { data: requirementsResponse } = useQuery({
    queryKey: ['compliance-requirements', requirementsQueryParams],
    queryFn: () => complianceApi.getRequirements(requirementsQueryParams),
    enabled: activeTab === 'requirements' || expandedFrameworks.size > 0,
  })

  const requirements = requirementsResponse?.data || []

  // Get unique categories from requirements for filter (moved to top level to fix hooks order)
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>()
    requirements?.forEach(req => {
      if (req.category) categories.add(req.category)
    })
    return Array.from(categories).map(cat => ({
      value: cat,
      label: cat,
    }))
  }, [requirements])

  // Define status options for requirements
  const requirementStatusOptions = [
    { value: 'compliant', label: 'Compliant' },
    { value: 'non_compliant', label: 'Non Compliant' },
    { value: 'partially_compliant', label: 'Partially Compliant' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'not_applicable', label: 'Not Applicable' },
  ]

  // Define framework options for filtering
  const requirementFrameworkOptions = useMemo(() => {
    return frameworks?.map(fw => ({
      value: fw.id,
      label: fw.name,
    })) || []
  }, [frameworks])

  // Function to clear all requirement filters
  const handleClearRequirementFilters = () => {
    setRequirementSearch("")
    setRequirementStatusFilter("")
    setRequirementCategoryFilter("")
    setRequirementFrameworkFilter("")
  }

  const deleteFrameworkMutation = useMutation({
    mutationFn: (id: string) => complianceApi.deleteFramework(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-frameworks'] })
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] })
      toast.success("Framework deleted successfully")
      setDeletingFrameworkId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete framework")
    },
  })

  const deleteRequirementMutation = useMutation({
    mutationFn: (id: string) => complianceApi.deleteRequirement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-requirements'] })
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] })
      toast.success("Requirement deleted successfully")
      setDeletingRequirementId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete requirement")
    },
  })

  const bulkDeleteRequirementMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => complianceApi.deleteRequirement(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-requirements'] })
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] })
      toast.success(`${selectedRequirements.size} requirement(s) deleted successfully`)
      setSelectedRequirements(new Set())
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete requirements")
    },
  })

  const handleSelectRequirement = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedRequirements)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRequirements(newSelected)
  }

  const handleBulkDeleteRequirements = () => {
    if (selectedRequirements.size > 0 && confirm(`Are you sure you want to delete ${selectedRequirements.size} requirement(s)? This action cannot be undone.`)) {
      bulkDeleteRequirementMutation.mutate(Array.from(selectedRequirements))
    }
  }

  const bulkUpdateRequirementStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => complianceApi.bulkUpdateRequirementStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-requirements'] })
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] })
      toast.success(`Status updated for ${selectedRequirements.size} requirement(s)`)
      setSelectedRequirements(new Set())
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update requirement status")
    },
  })

  const handleBulkRequirementStatusUpdate = (status: string) => {
    if (selectedRequirements.size > 0) {
      bulkUpdateRequirementStatusMutation.mutate({ ids: Array.from(selectedRequirements), status })
    }
  }

  const toggleFramework = (id: string) => {
    const newExpanded = new Set(expandedFrameworks)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFrameworks(newExpanded)
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'partially_compliant':
        return 'bg-orange-100 text-orange-800'
      case 'non_compliant':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStatusTab = () => {
    if (!complianceStatus || !complianceStatus.frameworks || complianceStatus.frameworks.length === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Compliance Data</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Compliance frameworks and requirements will be displayed here once configured.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getComplianceColor(complianceStatus.overallCompliance)}`}>
                {complianceStatus.overallCompliance}%
              </div>
              <p className="text-xs text-muted-foreground">Across all frameworks</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {complianceStatus.frameworks.map((framework) => (
            <Card key={framework.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                  {getTrendIcon(framework.trend)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Compliance</span>
                      <span className={`text-lg font-bold ${getComplianceColor(framework.compliancePercentage)}`}>
                        {framework.compliancePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          framework.compliancePercentage >= 90
                            ? 'bg-green-600'
                            : framework.compliancePercentage >= 70
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${framework.compliancePercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requirements Met:</span>
                      <span className="font-medium">{framework.requirementsMet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Requirements:</span>
                      <span className="font-medium">{framework.totalRequirements}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    )
  }

  const renderFrameworksTab = () => {
    const frameworkRequirements = frameworks?.map(fw => ({
      ...fw,
      requirements: requirements?.filter(req => req.frameworkId === fw.id) || []
    })) || []

    return (
      <>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Compliance Frameworks</h3>
          <div className="flex gap-2">
            <ExportButton
              onExportCSV={() => {
                if (requirements && requirements.length > 0) {
                  const formattedRequirements = requirements.map(formatRequirementForExport)
                  const csv = convertToCSV(formattedRequirements)
                  downloadCSV(csv, `compliance-requirements-export-${new Date().toISOString().split('T')[0]}`)
                }
              }}
              disabled={!requirements || requirements.length === 0}
            />
            <Button onClick={() => {
              setEditingFramework(null)
              setIsFrameworkDialogOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Framework
            </Button>
          </div>
        </div>

        <DataTableFilters
          searchPlaceholder="Search requirements by title or description..."
          searchValue={requirementSearch}
          onSearchChange={setRequirementSearch}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: requirementStatusOptions,
              value: requirementStatusFilter,
              onChange: setRequirementStatusFilter,
            },
            {
              key: 'framework',
              label: 'Framework',
              options: requirementFrameworkOptions,
              value: requirementFrameworkFilter,
              onChange: setRequirementFrameworkFilter,
            },
            ...(categoryOptions.length > 0 ? [{
              key: 'category',
              label: 'Category',
              options: categoryOptions,
              value: requirementCategoryFilter,
              onChange: setRequirementCategoryFilter,
            }] : []),
          ]}
          onClear={handleClearRequirementFilters}
        />

        <BulkActionsToolbar
          selectedCount={selectedRequirements.size}
          onDelete={handleBulkDeleteRequirements}
          onStatusUpdate={handleBulkRequirementStatusUpdate}
          statusOptions={requirementStatusOptions}
        />

        {requirementsResponse && requirementsResponse.total > 0 && (
          <Pagination
            currentPage={requirementsResponse.page}
            totalPages={Math.ceil(requirementsResponse.total / requirementsResponse.limit)}
            totalItems={requirementsResponse.total}
            itemsPerPage={requirementsResponse.limit}
            onPageChange={setRequirementPage}
          />
        )}

        <div className="space-y-4">
          {frameworkRequirements.map((framework) => {
            const isExpanded = expandedFrameworks.has(framework.id)
            const frameworkReqs = framework.requirements || []

            return (
              <Card key={framework.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFramework(framework.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {framework.name} {framework.code && `(${framework.code})`}
                        </CardTitle>
                        {framework.region && (
                          <p className="text-sm text-muted-foreground mt-1">{framework.region}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingFramework(framework)
                          setIsFrameworkDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingFrameworkId(framework.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {framework.description && (
                    <p className="text-sm text-muted-foreground mt-2">{framework.description}</p>
                  )}
                  <div className="mt-2">
                    <Badge variant="outline">
                      {frameworkReqs.length} Requirements
                    </Badge>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Requirements</h4>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUploadFrameworkId(framework.id)
                              setUploadFrameworkName(framework.name)
                              setIsCSVUploadOpen(true)
                            }}
                          >
                            <Upload className="mr-1 h-3 w-3" />
                            Upload CSV
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedFrameworkId(framework.id)
                              setEditingRequirement(null)
                              setIsRequirementDialogOpen(true)
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Requirement
                          </Button>
                        </div>
                      </div>
                      {frameworkReqs.length > 0 ? (
                        <div className="space-y-2">
                          {frameworkReqs.map((req) => (
                            <div
                              key={req.id}
                              className={`flex items-center justify-between p-3 border rounded-lg relative ${
                                selectedRequirements.has(req.id) ? 'ring-2 ring-primary' : ''
                              }`}
                            >
                              <div className="absolute top-3 left-3">
                                <input
                                  type="checkbox"
                                  checked={selectedRequirements.has(req.id)}
                                  onChange={(e) => handleSelectRequirement(req.id, e.target.checked)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </div>
                              <div className="flex-1 pl-8">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{req.title}</span>
                                  {req.requirementCode && (
                                    <Badge variant="outline" className="text-xs">
                                      {req.requirementCode}
                                    </Badge>
                                  )}
                                  <Badge className={getStatusColor(req.status)}>
                                    {req.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                {req.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingRequirement(req)
                                    setIsRequirementDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingRequirementId(req.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No requirements yet. Add one to get started.
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Compliance Management</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'status' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('status')}
        >
          Status Dashboard
        </Button>
        <Button
          variant={activeTab === 'frameworks' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('frameworks')}
        >
          Frameworks
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'status' && renderStatusTab()}
      {activeTab === 'frameworks' && renderFrameworksTab()}

      {/* Framework Form */}
      <FrameworkForm
        open={isFrameworkDialogOpen}
        onOpenChange={setIsFrameworkDialogOpen}
        frameworkId={editingFramework?.id}
        initialData={editingFramework}
      />

      {/* Requirement Form */}
      <RequirementForm
        open={isRequirementDialogOpen}
        onOpenChange={setIsRequirementDialogOpen}
        requirementId={editingRequirement?.id}
        initialData={editingRequirement}
      />

      {/* CSV Upload Form */}
      {uploadFrameworkId && (
        <CSVUploadForm
          open={isCSVUploadOpen}
          onOpenChange={(open) => {
            setIsCSVUploadOpen(open)
            if (!open) {
              setUploadFrameworkId(null)
              setUploadFrameworkName("")
            }
          }}
          frameworkId={uploadFrameworkId}
          frameworkName={uploadFrameworkName}
        />
      )}

      {/* Delete Confirmations */}
      {deletingFrameworkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this framework? This will also delete all associated requirements. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingFrameworkId(null)}
                  disabled={deleteFrameworkMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteFrameworkMutation.mutate(deletingFrameworkId)}
                  disabled={deleteFrameworkMutation.isPending}
                >
                  {deleteFrameworkMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {deletingRequirementId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Requirement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this requirement? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingRequirementId(null)}
                  disabled={deleteRequirementMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteRequirementMutation.mutate(deletingRequirementId)}
                  disabled={deleteRequirementMutation.isPending}
                >
                  {deleteRequirementMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
