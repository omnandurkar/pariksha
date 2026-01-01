"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitFeedback(data) {
    const session = await auth();

    try {
        await prisma.feedback.create({
            data: {
                text: data.text,
                rating: parseInt(data.rating) || null,
                category: data.category,
                isAnonymous: data.isAnonymous,
                userId: data.isAnonymous ? null : session?.user?.id,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit feedback:", error);
        return { success: false, error: "Failed to submit feedback" };
    }
}

export async function getFeedbacks(filters = {}) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const where = {};
    if (filters.rating) where.rating = parseInt(filters.rating);
    if (filters.category && filters.category !== "ALL") where.category = filters.category;

    // Status filter?
    if (filters.status && filters.status !== "ALL") where.status = filters.status;

    try {
        const feedbacks = await prisma.feedback.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        return { success: true, data: feedbacks };
    } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
        return { success: false, error: "Failed to fetch feedbacks" };
    }
}

export async function updateFeedbackStatus(id, status) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.feedback.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/admin/feedback");
        return { success: true };
    } catch (error) {
        console.error("Failed to update feedback status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
