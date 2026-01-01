import prisma from "@/lib/prisma"
import AccessPage from "./client-page"

export default async function AccessControlPage() {
    const users = await prisma.user.findMany({
        orderBy: { role: 'asc' } // Admins first usually (alphabetical: ADMIN < STUDENT)
    });

    return <AccessPage users={users} />
}
