"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addQuestion } from "./actions"
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

export function BulkImport({ examId }) {
    const [jsonInput, setJsonInput] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [open, setOpen] = useState(false)

    const handleImport = async () => {
        try {
            const questions = JSON.parse(jsonInput)
            if (!Array.isArray(questions)) throw new Error("Root must be an array")

            setIsPending(true)
            let count = 0
            let errors = 0

            for (const q of questions) {
                const payload = {
                    examId,
                    text: q.text,
                    marks: q.marks || 1,
                    options: q.options
                }
                // We reuse addQuestion action which validates each
                const result = await addQuestion(payload)
                if (result.error) {
                    console.error("Failed to import", q, result.error)
                    errors++
                } else {
                    count++
                }
            }

            setIsPending(false)
            toast.success(`Imported ${count} questions. ${errors} failed.`)
            setOpen(false)
            setJsonInput("")
        } catch (e) {
            toast.error("Invalid JSON format")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Bulk Import JSON
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Questions</DialogTitle>
                    <DialogDescription>
                        Paste a JSON array of questions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">JSON Data</Label>
                        <Textarea
                            placeholder={`[
  {
    "text": "Question?",
    "marks": 1,
    "options": [
      { "text": "A", "isCorrect": true },
      { "text": "B", "isCorrect": false }
    ]
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
