"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/lib/audit-logger"

export async function togglePublishResults(examId, publish) {
    try {
        await prisma.exam.update({
            where: { id: examId },
            data: { publishResults: publish }
        });
        await logAdminAction('TOGGLE_RESULTS', { publish }, examId);
        revalidatePath(`/admin/exams/${examId}`);
        revalidatePath(`/dashboard`); // Update student dashboard
        return { success: true };
    } catch (error) {
        return { error: "Failed to update publish status" };
    }
}
