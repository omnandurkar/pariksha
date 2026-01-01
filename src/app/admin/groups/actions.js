"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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
        await prisma.group.create({
            data: validatedFields.data
        })
        revalidatePath('/admin/groups')
        return { success: true }
    } catch (error) {
        return { error: "Failed to create group" }
    }
}

export async function deleteGroup(groupId) {
    try {
        await prisma.group.delete({ where: { id: groupId } })
        revalidatePath('/admin/groups')
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete group" }
    }
}
