import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminRemarkForm } from "./remark-form"
import { Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AttemptReviewPage({ params }) {
    const { attemptId, examId } = await params

    const attempt = await prisma.attempt.findUnique({
        where: { id: attemptId },
        include: {
            user: true,
            exam: { include: { questions: { include: { options: true } } } },
            answers: { include: { selectedOption: true } }
        }
    })

    if (!attempt) return notFound()

    const totalMarks = attempt.exam.questions.reduce((sum, q) => sum + q.marks, 0) || 1;
    const percentage = Math.round((attempt.score / totalMarks) * 100);
    const isPassed = percentage >= attempt.exam.passingPercentage;

    // Map answers for easy lookup
    const answerMap = new Map();
    attempt.answers.forEach(a => answerMap.set(a.questionId, a));

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/results/${examId}`}><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{attempt.user.name}'s Attempt</h1>
                    <p className="text-muted-foreground">{attempt.exam.title}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Answer Sheet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {attempt.exam.questions.map((q, i) => {
                            const answer = answerMap.get(q.id);
                            const selectedOptionId = answer?.selectedOptionId;
                            const isCorrect = answer?.selectedOption?.isCorrect;

                            return (
                                <div key={q.id} className="border-b last:border-0 pb-4">
                                    <div className="flex items-start gap-2">
                                        <span className="font-mono text-muted-foreground">{i + 1}.</span>
                                        <div className="flex-1">
                                            <p className="font-medium mb-2">{q.text}</p>
                                            <div className="grid gap-2">
                                                {q.options.map(opt => {
                                                    let className = "p-2 rounded border text-sm flex items-center justify-between";

                                                    // Highlight Logic
                                                    if (opt.isCorrect) {
                                                        className += " bg-green-50 border-green-200 text-green-700";
                                                    } else if (opt.id === selectedOptionId && !opt.isCorrect) {
                                                        className += " bg-red-50 border-red-200 text-red-700";
                                                    } else {
                                                        className += " text-muted-foreground";
                                                    }

                                                    return (
                                                        <div key={opt.id} className={className}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{opt.text}</span>
                                                                {/* Label for clarity */}
                                                                {opt.isCorrect && <span className="text-[10px] uppercase font-bold bg-green-200 px-1.5 rounded">Correct</span>}
                                                                {opt.id === selectedOptionId && !opt.isCorrect && <span className="text-[10px] uppercase font-bold bg-red-200 px-1.5 rounded">Marked</span>}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {opt.isCorrect && <Check className="h-4 w-4 text-green-700" />}
                                                                {opt.id === selectedOptionId && !opt.isCorrect && <X className="h-4 w-4 text-red-700" />}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold w-8 text-right">
                                            {isCorrect ? q.marks : 0}/{q.marks}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center py-4">
                                <div className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                    {percentage}%
                                </div>
                                <Badge className="mt-2" variant={isPassed ? "default" : "destructive"}>
                                    {isPassed ? "PASSED" : "FAILED"}
                                </Badge>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    Score: {attempt.score} / {totalMarks}
                                </p>
                            </div>
                            <AdminRemarkForm attemptId={attempt.id} initialRemark={attempt.adminRemark} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
