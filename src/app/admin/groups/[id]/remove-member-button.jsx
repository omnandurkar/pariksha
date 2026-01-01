"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { removeMember } from "./member-actions"
import { toast } from "sonner"
import { useState } from "react"

export function RemoveMemberButton({ memberId }) {
    const [isPending, setIsPending] = useState(false)

    async function handleRemove() {
        if (!confirm("Remove this student from the group?")) return

        setIsPending(true)
        const result = await removeMember(memberId)
        setIsPending(false)

        if (result.error) toast.error(result.error)
        else toast.success("Member removed")
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isPending}>
            <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
    )
}
