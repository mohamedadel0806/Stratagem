"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { SavedFilters } from "./saved-filters"

interface FilterOption {
  value: string
  label: string
}

export interface DataTableFiltersProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: Array<{
    key: string
    label: string
    options: FilterOption[]
    value?: string
    onChange?: (value: string) => void
  }> | Record<string, any> // Support both array and object patterns
  filterConfig?: Array<{
    key: string
    label: string
    type: 'text' | 'select' | 'date' | 'number'
    placeholder?: string
    options?: FilterOption[]
  }>
  onFiltersChange?: (filters: Record<string, any>) => void
  onClear?: () => void
  // For saved filters
  storageKey?: string
  onLoadPreset?: (filters: Record<string, string>, searchValue?: string) => void
}

export function DataTableFilters({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  filterConfig,
  onFiltersChange,
  onClear,
  storageKey,
  onLoadPreset,
}: DataTableFiltersProps) {
  // Support both array and object patterns
  const isArrayPattern = Array.isArray(filters)
  const filterArray = isArrayPattern ? (filters as Array<any>) : []
  const filterValues = !isArrayPattern ? (filters as Record<string, any>) : {}
  
  // Use filterConfig if provided, otherwise use filters array
  const activeFilterConfig = filterConfig || filterArray
  
  const hasActiveFilters = searchValue || (isArrayPattern 
    ? filterArray.some(f => f.value) 
    : Object.values(filterValues).some(v => v !== undefined && v !== null && v !== ''))

  // Build current filters object for saving
  const currentFilters = React.useMemo(() => {
    const result: Record<string, string> = {}
    if (isArrayPattern) {
      filterArray.forEach((f) => {
        if (f.value) {
          result[f.key] = f.value
        }
      })
    } else {
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          result[key] = String(value)
        }
      })
    }
    return result
  }, [filters, isArrayPattern, filterArray, filterValues])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => {
              const value = e.target.value
              onSearchChange?.(value)
              // Also update filters if using object pattern
              if (!isArrayPattern && onFiltersChange) {
                onFiltersChange({
                  ...filterValues,
                  search: value,
                })
              }
            }}
            className="pl-8"
          />
        </div>
        {activeFilterConfig
          .filter((filter) => {
            // Show select filters: either has type='select' (from filterConfig) or has options (from array pattern)
            return filter.type === 'select' || (filter as any).options
          })
          .map((filter, index) => {
            const filterKey = filter.key
            const currentValue = isArrayPattern 
              ? (filter as any).value || "all"
              : (filterValues[filterKey] || "all")
            
            const handleChange = (value: string) => {
              const newValue = value === "all" ? "" : value
              if (isArrayPattern) {
                // Array pattern: call onChange on the filter object
                const filterObj = filterArray[index]
                filterObj?.onChange?.(newValue)
              } else {
                // Object pattern: update the filters object
                onFiltersChange?.({
                  ...filterValues,
                  [filterKey]: newValue,
                })
              }
            }

            return (
              <Select
                key={filterKey || `filter-${index}`}
                value={String(currentValue)}
                onValueChange={handleChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={`${filterKey}-all`} value="all">All {filter.label}</SelectItem>
                  {(filter.options || [])
                    .filter((option) => option.value !== '' && option.value !== null && option.value !== undefined)
                    .map((option) => (
                      <SelectItem key={`${filterKey}-${option.value}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )
          })}
        {hasActiveFilters && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-9 px-2 lg:px-3"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
      {/* Saved Filters - only show if storageKey is provided */}
      {storageKey && onLoadPreset && (
        <SavedFilters
          storageKey={storageKey}
          currentFilters={currentFilters}
          currentSearchValue={searchValue}
          onLoadPreset={onLoadPreset}
        />
      )}
    </div>
  )
}

