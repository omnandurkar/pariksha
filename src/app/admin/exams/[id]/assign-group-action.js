"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function assignGroupToExam(examId, groupId) {
    try {
        // Fetch all students in the group
        const groupMembers = await prisma.groupMember.findMany({
            where: { groupId },
            select: { userId: true }
        })

        if (groupMembers.length === 0) {
            return { error: "Group has no members" }
        }

        // Create assignments (ignore duplicates)
        // Prisma createMany with skipDuplicates does not work for SQLite in all versions effectively with unique constraints in relation logic sometimes,
        // but ExamAssignment matches unique [userId, examId].
        // Ideally:
        // await prisma.examAssignment.createMany({
        //    data: groupMembers.map(m => ({ examId, userId: m.userId })),
        //    skipDuplicates: true
        // })
        // But let's check explicit existence to be safe or use loop if createMany not supported fully.
        // Prisma 5 supports skipDuplicates.

        await prisma.examAssignment.createMany({
            data: groupMembers.map(m => ({
                examId,
                userId: m.userId
            })),
            skipDuplicates: true
        })

        revalidatePath(`/admin/exams/${examId}`)
        return { success: true, count: groupMembers.length }

    } catch (error) {
        console.error("Assign group error:", error)
        return { error: "Failed to assign group" }
    }
}
