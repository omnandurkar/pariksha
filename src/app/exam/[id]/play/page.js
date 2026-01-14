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
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    randomizeQuestions: true,
                    allowCalculator: true,
                    forceFullscreen: true,
                    questions: {
                        include: {
                            options: {
                                select: { id: true, text: true }
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

    // Use a simple copy to avoid mutation, satisfying some purity checks
    // eslint-disable-next-line react-hooks/purity
    // Shuffle questions if enabled
    let questionsToUse = [...attempt.exam.questions];
    if (attempt.exam.randomizeQuestions) {
        questionsToUse.sort(() => Math.random() - 0.5);
    }

    return (
        <div className="min-h-screen bg-background">
            <ExamPlayer
                exam={attempt.exam}
                questions={questionsToUse}
                attemptId={attempt.id}
                endTime={new Date(attempt.startTime.getTime() + attempt.exam.duration * 60000)}
            />
        </div>
    )
}
