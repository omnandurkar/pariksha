import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ResultsClient } from "./results-client"

export default async function ExamResultsPage({ params }) {
    const { examId } = await params

    // Fetch exam with all completed attempts
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            attempts: {
                where: { status: 'COMPLETED' },
                include: { user: true },
                orderBy: { score: 'desc' }
            },
            questions: { select: { marks: true } }
        }
    })

    if (!exam) return notFound()

    const totalMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0) || 1;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/results"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">{exam.title} - Detailed Results</h1>
                    <p className="text-muted-foreground text-sm">Passing Criteria: {exam.passingPercentage}% ({Math.ceil((exam.passingPercentage / 100) * totalMarks)} marks)</p>
                </div>
            </div>

            <ResultsClient exam={exam} attempts={exam.attempts} totalMarks={totalMarks} />
        </div>
    )
}
