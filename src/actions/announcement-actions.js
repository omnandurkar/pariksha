"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const announcementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    expiresAt: z.string().optional().or(z.literal('')),
    isActive: z.boolean().default(true)
})

export async function createAnnouncement(formData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    const validate = announcementSchema.safeParse({
        title: formData.get("title"),
        message: formData.get("message"),
        expiresAt: formData.get("expiresAt"),
        isActive: formData.get("isActive") === "on"
    })

    if (!validate.success) {
        return { error: "Invalid data" }
    }

    const { title, message, isActive, expiresAt } = validate.data

    try {
        await prisma.announcement.create({
            data: {
                title,
                message,
                isActive,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        })
        revalidatePath("/admin/announcements")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to create announcement" }
    }
}

export async function deleteAnnouncement(id) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.announcement.delete({ where: { id } })
        revalidatePath("/admin/announcements")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete" }
    }
}

export async function toggleAnnouncement(id, currentState) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.announcement.update({
            where: { id },
            data: { isActive: !currentState }
        })
        revalidatePath("/admin/announcements")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (e) {
        return { error: "Failed to update" }
    }
}
