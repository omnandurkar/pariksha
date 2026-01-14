"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { logAdminAction } from "@/lib/audit-logger"

const updateExamSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
    isActive: z.boolean().default(false),
    issueCertificate: z.boolean().default(false),
    randomizeQuestions: z.boolean().default(false),
    allowCalculator: z.boolean().default(false),
    showLeaderboard: z.boolean().default(false),
    forceFullscreen: z.boolean().default(false),
    passingPercentage: z.coerce.number().min(0).max(100).default(40),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    resultDate: z.string().optional().or(z.literal(''))
})

export async function updateExam(examId, formData) {
    const validatedFields = updateExamSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        duration: formData.get('duration'),
        isActive: formData.get('isActive') === 'on',
        issueCertificate: formData.get('issueCertificate') === 'on',
        randomizeQuestions: formData.get('randomizeQuestions') === 'on',
        allowCalculator: formData.get('allowCalculator') === 'on',
        showLeaderboard: formData.get('showLeaderboard') === 'on',
        forceFullscreen: formData.get('forceFullscreen') === 'on',
        passingPercentage: formData.get('passingPercentage'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        resultDate: formData.get('resultDate')
    })

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    try {
        const data = { ...validatedFields.data };

        // Convert empty strings to null, and strings to Date objects
        if (data.startDate) data.startDate = new Date(data.startDate);
        else data.startDate = null;

        if (data.endDate) data.endDate = new Date(data.endDate);
        else data.endDate = null;

        if (data.resultDate) data.resultDate = new Date(data.resultDate);
        else data.resultDate = null;

        await prisma.exam.update({
            where: { id: examId },
            data: data
        })

        await logAdminAction('UPDATE_EXAM', { id: examId, updates: data }, examId);

        revalidatePath(`/admin/exams/${examId}`)
        return { success: true }
    } catch (error) {
        console.error("Update exam error:", error)
        return { error: "Failed to update exam" }
    }
}
