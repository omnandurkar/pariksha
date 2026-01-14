"use client"

import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ContinueExamButton({ examId, forceFullscreen }) {
    const router = useRouter()

    const handleContinue = async () => {
        if (forceFullscreen) {
            try {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                }
            } catch (err) {
                console.error("Fullscreen request failed:", err);
                toast.error("Could not enter fullscreen. Please check permissions.");
            }
        }
        router.push(`/exam/${examId}/play`)
    }

    return (
        <Button onClick={handleContinue} className="w-full animate-pulse-slow font-semibold relative overflow-hidden group">
            <span className="relative z-10 flex items-center justify-center gap-2">
                Continue Exam <PlayCircle className="h-4 w-4" />
            </span>
            <span className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
        </Button>
    )
}
