"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function togglePublishResults(examId, publish) {
    try {
        await prisma.exam.update({
            where: { id: examId },
            data: { publishResults: publish }
        });
        revalidatePath(`/admin/exams/${examId}`);
        revalidatePath(`/dashboard`); // Update student dashboard
        return { success: true };
    } catch (error) {
        return { error: "Failed to update publish status" };
    }
}
