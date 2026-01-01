"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createGroup } from "./actions"
import { toast } from "sonner"
import { Users, Plus } from "lucide-react"

export function CreateGroupDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    async function onSubmit(event) {
        event.preventDefault()
        setIsPending(true)
        const formData = new FormData(event.target)
        const result = await createGroup(formData)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Group created")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Group
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input id="name" name="name" placeholder="Batch 2025" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Optional details..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Group"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
