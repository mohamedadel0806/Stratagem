"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils/helpers"

interface SelectableCardProps {
  id: string
  selected: boolean
  onSelect: (id: string, selected: boolean) => void
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

export function SelectableCard({
  id,
  selected,
  onSelect,
  children,
  className,
  'data-testid': testId,
}: SelectableCardProps) {
  return (
    <Card
      className={cn(
        "relative transition-all",
        selected && "ring-2 ring-primary",
        className
      )}
      data-testid={testId}
    >
      <div className="absolute top-4 left-4 z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(id, checked === true)}
          onClick={(e) => e.stopPropagation()}
          className="bg-background border-2"
        />
      </div>
      {children}
    </Card>
  )
}

