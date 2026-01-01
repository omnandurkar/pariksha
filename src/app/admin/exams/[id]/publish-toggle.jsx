"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { togglePublishResults } from "./result-actions"
import { toast } from "sonner"
import { useState } from "react"

export function PublishResultsToggle({ examId, initialStatus }) {
    const [published, setPublished] = useState(initialStatus);
    const [isPending, setIsPending] = useState(false);

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
        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-card">
            <Switch id="publish-mode" checked={published} onCheckedChange={handleToggle} disabled={isPending} />
            <Label htmlFor="publish-mode" className="font-medium cursor-pointer">
                {published ? "Results Declared (Visible to Students)" : "Declare Results"}
            </Label>
        </div>
    )
}
