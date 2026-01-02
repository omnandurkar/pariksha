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

    if (!attempt || attempt.status !== 'STARTED') {
        return { error: "Invalid attempt" };
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

    return { success: true, redirectUrl: `/dashboard/results/${attemptId}` };
}
