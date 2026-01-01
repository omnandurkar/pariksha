"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const examSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Duration is required"),
    isActive: z.boolean().default(false),
    startDate: z.coerce.date().nullable().optional(), // Coerce handles string -> Date
    endDate: z.coerce.date().nullable().optional(),
    resultDate: z.coerce.date().nullable().optional(),
})

export async function createExam(data) {
    // This action is called by react-hook-form handleSubmit usually via client wrapper or directly if formData.
    // Here we assume data is object (from client component) or we handle formData.
    // For simplicity, let's accept object since we use client component.

    // Validate
    const validated = examSchema.safeParse(data);
    if (!validated.success) {
        return { error: "Invalid data" };
    }

    const { title, description, duration, isActive } = validated.data;

    try {
        await prisma.exam.create({
            data: {
                title,
                description,
                duration,
                isActive,
                startDate: validated.data.startDate,
                endDate: validated.data.endDate,
                resultDate: validated.data.resultDate
            }
        });
    } catch (e) {
        console.error(e);
        return { error: "Failed to create exam" };
    }

    revalidatePath("/admin/exams");
    redirect("/admin/exams");
}
