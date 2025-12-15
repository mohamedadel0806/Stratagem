"use client"

import * as React from "react"

import { cn } from "@/lib/utils/helpers"

// Simple progress bar component (no external dependency needed)
const ProgressPrimitive = {
  Root: React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: number }
  >(({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  )),
};

const Progress = ProgressPrimitive.Root;
Progress.displayName = "Progress"

export { Progress }

