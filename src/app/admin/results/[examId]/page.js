import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { GrantReattemptButton } from "./grant-reattempt-button"

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

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exam.attempts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No attempts recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            exam.attempts.map((attempt, index) => {
                                const percentage = Math.round((attempt.score / totalMarks) * 100);
                                const isPassed = percentage >= exam.passingPercentage;

                                return (
                                    <TableRow key={attempt.id}>
                                        <TableCell className="font-medium">#{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{attempt.user.name}</div>
                                            <div className="text-xs text-muted-foreground">{attempt.user.email}</div>
                                        </TableCell>
                                        <TableCell>{attempt.score} / {totalMarks}</TableCell>
                                        <TableCell>{percentage}%</TableCell>
                                        <TableCell>
                                            <Badge variant={isPassed ? "default" : "destructive"}>
                                                {isPassed ? "PASSED" : "FAILED"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(attempt.submitTime).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/results/${examId}/${attempt.id}`}>
                                                    Review
                                                </Link>
                                            </Button>
                                            <GrantReattemptButton userId={attempt.userId} examId={examId} />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
