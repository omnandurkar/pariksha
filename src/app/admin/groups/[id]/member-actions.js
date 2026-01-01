"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function addMembers(groupId, userIds) {
    if (!userIds || userIds.length === 0) return { error: "No users selected" }

    try {
        await prisma.groupMember.createMany({
            data: userIds.map(userId => ({
                groupId,
                userId
            }))
        })
        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        return { error: "Failed to add members" }
    }
}

export async function removeMember(memberId) {
    try {
        // Fetch member to get groupId before deleting
        const member = await prisma.groupMember.findUnique({
            where: { id: memberId },
            select: { groupId: true }
        })

        if (!member) return { error: "Member not found" }

        await prisma.groupMember.delete({ where: { id: memberId } })
        revalidatePath(`/admin/groups/${member.groupId}`)
        return { success: true }
    } catch (error) {
        console.error("Remove member error:", error)
        return { error: "Failed to remove member" }
    }
}
