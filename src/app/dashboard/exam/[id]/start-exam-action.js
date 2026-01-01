"use server"

import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function startExam(examId, userId) {
    // 1. Check if already has an ACTIVE attempt
    const activeAttempt = await prisma.attempt.findFirst({
        where: { examId, userId, status: 'STARTED' }
    })

    if (activeAttempt) {
        return { success: true, redirectUrl: `/exam/${examId}/play` }
    }

    // 2. Check Assignment & Limits
    const assignment = await prisma.examAssignment.findUnique({
        where: { userId_examId: { userId, examId } },
        include: { exam: true }
    })

    if (!assignment) {
        return { error: "You are not assigned to this exam." }
    }

    const maxAllowed = assignment.allowedAttempts ?? assignment.exam.maxAttempts
    const attemptsUsed = await prisma.attempt.count({
        where: { examId, userId }
    })

    if (attemptsUsed >= maxAllowed) {
        return { error: `Maximum attempts (${maxAllowed}) reached. Contact admin for a re-attempt.` }
    }

    // 3. Create New Attempt
    await prisma.attempt.create({
        data: {
            examId,
            userId,
            status: 'STARTED',
            startTime: new Date()
        }
    })

    return { success: true, redirectUrl: `/dashboard/exam/${examId}/play` }
}
