"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { logAdminAction } from "@/lib/audit-logger"

const createGroupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
})

export async function createGroup(formData) {
    const validatedFields = createGroupSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid input" }
    }

    try {
        const newGroup = await prisma.group.create({
            data: validatedFields.data
        })

        await logAdminAction('CREATE_GROUP', validatedFields.data, newGroup.id);

        revalidatePath('/admin/groups')
        return { success: true }
    } catch (error) {
        return { error: "Failed to create group" }
    }
}

export async function deleteGroup(groupId) {
    try {
        await prisma.group.delete({ where: { id: groupId } })

        await logAdminAction('DELETE_GROUP', { id: groupId }, groupId);

        revalidatePath('/admin/groups')
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete group" }
    }
}
