import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Users, CheckCircle, MessageSquareWarning } from "lucide-react"

export default async function AdminResultsPage() {
    // Fetch stats grouped by exam
    const exams = await prisma.exam.findMany({
        include: {
            attempts: {
                where: { status: 'COMPLETED' },
                select: { score: true }
            },
            assignments: {
                select: { userId: true }
            },
            questions: {
                select: { marks: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Results Overview</h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/results/retests">
                        <MessageSquareWarning className="h-4 w-4 mr-2" />
                        View Retest Requests
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exams.map(exam => {
                    const completedCount = exam.attempts.length;
                    const assignedCount = exam.assignments.length;

                    // Simple calc assuming 1 mark per question for percentage if totalMarks not calc
                    // Ideally database would store total marks or we calc dynamically
                    const totalMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0) || 1;

                    const passedCount = exam.attempts.filter(a => {
                        const pct = (a.score / totalMarks) * 100;
                        return pct >= exam.passingPercentage;
                    }).length;

                    const passRate = completedCount > 0 ? Math.round((passedCount / completedCount) * 100) : 0;

                    return (
                        <Card key={exam.id} className="flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg truncate" title={exam.title}>
                                    {exam.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col items-center bg-muted/40 p-2 rounded">
                                        <div className="text-2xl font-bold">{completedCount}/{assignedCount}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Users className="h-3 w-3" /> Attempted
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center bg-muted/40 p-2 rounded">
                                        <div className={`text-2xl font-bold ${passRate >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {passRate}%
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" /> Pass Rate
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                    <span>Pass Criteria: {exam.passingPercentage}%</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/admin/results/${exam.id}`}>
                                        <BarChart className="mr-2 h-4 w-4" /> View Analysis
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
