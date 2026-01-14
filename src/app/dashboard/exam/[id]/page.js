import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import PreExamView from "./pre-exam-view"

export default async function ExamInstructionsPage({ params }) {
    const { id } = await params
    const session = await auth()

    const exam = await prisma.exam.findUnique({
        where: { id },
        include: { _count: { select: { questions: true } } }
    })
    // forceFullscreen is a scalar, so it's returned by default unless there's a strict select. 
    // findUnique returns all scalars by default.
    // So 'forceFullscreen' should already be in 'exam'. 
    // Let's verify standard Prisma behavior. Yes, scalars are included. 
    // No change needed in page.js unless he used 'select'. He used 'include'.
    // Wait, 'include' adds relations, but scalars are there.
    // I will verify page.js content again.
    // Line 12: include: { _count: { select: { questions: true } } }
    // This is fine. forceFullscreen will be there.

    if (!exam) return notFound()

    return (
        <div className="max-w-2xl mx-auto py-10">
            <PreExamView exam={exam} userId={session.user.id} />
        </div>
    )
}
