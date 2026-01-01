"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const optionSchema = z.object({
    text: z.string().min(1, "Option text required"),
    isCorrect: z.boolean().default(false),
})

const questionSchema = z.object({
    examId: z.string(),
    text: z.string().min(1, "Question text required"),
    marks: z.coerce.number().min(1).default(1),
    options: z.array(optionSchema).min(2, "At least 2 options required").refine(
        (options) => options.some((opt) => opt.isCorrect),
        { message: "At least one correct option required" }
    ),
})

export async function addQuestion(data) {
    const validated = questionSchema.safeParse(data);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const { examId, text, marks, options } = validated.data;

    try {
        await prisma.question.create({
            data: {
                examId,
                text,
                marks,
                options: {
                    create: options.map(opt => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect
                    }))
                }
            }
        });
        revalidatePath(`/admin/exams/${examId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to add question" };
    }
}

export async function deleteQuestion(questionId, examId) {
    try {
        await prisma.question.delete({
            where: { id: questionId }
        });
        revalidatePath(`/admin/exams/${examId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete question" };
    }
}
