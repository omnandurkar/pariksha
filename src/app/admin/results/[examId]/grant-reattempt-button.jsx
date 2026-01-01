"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { grantReattempt } from "./reattempt-action"
import { toast } from "sonner"

export function GrantReattemptButton({ userId, examId }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleGrant = async () => {
        if (!confirm("Allow this student to take the exam again? This will increase their allowed attempts by 1.")) return

        setIsLoading(true)
        const result = await grantReattempt(userId, examId)
        setIsLoading(false)

        if (result.success) {
            toast.success("Re-attempt granted successfully")
        } else {
            toast.error(result.error)
        }
    }

    return (
        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={handleGrant} disabled={isLoading} title="Grant Re-attempt">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
    )
}
