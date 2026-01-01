"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback-dialog";

export function DashboardFooter() {
    return (
        <footer className="border-t py-6 bg-muted/20 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                    <span>&copy; {new Date().getFullYear()} Pariksha</span>
                    <Link href="/about" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                        Behind Pariksha
                    </Link>
                </div>

                <FeedbackDialog
                    trigger={
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            Send Feedback
                        </Button>
                    }
                />
            </div>
        </footer>
    );
}
