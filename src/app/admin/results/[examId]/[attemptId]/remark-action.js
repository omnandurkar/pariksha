"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateRemarkSchema = z.object({
    remark: z.string().max(500, "Remark too long").optional(),
})

export async function updateRemark(attemptId, formData) {
    const validatedFields = updateRemarkSchema.safeParse({
        remark: formData.get('remark'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid input" }
    }

    try {
        await prisma.attempt.update({
            where: { id: attemptId },
            data: { adminRemark: validatedFields.data.remark }
        })
        revalidatePath(`/admin/results`)
        return { success: true }
    } catch (error) {
        return { error: "Failed to save remark" }
    }
}
