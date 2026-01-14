"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Megaphone, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnnouncementBanner({ announcements }) {
    const [visible, setVisible] = useState([])

    useEffect(() => {
        // Filter out dismissed announcements
        const dismissed = JSON.parse(sessionStorage.getItem("dismissedAnnouncements") || "[]");
        setVisible(announcements.filter(a => !dismissed.includes(a.id)));
    }, [announcements])

    const handleDismiss = (id) => {
        const dismissed = JSON.parse(sessionStorage.getItem("dismissedAnnouncements") || "[]");
        sessionStorage.setItem("dismissedAnnouncements", JSON.stringify([...dismissed, id]));
        setVisible(prev => prev.filter(a => a.id !== id));
    }

    if (visible.length === 0) return null;

    return (
        <div className="space-y-2 mb-6">
            {visible.map((a) => (
                <Alert key={a.id} className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 relative">
                    <Megaphone className="h-4 w-4" />
                    <div className="pr-8">
                        <AlertTitle className="font-semibold">{a.title}</AlertTitle>
                        <AlertDescription className="text-sm mt-1 whitespace-pre-wrap">
                            {a.message}
                        </AlertDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800"
                        onClick={() => handleDismiss(a.id)}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </Alert>
            ))}
        </div>
    )
}
