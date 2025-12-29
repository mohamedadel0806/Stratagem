"use client"

import { useState, useMemo } from "react"
import * as React from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { risksApi, RiskQueryParams, RiskLevel } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ShieldAlert, Plus, AlertTriangle, Edit, Trash2, Eye,
  Package, Shield, Target, Activity, TrendingUp, Clock
} from "lucide-react"
import { RiskForm } from "@/components/forms/risk-form"
import { DataTableFilters } from "@/components/filters/data-table-filters"
import { Pagination } from "@/components/ui/pagination"
import { RiskExportButton } from "@/components/export/risk-export-button"
import { BulkActionsToolbar } from "@/components/bulk/bulk-actions-toolbar"
import { SelectableCard } from "@/components/bulk/selectable-card"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Simple toast implementation
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

export default function RisksPage() {
  const params = useParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<{ id: string; data: any } | null>(null)
  const [deletingRiskId, setDeletingRiskId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Filter state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("")
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [selectedRisks, setSelectedRisks] = useState<Set<string>>(new Set())

  // Build query params
  const queryParams: RiskQueryParams = useMemo(() => {
    const params: RiskQueryParams = {
      page,
      limit,
    }
    if (search) params.search = search
    // Only add filters if they have valid values (not empty or "all")
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter
    if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter
    if (riskLevelFilter && riskLevelFilter !== 'all') params.current_risk_level = riskLevelFilter as RiskLevel
    return params
  }, [search, statusFilter, categoryFilter, riskLevelFilter, page, limit])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1)
  }, [search, statusFilter, categoryFilter, riskLevelFilter])

  const { data: risksResponse, isLoading, error: risksError } = useQuery({
    queryKey: ['risks', queryParams],
    queryFn: () => risksApi.getAll(queryParams),
    retry: false,
  })

  const { data: dashboardSummary } = useQuery({
    queryKey: ['risk-dashboard-summary'],
    queryFn: () => risksApi.getDashboardSummary(),
  })

  const risks = risksResponse?.data || []

  const deleteMutation = useMutation({
    mutationFn: (id: string) => risksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] })
      queryClient.invalidateQueries({ queryKey: ['risk-dashboard-summary'] })
      toast.success("Risk deleted successfully")
      setDeletingRiskId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete risk")
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => risksApi.delete(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] })
      queryClient.invalidateQueries({ queryKey: ['risk-dashboard-summary'] })
      toast.success(`${selectedRisks.size} risk(s) deleted successfully`)
      setSelectedRisks(new Set())
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete risks")
    },
  })

  const handleSelectRisk = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedRisks)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRisks(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRisks(new Set(risks.map(r => r.id)))
    } else {
      setSelectedRisks(new Set())
    }
  }

  const handleBulkDelete = () => {
    if (selectedRisks.size > 0 && confirm(`Are you sure you want to delete ${selectedRisks.size} risk(s)? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(Array.from(selectedRisks))
    }
  }

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => risksApi.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] })
      toast.success(`Status updated for ${selectedRisks.size} risk(s)`)
      setSelectedRisks(new Set())
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update risk status")
    },
  })

  const handleBulkStatusUpdate = (status: string) => {
    if (selectedRisks.size > 0) {
      bulkUpdateStatusMutation.mutate({ ids: Array.from(selectedRisks), status })
    }
  }

  // Convert enum to number (handles both numeric values and string keys like "MEDIUM")
  const toNumber = (val: any): number => {
    if (typeof val === 'number') return val
    const num = Number(val)
    if (!isNaN(num)) return num
    // Handle enum string keys
    const enumMap: Record<string, number> = {
      'VERY_LOW': 1, 'LOW': 2, 'MEDIUM': 3, 'HIGH': 4, 'VERY_HIGH': 5
    }
    return enumMap[val?.toUpperCase()] || 3
  }

  const getRiskLevel = (level?: string, score?: number) => {
    if (level) {
      switch (level) {
        case 'critical': return { label: 'Critical', color: 'bg-red-500 text-white', textColor: 'text-red-600' }
        case 'high': return { label: 'High', color: 'bg-orange-500 text-white', textColor: 'text-orange-600' }
        case 'medium': return { label: 'Medium', color: 'bg-yellow-500 text-white', textColor: 'text-yellow-600' }
        case 'low': return { label: 'Low', color: 'bg-green-500 text-white', textColor: 'text-green-600' }
      }
    }
    if (score) {
      if (score >= 20) return { label: 'Critical', color: 'bg-red-500 text-white', textColor: 'text-red-600' }
      if (score >= 12) return { label: 'High', color: 'bg-orange-500 text-white', textColor: 'text-orange-600' }
      if (score >= 6) return { label: 'Medium', color: 'bg-yellow-500 text-white', textColor: 'text-yellow-600' }
      return { label: 'Low', color: 'bg-green-500 text-white', textColor: 'text-green-600' }
    }
    return { label: 'Unknown', color: 'bg-gray-500 text-white', textColor: 'text-gray-600' }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mitigated':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'assessed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'identified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'accepted':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'closed':
        return 'bg-gray-100 text-gray-600 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleClearFilters = () => {
    setSearch("")
    setStatusFilter("")
    setCategoryFilter("")
    setRiskLevelFilter("")
  }

  const statusOptions = [
    { value: 'identified', label: 'Identified' },
    { value: 'assessed', label: 'Assessed' },
    { value: 'mitigated', label: 'Mitigated' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'closed', label: 'Closed' },
  ]

  const categoryOptions = [
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'data_privacy', label: 'Data Privacy' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'operational', label: 'Operational' },
    { value: 'financial', label: 'Financial' },
    { value: 'strategic', label: 'Strategic' },
    { value: 'reputational', label: 'Reputational' },
  ]

  const riskLevelOptions = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Risk Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-pulse text-muted-foreground">Loading risks...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Risk Management</h2>
        <div className="flex gap-2">
          <RiskExportButton
            risks={risks}
            disabled={!risks || risks.length === 0}
          />
          <Button onClick={() => setIsDialogOpen(true)} data-testid="risk-register-new-risk-button">
            <Plus className="mr-2 h-4 w-4" />
            New Risk
          </Button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      {dashboardSummary && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Risks</p>
                  <p className="text-2xl font-bold">{dashboardSummary.total_risks}</p>
                </div>
                <ShieldAlert className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Critical</p>
                  <p className="text-2xl font-bold text-red-700">{dashboardSummary.critical_risks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">High</p>
                  <p className="text-2xl font-bold text-orange-700">{dashboardSummary.high_risks}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Treatments</p>
                  <p className="text-2xl font-bold">{dashboardSummary.active_treatments}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className={dashboardSummary.overdue_reviews > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Reviews</p>
                  <p className="text-2xl font-bold">{dashboardSummary.overdue_reviews}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <DataTableFilters
        searchPlaceholder="Search risks by title, description, or ID..."
        searchValue={search}
        onSearchChange={setSearch}
        data-testid="risk-register-search-input"
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            key: 'category',
            label: 'Category',
            options: categoryOptions,
            value: categoryFilter,
            onChange: setCategoryFilter,
          },
          {
            key: 'riskLevel',
            label: 'Risk Level',
            options: riskLevelOptions,
            value: riskLevelFilter,
            onChange: setRiskLevelFilter,
          },
        ]}
        onClear={handleClearFilters}
      />

      <BulkActionsToolbar
        selectedCount={selectedRisks.size}
        onDelete={handleBulkDelete}
        onStatusUpdate={handleBulkStatusUpdate}
        statusOptions={statusOptions}
      />

      <RiskForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Edit Dialog */}
      {editingRisk && (
        <RiskForm
          open={!!editingRisk}
          onOpenChange={(open) => {
            if (!open) setEditingRisk(null)
          }}
          riskId={editingRisk.id}
          initialData={{
            title: editingRisk.data.title,
            description: editingRisk.data.description,
            category: editingRisk.data.category,
            status: editingRisk.data.status,
            likelihood: editingRisk.data.likelihood,
            impact: editingRisk.data.impact,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingRiskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this risk? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingRiskId(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(deletingRiskId)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {risks && risks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="risk-register-list">
          {risks.map((risk) => {
            const likelihood = toNumber(risk.current_likelihood || risk.likelihood)
            const impact = toNumber(risk.current_impact || risk.impact)
            const currentScore = risk.current_risk_score || (likelihood * impact)
            const riskLevel = getRiskLevel(risk.current_risk_level, currentScore)
            return (
              <SelectableCard
                key={risk.id}
                id={risk.id}
                selected={selectedRisks.has(risk.id)}
                onSelect={handleSelectRisk}
                data-testid={`risk-register-card-${risk.id}`}
              >
                <CardHeader className="pl-10 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg line-clamp-1">{risk.title}</CardTitle>
                      </div>
                      {risk.risk_id && (
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{risk.risk_id}</p>
                      )}
                    </div>
                    <ShieldAlert className={`h-5 w-5 ${riskLevel.textColor}`} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge className={riskLevel.color}>
                      {riskLevel.label} ({currentScore})
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(risk.status)}>
                      {risk.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {risk.description || 'No description available'}
                  </p>

                  {/* Risk Score Comparison */}
                  {(risk.inherent_risk_score || risk.target_risk_score) && (
                    <div className="mb-3 p-2 bg-muted/50 rounded-md">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Inherent → Current → Target</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-medium">{risk.inherent_risk_score || '-'}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className={`font-bold ${riskLevel.textColor}`}>{currentScore}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium text-green-600">{risk.target_risk_score || '-'}</span>
                      </div>
                    </div>
                  )}

                  {/* Control Effectiveness */}
                  {risk.control_effectiveness !== undefined && risk.control_effectiveness > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Control Effectiveness</span>
                        <span className="font-medium">{risk.control_effectiveness}%</span>
                      </div>
                      <Progress value={risk.control_effectiveness} className="h-1.5" />
                    </div>
                  )}

                  {/* Integration Stats */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    {risk.linked_assets_count !== undefined && risk.linked_assets_count > 0 && (
                      <div className="flex items-center gap-1" title="Linked Assets">
                        <Package className="h-3 w-3" />
                        <span>{risk.linked_assets_count}</span>
                      </div>
                    )}
                    {risk.linked_controls_count !== undefined && risk.linked_controls_count > 0 && (
                      <div className="flex items-center gap-1" title="Linked Controls">
                        <Shield className="h-3 w-3" />
                        <span>{risk.linked_controls_count}</span>
                      </div>
                    )}
                    {risk.active_treatments_count !== undefined && risk.active_treatments_count > 0 && (
                      <div className="flex items-center gap-1" title="Active Treatments">
                        <Target className="h-3 w-3" />
                        <span>{risk.active_treatments_count}</span>
                      </div>
                    )}
                    {risk.kri_count !== undefined && risk.kri_count > 0 && (
                      <Link
                        href={`/${params.locale}/dashboard/risks/kris`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        title="View KRIs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Activity className="h-3 w-3" />
                        <span>{risk.kri_count}</span>
                      </Link>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium capitalize">{risk.category_name || risk.category.replace('_', ' ')}</span>
                    </div>
                    {risk.owner_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="font-medium">{risk.owner_name}</span>
                      </div>
                    )}
                    {risk.next_review_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Review:</span>
                        <span className={`font-medium ${new Date(risk.next_review_date) < new Date() ? 'text-red-600' : ''}`}>
                          {new Date(risk.next_review_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Link href={`/${params.locale}/dashboard/risks/${risk.id}`} className="flex-1" data-testid={`risk-register-view-button-${risk.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRisk({ id: risk.id, data: risk })}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingRiskId(risk.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </SelectableCard>
            )
          })}
        </div>
      ) : null}

      {risksResponse && risksResponse.total > 0 && (
        <Pagination
          currentPage={risksResponse.page}
          totalPages={Math.ceil(risksResponse.total / risksResponse.limit)}
          totalItems={risksResponse.total}
          itemsPerPage={risksResponse.limit}
          onPageChange={setPage}
        />
      )}

      {risksError && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Risks</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {(risksError as any)?.response?.data?.message || (risksError as any)?.message || 'Failed to load risks. Please check your authentication and try again.'}
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {!risksError && risks.length === 0 && !isLoading && risksResponse && risksResponse.total === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Risks Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Get started by identifying and documenting your first risk.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Risk
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
