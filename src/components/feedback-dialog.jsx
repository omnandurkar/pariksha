"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageSquare, Star, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { submitFeedback } from "@/actions/feedback";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    text: z.string().min(10, "Feedback must be at least 10 characters long."),
    category: z.string({
        required_error: "Please select a category.",
    }),
    rating: z.string().optional(),
    isAnonymous: z.boolean().default(false),
});

export function FeedbackDialog({ trigger, open, onOpenChange }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const finalOpen = isControlled ? open : internalOpen;
    const finalOnOpenChange = isControlled ? onOpenChange : setInternalOpen;

    const [hoverRating, setHoverRating] = useState(0);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            category: "",
            rating: "0",
            isAnonymous: false,
        },
    });

    const onSubmit = async (values) => {
        try {
            const result = await submitFeedback(values);
            if (result.success) {
                toast.success("Thank you for your feedback!", {
                    description: "It helps Pariksha improve.",
                    icon: "💌"
                });
                finalOnOpenChange(false);
                form.reset();
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to submit feedback.");
        }
    };

    return (
        <Dialog open={finalOpen} onOpenChange={finalOnOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Send Feedback
                    </DialogTitle>
                    <DialogDescription>
                        Share your thoughts, report bugs, or suggest improvements.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="EXPERIENCE">General Experience</SelectItem>
                                            <SelectItem value="SUGGESTION">Suggestion / Feature Request</SelectItem>
                                            <SelectItem value="BUG">Report a Bug</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating (Optional)</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={cn(
                                                        "p-1 rounded-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                                                        (hoverRating || parseInt(field.value)) >= star
                                                            ? "text-yellow-500"
                                                            : "text-muted-foreground/30"
                                                    )}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => field.onChange(star.toString())}
                                                >
                                                    <Star className={cn("h-6 w-6", (hoverRating || parseInt(field.value)) >= star && "fill-current")} />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Feedback</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us what you think..."
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isAnonymous"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
                                    <div className="space-y-0.5">
                                        <FormLabel>Submit Anonymously</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Feedback
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
