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

    if (!exam) return notFound()

    return (
        <div className="max-w-2xl mx-auto py-10">
            <PreExamView exam={exam} userId={session.user.id} />
        </div>
    )
}
