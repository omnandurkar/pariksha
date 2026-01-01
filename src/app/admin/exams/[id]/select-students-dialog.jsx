"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Search } from "lucide-react"
import { bulkCreateAndAssign } from "./assign-actions"
import { toast } from "sonner"

export function SelectStudentsDialog({ examId, availableStudents }) {
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

    const handleAssign = async () => {
        if (selectedIds.size === 0) {
            toast.error("Please select at least one student")
            return
        }

        setIsPending(true)
        // Convert selected IDs back to emails for the existing action, 
        // OR the action could accept IDs. 
        // The existing bulkCreateAndAssign accepts strings (emails) or objects.
        // Let's pass emails.
        const emailsToAssign = availableStudents
            .filter(s => selectedIds.has(s.id))
            .map(s => s.email)

        const result = await bulkCreateAndAssign(examId, emailsToAssign)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.message)
            setOpen(false)
            setSelectedIds(new Set())
            setSearch("")
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredStudents.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredStudents.map(s => s.id)))
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                    <UserPlus className="mr-2 h-4 w-4" /> Select Existing Students
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle>Select Students</DialogTitle>
                    <DialogDescription>
                        Choose students to assign to this exam.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No matching students found.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer border-b mb-2" onClick={toggleSelectAll}>
                                <Checkbox
                                    checked={selectedIds.size > 0 && selectedIds.size === filteredStudents.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                                <div className="text-sm font-medium">Select All</div>
                            </div>
                            {filteredStudents.map(student => (
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
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-2">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-muted-foreground">
                            {selectedIds.size} selected
                        </div>
                        <Button onClick={handleAssign} disabled={isPending || selectedIds.size === 0}>
                            {isPending ? "Assigning..." : "Assign Selected"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
