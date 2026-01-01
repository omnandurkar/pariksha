"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function grantReattempt(userId, examId) {
    try {
        const assignment = await prisma.examAssignment.findUnique({
            where: {
                userId_examId: { userId, examId }
            },
            include: { exam: true }
        })

        if (!assignment) return { error: "Student is not assigned to this exam." }

        // Determine current limit (either specific or default)
        const currentLimit = assignment.allowedAttempts ?? assignment.exam.maxAttempts

        // Increase limit by 1
        await prisma.examAssignment.update({
            where: { id: assignment.id },
            data: { allowedAttempts: currentLimit + 1 }
        })

        revalidatePath(`/admin/results/${examId}`)
        return { success: true }
    } catch (error) {
        console.error("Grant re-attempt error:", error)
        return { error: "Failed to grant re-attempt" }
    }
}
