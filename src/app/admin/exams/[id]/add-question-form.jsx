"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { addQuestion } from "./actions"
import { toast } from "sonner"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

const formSchema = z.object({
    text: z.string().min(1, "Question text is required"),
    marks: z.coerce.number().min(1),
    options: z.array(z.object({
        text: z.string().min(1, "Option text is required"),
        isCorrect: z.boolean().default(false),
    })).min(2, "At least 2 options"),
})

export function AddQuestionForm({ examId }) {
    const [isPending, setIsPending] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            marks: 1,
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false }
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    async function onSubmit(values) {
        setIsPending(true)
        const payload = { ...values, examId }

        // Validate at least one correct answer manually if Zod refinement fails on client appropriately
        if (!values.options.some(opt => opt.isCorrect)) {
            toast.error("Please mark at least one option as correct.");
            setIsPending(false);
            return;
        }

        const result = await addQuestion(payload)
        setIsPending(false)

        if (result.error) {
            toast.error("Failed to add question");
        } else {
            toast.success("Question added successfully");
            form.reset({
                text: "",
                marks: 1,
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false }
                ]
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-4 rounded-lg bg-card">
                <h3 className="font-semibold text-lg">Add New Question</h3>

                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Text</FormLabel>
                            <FormControl>
                                <Input placeholder="What is the capital of India?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="marks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Marks</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel>Options</FormLabel>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`options.${index}.isCorrect`}
                                render={({ field }) => (
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`options.${index}.text`}
                                render={({ field }) => (
                                    <FormControl>
                                        <Input placeholder={`Option ${index + 1}`} {...field} />
                                    </FormControl>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 2}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "", isCorrect: false })}>
                        <Plus className="h-4 w-4 mr-2" /> Add Option
                    </Button>
                </div>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Question"}
                </Button>
            </form>
        </Form>
    )
}
