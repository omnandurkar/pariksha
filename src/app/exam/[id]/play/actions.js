"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitExam(attemptId, answers, markedIds = []) {
    // 1. Fetch Attempt & Questions
    const attempt = await prisma.attempt.findUnique({
        where: { id: attemptId },
        include: { exam: { include: { questions: { include: { options: true } } } } }
    });

    if (!attempt) {
        return { error: "Invalid attempt" };
    }

    if (attempt.status === 'COMPLETED') {
        return { success: true, redirectUrl: `/dashboard/results/${attemptId}` };
    }

    if (attempt.status !== 'STARTED') {
        return { error: "Attempt not active" };
    }

    // 2. Calculate Score
    let score = 0;
    const answerRecords = [];

    for (const q of attempt.exam.questions) {
        const selectedOptionId = answers[q.id];
        const isMarked = markedIds.includes(q.id);

        if (selectedOptionId) {
            // Find if correct
            const selectedOpt = q.options.find(o => o.id === selectedOptionId);
            if (selectedOpt && selectedOpt.isCorrect) {
                score += q.marks;
            }

            answerRecords.push({
                attemptId,
                questionId: q.id,
                selectedOptionId,
                isMarked
            });
        }
    }

    // 3. Save Answers & Update Attempt
    try {
        await prisma.$transaction([
            prisma.answer.createMany({ data: answerRecords }),
            prisma.attempt.update({
                where: { id: attemptId },
                data: {
                    status: 'COMPLETED',
                    submitTime: new Date(),
                    score: score
                }
            })
        ]);
    } catch (error) {
        console.error("Submit Transaction Error:", error);

        // Check for Unique Constraint Violation (P2002) -> Likely double submission
        // Or just checking if the attempt is already completed to be safe
        const checkAttempt = await prisma.attempt.findUnique({
            where: { id: attemptId },
            select: { status: true }
        });

        if (checkAttempt?.status === 'COMPLETED') {
            return { success: true, redirectUrl: `/dashboard/results/${attemptId}` };
        }

        return { error: "Submission failed. Please check your connection." };
    }

    return { success: true, redirectUrl: `/dashboard/results/${attemptId}` };
}
