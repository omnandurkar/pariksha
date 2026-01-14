"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateExam } from "./edit-actions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DateTimePicker } from "@/components/ui/date-time-picker"

export function EditExamDialog({ exam }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    // Date states
    const [startDate, setStartDate] = useState(exam.startDate ? new Date(exam.startDate) : null)
    const [endDate, setEndDate] = useState(exam.endDate ? new Date(exam.endDate) : null)
    const [resultDate, setResultDate] = useState(exam.resultDate ? new Date(exam.resultDate) : null)

    async function onSubmit(event) {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData(event.target);
        const result = await updateExam(exam.id, formData);
        setIsPending(false);

        if (result.error) {
            toast.error("Failed to update exam");
        } else {
            toast.success("Exam updated successfully");
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Exam Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Exam Title</Label>
                        <Input id="title" name="title" defaultValue={exam.title} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={exam.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (mins)</Label>
                            <Input id="duration" name="duration" type="number" defaultValue={exam.duration} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passingPercentage">Passing %</Label>
                            <Input id="passingPercentage" name="passingPercentage" type="number" min="0" max="100" defaultValue={exam.passingPercentage} required />
                        </div>
                    </div>

                    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                        <h4 className="font-medium text-sm text-foreground/80">Scheduler (Real World Timing)</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date (Gateway Opens)</Label>
                                <DateTimePicker
                                    id="startDate"
                                    name="startDate"
                                    date={startDate}
                                    setDate={setStartDate}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date (Strict Cut-off)</Label>
                                <DateTimePicker
                                    id="endDate"
                                    name="endDate"
                                    date={endDate}
                                    setDate={setEndDate}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resultDate">Result Date (Results are out 🎉)</Label>
                                <DateTimePicker
                                    id="resultDate"
                                    name="resultDate"
                                    date={resultDate}
                                    setDate={setResultDate}
                                />
                                <p className="text-xs text-muted-foreground">If set, results will be hidden from students until this date/time.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <Switch id="isActive" name="isActive" defaultChecked={exam.isActive} />
                        <Label htmlFor="isActive">Active (Visible to students)</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <Switch id="issueCertificate" name="issueCertificate" defaultChecked={exam.issueCertificate} />
                        <Label htmlFor="issueCertificate">Issue Certificate on Passing</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <Switch id="randomizeQuestions" name="randomizeQuestions" defaultChecked={exam.randomizeQuestions} />
                        <Label htmlFor="randomizeQuestions">Randomize Question Order</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <Switch id="allowCalculator" name="allowCalculator" defaultChecked={exam.allowCalculator} />
                        <Label htmlFor="allowCalculator">Allow Calculator</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <Switch id="showLeaderboard" name="showLeaderboard" defaultChecked={exam.showLeaderboard} />
                        <Label htmlFor="showLeaderboard">Show Leaderboard on Result Page</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50">
                        <Switch id="forceFullscreen" name="forceFullscreen" defaultChecked={exam.forceFullscreen} />
                        <Label htmlFor="forceFullscreen" className="text-red-900 dark:text-red-200 font-medium">Force Fullscreen Mode (Strict Security)</Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
