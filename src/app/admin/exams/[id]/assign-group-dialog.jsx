"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { assignGroupToExam } from "./assign-group-action"
import { toast } from "sonner"
import { Users } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function AssignGroupDialog({ examId, groups }) {
    const [open, setOpen] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const [isPending, setIsPending] = useState(false)

    async function handleAssign() {
        if (!selectedGroupId) return

        setIsPending(true)
        const result = await assignGroupToExam(examId, selectedGroupId)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`Assigned members from group successfully`)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                    <Users className="mr-2 h-4 w-4" /> Assign Student Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Group to Exam</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Group</label>
                        <Select onValueChange={setSelectedGroupId} value={selectedGroupId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a group..." />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map(group => (
                                    <SelectItem key={group.id} value={group.id}>
                                        {group.name} ({group._count?.members || 0} members)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleAssign} disabled={isPending || !selectedGroupId} className="w-full">
                        {isPending ? "Assigning..." : "Assign Group"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
