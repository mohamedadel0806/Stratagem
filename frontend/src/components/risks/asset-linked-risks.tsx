"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { riskLinksApi, RiskAssetLink, risksApi, Risk } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, ExternalLink, ShieldAlert, Search, Loader2, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface AssetLinkedRisksProps {
  assetType: 'physical' | 'information' | 'software' | 'application' | 'supplier'
  assetId: string
}

export function AssetLinkedRisks({ assetType, assetId }: AssetLinkedRisksProps) {
  const params = useParams()
  const locale = params?.locale || 'en'
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [selectedRiskId, setSelectedRiskId] = useState<string>('')
  const [impactDescription, setImpactDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [unlinkingLinkId, setUnlinkingLinkId] = useState<string | null>(null)

  const { data: risks, isLoading } = useQuery({
    queryKey: ['asset-risks', assetType, assetId],
    queryFn: () => riskLinksApi.getRisksByAsset(assetType, assetId),
    enabled: !!assetId,
  })

  const { data: riskScoreData } = useQuery({
    queryKey: ['asset-risk-score', assetType, assetId],
    queryFn: () => riskLinksApi.getAssetRiskScore(assetType, assetId),
    enabled: !!assetId,
  })

  // Transform backend response to match component expectations
  const riskScore = riskScoreData ? {
    risk_count: riskScoreData.total_risks || 0,
    aggregate_score: riskScoreData.total_risk_score || 0,
    risk_level: riskScoreData.max_risk_level || 'low',
    critical_count: riskScoreData.risk_breakdown?.find((b: any) => b.level === 'critical')?.count || 0,
    high_count: riskScoreData.risk_breakdown?.find((b: any) => b.level === 'high')?.count || 0,
    medium_count: riskScoreData.risk_breakdown?.find((b: any) => b.level === 'medium')?.count || 0,
    low_count: riskScoreData.risk_breakdown?.find((b: any) => b.level === 'low')?.count || 0,
    // Also keep original fields for backward compatibility
    ...riskScoreData,
  } : null

  // Fetch available risks for linking
  const { data: availableRisks, isLoading: isLoadingRisks } = useQuery({
    queryKey: ['available-risks', searchQuery],
    queryFn: () => risksApi.getAll({ search: searchQuery, limit: 50 }),
    enabled: isLinkDialogOpen,
  })

  // Get already linked risk IDs
  const linkedRiskIds = new Set(risks?.map((r: any) => r.id) || [])

  // Filter out already linked risks
  const filteredRisks = availableRisks?.data?.filter((risk: Risk) => !linkedRiskIds.has(risk.id)) || []

  const linkMutation = useMutation({
    mutationFn: (data: { risk_id: string; asset_type: string; asset_id: string; impact_description?: string }) =>
      riskLinksApi.linkAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-risks', assetType, assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-risk-score', assetType, assetId] })
      toast({
        title: 'Success',
        description: 'Risk linked to asset successfully',
      })
      setIsLinkDialogOpen(false)
      setSelectedRiskId('')
      setImpactDescription('')
      setSearchQuery('')
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to link risk',
        variant: 'destructive',
      })
    },
  })

  const handleLinkRisk = () => {
    if (!selectedRiskId) {
      toast({
        title: 'Error',
        description: 'Please select a risk to link',
        variant: 'destructive',
      })
      return
    }

    linkMutation.mutate({
      risk_id: selectedRiskId,
      asset_type: assetType,
      asset_id: assetId,
      impact_description: impactDescription || undefined,
    })
  }

  const unlinkMutation = useMutation({
    mutationFn: (linkId: string) => riskLinksApi.unlinkAsset(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-risks', assetType, assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-risk-score', assetType, assetId] })
      toast({
        title: 'Success',
        description: 'Risk unlinked from asset successfully',
      })
      setUnlinkingLinkId(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to unlink risk',
        variant: 'destructive',
      })
      setUnlinkingLinkId(null)
    },
  })

  const handleUnlink = (linkId: string) => {
    setUnlinkingLinkId(linkId)
  }

  const getRiskLevel = (level?: string, score?: number) => {
    if (level) {
      switch (level) {
        case 'critical': return { label: 'Critical', color: 'bg-red-500 text-white', bgColor: 'bg-red-50', textColor: 'text-red-600' }
        case 'high': return { label: 'High', color: 'bg-orange-500 text-white', bgColor: 'bg-orange-50', textColor: 'text-orange-600' }
        case 'medium': return { label: 'Medium', color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' }
        case 'low': return { label: 'Low', color: 'bg-green-500 text-white', bgColor: 'bg-green-50', textColor: 'text-green-600' }
      }
    }
    if (score) {
      if (score >= 20) return { label: 'Critical', color: 'bg-red-500 text-white', bgColor: 'bg-red-50', textColor: 'text-red-600' }
      if (score >= 12) return { label: 'High', color: 'bg-orange-500 text-white', bgColor: 'bg-orange-50', textColor: 'text-orange-600' }
      if (score >= 6) return { label: 'Medium', color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' }
      return { label: 'Low', color: 'bg-green-500 text-white', bgColor: 'bg-green-50', textColor: 'text-green-600' }
    }
    return { label: 'Unknown', color: 'bg-gray-500 text-white', bgColor: 'bg-gray-50', textColor: 'text-gray-600' }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-pulse text-muted-foreground">Loading risks...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Risk Score Summary */}
      {riskScore && (
        <Card className={getRiskLevel(riskScore.risk_level, riskScore.aggregate_score).bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Asset Risk Score</span>
              <Badge className={getRiskLevel(riskScore.risk_level, riskScore.aggregate_score).color}>
                {riskScore.risk_level || 'Unknown'} ({riskScore.aggregate_score || 0})
              </Badge>
            </CardTitle>
            <CardDescription>
              Aggregate risk score based on {riskScore.risk_count || 0} linked risk{riskScore.risk_count !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          {riskScore.risk_count > 0 && (
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Critical</div>
                  <div className="text-2xl font-bold text-red-600">{riskScore.critical_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">High</div>
                  <div className="text-2xl font-bold text-orange-600">{riskScore.high_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Medium</div>
                  <div className="text-2xl font-bold text-yellow-600">{riskScore.medium_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Low</div>
                  <div className="text-2xl font-bold text-green-600">{riskScore.low_count || 0}</div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Linked Risks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Linked Risks</CardTitle>
              <CardDescription>
                Risks that impact this asset
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsLinkDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Link Risk
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {risks && risks.length > 0 ? (
            <div className="space-y-3">
              {risks.map((risk: any) => {
                // Handle both response formats: full risk object or simplified link response
                const riskId = risk.risk_id || risk.id
                const riskTitle = risk.risk_title || risk.title
                const riskLevel = getRiskLevel(risk.risk_level || risk.current_risk_level, risk.risk_score || risk.current_risk_score)
                const linkId = risk.link_id || risk.id // Use link_id for unlinking
                
                return (
                  <div
                    key={linkId || `risk-${riskId}`}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className={`h-4 w-4 ${riskLevel.textColor || 'text-muted-foreground'}`} />
                        <Link
                          href={`/${locale}/dashboard/risks/${riskId}`}
                          className="font-semibold hover:underline"
                        >
                          {riskTitle}
                        </Link>
                        {(risk.risk_identifier || risk.risk_id) && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {risk.risk_identifier || risk.risk_id}
                          </Badge>
                        )}
                      </div>
                      {risk.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {risk.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={riskLevel.color}>
                          {riskLevel.label} ({risk.risk_score || risk.current_risk_score || risk.likelihood * risk.impact})
                        </Badge>
                        {(risk.category_name || risk.category) && (
                          <Badge variant="outline" className="capitalize">
                            {risk.category_name || risk.category?.replace('_', ' ')}
                          </Badge>
                        )}
                        {risk.impact_description && (
                          <span className="text-xs text-muted-foreground">
                            Impact: {risk.impact_description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/${locale}/dashboard/risks/${riskId}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnlink(linkId)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Unlink risk"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No risks linked to this asset</p>
              <Button onClick={() => setIsLinkDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Link First Risk
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Risk Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link Risk to Asset</DialogTitle>
            <DialogDescription>
              Search and select a risk to link to this asset. You can optionally describe how this risk impacts the asset.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div>
              <Label htmlFor="search">Search Risks</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, description, or risk ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md">
              {isLoadingRisks ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredRisks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No risks found matching your search' : 'No available risks to link'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredRisks.map((risk: Risk) => {
                    const riskLevel = getRiskLevel(risk.current_risk_level, risk.current_risk_score)
                    const isSelected = selectedRiskId === risk.id
                    return (
                      <div
                        key={risk.id || `risk-${risk.title}`}
                        onClick={() => setSelectedRiskId(risk.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <ShieldAlert className={`h-4 w-4 ${riskLevel.textColor || 'text-muted-foreground'}`} />
                              <span className="font-semibold">{risk.title}</span>
                              {risk.risk_id && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {risk.risk_id}
                                </Badge>
                              )}
                              <Badge className={riskLevel.color}>
                                {riskLevel.label}
                              </Badge>
                            </div>
                            {risk.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {risk.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="capitalize text-xs">
                                {risk.category_name || risk.category?.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Score: {risk.current_risk_score || risk.likelihood * risk.impact}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="ml-2">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedRiskId && (
              <div className="space-y-2">
                <Label htmlFor="impact">Impact Description (Optional)</Label>
                <Textarea
                  id="impact"
                  placeholder="Describe how this risk impacts this asset..."
                  value={impactDescription}
                  onChange={(e) => setImpactDescription(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLinkRisk}
              disabled={!selectedRiskId || linkMutation.isPending}
            >
              {linkMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Linking...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Link Risk
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={!!unlinkingLinkId} onOpenChange={(open) => !open && setUnlinkingLinkId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Risk</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink this risk from the asset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unlinkMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unlinkingLinkId && unlinkMutation.mutate(unlinkingLinkId)}
              disabled={unlinkMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {unlinkMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Unlinking...
                </>
              ) : (
                'Unlink Risk'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

