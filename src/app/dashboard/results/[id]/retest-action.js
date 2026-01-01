"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const requestRetestSchema = z.object({
    reason: z.string().min(5, "Reason must be at least 5 characters"),
})

export async function requestRetest(attemptId, formData) {
    const validatedFields = requestRetestSchema.safeParse({
        reason: formData.get('reason'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid input" }
    }

    try {
        await prisma.attempt.update({
            where: { id: attemptId },
            data: {
                isRetestRequested: true,
                retestReason: validatedFields.data.reason
            }
        })
        revalidatePath(`/dashboard/results/${attemptId}`)
        return { success: true }
    } catch (error) {
        return { error: "Failed to request retest" }
    }
}
