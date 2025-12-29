"use client"

import * as React from "react"
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { AuditLogAction } from "@/lib/api/audit-logs"

export interface AuditLogFiltersProps {
    onSearchChange: (value: string) => void
    onActionChange: (value: string) => void
    onDateRangeChange: (range: DateRange | undefined) => void
    onReset: () => void
}

export function AuditLogFilters({
    onSearchChange,
    onActionChange,
    onDateRangeChange,
    onReset,
}: AuditLogFiltersProps) {
    const [date, setDate] = React.useState<DateRange | undefined>()
    const [searchValue, setSearchValue] = React.useState("")
    const [actionValue, setActionValue] = React.useState("all")

    const handleReset = () => {
        setDate(undefined)
        setSearchValue("")
        setActionValue("all")
        onReset()
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by description or user..."
                    className="pl-8"
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                        onSearchChange(e.target.value)
                    }}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <Select
                    value={actionValue}
                    onValueChange={(value) => {
                        setActionValue(value)
                        onActionChange(value === "all" ? "" : value)
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="updated">Updated</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                        <SelectItem value="status_changed">Status Changed</SelectItem>
                        <SelectItem value="subscription_changed">Subscription Changed</SelectItem>
                        <SelectItem value="user_added">User Added</SelectItem>
                        <SelectItem value="user_removed">User Removed</SelectItem>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[260px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(range) => {
                                setDate(range)
                                onDateRangeChange(range)
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Button variant="ghost" onClick={handleReset} className="h-10 px-2 lg:px-3">
                    Reset
                    <X className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
