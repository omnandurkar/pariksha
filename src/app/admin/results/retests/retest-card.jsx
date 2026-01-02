"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { approveRetest, denyRetest } from "./actions"
import { toast } from "sonner"
import { useState } from "react"
import { Check, X } from "lucide-react"
import { format } from "date-fns"

export function RetestRequestCard({ attempt }) {
    const [isPending, setIsPending] = useState(false)

    async function handleApprove() {
        if (!confirm("Warning: This will DELETE the student's current attempt and allow them to start over. Proceed?")) return;
        setIsPending(true)
        const result = await approveRetest(attempt.id)
        setIsPending(false)
        if (result.error) toast.error(result.error)
        else toast.success("Retest approved (Attempt reset)")
    }

    async function handleDeny() {
        setIsPending(true)
        const result = await denyRetest(attempt.id)
        setIsPending(false)
        if (result.error) toast.error(result.error)
        else toast.success("Retest denied")
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between">
                    <span>{attempt.user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{attempt.exam.title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <div className="bg-muted p-2 rounded mb-2 italic">
                    &quot;{attempt.retestReason}&quot;
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Score: {attempt.score}</span>
                    <span>Date: {format(new Date(attempt.submitTime), "dd/MM/yyyy")}</span>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={handleDeny} disabled={isPending} className="text-red-500 hover:text-red-600">
                    <X className="h-4 w-4 mr-1" /> Deny
                </Button>
                <Button size="sm" onClick={handleApprove} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
            </CardFooter>
        </Card>
    )
}
