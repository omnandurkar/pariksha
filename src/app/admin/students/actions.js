"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { logAdminAction } from "@/lib/audit-logger"

const studentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().optional(), // Optional for update
})

export async function addStudent(data) {
    const validated = studentSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const { name, email, password } = validated.data;
    if (!password || password.length < 6) return { error: "Password min 6 chars required for creation" };

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: "Email already exists" };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'STUDENT'
            }
        });

        await logAdminAction('CREATE_STUDENT', { name, email }, newUser.id);

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create student" };
    }
}

export async function updateStudent(id, data) {
    const validated = studentSchema.safeParse(data);
    if (!validated.success) return { error: validated.error.flatten().fieldErrors };

    const { name, email, password } = validated.data;

    try {
        const updateData = { name, email };
        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        await logAdminAction('UPDATE_STUDENT', { updates: updateData }, id);

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update user. Email might be duplicate." };
    }
}

export async function deleteStudent(id) {
    try {
        await prisma.user.delete({ where: { id } });

        await logAdminAction('DELETE_STUDENT', { id }, id);

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete student" };
    }
}

export async function bulkDeleteStudents(ids) {
    try {
        await prisma.user.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        await logAdminAction('DELETE_STUDENTS_BULK', { count: ids.length, ids }, null);

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Bulk delete error:", error);
        return { error: "Failed to delete selected students" };
    }
}
