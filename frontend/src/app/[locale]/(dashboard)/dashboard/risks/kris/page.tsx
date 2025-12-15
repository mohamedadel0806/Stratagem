"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { krisApi, KRI, KRIStatus, KRITrend } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Activity, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Minus, Download } from "lucide-react"
import { KRIForm } from "@/components/forms/kri-form"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useParams } from "next/navigation"
import { DataTableFilters } from "@/components/filters/data-table-filters"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { generateKRIReportPDF, KRI as KRIExport } from "@/lib/utils/risk-export"

// KRI Status constants
const KRI_STATUS = {
  GREEN: 'green' as const,
  AMBER: 'amber' as const,
  RED: 'red' as const,
} as const;

export default function KRIsPage() {
  const params = useParams()
  const locale = params?.locale || 'en'
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingKRI, setEditingKRI] = useState<KRI | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { data: kris, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['kris', statusFilter, searchQuery],
    queryFn: () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kris/page.tsx:38',message:'Query function executing',data:{statusFilter,searchQuery},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return krisApi.getAll({
        status: statusFilter !== 'all' ? (statusFilter as KRIStatus) : undefined,
        isActive: true,
      }).then((result) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kris/page.tsx:41',message:'Query function completed',data:{kriCount:result.length,kriIds:result.map(r=>r.id),kriNames:result.map(r=>r.name)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return result;
      });
    },
  })

  // Track query state changes
  React.useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kris/page.tsx:53',message:'Query state changed',data:{isLoading,isFetching,dataUpdatedAt,kriCount:kris?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }, [isLoading, isFetching, dataUpdatedAt, kris])

  // Filter and sort KRIs by search query and creation date
  const filteredKRIs = React.useMemo(() => {
    const result = (kris || []).filter((kri) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        kri.name.toLowerCase().includes(query) ||
        kri.kri_id?.toLowerCase().includes(query) ||
        kri.description?.toLowerCase().includes(query)
      )
    })
    // Sort by created_at descending (newest first)
    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateB - dateA
    })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kris/page.tsx:45',message:'Filtered KRIs computed',data:{totalKris:kris?.length||0,filteredCount:result.length,searchQuery,statusFilter,kriIds:result.map(r=>r.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return result;
  }, [kris, searchQuery])

  const deleteMutation = useMutation({
    mutationFn: (id: string) => krisApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kris'] })
      toast({
        title: 'Success',
        description: 'KRI deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete KRI',
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (kri: KRI) => {
    setEditingKRI(kri)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this KRI?')) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusIcon = (status?: KRIStatus) => {
    switch (status) {
      case KRI_STATUS.GREEN:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case KRI_STATUS.AMBER:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case KRI_STATUS.RED:
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status?: KRIStatus) => {
    switch (status) {
      case KRI_STATUS.GREEN:
        return 'bg-green-100 text-green-800 border-green-300'
      case KRI_STATUS.AMBER:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case KRI_STATUS.RED:
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTrendIcon = (trend?: KRITrend) => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case 'worsening':
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading KRIs...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Key Risk Indicators (KRIs)</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor Key Risk Indicators
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (kris && kris.length > 0) {
                generateKRIReportPDF(kris as KRIExport[])
                toast({
                  title: 'Export Successful',
                  description: 'KRI report exported to PDF',
                })
              }
            }}
            disabled={!kris || kris.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => {
            setEditingKRI(null)
            setIsFormOpen(true)
          }} data-testid="kris-new-button">
            <Plus className="mr-2 h-4 w-4" />
            New KRI
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search KRIs by name, ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value={KRI_STATUS.GREEN}>Green</option>
              <option value={KRI_STATUS.AMBER}>Amber</option>
              <option value={KRI_STATUS.RED}>Red</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* KRIs Grid */}
      {filteredKRIs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'No KRIs match your search criteria'
                : 'No KRIs found. Create your first KRI to get started.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First KRI
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredKRIs.map((kri) => (
            <Card key={kri.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{kri.name}</CardTitle>
                      {getStatusIcon(kri.current_status)}
                    </div>
                    {kri.kri_id && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {kri.kri_id}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(kri.trend)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {kri.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {kri.description}
                  </p>
                )}
                
                <div className="space-y-2 mb-4">
                  {kri.current_status && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(kri.current_status)}
                      >
                        {kri.current_status.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  {kri.current_value !== null && kri.current_value !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Value:</span>
                      <span className="font-medium">{kri.current_value} {kri.measurement_unit || ''}</span>
                    </div>
                  )}
                  {kri.measurement_frequency && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="capitalize">{kri.measurement_frequency}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(kri)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(kri.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* KRI Form Dialog */}
      <KRIForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setEditingKRI(null)
          }
        }}
        kriId={editingKRI?.id}
        initialData={editingKRI || undefined}
        onSuccess={() => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kris/page.tsx:305',message:'Page onSuccess callback - before invalidation',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          queryClient.invalidateQueries({ queryKey: ['kris'] })
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'kris/page.tsx:306',message:'Page onSuccess callback - after invalidation',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          setIsFormOpen(false)
          setEditingKRI(null)
        }}
      />
    </div>
  )
}

