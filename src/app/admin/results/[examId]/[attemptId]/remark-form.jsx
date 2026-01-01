"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateRemark } from "./remark-action"
import { toast } from "sonner"

export function AdminRemarkForm({ attemptId, initialRemark }) {
    const [isPending, setIsPending] = useState(false)

    async function onSubmit(event) {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData(event.target);

        const result = await updateRemark(attemptId, formData);
        setIsPending(false);

        if (result.error) toast.error(result.error);
        else toast.success("Remark saved");
    }

    return (
        <form onSubmit={onSubmit} className="space-y-2 border p-4 rounded-lg bg-card">
            <Label htmlFor="remark">Admin Remarks (Visible to Student)</Label>
            <Textarea
                id="remark"
                name="remark"
                placeholder="Good job! Focus on..."
                defaultValue={initialRemark || ""}
            />
            <div className="flex justify-end">
                <Button size="sm" type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Remark"}
                </Button>
            </div>
        </form>
    )
}
