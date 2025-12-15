"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Table,
  BarChart3,
  Target,
  Activity,
  Loader2 
} from "lucide-react"
import {
  generateRiskRegisterPDF,
  generateRiskHeatmapPDF,
  generateTreatmentPlanPDF,
  generateKRIReportPDF,
  generateComprehensiveDashboardPDF,
  exportRiskRegisterExcel,
  Risk,
  Treatment,
  KRI,
  HeatmapCell,
  DashboardSummary,
} from "@/lib/utils/risk-export"
import { convertToCSV, downloadCSV, formatRiskForExport } from "@/lib/utils/export"
import { useToast } from "@/hooks/use-toast"

interface RiskExportButtonProps {
  risks?: Risk[]
  treatments?: Treatment[]
  kris?: KRI[]
  heatmapCells?: HeatmapCell[]
  dashboardSummary?: DashboardSummary
  disabled?: boolean
  className?: string
  variant?: 'default' | 'full'
}

export function RiskExportButton({
  risks = [],
  treatments = [],
  kris = [],
  heatmapCells = [],
  dashboardSummary,
  disabled = false,
  className,
  variant = 'default',
}: RiskExportButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExport = async (
    exportFn: () => Promise<void> | void,
    successMessage: string
  ) => {
    setIsExporting(true)
    try {
      await exportFn()
      toast({
        title: 'Export Successful',
        description: successMessage,
      })
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export data',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleCSVExport = () => {
    if (risks.length === 0) {
      toast({
        title: 'No Data',
        description: 'No risks to export',
        variant: 'destructive',
      })
      return
    }
    const formattedRisks = risks.map(formatRiskForExport)
    const csv = convertToCSV(formattedRisks)
    downloadCSV(csv, `risks-export-${new Date().toISOString().split('T')[0]}`)
    toast({
      title: 'Export Successful',
      description: 'Risk register exported to CSV',
    })
  }

  const handlePDFRiskRegister = () => {
    if (risks.length === 0) {
      toast({ title: 'No Data', description: 'No risks to export', variant: 'destructive' })
      return
    }
    handleExport(
      () => generateRiskRegisterPDF(risks),
      'Risk register exported to PDF'
    )
  }

  const handlePDFHeatmap = () => {
    handleExport(
      () => generateRiskHeatmapPDF(heatmapCells, risks),
      'Risk heatmap exported to PDF'
    )
  }

  const handlePDFTreatments = () => {
    if (treatments.length === 0) {
      toast({ title: 'No Data', description: 'No treatments to export', variant: 'destructive' })
      return
    }
    handleExport(
      () => generateTreatmentPlanPDF(treatments),
      'Treatment plan exported to PDF'
    )
  }

  const handlePDFKRIs = () => {
    if (kris.length === 0) {
      toast({ title: 'No Data', description: 'No KRIs to export', variant: 'destructive' })
      return
    }
    handleExport(
      () => generateKRIReportPDF(kris),
      'KRI report exported to PDF'
    )
  }

  const handleExcelExport = () => {
    if (risks.length === 0) {
      toast({ title: 'No Data', description: 'No risks to export', variant: 'destructive' })
      return
    }
    handleExport(
      () => exportRiskRegisterExcel(risks, treatments, kris),
      'Risk data exported to Excel'
    )
  }

  const handleComprehensiveDashboardPDF = () => {
    handleExport(
      () => generateComprehensiveDashboardPDF(risks, treatments, kris, heatmapCells, dashboardSummary),
      'Complete dashboard report exported to PDF'
    )
  }

  // Only render the dropdown menu on the client
  if (!mounted) {
    return (
      <Button variant="outline" disabled={disabled || isExporting} className={className}>
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Export
      </Button>
    )
  }

  if (variant === 'default') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={disabled || isExporting} className={className}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleCSVExport} disabled={risks.length === 0}>
            <Table className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExcelExport} disabled={risks.length === 0}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePDFRiskRegister} disabled={risks.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Risk Register PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Full variant with all export options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting} className={className}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Reports
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* Export All Dashboard - Primary Option */}
        <DropdownMenuItem onClick={handleComprehensiveDashboardPDF} className="font-medium">
          <FileText className="mr-2 h-4 w-4" />
          Export All Dashboard (PDF)
          <span className="ml-auto text-xs text-muted-foreground">Full Report</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* CSV Exports */}
        <DropdownMenuItem onClick={handleCSVExport} disabled={risks.length === 0}>
          <Table className="mr-2 h-4 w-4" />
          Risk Register (CSV)
        </DropdownMenuItem>

        {/* Excel Export */}
        <DropdownMenuItem onClick={handleExcelExport} disabled={risks.length === 0}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Complete Report (Excel)
          <span className="ml-auto text-xs text-muted-foreground">Multi-sheet</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* PDF Reports */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileText className="mr-2 h-4 w-4" />
            Individual PDF Reports
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuItem onClick={handlePDFRiskRegister} disabled={risks.length === 0}>
              <Table className="mr-2 h-4 w-4" />
              Risk Register
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePDFHeatmap}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Risk Heatmap
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePDFTreatments} disabled={treatments.length === 0}>
              <Target className="mr-2 h-4 w-4" />
              Treatment Plan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePDFKRIs} disabled={kris.length === 0}>
              <Activity className="mr-2 h-4 w-4" />
              KRI Report
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

