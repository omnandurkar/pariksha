"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createExam } from "@/app/admin/exams/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, { message: "Duration must be at least 1 minute." }),
    isActive: z.boolean().default(false),
    startDate: z.string().optional(), // Input returns string
    endDate: z.string().optional(),
    resultDate: z.string().optional(),
})

export function CreateExamForm() {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: 60,
            isActive: false,
            startDate: "",
            endDate: "",
            resultDate: "",
        },
    })

    async function onSubmit(values) {
        setIsPending(true)
        try {
            // Action expects coerced Dates, but if empty string, zod coerce might fail or make it Invalid Date?
            // "z.coerce.date()" on "" throws "Invalid Date" usually. 
            // We should strip empty strings.
            const payload = { ...values };
            if (!payload.startDate) delete payload.startDate;
            if (!payload.endDate) delete payload.endDate;
            if (!payload.resultDate) delete payload.resultDate;

            const result = await createExam(payload)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Exam created successfully. You're in control.")
            }
        } catch (e) {
            // Redirect throws error
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Midterm Exam" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (minutes)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 h-full">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                    <h4 className="font-medium text-sm text-foreground/80">Scheduler (Real World Timing)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date (Gateway Opens)</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date (Strict Cut-off)</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="resultDate"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Result Date (Results are out 🎉)</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormDescription>If set, results will be hidden from students until this date.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Exam description..." className="h-24" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Creating..." : "Create Exam"}
                </Button>
            </form>
        </Form>
    )
}
