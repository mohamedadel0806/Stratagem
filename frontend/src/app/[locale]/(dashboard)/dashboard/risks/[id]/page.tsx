"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { risksApi, riskAssessmentsApi, riskTreatmentsApi, krisApi, riskLinksApi, riskAssessmentRequestsApi } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  ShieldAlert, ArrowLeft, Edit, Trash2, Plus, Link2, Unlink, 
  AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, 
  CheckCircle2, XCircle, Activity, Target, Shield, Package
} from "lucide-react"
import { RiskForm } from "@/components/forms/risk-form"
import { TreatmentForm } from "@/components/forms/treatment-form"
import { RiskAssessmentForm } from "@/components/forms/risk-assessment-form"
import { RiskAssessmentRequestForm } from "@/components/forms/risk-assessment-request-form"
import { KRIBrowserDialog } from "@/components/risks/kri-browser-dialog"
import { KRITrendChart } from "@/components/risks/kri-trend-chart"
import { TreatmentGanttChart } from "@/components/risks/treatment-gantt-chart"
import { RiskAssetBrowserDialog } from "@/components/risks/risk-asset-browser-dialog"
import { RiskControlBrowserDialog } from "@/components/risks/risk-control-browser-dialog"
import { useState } from "react"

// Simple toast implementation
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

