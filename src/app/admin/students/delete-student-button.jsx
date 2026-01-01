"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteStudent } from "./actions"
import { toast } from "sonner"
import { useState } from "react"

export function DeleteStudentButton({ id }) {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure? This will delete the student and their exam history.")) return;
        setIsPending(true);
        const result = await deleteStudent(id);
        setIsPending(false);
        if (result.error) toast.error(result.error);
        else toast.success("Student deleted");
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending}>
            <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
    )
}
