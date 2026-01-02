"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { History } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"

function formatLogDetails(action, detailsString) {
    if (!detailsString) return null;
    let details;
    try {
        details = JSON.parse(detailsString);
    } catch (e) {
        return detailsString; // Fallback to raw string if not JSON
    }

    switch (action) {
        case 'CREATE_EXAM':
            return `Created exam "${details.title}" (${details.duration} mins)`;
        case 'UPDATE_EXAM':
            const changes = Object.keys(details.updates || {}).join(", ");
            return `Updated exam properties: ${changes}`;
        case 'TOGGLE_RESULTS':
            return `Results ${details.publish ? 'published' : 'hidden'}`;

        case 'CREATE_STUDENT':
            return `Added student: ${details.name} (${details.email})`;
        case 'UPDATE_STUDENT':
            const userChanges = Object.keys(details.updates || {}).join(", ");
            return `Updated student profile: ${userChanges}`;
        case 'DELETE_STUDENT':
            return `Deleted student ID: ${details.id}`;
        case 'DELETE_STUDENTS_BULK':
            return `Deleted ${details.count} students`;

        case 'CREATE_GROUP':
            return `Created group "${details.name}"`;
        case 'DELETE_GROUP':
            return `Deleted group`;

        case 'APPROVE_ACCESS_REQUEST':
            return `Approved access for ${details.name} (${details.email})`;
        case 'REJECT_ACCESS_REQUEST':
            return `Rejected access request`;

        case 'APPROVE_RETEST':
            return `Approved retest request`;
        case 'DENY_RETEST':
            return `Denied retest request`;

        case 'DELETE_EXAMS':
            return `Deleted ${details.count} exams`;

        default:
            return JSON.stringify(details, null, 2); // Fallback for unknown actions
    }
}

export function AdminHistorySheet({ logs }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" title="Audit History">
                    <History className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Admin Activity Log</SheetTitle>
                    <SheetDescription>
                        Recent actions performed by administrators.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                    <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                        <div className="space-y-6">
                            {logs.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center">No history recorded yet.</p>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="relative pl-4 border-l-2 border-muted pb-1 last:pb-0">
                                        <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {log.action.replace(/_/g, " ")}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                By <span className="font-semibold text-foreground">{log.admin.name || log.admin.email}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                            </p>
                                            {log.details && (
                                                <p className="text-xs bg-muted p-2 rounded mt-1 font-mono wrap-break-word whitespace-pre-wrap">
                                                    {formatLogDetails(log.action, log.details)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}
