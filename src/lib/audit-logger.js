import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function logAdminAction(action, details, entityId = null) {
    try {
        const session = await auth()
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            console.warn("Audit Log: Unauthorized attempt or not an admin")
            return
        }

        await prisma.auditLog.create({
            data: {
                adminId: session.user.id,
                action,
                details: typeof details === 'object' ? JSON.stringify(details) : details,
                entityId
            }
        })
    } catch (error) {
        console.error("Audit Log Error:", error)
        // Don't crash the app if logging fails
    }
}
