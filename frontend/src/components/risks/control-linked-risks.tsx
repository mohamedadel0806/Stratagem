"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { riskLinksApi } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, ExternalLink, ShieldAlert, Shield, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { RiskBrowserDialog } from "./risk-browser-dialog"
import { useToast } from "@/hooks/use-toast"

interface ControlLinkedRisksProps {
  controlId: string
}

export function ControlLinkedRisks({ controlId }: ControlLinkedRisksProps) {
  const params = useParams()
  const locale = params?.locale || 'en'
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isRiskBrowserOpen, setIsRiskBrowserOpen] = useState(false)

  const { data: risks, isLoading } = useQuery({
    queryKey: ['control-risks', controlId],
    queryFn: () => riskLinksApi.getRisksByControl(controlId),
    enabled: !!controlId,
  })

  // Get existing risk IDs for the browser dialog
  // Backend returns { link_id, risk_id, risk_identifier, risk_title, ... }
  const existingRiskIds = new Set(
    risks?.map((r: any) => r.risk_id || r.id) || []
  )

  // Unlink mutation
  const unlinkMutation = useMutation({
    mutationFn: (linkId: string) => riskLinksApi.unlinkControl(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-risks', controlId] })
      queryClient.invalidateQueries({ queryKey: ['control-effectiveness', controlId] })
      toast({
        title: 'Success',
        description: 'Risk unlinked successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to unlink risk',
        variant: 'destructive',
      })
    },
  })

  const handleUnlink = (linkId: string, riskTitle: string) => {
    if (confirm(`Are you sure you want to unlink "${riskTitle}" from this control?`)) {
      unlinkMutation.mutate(linkId)
    }
  }

  // Calculate effectiveness from risks data
  // Backend returns effectiveness_rating (0-5) not percentage
  // The API endpoint getControlEffectiveness expects riskId, not controlId
  // So we calculate it from the linked risks data instead
  const effectiveness = risks && risks.length > 0 ? (() => {
    const risksWithEffectiveness = risks.filter((r: any) => r.effectiveness_rating != null)
    const totalEffectiveness = risksWithEffectiveness.reduce((sum: number, risk: any) => {
      // Convert 0-5 rating to percentage (0-100)
      const rating = risk.effectiveness_rating || 0
      return sum + (rating * 20) // 0-5 scale to 0-100%
    }, 0)
    const avgEffectiveness = risksWithEffectiveness.length > 0 
      ? totalEffectiveness / risksWithEffectiveness.length 
      : null
    
    return {
      risk_count: risks.length,
      average_effectiveness: avgEffectiveness,
      risks_without_controls: 0, // All risks here are linked to this control
    }
  })() : null

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
      {/* Control Effectiveness Summary */}
      {effectiveness && effectiveness.average_effectiveness != null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Control Effectiveness
            </CardTitle>
            <CardDescription>
              Overall effectiveness across {effectiveness.risk_count || 0} linked risk{effectiveness.risk_count !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Effectiveness</span>
                <span className="font-semibold">{Math.round(effectiveness.average_effectiveness)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, effectiveness.average_effectiveness))}%` }}
                />
              </div>
              {effectiveness.risks_without_controls > 0 && (
                <div className="text-sm text-yellow-600 mt-2">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  {effectiveness.risks_without_controls} risk{effectiveness.risks_without_controls !== 1 ? 's' : ''} without controls
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Linked Risks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Linked Risks</CardTitle>
              <CardDescription>
                Risks mitigated by this control
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsRiskBrowserOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Link Risk
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {risks && risks.length > 0 ? (
            <div className="space-y-3">
              {risks.map((risk: any, index: number) => {
                // Backend returns: { link_id, risk_id, risk_identifier, risk_title, risk_level, risk_score, effectiveness_rating, ... }
                // Map to expected structure
                const riskId = risk.risk_id || risk.id
                const riskTitle = risk.risk_title || risk.title || 'Untitled Risk'
                const riskIdentifier = risk.risk_identifier || risk.risk_id
                const riskLevel = getRiskLevel(risk.risk_level || risk.current_risk_level, risk.risk_score || risk.current_risk_score)
                const linkId = risk.link_id
                // Calculate risk score safely
                const riskScore = risk.risk_score ?? risk.current_risk_score ?? (risk.likelihood && risk.impact ? risk.likelihood * risk.impact : null)
                const riskScoreDisplay = riskScore != null ? riskScore : 'N/A'
                // Convert effectiveness_rating (0-5) to percentage if available
                const effectivenessPercentage = risk.effectiveness_rating != null ? risk.effectiveness_rating * 20 : risk.effectiveness_percentage
                
                return (
                  <div
                    key={linkId || riskId || `risk-${index}`}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className={`h-4 w-4 ${riskLevel.textColor}`} />
                        <Link
                          href={`/${locale}/dashboard/risks/${riskId}`}
                          className="font-semibold hover:underline"
                        >
                          {riskTitle}
                        </Link>
                        {riskIdentifier && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {riskIdentifier}
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
                          {riskLevel.label} ({riskScoreDisplay})
                        </Badge>
                        {risk.category_name && (
                          <Badge variant="outline" className="capitalize">
                            {risk.category_name}
                          </Badge>
                        )}
                        {effectivenessPercentage !== undefined && effectivenessPercentage != null && (
                          <Badge variant="secondary">
                            {Math.round(effectivenessPercentage)}% effective
                          </Badge>
                        )}
                        {risk.control_type_for_risk && (
                          <Badge variant="outline" className="text-xs">
                            {risk.control_type_for_risk}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/${locale}/dashboard/risks/${riskId}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      {linkId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlink(linkId, riskTitle)}
                          disabled={unlinkMutation.isPending}
                          className="text-destructive hover:text-destructive"
                          title="Unlink risk"
                        >
                          {unlinkMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No risks linked to this control</p>
              <Button onClick={() => setIsRiskBrowserOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Link First Risk
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <RiskBrowserDialog
        open={isRiskBrowserOpen}
        onOpenChange={setIsRiskBrowserOpen}
        controlId={controlId}
        existingRiskIds={existingRiskIds}
      />
    </div>
  )
}

