"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/helpers"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  // Ensure all values are valid numbers to prevent NaN
  const safeCurrentPage = Number(currentPage) || 1
  const safeItemsPerPage = Number(itemsPerPage) || 20
  const safeTotalItems = Number(totalItems) || 0
  
  const startItem = safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safeItemsPerPage + 1
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems)

  const safeTotalPages = Number(totalPages) || 1
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (safeTotalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (safeCurrentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(safeTotalPages)
      } else if (safeCurrentPage >= safeTotalPages - 2) {
        // Near the end
        pages.push("ellipsis")
        for (let i = safeTotalPages - 3; i <= safeTotalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push("ellipsis")
        for (let i = safeCurrentPage - 1; i <= safeCurrentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(safeTotalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {safeTotalItems} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <Button
                  key={`ellipsis-${index}`}
                  variant="ghost"
                  size="sm"
                  className="w-10 px-0"
                  disabled
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )
            }

            const pageNum = page as number
            return (
              <Button
                key={pageNum}
                variant={safeCurrentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-10"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

