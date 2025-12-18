"use client"

import { useQuery } from "@tanstack/react-query"
import { riskLinksApi, RiskAssetType } from "@/lib/api/risks"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect } from "react"

interface AssetRiskBadgeProps {
  assetId: string
  assetType: RiskAssetType
  showZero?: boolean
  className?: string
  riskCount?: number // Optional: use provided count to avoid API call
}

export function AssetRiskBadge({ assetId, assetType, showZero = false, className, riskCount: providedRiskCount }: AssetRiskBadgeProps) {
  const params = useParams()
  const locale = params?.locale || 'en'


  // Only fetch risks if riskCount is not provided and we need detailed risk info
  const { data: risks, isLoading } = useQuery({
    queryKey: ['asset-risks', assetType, assetId],
    queryFn: () => riskLinksApi.getRisksByAsset(assetType, assetId),
    staleTime: 60000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: providedRiskCount === undefined, // Only fetch if count not provided
  })

  // Use provided count if available, otherwise use fetched risks length
  const riskCount = providedRiskCount !== undefined ? providedRiskCount : (risks?.length || 0)

  if (isLoading && providedRiskCount === undefined) {
    return (
      <Badge variant="outline" className={`text-xs ${className}`}>
        <ShieldAlert className="h-3 w-3 mr-1 animate-pulse" />
        ...
      </Badge>
    )
  }

  if (riskCount === 0 && !showZero) {
    return null
  }

  // Calculate risk level summary (only if we have detailed risk data)
  const criticalCount = risks?.filter((r: any) => r.risk?.current_risk_level === 'critical').length || 0
  const highCount = risks?.filter((r: any) => r.risk?.current_risk_level === 'high').length || 0

  const getBadgeVariant = () => {
    if (criticalCount > 0) return 'destructive'
    if (highCount > 0) return 'default'
    if (riskCount > 0) return 'secondary'
    return 'outline'
  }

  const getBadgeColor = () => {
    if (criticalCount > 0) return 'bg-red-500 hover:bg-red-600 text-white'
    if (highCount > 0) return 'bg-orange-500 hover:bg-orange-600 text-white'
    if (riskCount > 0) return 'bg-yellow-500 hover:bg-yellow-600 text-white'
    return ''
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={riskCount === 0 ? 'outline' : undefined}
            className={`text-xs cursor-pointer ${riskCount > 0 ? getBadgeColor() : ''} ${className}`}
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            {riskCount} Risk{riskCount !== 1 ? 's' : ''}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{riskCount} Linked Risk{riskCount !== 1 ? 's' : ''}</p>
            {riskCount > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {criticalCount > 0 && <span className="text-red-500">{criticalCount} Critical</span>}
                {criticalCount > 0 && highCount > 0 && ', '}
                {highCount > 0 && <span className="text-orange-500">{highCount} High</span>}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Compact version for use in tight spaces
export function AssetRiskBadgeCompact({ assetId, assetType, className }: AssetRiskBadgeProps) {
  const { data: risks, isLoading } = useQuery({
    queryKey: ['asset-risks', assetType, assetId],
    queryFn: () => riskLinksApi.getRisksByAsset(assetType, assetId),
    staleTime: 60000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const riskCount = risks?.length || 0

  if (isLoading || riskCount === 0) {
    return null
  }

  const criticalCount = risks?.filter((r: any) => r.risk?.current_risk_level === 'critical').length || 0
  const highCount = risks?.filter((r: any) => r.risk?.current_risk_level === 'high').length || 0

  const getColor = () => {
    if (criticalCount > 0) return 'text-red-500'
    if (highCount > 0) return 'text-orange-500'
    return 'text-yellow-500'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`flex items-center gap-1 text-xs ${getColor()} ${className}`}>
            <AlertTriangle className="h-3 w-3" />
            {riskCount}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {riskCount} linked risk{riskCount !== 1 ? 's' : ''}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}





