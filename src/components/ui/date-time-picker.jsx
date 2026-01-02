"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export function DateTimePicker({ date, setDate, name, id }) {
    const [selectedDateTime, setSelectedDateTime] = React.useState(date)

    // Sync internal state if prop changes
    React.useEffect(() => {
        if (date) setSelectedDateTime(date)
    }, [date])

    function handleDateSelect(selectedDate) {
        if (!selectedDate) return
        const newDate = new Date(selectedDateTime || new Date())
        newDate.setFullYear(selectedDate.getFullYear())
        newDate.setMonth(selectedDate.getMonth())
        newDate.setDate(selectedDate.getDate())
        setSelectedDateTime(newDate)
        setDate(newDate)
    }

    function handleTimeChange(e) {
        const timeStr = e.target.value
        if (!timeStr) return
        const [hours, minutes] = timeStr.split(':').map(Number)
        const newDate = new Date(selectedDateTime || new Date())
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        setSelectedDateTime(newDate)
        setDate(newDate)
    }

    // Handle case where user clears or initial state is null
    const handleTimeBlur = (e) => {
        if (!selectedDateTime && e.target.value) {
            // If no date was selected but time is entered, assume today
            const [hours, minutes] = e.target.value.split(':').map(Number);
            const newDate = new Date();
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            setSelectedDateTime(newDate);
            setDate(newDate);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDateTime && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateTime ? format(selectedDateTime, "dd/MM/yyyy hh:mm a") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDateTime}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="p-3 border-t bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                            type="time"
                            value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
                            onChange={handleTimeChange}
                            onBlur={handleTimeBlur}
                            className="flex-1"
                        />
                    </div>
                </div>
            </PopoverContent>
            {/* Hidden input for form submission - ensuring ISO string for server compat */}
            <input type="hidden" name={name} value={selectedDateTime ? selectedDateTime.toISOString() : ""} />
        </Popover>
    )
}
