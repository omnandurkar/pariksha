"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { togglePublishResults } from "./result-actions"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export function PublishResultsToggle({ examId, initialStatus, resultDate }) {
    const [published, setPublished] = useState(initialStatus);
    const [isPending, setIsPending] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = async (checked) => {
        setPublished(checked);
        setIsPending(true);
        const result = await togglePublishResults(examId, checked);
        setIsPending(false);

        if (result.error) {
            setPublished(!checked); // Revert
            toast.error(result.error);
        } else {
            toast.success(checked ? "Results Published" : "Results Hidden");
        }
    }

    return (
        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-card shadow-sm">
            <Switch id="publish-mode" checked={published} onCheckedChange={handleToggle} disabled={isPending} />
            <div className="grid gap-0.5">
                <div className="flex items-center gap-1.5">
                    <Label htmlFor="publish-mode" className="font-medium cursor-pointer">
                        {published ? "Results Declared (Visible)" : "Declare Results"}
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                                <p>If a Result Date is scheduled, results will be published automatically when the time comes. No need to toggle this manually.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {mounted && resultDate && (
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(resultDate) <= new Date() ? "(Schedule has passed - Results are visible)" : `(Scheduled for ${new Date(resultDate).toLocaleDateString()})`}
                    </span>
                )}
            </div>
        </div>
    )
}
