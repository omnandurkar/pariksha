"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Flexible input: can be string email, or object with email, name, password
// If just email, assumes user exists. If object, tries to create if missing.

export async function bulkCreateAndAssign(examId, inputData) {
    if (!inputData || inputData.length === 0) return { error: "No data provided" };

    try {
        let successCount = 0;
        let createdCount = 0;
        let errorCount = 0;

        for (const item of inputData) {
            let email, name, password;
            if (typeof item === 'string') {
                email = item;
            } else {
                email = item.email;
                name = item.name;
                password = item.password;
            }

            if (!email) {
                errorCount++;
                continue;
            }

            // 1. Find or Create User
            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                if (!name || !password) {
                    // Can't create without name/pass if input was just email or incomplete object
                    // Skip this user
                    console.log(`Skipping ${email}: User not found and missing creation details.`);
                    errorCount++;
                    continue;
                }

                // Create user
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        role: 'STUDENT'
                    }
                });
                createdCount++;
            }

            // 2. Assign to Exam (Idempotent)
            try {
                await prisma.examAssignment.create({
                    data: {
                        examId,
                        userId: user.id
                    }
                });
                successCount++;
            } catch (e) {
                // Ignore unique constraint violation (already assigned)
                if (e.code !== 'P2002') {
                    console.error("Assignment error", e);
                    errorCount++;
                }
            }
        }

        revalidatePath(`/admin/exams/${examId}`);
        return {
            success: true,
            message: `Processed. Assigned: ${successCount}. Created New: ${createdCount}. Errors/Skipped: ${errorCount}`
        };

    } catch (error) {
        console.error("Bulk Operation Failed:", error);
        return { error: "Bulk operation failed." };
    }
}


export async function unassignStudentFromExam(examId, userId) {
    try {
        await prisma.examAssignment.delete({
            where: {
                userId_examId: {
                    userId,
                    examId
                }
            }
        });
        revalidatePath(`/admin/exams/${examId}`);
        return { success: true };
    } catch (error) {
        console.error("Unassign error", error);
        return { error: "Failed to unassign student" };
    }
}
