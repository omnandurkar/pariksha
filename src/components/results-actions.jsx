"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, SquareArrowOutUpRight, RotateCw } from "lucide-react"
import Link from "next/link"
import { grantReattempt } from "@/app/admin/results/actions"
import { toast } from "sonner"
import { useState } from "react"

export function ResultsActions({ attemptId, examId, userId }) {
    const [loading, setLoading] = useState(false);

    const handleReattempt = async () => {
        setLoading(true);
        try {
            const res = await grantReattempt(examId, userId);
            if (res.success) {
                toast.success("Reattempt granted successfully.");
            } else {
                toast.error(res.error || "Failed.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/results/${attemptId}`} target="_blank" className="cursor-pointer flex items-center">
                        <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                        View Result
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleReattempt} disabled={loading} className="text-red-600 focus:text-red-700 pointer-events-auto cursor-pointer">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Give Reattempt
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
