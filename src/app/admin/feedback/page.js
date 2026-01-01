import { Suspense } from "react";
import { getFeedbacks, updateFeedbackStatus } from "@/actions/feedback";
import { FeedbackClient } from "./feedback-client";
import { Loader2 } from "lucide-react";

export default async function FeedbackPage({ searchParams }) {
    const sp = await searchParams;
    const filters = {
        rating: sp.rating,
        category: sp.category,
        status: sp.status
    };

    const result = await getFeedbacks(filters);
    const feedbacks = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Feedback Inbox</h1>
                <p className="text-muted-foreground">
                    Manage and review feedback from students and staff.
                </p>
            </div>

            <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
                <FeedbackClient initialFeedbacks={feedbacks} />
            </Suspense>
        </div>
    );
}

export const dynamic = 'force-dynamic';
