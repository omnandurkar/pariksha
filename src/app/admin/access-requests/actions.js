"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveRequest(requestId, groupId = null) {
    try {
        const request = await prisma.accessRequest.findUnique({
            where: { id: requestId }
        })

        if (!request) return { error: "Request not found" }

        // Create User
        const newUser = await prisma.user.create({
            data: {
                name: request.name,
                email: request.email,
                password: request.password, // Already hashed
                role: "STUDENT"
            }
        })

        // Add to Group if selected
        if (groupId && groupId !== "none") {
            await prisma.groupMember.create({
                data: {
                    groupId,
                    userId: newUser.id
                }
            })
        }

        // Delete Request
        await prisma.accessRequest.delete({ where: { id: requestId } })

        revalidatePath("/admin/access-requests")
        revalidatePath("/admin/students")
        return { success: true }
    } catch (error) {
        console.error("Approve request error:", error)
        return { error: "Failed to approve request" }
    }
}

export async function rejectRequest(requestId) {
    try {
        await prisma.accessRequest.delete({ where: { id: requestId } })
        revalidatePath("/admin/access-requests")
        return { success: true }
    } catch (error) {
        console.error("Reject request error:", error)
        return { error: "Failed to reject request" }
    }
}
