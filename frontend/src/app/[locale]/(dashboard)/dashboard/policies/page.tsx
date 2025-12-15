"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { policiesApi, PolicyQueryParams } from "@/lib/api/policies"
import { DataTableFilters } from "@/components/filters/data-table-filters"
import { Pagination } from "@/components/ui/pagination"
import { ExportButton } from "@/components/export/export-button"
import { BulkActionsToolbar } from "@/components/bulk/bulk-actions-toolbar"
import { SelectableCard } from "@/components/bulk/selectable-card"
import { convertToCSV, downloadCSV, formatPolicyForExport } from "@/lib/utils/export"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Edit, Trash2, Eye } from "lucide-react"
import { PolicyForm } from "@/components/forms/policy-form"
import Link from "next/link"

// Simple toast implementation
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

export default function PoliciesPage() {
  const params = useParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<{ id: string; data: any } | null>(null)
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Filter state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [policyTypeFilter, setPolicyTypeFilter] = useState<string>("")
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(new Set())

  // Build query params
  const queryParams: PolicyQueryParams = useMemo(() => {
    const params: PolicyQueryParams = {
      page,
      limit,
    }
    if (search) params.search = search
    if (statusFilter) params.status = statusFilter
    if (policyTypeFilter) params.policyType = policyTypeFilter
    return params
  }, [search, statusFilter, policyTypeFilter, page, limit])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1)
  }, [search, statusFilter, policyTypeFilter])

  const { data: policiesResponse, isLoading } = useQuery({
    queryKey: ['policies', queryParams],
    queryFn: () => policiesApi.getAll(queryParams),
  })

  const policies = policiesResponse?.data || []

  const deleteMutation = useMutation({
    mutationFn: (id: string) => policiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success("Policy deleted successfully")
      setDeletingPolicyId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete policy")
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => policiesApi.delete(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success(`${selectedPolicies.size} policy/policies deleted successfully`)
      setSelectedPolicies(new Set())
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete policies")
    },
  })

  const handleSelectPolicy = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedPolicies)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedPolicies(newSelected)
  }

  const handleBulkDelete = () => {
    if (selectedPolicies.size > 0 && confirm(`Are you sure you want to delete ${selectedPolicies.size} policy/policies? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(Array.from(selectedPolicies))
    }
  }

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => policiesApi.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success(`Status updated for ${selectedPolicies.size} policy/policies`)
      setSelectedPolicies(new Set())
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update policy status")
    },
  })

  const handleBulkStatusUpdate = (status: string) => {
    if (selectedPolicies.size > 0) {
      bulkUpdateStatusMutation.mutate({ ids: Array.from(selectedPolicies), status })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'in_review':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'bg-red-100 text-red-800'
      case 'compliance':
        return 'bg-blue-100 text-blue-800'
      case 'operational':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleClearFilters = () => {
    setSearch("")
    setStatusFilter("")
    setPolicyTypeFilter("")
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'in_review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ]

  const policyTypeOptions = [
    { value: 'security', label: 'Security' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'operational', label: 'Operational' },
    { value: 'it', label: 'IT' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[400px]">
              <span className="text-sm text-muted-foreground">Loading policies...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
        <div className="flex gap-2">
          <ExportButton
            onExportCSV={() => {
              if (policies && policies.length > 0) {
                const formattedPolicies = policies.map(formatPolicyForExport)
                const csv = convertToCSV(formattedPolicies)
                downloadCSV(csv, `policies-export-${new Date().toISOString().split('T')[0]}`)
              }
            }}
            disabled={!policies || policies.length === 0}
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      <DataTableFilters
        searchPlaceholder="Search policies by title or description..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            key: 'policyType',
            label: 'Type',
            options: policyTypeOptions,
            value: policyTypeFilter,
            onChange: setPolicyTypeFilter,
          },
        ]}
        onClear={handleClearFilters}
      />

      <BulkActionsToolbar
        selectedCount={selectedPolicies.size}
        onDelete={handleBulkDelete}
        onStatusUpdate={handleBulkStatusUpdate}
        statusOptions={statusOptions}
      />

      {policiesResponse && policiesResponse.total > 0 && (
        <Pagination
          currentPage={policiesResponse.page}
          totalPages={Math.ceil(policiesResponse.total / policiesResponse.limit)}
          totalItems={policiesResponse.total}
          itemsPerPage={policiesResponse.limit}
          onPageChange={setPage}
        />
      )}

      <PolicyForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {policies && policies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <SelectableCard
              key={policy.id}
              id={policy.id}
              selected={selectedPolicies.has(policy.id)}
              onSelect={handleSelectPolicy}
            >
              <CardHeader className="pl-12">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(policy.status)}>
                    {policy.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  {policy.policyType && (
                    <Badge variant="outline" className={getTypeColor(policy.policyType)}>
                      {policy.policyType}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {policy.description || 'No description available'}
                </p>
                <div className="space-y-1 text-xs text-muted-foreground mb-4">
                  {policy.version && <div>Version: {policy.version}</div>}
                  {policy.effectiveDate && (
                    <div>Effective: {new Date(policy.effectiveDate).toLocaleDateString()}</div>
                  )}
                  {policy.reviewDate && (
                    <div>Review: {new Date(policy.reviewDate).toLocaleDateString()}</div>
                  )}
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Link href={`/${params.locale}/dashboard/policies/${policy.id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPolicy({ id: policy.id, data: policy })}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingPolicyId(policy.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </SelectableCard>
          ))}
        </div>
      ) : null}

      {policiesResponse && policiesResponse.total > 0 && (
        <Pagination
          currentPage={policiesResponse.page}
          totalPages={Math.ceil(policiesResponse.total / policiesResponse.limit)}
          totalItems={policiesResponse.total}
          itemsPerPage={policiesResponse.limit}
          onPageChange={setPage}
        />
      )}

      {policies.length === 0 && !isLoading && policiesResponse && policiesResponse.total === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Policies Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Get started by creating your first policy.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingPolicy && (
        <PolicyForm
          open={!!editingPolicy}
          onOpenChange={(open) => {
            if (!open) setEditingPolicy(null)
          }}
          policyId={editingPolicy.id}
          initialData={{
            title: editingPolicy.data.title,
            description: editingPolicy.data.description,
            policyType: editingPolicy.data.policyType,
            status: editingPolicy.data.status,
            version: editingPolicy.data.version,
            effectiveDate: editingPolicy.data.effectiveDate ? new Date(editingPolicy.data.effectiveDate).toISOString().split('T')[0] : undefined,
            reviewDate: editingPolicy.data.reviewDate ? new Date(editingPolicy.data.reviewDate).toISOString().split('T')[0] : undefined,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingPolicyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this policy? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingPolicyId(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(deletingPolicyId)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

