"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function toggleAdminRole(userId, newRole) {
    const session = await auth();
    // Prevent self-demotion to avoid lockout (basic safeguard)
    if (userId === session?.user?.id && newRole !== 'ADMIN') {
        return { error: "You cannot demote yourself." };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });
        revalidatePath("/admin/access");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update role" };
    }
}
