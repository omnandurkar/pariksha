"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { requestRetest } from "./retest-action"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

export function RequestRetestDialog({ attempt }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    if (attempt.isRetestRequested) {
        return (
            <Button variant="secondary" disabled className="w-full mt-4">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Retest Requested
            </Button>
        )
    }

    async function onSubmit(event) {
        event.preventDefault()
        setIsPending(true)
        const formData = new FormData(event.target)
        const result = await requestRetest(attempt.id, formData)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Retest request sent")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" /> Request Retest
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Retest</DialogTitle>
                    <DialogDescription>
                        Explain why you need to take this exam again. The admin will review your request.
                        If approved, your current attempt will be deleted.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea
                        name="reason"
                        placeholder="e.g., Internet connection failed during submission..."
                        required
                    />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Sending..." : "Submit Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
