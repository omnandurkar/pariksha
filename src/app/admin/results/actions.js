"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/lib/audit-logger"

export async function grantReattempt(examId, userId) {
    try {
        // 1. Get current attempt count
        const attemptCount = await prisma.attempt.count({
            where: {
                examId: examId,
                userId: userId
            }
        });

        // 2. Upsert ExamAssignment to allow +1 attempt
        // We set allowedAttempts to attemptCount + 1.
        // Even if maxAttempts was 1, and they took 1, this overrides it to 2.
        await prisma.examAssignment.upsert({
            where: {
                userId_examId: {
                    userId: userId,
                    examId: examId
                }
            },
            create: {
                userId: userId,
                examId: examId,
                allowedAttempts: attemptCount + 1
            },
            update: {
                allowedAttempts: attemptCount + 1
            }
        });

        // 3. Log it
        await logAdminAction('GRANT_REATTEMPT', { examId, userId, newLimit: attemptCount + 1 });

        revalidatePath(`/admin/results/${examId}`)
        return { success: true }
    } catch (error) {
        console.error("Grant Reattempt Error:", error);
        return { error: "Failed to grant reattempt." }
    }
}
