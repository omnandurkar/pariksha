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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { addMembers } from "./member-actions"
import { toast } from "sonner"
import { UserPlus, Search } from "lucide-react"

export function AddMemberDialog({ groupId, availableStudents }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [isPending, setIsPending] = useState(false)

    // Filter students
    const filteredStudents = availableStudents.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (studentId) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId)
        } else {
            newSelected.add(studentId)
        }
        setSelectedIds(newSelected)
    }

    const handleAdd = async () => {
        if (selectedIds.size === 0) return

        setIsPending(true)
        const result = await addMembers(groupId, Array.from(selectedIds))
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Members added")
            setOpen(false)
            setSelectedIds(new Set())
            setSearch("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Members
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle>Add Students to Group</DialogTitle>
                </DialogHeader>

                <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No students found.
                        </div>
                    ) : (
                        filteredStudents.map(student => (
                            <div
                                key={student.id}
                                className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                                onClick={() => handleSelect(student.id)}
                            >
                                <Checkbox
                                    checked={selectedIds.has(student.id)}
                                    onCheckedChange={() => handleSelect(student.id)}
                                />
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium truncate">{student.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Button onClick={handleAdd} disabled={isPending || selectedIds.size === 0} className="mt-2">
                    {isPending ? "Adding..." : `Add ${selectedIds.size} Selected`}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
