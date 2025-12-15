"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BulkActionsToolbarProps {
  selectedCount: number
  onDelete?: () => void
  onStatusUpdate?: (status: string) => void
  statusOptions?: Array<{ value: string; label: string }>
  className?: string
}

export function BulkActionsToolbar({
  selectedCount,
  onDelete,
  onStatusUpdate,
  statusOptions = [],
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className={`flex items-center justify-between p-4 bg-muted rounded-lg border ${className}`}>
      <div className="text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </div>
      <div className="flex gap-2">
        {statusOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onStatusUpdate?.(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  )
}

