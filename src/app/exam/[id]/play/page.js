import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { ExamPlayer } from "./exam-player"

export default async function ExamPlayPage({ params }) {
    const { id } = await params
    const session = await auth()

    // Verify attempt exists
    const attempt = await prisma.attempt.findFirst({
        where: {
            examId: id,
            userId: session.user.id,
            status: 'STARTED'
        },
        include: {
            exam: {
                include: {
                    questions: {
                        include: {
                            options: {
                                select: { id: true, text: true } // Hide isCorrect
                            }
                        }
                    }
                }
            }
        }
    })

    // If no started attempt, redirect to instructions (which handles creation or completed status)
    if (!attempt) {
        // Check if completed?
        const completed = await prisma.attempt.findFirst({
            where: { examId: id, userId: session.user.id, status: 'COMPLETED' }
        });
        if (completed) redirect(`/dashboard/results/${completed.id}`);
        redirect(`/dashboard/exam/${id}`);
    }

    // Shuffle questions for client (simple shuffle)
    // Ideally this should be stored in DB to persist order, but for MVP shuffle on load is okay
    // provided we map answers correctly by ID.
    // Use a simple copy to avoid mutation, satisfying some purity checks
    // eslint-disable-next-line react-hooks/purity
    const shuffledQuestions = [...attempt.exam.questions].sort(() => Math.random() - 0.5);

    return (
        <div className="min-h-screen bg-background">
            <ExamPlayer
                exam={attempt.exam}
                questions={shuffledQuestions}
                attemptId={attempt.id}
                endTime={new Date(attempt.startTime.getTime() + attempt.exam.duration * 60000)}
            />
        </div>
    )
}
