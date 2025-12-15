"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { policiesApi } from "@/lib/api/policies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, Edit, Trash2, Upload, Download } from "lucide-react"
import { PolicyForm } from "@/components/forms/policy-form"
import { PolicyDocumentUpload } from "@/components/forms/policy-document-upload"

// Simple toast implementation
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

export default function PolicyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const policyId = params.id as string
  const locale = params.locale as string

  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy', policyId],
    queryFn: () => policiesApi.getById(policyId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => policiesApi.delete(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success("Policy deleted successfully")
      router.push(`/${locale}/dashboard/policies`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete policy")
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Policy Details</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[400px]">
              <span className="text-sm text-muted-foreground">Loading policy details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Policy Not Found</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <p className="text-muted-foreground mb-4">The policy you're looking for doesn't exist.</p>
              <Button onClick={() => router.push(`/${locale}/dashboard/policies`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Policies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/policies`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Policy Details</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{policy.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getStatusColor(policy.status)}>
                  {policy.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className={getTypeColor(policy.policyType)}>
                  {policy.policyType}
                </Badge>
                {policy.version && (
                  <Badge variant="outline">
                    Version {policy.version}
                  </Badge>
                )}
              </div>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {policy.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{policy.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Policy Type</h3>
              <p className="text-sm text-muted-foreground capitalize">{policy.policyType}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Status</h3>
              <p className="text-sm text-muted-foreground capitalize">{policy.status.replace('_', ' ')}</p>
            </div>
          </div>

          {policy.version && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Version</h3>
              <p className="text-sm text-muted-foreground">{policy.version}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {policy.effectiveDate && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Effective Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(policy.effectiveDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
            {policy.reviewDate && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Review Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(policy.reviewDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Created At</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(policy.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Document Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Document</h3>
              {!policy.documentName && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </div>
            {policy.documentName ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{policy.documentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {policy.documentMimeType || 'Document'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Replace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const downloadUrl = policiesApi.downloadDocument(policy.id)
                      window.open(downloadUrl, '_blank')
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed rounded-lg text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">No document uploaded</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {isEditDialogOpen && policy && (
        <PolicyForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          policyId={policyId}
          initialData={{
            title: policy.title,
            description: policy.description,
            policyType: policy.policyType,
            status: policy.status,
            version: policy.version,
            effectiveDate: policy.effectiveDate ? new Date(policy.effectiveDate).toISOString().split('T')[0] : undefined,
            reviewDate: policy.reviewDate ? new Date(policy.reviewDate).toISOString().split('T')[0] : undefined,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete "{policy.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutation.mutate()
                    setIsDeleteDialogOpen(false)
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document Upload Dialog */}
      {isUploadDialogOpen && (
        <PolicyDocumentUpload
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          policyId={policyId}
          policyName={policy.title}
        />
      )}
    </div>
  )
}

