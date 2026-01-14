import prisma from "@/lib/prisma"
import { LeaderboardUI } from "./leaderboard-ui"

export async function Leaderboard({ examId, currentUserId, variant = "default" }) {
    // Fetch all attempts for the leaderboard
    const topAttempts = await prisma.attempt.findMany({
        where: {
            examId: examId,
            status: 'COMPLETED'
        },
        orderBy: [
            { score: 'desc' },
            { submitTime: 'asc' } // Tie-breaker: who finished earlier
        ],
        // No limit - show all students
        include: {
            user: {
                select: { id: true, name: true }
            }
        }
    })

    if (topAttempts.length === 0) return null

    return <LeaderboardUI attempts={topAttempts} currentUserId={currentUserId} variant={variant} />
}
