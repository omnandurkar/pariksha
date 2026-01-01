"use client"

import { Button } from "@/components/ui/button"
import { unassignStudentFromExam } from "./assign-actions"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function AssignedStudentsList({ assignments, examId }) {
    const handleUnassign = async (userId) => {
        if (!confirm("Unassign this student?")) return;
        const result = await unassignStudentFromExam(examId, userId);
        if (result.error) toast.error(result.error);
        else toast.success("Unassigned");
    }

    if (assignments.length === 0) {
        return <div className="text-sm text-muted-foreground py-4">No students assigned.</div>
    }

    return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {assignments.map(a => (
                <div key={a.user.id} className="flex items-center justify-between p-2 border rounded bg-card">
                    <div>
                        <div className="font-medium text-sm">{a.user.name}</div>
                        <div className="text-xs text-muted-foreground">{a.user.email}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUnassign(a.user.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
