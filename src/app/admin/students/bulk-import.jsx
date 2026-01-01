"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addStudent } from "./actions"
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
import { Upload } from "lucide-react"

export function BulkStudentImport() {
    const [jsonInput, setJsonInput] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [open, setOpen] = useState(false)

    const handleImport = async () => {
        try {
            const students = JSON.parse(jsonInput)
            if (!Array.isArray(students)) throw new Error("Root must be an array")

            setIsPending(true)
            let count = 0
            let errors = 0

            for (const s of students) {
                const payload = {
                    name: s.name,
                    email: s.email,
                    password: s.password || "password123" // Default password if missing, or require it
                }

                const result = await addStudent(payload)
                if (result.error) {
                    console.error("Failed to import", s.email, result.error)
                    errors++
                } else {
                    count++
                }
            }

            setIsPending(false)
            toast.success(`Imported ${count} students. ${errors} failed.`)
            setOpen(false)
            setJsonInput("")
        } catch (e) {
            toast.error("Invalid JSON format")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Bulk Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Students</DialogTitle>
                    <DialogDescription>
                        Paste a JSON array of students.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">JSON Data</Label>
                        <Textarea
                            placeholder={`[
  {
    "name": "Student Name",
    "email": "student@example.com",
    "password": "securepassword"
  }
]`}
                            className="h-[300px] font-mono text-xs"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleImport} disabled={isPending}>
                        {isPending ? "Importing..." : "Import"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
