"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { bulkCreateAndAssign } from "./assign-actions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"

export function BulkAssignStudents({ examId }) {
    const [jsonInput, setJsonInput] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [open, setOpen] = useState(false)

    const handleImport = async () => {
        try {
            const parsed = JSON.parse(jsonInput)
            if (!Array.isArray(parsed)) throw new Error("Input must be an array");

            setIsPending(true)
            const result = await bulkCreateAndAssign(examId, parsed);
            setIsPending(false)

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message);
                setOpen(false);
                setJsonInput("");
            }

        } catch (e) {
            toast.error("Invalid JSON format");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Bulk Assign / Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Students</DialogTitle>
                    <DialogDescription>
                        Paste array of emails OR student objects to create & assign.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">JSON Input</Label>
                        <Textarea
                            placeholder={`[
  "existing@example.com",
  {
    "name": "New Student",
    "email": "new@example.com",
    "password": "pass"
  }
]`}
                            className="h-[250px] font-mono text-xs"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleImport} disabled={isPending}>
                        {isPending ? "Processing..." : "Process"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
