"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/lib/audit-logger"

export async function approveRetest(attemptId) {
    try {
        // Delete the attempt to allow re-taking
        await prisma.attempt.delete({
            where: { id: attemptId }
        })

        await logAdminAction('APPROVE_RETEST', { attemptId }, attemptId);

        revalidatePath('/admin/results/retests')
        return { success: true }
    } catch (error) {
        return { error: "Failed to approve retest" }
    }
}

export async function denyRetest(attemptId) {
    try {
        await prisma.attempt.update({
            where: { id: attemptId },
            data: {
                isRetestRequested: false,
                adminRemark: "Retest Request Denied."
            }
        })

        await logAdminAction('DENY_RETEST', { attemptId }, attemptId);

        revalidatePath('/admin/results/retests')
        return { success: true }
    } catch (error) {
        return { error: "Failed to deny retest" }
    }
}
