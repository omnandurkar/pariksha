
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ExportResultsButton } from "@/components/export-results-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { AnalyticsView } from "@/components/analytics-view"
import { ResultsActions } from "@/components/results-actions"

export default async function ExamResultsPage({ params }) {
    const { examId } = await params

    // Fetch exam with all completed attempts
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            attempts: {
                where: { status: 'COMPLETED' },
                include: {
                    user: true,
                    answers: {
                        include: {
                            selectedOption: true
                        }
                    }
                },
                orderBy: { score: 'desc' }
            },
            questions: {
                select: {
                    id: true,
                    text: true,
                    marks: true
                }
            }
        }
    })

    if (!exam) return notFound()

    const totalMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0) || 1;
    const attempts = exam.attempts;

    // Attach exam passing percentage to attempts for easier CSV properties if needed, 
    // or just pass it to the button.
    const mappedAttempts = attempts.map(a => ({ ...a, exam: { passingPercentage: exam.passingPercentage } }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/results"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">{exam.title} - Detailed Results</h1>
                        <p className="text-muted-foreground text-sm">Passing Criteria: {exam.passingPercentage}% ({Math.ceil((exam.passingPercentage / 100) * totalMarks)} marks)</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
                    <p className="text-muted-foreground">Results Overview</p>
                </div>
                <ExportResultsButton results={mappedAttempts} examTitle={exam.title} totalMarks={totalMarks} />
            </div>

            <Tabs defaultValue="results" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="results">Student Results</TabsTrigger>
                    <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{attempts.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {attempts.length > 0
                                        ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)
                                        : 0}
                                    <span className="text-muted-foreground text-sm font-normal"> / {totalMarks}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {attempts.length > 0
                                        ? Math.round((attempts.filter(a => (a.score / totalMarks) * 100 >= exam.passingPercentage).length / attempts.length) * 100)
                                        : 0}%
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Attempts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attempts.map((attempt, index) => {
                                        const percentage = Math.round((attempt.score / totalMarks) * 100)
                                        const isPassed = percentage >= exam.passingPercentage
                                        const rank = index + 1;

                                        return (
                                            <TableRow key={attempt.id}>
                                                <TableCell className="font-medium text-muted-foreground">#{rank}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{attempt.user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{attempt.user.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{attempt.score} / {totalMarks}</div>
                                                    <div className="text-xs text-muted-foreground">{percentage}%</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={isPassed ? "success" : "destructive"}>
                                                        {isPassed ? "Pass" : "Fail"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {format(new Date(attempt.submitTime), "MMM d, h:mm a")}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ResultsActions
                                                        attemptId={attempt.id}
                                                        examId={examId} // examId is available from props/params
                                                        userId={attempt.userId}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <AnalyticsView exam={exam} attempts={attempts} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
