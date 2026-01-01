import prisma from "@/lib/prisma"
import { RetestRequestCard } from "./retest-card"
import { MessageSquareWarning } from "lucide-react"

export default async function RetestRequestsPage() {
    const requests = await prisma.attempt.findMany({
        where: { isRetestRequested: true },
        include: {
            user: true,
            exam: true
        },
        orderBy: { submitTime: 'desc' }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquareWarning className="h-6 w-6 text-orange-500" />
                Retest Requests
            </h1>

            {requests.length === 0 ? (
                <div className="p-8 text-center border rounded-lg bg-muted/20 text-muted-foreground">
                    No pending retest requests.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map(attempt => (
                        <RetestRequestCard key={attempt.id} attempt={attempt} />
                    ))}
                </div>
            )}
        </div>
    )
}