export default function RiskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTreatmentFormOpen, setIsTreatmentFormOpen] = useState(false)
  const [isAssessmentFormOpen, setIsAssessmentFormOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<any>(null)
  const [deletingTreatmentId, setDeletingTreatmentId] = useState<string | null>(null)
  const [isKRIBrowserOpen, setIsKRIBrowserOpen] = useState(false)
  const [isAssetBrowserOpen, setIsAssetBrowserOpen] = useState(false)
  const [isControlBrowserOpen, setIsControlBrowserOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)

  const riskId = params.id as string
  const locale = params.locale as string

  // Fetch risk details
  const { data: risk, isLoading } = useQuery({
    queryKey: ['risk', riskId],
    queryFn: () => risksApi.getById(riskId),
  })

  // Fetch related data
  const { data: assessments } = useQuery({
    queryKey: ['risk-assessments', riskId],
    queryFn: () => riskAssessmentsApi.getByRiskId(riskId),
    enabled: !!riskId,
  })

  const { data: latestAssessments } = useQuery({
    queryKey: ['risk-assessments-latest', riskId],
    queryFn: () => riskAssessmentsApi.getLatest(riskId),
    enabled: !!riskId,
  })

  // Fetch assessment requests for this risk
  const { data: assessmentRequests } = useQuery({
    queryKey: ['risk-assessment-requests', riskId],
    queryFn: () => riskAssessmentRequestsApi.getByRiskId(riskId),
    enabled: !!riskId,
  })

  const { data: treatments } = useQuery({
    queryKey: ['risk-treatments', riskId],
    queryFn: () => riskTreatmentsApi.getByRiskId(riskId),
    enabled: !!riskId,
  })

  const { data: kris } = useQuery({
    queryKey: ['risk-kris', riskId],
    queryFn: () => krisApi.getByRiskId(riskId),
    enabled: !!riskId,
  })

  const { data: linkedAssets } = useQuery({
    queryKey: ['risk-assets', riskId],
    queryFn: () => riskLinksApi.getAssetsByRisk(riskId),
    enabled: !!riskId,
  })

  const { data: linkedControls } = useQuery({
    queryKey: ['risk-controls', riskId],
    queryFn: () => riskLinksApi.getControlsByRisk(riskId),
    enabled: !!riskId,
  })

  const deleteMutation = useMutation({
    mutationFn: () => risksApi.delete(riskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] })
      toast.success("Risk deleted successfully")
      router.push(`/${locale}/dashboard/risks`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete risk")
    },
  })

  const unlinkKRIMutation = useMutation({
    mutationFn: ({ kriId }: { kriId: string }) => krisApi.unlinkFromRisk(kriId, riskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-kris', riskId] })
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] })
      toast.success("KRI unlinked successfully")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unlink KRI")
    },
  })

  const unlinkAssetMutation = useMutation({
    mutationFn: (linkId: string) => riskLinksApi.unlinkAsset(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-assets', riskId] })
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] })
      toast.success("Asset unlinked successfully")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unlink asset")
    },
  })

  const unlinkControlMutation = useMutation({
    mutationFn: (linkId: string) => riskLinksApi.unlinkControl(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-controls', riskId] })
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] })
      toast.success("Control unlinked successfully")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unlink control")
    },
  })

  const deleteTreatmentMutation = useMutation({
    mutationFn: (treatmentId: string) => riskTreatmentsApi.delete(treatmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-treatments', riskId] })
      queryClient.invalidateQueries({ queryKey: ['risk', riskId] })
      toast.success("Treatment deleted successfully")
      setDeletingTreatmentId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete treatment")
      setDeletingTreatmentId(null)
    },
  })

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
        case 'critical': return { label: 'Critical', color: 'bg-red-500 text-white', bgColor: 'bg-red-50' }
        case 'high': return { label: 'High', color: 'bg-orange-500 text-white', bgColor: 'bg-orange-50' }
        case 'medium': return { label: 'Medium', color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50' }
        case 'low': return { label: 'Low', color: 'bg-green-500 text-white', bgColor: 'bg-green-50' }
      }
    }
    if (score) {
      if (score >= 20) return { label: 'Critical', color: 'bg-red-500 text-white', bgColor: 'bg-red-50' }
      if (score >= 12) return { label: 'High', color: 'bg-orange-500 text-white', bgColor: 'bg-orange-50' }
      if (score >= 6) return { label: 'Medium', color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50' }
      return { label: 'Low', color: 'bg-green-500 text-white', bgColor: 'bg-green-50' }
    }
    return { label: 'Unknown', color: 'bg-gray-500 text-white', bgColor: 'bg-gray-50' }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mitigated': return 'bg-green-100 text-green-800 border-green-300'
      case 'assessed': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'identified': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'accepted': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'closed': return 'bg-gray-100 text-gray-600 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTreatmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      case 'deferred': return 'bg-orange-100 text-orange-800'
      case 'cancelled': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getKRIStatusIcon = (status?: string) => {
    switch (status) {
      case 'green': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'amber': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'red': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'worsening': return <TrendingUp className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/risks`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Risk Details</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-pulse text-muted-foreground">Loading risk details...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!risk) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px]">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">The risk you're looking for doesn't exist.</p>
              <Button onClick={() => router.push(`/${locale}/dashboard/risks`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Risks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const likelihood = toNumber(risk.current_likelihood || risk.likelihood)
  const impact = toNumber(risk.current_impact || risk.impact)
  const currentScore = risk.current_risk_score || (likelihood * impact)
  const currentLevel = getRiskLevel(risk.current_risk_level, currentScore)
  const inherentScore = risk.inherent_risk_score || (toNumber(risk.inherent_likelihood) * toNumber(risk.inherent_impact))
  const inherentLevel = getRiskLevel(risk.inherent_risk_level, inherentScore)
  const targetScore = risk.target_risk_score || (toNumber(risk.target_likelihood) * toNumber(risk.target_impact))
  const targetLevel = getRiskLevel(risk.target_risk_level, targetScore)

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/risks`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{risk.title}</h2>
              {risk.risk_id && (
                <Badge variant="outline" className="font-mono text-xs">
                  {risk.risk_id}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={currentLevel.color}>
                {currentLevel.label} Risk
              </Badge>
              <Badge variant="outline" className={getStatusColor(risk.status)}>
                {risk.status.replace('_', ' ')}
              </Badge>
              {risk.category_name && (
                <Badge variant="secondary">{risk.category_name}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} data-testid="risk-details-edit-button">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Risk Score Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={inherentLevel.bgColor}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inherent Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risk.inherent_risk_score || '-'}</div>
            <p className="text-xs text-muted-foreground">
              {risk.inherent_likelihood || '-'} × {risk.inherent_impact || '-'}
            </p>
          </CardContent>
        </Card>

        <Card className={currentLevel.bgColor}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentScore}</div>
            <p className="text-xs text-muted-foreground">
              {risk.current_likelihood || risk.likelihood} × {risk.current_impact || risk.impact}
            </p>
          </CardContent>
        </Card>

        <Card className={targetLevel.bgColor}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Target Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risk.target_risk_score || '-'}</div>
            <p className="text-xs text-muted-foreground">
              {risk.target_likelihood || '-'} × {risk.target_impact || '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Control Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risk.control_effectiveness || 0}%</div>
            <Progress value={risk.control_effectiveness || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" data-testid="risk-details-tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments" data-testid="risk-details-tab-assessments">
            Assessments
            {assessments && assessments.length > 0 && (
              <Badge variant="secondary" className="ml-2">{assessments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="assets" data-testid="risk-details-tab-assets">
            Assets
            {linkedAssets && linkedAssets.length > 0 && (
              <Badge variant="secondary" className="ml-2">{linkedAssets.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="controls" data-testid="risk-details-tab-controls">
            Controls
            {linkedControls && linkedControls.length > 0 && (
              <Badge variant="secondary" className="ml-2">{linkedControls.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="treatments" data-testid="risk-details-tab-treatments">
            Treatments
            {treatments && treatments.length > 0 && (
              <Badge variant="secondary" className="ml-2">{treatments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="kris" data-testid="risk-details-tab-kris">
            KRIs
            {kris && kris.length > 0 && (
              <Badge variant="secondary" className="ml-2">{kris.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
                <CardTitle className="text-lg">Risk Details</CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
          {risk.description && (
            <div>
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{risk.description}</p>
            </div>
          )}
                {risk.risk_statement && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Risk Statement</h4>
                    <p className="text-sm text-muted-foreground italic">"{risk.risk_statement}"</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Category</h4>
                    <p className="text-sm text-muted-foreground">{risk.category_name || risk.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Status</h4>
                    <p className="text-sm text-muted-foreground capitalize">{risk.status.replace('_', ' ')}</p>
                  </div>
                  {risk.threat_source && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Threat Source</h4>
                      <p className="text-sm text-muted-foreground capitalize">{risk.threat_source}</p>
                    </div>
                  )}
                  {risk.risk_velocity && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Risk Velocity</h4>
                      <p className="text-sm text-muted-foreground capitalize">{risk.risk_velocity}</p>
                    </div>
                  )}
                </div>
                {risk.early_warning_signs && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Early Warning Signs</h4>
                    <p className="text-sm text-muted-foreground">{risk.early_warning_signs}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ownership & Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                    <h4 className="text-sm font-semibold mb-1">Risk Owner</h4>
                    <p className="text-sm text-muted-foreground">{risk.owner_name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Risk Analyst</h4>
                    <p className="text-sm text-muted-foreground">{risk.risk_analyst_name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Date Identified</h4>
                    <p className="text-sm text-muted-foreground">
                      {risk.date_identified ? new Date(risk.date_identified).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Next Review</h4>
                    <p className="text-sm text-muted-foreground">
                      {risk.next_review_date ? new Date(risk.next_review_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(risk.createdAt).toLocaleDateString()}
                    </p>
            </div>
            <div>
                    <h4 className="text-sm font-semibold mb-1">Version</h4>
                    <p className="text-sm text-muted-foreground">{risk.version_number || 1}</p>
                  </div>
                </div>
                {risk.tags && risk.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {risk.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
            </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{risk.linked_assets_count || linkedAssets?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Linked Assets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{risk.linked_controls_count || linkedControls?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Linked Controls</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
            <div>
                  <p className="text-2xl font-bold">{risk.active_treatments_count || treatments?.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length || 0}</p>
                  <p className="text-xs text-muted-foreground">Active Treatments</p>
            </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Activity className="h-8 w-8 text-orange-500" />
            <div>
                  <p className="text-2xl font-bold">{risk.kri_count || kris?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Key Risk Indicators</p>
                </div>
              </CardContent>
            </Card>
            </div>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Assessments</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsRequestFormOpen(true)} data-testid="risk-details-request-assessment-button">
                <Plus className="mr-2 h-4 w-4" />
                Request Assessment
              </Button>
            <Button onClick={() => setIsAssessmentFormOpen(true)} data-testid="risk-details-new-assessment-button">
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
            </div>
          </div>

          {/* Latest Assessments Summary */}
          {latestAssessments && (
            <div className="grid gap-4 md:grid-cols-3">
              {['inherent', 'current', 'target'].map((type) => {
                const assessment = latestAssessments[type as keyof typeof latestAssessments]
                return (
                  <Card key={type}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm capitalize">{type} Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assessment ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Score:</span>
                            <Badge className={getRiskLevel(assessment.risk_level).color}>
                              {assessment.risk_score}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">L × I:</span>
                            <span>{assessment.likelihood} × {assessment.impact}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(assessment.assessment_date).toLocaleDateString()}
                            {assessment.assessor_name && ` by ${assessment.assessor_name}`}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No assessment yet</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Assessment Requests */}
          {assessmentRequests && assessmentRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assessment Requests</CardTitle>
                <CardDescription>Pending and active assessment requests for this risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assessmentRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {request.request_identifier}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {request.assessment_type}
                        </Badge>
                        <Badge
                          className={
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {request.status.replace('_', ' ')}
                        </Badge>
                        {request.requested_for_name && (
                          <span className="text-sm text-muted-foreground">
                            → {request.requested_for_name}
                          </span>
                        )}
                      </div>
                      <Link href={`/${locale}/dashboard/risks/assessment-requests`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {assessmentRequests.length > 5 && (
                    <Link href={`/${locale}/dashboard/risks/assessment-requests?riskId=${riskId}`}>
                      <Button variant="outline" className="w-full">
                        View All {assessmentRequests.length} Requests
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              {assessments && assessments.length > 0 ? (
                <div className="space-y-2">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{assessment.assessment_type}</Badge>
                        <Badge className={getRiskLevel(assessment.risk_level).color}>
                          {assessment.risk_score}
                        </Badge>
                        <span className="text-sm">
                          {assessment.likelihood} × {assessment.impact}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(assessment.assessment_date).toLocaleDateString()}
                        {assessment.is_latest && <Badge variant="secondary" className="ml-2">Latest</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No assessments recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Linked Assets</h3>
            <Button 
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'risks/[id]/page.tsx:657',message:'Link Asset button clicked',data:{riskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                setIsAssetBrowserOpen(true)
              }}
              data-testid="risk-details-link-asset-button"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Link Asset
            </Button>
          </div>
          <Card>
            <CardContent className="p-4">
              {linkedAssets && linkedAssets.length > 0 ? (
                <div className="space-y-2">
                  {linkedAssets.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="capitalize">{link.asset_type}</Badge>
                        <span className="text-sm font-mono">{link.asset_id.substring(0, 8)}...</span>
                        {link.impact_description && (
                          <span className="text-sm text-muted-foreground">- {link.impact_description}</span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // #region agent log
                          fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'risks/[id]/page.tsx:676',message:'Unlink Asset button clicked',data:{linkId:link.id,riskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                          // #endregion
                          if (confirm('Are you sure you want to unlink this asset?')) {
                            unlinkAssetMutation.mutate(link.id)
                          }
                        }}
                        disabled={unlinkAssetMutation.isPending}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No assets linked to this risk</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'risks/[id]/page.tsx:686',message:'Link First Asset button clicked',data:{riskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                      // #endregion
                      setIsAssetBrowserOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Link First Asset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Controls Tab */}
        <TabsContent value="controls" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Linked Controls</h3>
            <Button 
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'risks/[id]/page.tsx:741',message:'Link Control button clicked',data:{riskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                setIsControlBrowserOpen(true)
              }}
              data-testid="risk-details-link-control-button"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Link Control
            </Button>
          </div>
          <Card>
            <CardContent className="p-4">
              {linkedControls && linkedControls.length > 0 ? (
                <div className="space-y-2">
                  {linkedControls.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {link.control_info && (
                          <>
                            <Badge variant="outline">{link.control_info.control_identifier}</Badge>
                            <span className="text-sm">{link.control_info.title}</span>
                          </>
                        )}
                        {link.effectiveness_percentage !== undefined && (
                          <Badge variant="secondary">{link.effectiveness_percentage}% effective</Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // #region agent log
                          fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'risks/[id]/page.tsx:764',message:'Unlink Control button clicked',data:{linkId:link.id,riskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                          // #endregion
                          if (confirm('Are you sure you want to unlink this control?')) {
                            unlinkControlMutation.mutate(link.id)
                          }
                        }}
                        disabled={unlinkControlMutation.isPending}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No controls linked to this risk</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/45949711-2fc3-46e3-a840-ce93de4dc214',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'risks/[id]/page.tsx:774',message:'Link First Control button clicked',data:{riskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                      // #endregion
                      setIsControlBrowserOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Link First Control
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Treatment Plans</h3>
            <Button 
              onClick={() => {
                setEditingTreatment(null)
                setIsTreatmentFormOpen(true)
              }}
              data-testid="risk-details-new-treatment-button"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Treatment
            </Button>
          </div>

          {/* Treatment Gantt Chart */}
          {treatments && treatments.length > 0 && (
            <TreatmentGanttChart treatments={treatments} />
          )}
          <div className="grid gap-4">
            {treatments && treatments.length > 0 ? (
              treatments.map((treatment) => (
                <Card key={treatment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{treatment.title}</CardTitle>
                          <Badge variant="outline" className="font-mono text-xs">{treatment.treatment_id}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTreatmentStatusColor(treatment.status)}>
                            {treatment.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{treatment.strategy}</Badge>
                          <Badge variant="secondary" className="capitalize">{treatment.priority}</Badge>
                        </div>
                      </div>
                      {treatment.due_status === 'overdue' && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingTreatment(treatment)
                        setIsTreatmentFormOpen(true)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeletingTreatmentId(treatment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {treatment.description && (
                      <p className="text-sm text-muted-foreground">{treatment.description}</p>
                    )}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{treatment.progress_percentage}%</span>
                      </div>
                      <Progress value={treatment.progress_percentage} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <p>{treatment.treatment_owner_name || 'Unassigned'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target Date:</span>
                        <p>{treatment.target_completion_date ? new Date(treatment.target_completion_date).toLocaleDateString() : '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tasks:</span>
                        <p>{treatment.completed_tasks || 0}/{treatment.total_tasks || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No treatment plans for this risk</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setEditingTreatment(null)
                    setIsTreatmentFormOpen(true)
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Treatment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* KRIs Tab */}
        <TabsContent value="kris" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Key Risk Indicators</h3>
            <Button onClick={() => setIsKRIBrowserOpen(true)} data-testid="risk-details-link-kri-button">
              <Plus className="mr-2 h-4 w-4" />
              Link KRI
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {kris && kris.length > 0 ? (
              kris.map((kri) => (
                <Card key={kri.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{kri.name}</CardTitle>
                          <Badge variant="outline" className="font-mono text-xs">{kri.kri_id}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getKRIStatusIcon(kri.current_status)}
                        {getTrendIcon(kri.trend)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {kri.current_value ?? '-'} {kri.measurement_unit || ''}
                      </span>
                      <Badge variant={kri.current_status === 'green' ? 'default' : kri.current_status === 'red' ? 'destructive' : 'secondary'}>
                        {kri.current_status || 'N/A'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-1 rounded bg-green-50">
                        <div className="text-green-600">Green</div>
                        <div>≤ {kri.threshold_green ?? '-'}</div>
                      </div>
                      <div className="text-center p-1 rounded bg-yellow-50">
                        <div className="text-yellow-600">Amber</div>
                        <div>≤ {kri.threshold_amber ?? '-'}</div>
                      </div>
                      <div className="text-center p-1 rounded bg-red-50">
                        <div className="text-red-600">Red</div>
                        <div>&gt; {kri.threshold_amber ?? '-'}</div>
                      </div>
                    </div>
                    {/* KRI Trend Chart */}
                    <div className="mt-4 pt-4 border-t">
                      <KRITrendChart kriId={kri.id} kri={kri} limit={30} showThresholds={true} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {kri.last_measured_at ? `Last: ${new Date(kri.last_measured_at).toLocaleDateString()}` : 'Never measured'}
                      {' • '}
                      {kri.measurement_frequency}
                    </div>
                    <div className="flex justify-end pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to unlink "${kri.name}" from this risk?`)) {
                            unlinkKRIMutation.mutate({ kriId: kri.id })
                          }
                        }}
                        disabled={unlinkKRIMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Unlink className="mr-2 h-4 w-4" />
                        Unlink
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No KRIs linked to this risk</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsKRIBrowserOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Link First KRI
                  </Button>
        </CardContent>
      </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {isEditDialogOpen && risk && (
        <RiskForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          riskId={riskId}
          initialData={{
            title: risk.title,
            description: risk.description,
            category: risk.category,
            status: risk.status,
            likelihood: risk.likelihood,
            impact: risk.impact,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete "{risk.title}"? This will also remove all linked assessments, treatments, and associations. This action cannot be undone.
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

      {/* Treatment Form Dialog */}
      <TreatmentForm
        open={isTreatmentFormOpen}
        onOpenChange={(open) => {
          setIsTreatmentFormOpen(open)
          if (!open) {
            setEditingTreatment(null)
          }
        }}
        treatmentId={editingTreatment?.id}
        riskId={riskId}
        initialData={editingTreatment || undefined}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['risk-treatments', riskId] })
          setIsTreatmentFormOpen(false)
          setEditingTreatment(null)
        }}
      />

      {/* KRI Browser Dialog */}
      <KRIBrowserDialog
        open={isKRIBrowserOpen}
        onOpenChange={setIsKRIBrowserOpen}
        riskId={riskId}
        existingKRIIds={new Set((kris || []).map(kri => kri.id))}
      />

      {/* Risk Asset Browser Dialog */}
      <RiskAssetBrowserDialog
        open={isAssetBrowserOpen}
        onOpenChange={setIsAssetBrowserOpen}
        riskId={riskId}
        existingAssetIds={new Set((linkedAssets || []).map(link => link.asset_id))}
      />

      {/* Risk Control Browser Dialog */}
      <RiskControlBrowserDialog
        open={isControlBrowserOpen}
        onOpenChange={setIsControlBrowserOpen}
        riskId={riskId}
        existingControlIds={new Set((linkedControls || []).map(link => link.control_id).filter(Boolean))}
      />

      {/* Risk Assessment Form */}
      <RiskAssessmentForm
        open={isAssessmentFormOpen}
        onOpenChange={setIsAssessmentFormOpen}
        riskId={riskId}
        onSuccess={() => {
          setIsAssessmentFormOpen(false)
        }}
      />

      {/* Risk Assessment Request Form */}
      <RiskAssessmentRequestForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        riskId={riskId}
        onSuccess={() => {
          setIsRequestFormOpen(false)
        }}
      />

      {/* Delete Treatment Confirmation Dialog */}
      {deletingTreatmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this treatment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingTreatmentId(null)}
                  disabled={deleteTreatmentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteTreatmentMutation.mutate(deletingTreatmentId)}
                  disabled={deleteTreatmentMutation.isPending}
                >
                  {deleteTreatmentMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
