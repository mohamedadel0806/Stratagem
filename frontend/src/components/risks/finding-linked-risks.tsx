"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { riskLinksApi, RiskFindingLink } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, ExternalLink, ShieldAlert, Search, Loader2, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { risksApi, Risk } from "@/lib/api/risks"

interface FindingLinkedRisksProps {
  findingId: string
}

const relationshipTypeLabels: Record<string, string> = {
  identified: "Identified",
  contributes_to: "Contributes To",
  mitigates: "Mitigates",
  exacerbates: "Exacerbates",
  related: "Related",
}

export function FindingLinkedRisks({ findingId }: FindingLinkedRisksProps) {
  const params = useParams()
  const locale = params?.locale || "en"
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [selectedRiskId, setSelectedRiskId] = useState<string>("")
  const [relationshipType, setRelationshipType] = useState<string>("related")
  const [description, setDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [unlinkingLinkId, setUnlinkingLinkId] = useState<string | null>(null)

  const { data: risks, isLoading } = useQuery({
    queryKey: ["finding-risks", findingId],
    queryFn: () => riskLinksApi.getRisksByFinding(findingId),
    enabled: !!findingId,
  })

  // Fetch available risks for linking
  const { data: availableRisks, isLoading: isLoadingRisks } = useQuery({
    queryKey: ["available-risks", searchQuery],
    queryFn: () => risksApi.getAll({ search: searchQuery, limit: 50 }),
    enabled: isLinkDialogOpen,
  })

  // Get already linked risk IDs
  const linkedRiskIds = new Set(risks?.map((r: any) => r.risk_id || r.id) || [])

  // Filter out already linked risks
  const filteredRisks = availableRisks?.data?.filter((risk: Risk) => !linkedRiskIds.has(risk.id)) || []

  const linkMutation = useMutation({
    mutationFn: (data: { risk_id: string; finding_id: string; relationship_type?: string; description?: string }) =>
      riskLinksApi.linkFinding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finding-risks", findingId] })
      toast({
        title: "Success",
        description: "Risk linked to finding successfully",
      })
      setIsLinkDialogOpen(false)
      setSelectedRiskId("")
      setRelationshipType("related")
      setDescription("")
      setSearchQuery("")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to link risk",
        variant: "destructive",
      })
    },
  })

  const handleLinkRisk = () => {
    if (!selectedRiskId) {
      toast({
        title: "Error",
        description: "Please select a risk to link",
        variant: "destructive",
      })
      return
    }

    linkMutation.mutate({
      risk_id: selectedRiskId,
      finding_id: findingId,
      relationship_type: relationshipType as any,
      description: description || undefined,
    })
  }

  const unlinkMutation = useMutation({
    mutationFn: (linkId: string) => riskLinksApi.unlinkFinding(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finding-risks", findingId] })
      toast({
        title: "Success",
        description: "Risk unlinked from finding successfully",
      })
      setUnlinkingLinkId(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to unlink risk",
        variant: "destructive",
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
        case "critical":
          return { label: "Critical", color: "bg-red-500 text-white", bgColor: "bg-red-50", textColor: "text-red-600" }
        case "high":
          return { label: "High", color: "bg-orange-500 text-white", bgColor: "bg-orange-50", textColor: "text-orange-600" }
        case "medium":
          return { label: "Medium", color: "bg-yellow-500 text-white", bgColor: "bg-yellow-50", textColor: "text-yellow-600" }
        case "low":
          return { label: "Low", color: "bg-green-500 text-white", bgColor: "bg-green-50", textColor: "text-green-600" }
      }
    }
    if (score) {
      if (score >= 20)
        return { label: "Critical", color: "bg-red-500 text-white", bgColor: "bg-red-50", textColor: "text-red-600" }
      if (score >= 12) return { label: "High", color: "bg-orange-500 text-white", bgColor: "bg-orange-50", textColor: "text-orange-600" }
      if (score >= 6) return { label: "Medium", color: "bg-yellow-500 text-white", bgColor: "bg-yellow-50", textColor: "text-yellow-600" }
      return { label: "Low", color: "bg-green-500 text-white", bgColor: "bg-green-50", textColor: "text-green-600" }
    }
    return { label: "Unknown", color: "bg-gray-500 text-white", bgColor: "bg-gray-50", textColor: "text-gray-600" }
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
      {/* Linked Risks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Related Risks</CardTitle>
              <CardDescription>Risks associated with this finding</CardDescription>
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
              {risks.map((link: any) => {
                const riskId = link.risk_id || link.id
                const riskTitle = link.risk_title || link.title
                const riskLevel = getRiskLevel(
                  link.risk_level || link.current_risk_level,
                  link.risk_score || link.current_risk_score
                )
                const linkId = link.link_id || link.id

                return (
                  <div
                    key={linkId || `risk-${riskId}`}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className={`h-4 w-4 ${riskLevel.textColor || "text-muted-foreground"}`} />
                        <Link href={`/${locale}/dashboard/risks/${riskId}`} className="font-semibold hover:underline">
                          {riskTitle}
                        </Link>
                        {(link.risk_identifier || link.risk_id) && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {link.risk_identifier || link.risk_id}
                          </Badge>
                        )}
                      </div>
                      {link.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{link.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={riskLevel.color}>
                          {riskLevel.label} ({link.risk_score || link.current_risk_score || "N/A"})
                        </Badge>
                        {link.relationship_type && (
                          <Badge variant="secondary" className="capitalize">
                            {relationshipTypeLabels[link.relationship_type] || link.relationship_type}
                          </Badge>
                        )}
                        {(link.category_name || link.category) && (
                          <Badge variant="outline" className="capitalize">
                            {link.category_name || link.category?.replace("_", " ")}
                          </Badge>
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
              <p className="text-muted-foreground mb-4">No risks linked to this finding</p>
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
            <DialogTitle>Link Risk to Finding</DialogTitle>
            <DialogDescription>
              Search and select a risk to link to this finding. Specify how the finding relates to the risk.
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
                    {searchQuery ? "No risks found matching your search" : "No available risks to link"}
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
                          isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <ShieldAlert className={`h-4 w-4 ${riskLevel.textColor || "text-muted-foreground"}`} />
                              <span className="font-semibold">{risk.title}</span>
                              {risk.risk_id && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {risk.risk_id}
                                </Badge>
                              )}
                              <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
                            </div>
                            {risk.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{risk.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="capitalize text-xs">
                                {risk.category_name || risk.category?.replace("_", " ")}
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
                <div>
                  <Label htmlFor="relationship">Relationship Type</Label>
                  <Select value={relationshipType} onValueChange={setRelationshipType}>
                    <SelectTrigger id="relationship">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(relationshipTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe how this finding relates to the risk..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkRisk} disabled={!selectedRiskId || linkMutation.isPending}>
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
              Are you sure you want to unlink this risk from the finding? This action cannot be undone.
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
                "Unlink Risk"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

