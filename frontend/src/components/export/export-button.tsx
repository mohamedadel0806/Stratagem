"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet } from "lucide-react"

interface ExportButtonProps {
  onExportCSV: () => void
  onExportPDF?: () => void
  disabled?: boolean
  className?: string
}

export function ExportButton({
  onExportCSV,
  onExportPDF,
  disabled = false,
  className,
}: ExportButtonProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render the dropdown menu on the client to avoid hydration mismatch
  // Radix UI generates dynamic IDs that differ between server and client
  if (!mounted) {
    return (
      <Button variant="outline" disabled={disabled} className={className}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} className={className}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        {onExportPDF && (
          <DropdownMenuItem onClick={onExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

